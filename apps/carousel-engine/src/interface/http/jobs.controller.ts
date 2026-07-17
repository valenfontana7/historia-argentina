import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Res,
  StreamableFile,
} from "@nestjs/common";
import type { Response } from "express";
import {
  CreateCarouselJobRequestSchema,
  PatchCarouselJobSchema,
  RenderCarouselRequestSchema,
} from "@museoargent/carousel-contracts";
import type { CarouselEngineRuntime } from "../../runtime";
import { CarouselEngineError } from "../../domain/errors";

export const ENGINE_RUNTIME = Symbol("CAROUSEL_ENGINE_RUNTIME");

@Controller()
export class HealthController {
  constructor(
    @Inject(ENGINE_RUNTIME) private readonly engine: CarouselEngineRuntime,
  ) {}

  @Get("health")
  health() {
    return this.engine.getHealth();
  }
}

@Controller("jobs")
export class JobsController {
  constructor(
    @Inject(ENGINE_RUNTIME) private readonly engine: CarouselEngineRuntime,
  ) {}

  @Post()
  async create(@Body() body: unknown) {
    try {
      const request = CreateCarouselJobRequestSchema.parse(body);
      return await this.engine.createJob(request);
    } catch (err) {
      throw toHttp(err);
    }
  }

  @Get()
  async list(@Query("limit") limitRaw?: string) {
    const limit = Math.min(100, Math.max(1, Number(limitRaw) || 50));
    return { jobs: await this.engine.listJobs(limit) };
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    const job = await this.engine.getJob(id);
    if (!job) throw new NotFoundException("Job not found");
    return job;
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    const ok = await this.engine.deleteJob(id);
    if (!ok) throw new NotFoundException("Job not found");
    return { ok: true, id };
  }

  @Patch(":id")
  async patch(@Param("id") id: string, @Body() body: unknown) {
    try {
      const patch = PatchCarouselJobSchema.parse(body);
      return await this.engine.patchJob(id, patch);
    } catch (err) {
      throw toHttp(err);
    }
  }

  @Post(":id/render")
  async render(@Param("id") id: string, @Body() body: unknown) {
    try {
      const req = RenderCarouselRequestSchema.parse(body ?? {});
      return await this.engine.renderJob(id, req);
    } catch (err) {
      throw toHttp(err);
    }
  }

  @Get(":id/slides/:slideId")
  async slide(
    @Param("id") id: string,
    @Param("slideId") slideId: string,
    @Res() res: Response,
  ) {
    const found = await this.engine.getSlideImagePath(id, slideId);
    if (!found) throw new NotFoundException("Slide image not found");
    try {
      await stat(found.path);
    } catch {
      throw new NotFoundException("Slide image not found");
    }
    res.setHeader("Content-Type", "image/png");
    createReadStream(found.path).pipe(res);
  }

  @Get(":id/carousel")
  async carousel(@Param("id") id: string) {
    const job = await this.engine.getJob(id);
    if (!job) throw new NotFoundException("Job not found");
    const doc = await this.engine.store.readCarousel(id);
    if (!doc) throw new NotFoundException("Carousel not found");
    return doc;
  }

  @Get(":id/export-zip")
  @Header("Content-Type", "application/zip")
  async exportZip(@Param("id") id: string) {
    try {
      const buf = await this.engine.exportZip(id);
      return new StreamableFile(buf, {
        type: "application/zip",
        disposition: `attachment; filename="${id}.zip"`,
      });
    } catch (err) {
      throw toHttp(err);
    }
  }

  @Get(":id/export-manifest")
  async exportManifest(@Param("id") id: string) {
    const job = await this.engine.getJob(id);
    if (!job) throw new NotFoundException("Job not found");
    const manifest = await this.engine.store.readExportManifest(id);
    if (!manifest) throw new NotFoundException("Export manifest not found");
    return manifest;
  }
}

function toHttp(err: unknown): Error {
  if (err instanceof CarouselEngineError) {
    if (err.code === "not_found") return new NotFoundException(err.message);
    return new BadRequestException({ code: err.code, message: err.message });
  }
  if (err && typeof err === "object" && "issues" in err) {
    return new BadRequestException(err);
  }
  return err instanceof Error ? err : new Error(String(err));
}
