import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import {
  Body,
  ConflictException,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import type { Request, Response } from "express";
import {
  CreateJobRequestSchema,
  type CreateJobRequest,
} from "@museoargent/video-contracts";
import type { EngineRuntime } from "../../runtime";
import { abortJob } from "../../application/job-abort";

export const ENGINE_RUNTIME = Symbol("ENGINE_RUNTIME");

@Controller()
export class HealthController {
  @Get("health")
  health() {
    return { ok: true, service: "video-engine" };
  }
}

@Controller("jobs")
export class JobsController {
  constructor(
    @Inject(ENGINE_RUNTIME) private readonly engine: EngineRuntime,
  ) {}

  @Post()
  async create(@Body() body: unknown) {
    const request = CreateJobRequestSchema.parse(body) as CreateJobRequest;
    if (await this.engine.hasActiveJob()) {
      throw new ConflictException(
        "Ya hay un job en cola o en ejecución. Esperá a que termine (VPS 1 GB: un reel a la vez).",
      );
    }
    // Cachear assets ANTES de encolar para que el worker no arranque sin piezas.
    if (request.imageCatalog && Object.keys(request.imageCatalog).length > 0) {
      const cached = await this.engine.prepareExhibitionAssets(
        request.exhibition,
        request.imageCatalog,
      );
      console.info(
        JSON.stringify({
          msg: "assets cached",
          exhibitionId: request.exhibition.id,
          cached: cached.length,
        }),
      );
    }
    return this.engine.enqueue(request);
  }

  @Get()
  async list(@Query("limit") limitRaw?: string) {
    const limit = Math.min(
      100,
      Math.max(1, Number(limitRaw) || 50),
    );
    const jobs = await this.engine.listJobs(limit);
    return { jobs };
  }

  @Post(":id/cancel")
  async cancel(@Param("id") id: string) {
    const existing = await this.engine.getJob(id);
    if (!existing) throw new NotFoundException("Job not found");
    if (existing.status !== "queued" && existing.status !== "running") {
      return existing;
    }
    abortJob(id);
    const cancelled = await this.engine.cancelJob(id);
    if (!cancelled) throw new NotFoundException("Job not found");
    console.info(JSON.stringify({ msg: "job cancelled", id }));
    return cancelled;
  }

  @Get(":id/media")
  async media(
    @Param("id") id: string,
    @Req() req: Request,
    @Res() res: Response,
    @Query("download") download?: string,
  ) {
    const filePath = await this.engine.resolveMp4Path(id);
    if (!filePath) {
      throw new NotFoundException("MP4 no encontrado");
    }

    const job = await this.engine.getJob(id);
    const slug =
      job?.exhibitionId.replace(/^cronica:/, "") ?? "reel";
    const filename = `museoargent-${slug}-${id}.mp4`;
    const wantsDownload = download === "1" || download === "true";
    const disposition = wantsDownload
      ? `attachment; filename="${filename}"`
      : `inline; filename="${filename}"`;

    const fileStat = await stat(filePath);
    const size = fileStat.size;
    const range = req.headers.range;

    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", disposition);
    res.setHeader("Cache-Control", "private, max-age=0, must-revalidate");

    if (range) {
      const match = /^bytes=(\d+)-(\d*)$/.exec(range);
      if (!match) {
        res.status(416).end();
        return;
      }
      const start = Number(match[1]);
      const end = match[2]
        ? Number(match[2])
        : Math.min(start + 1024 * 1024 - 1, size - 1);
      if (
        Number.isNaN(start) ||
        Number.isNaN(end) ||
        start >= size ||
        end >= size ||
        start > end
      ) {
        res.status(416).end();
        return;
      }
      res.status(206);
      res.setHeader("Content-Range", `bytes ${start}-${end}/${size}`);
      res.setHeader("Content-Length", String(end - start + 1));
      createReadStream(filePath, { start, end }).pipe(res);
      return;
    }

    res.status(200);
    res.setHeader("Content-Length", String(size));
    createReadStream(filePath).pipe(res);
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    const job = await this.engine.getJob(id);
    if (!job) throw new NotFoundException("Job not found");
    return job;
  }
}
