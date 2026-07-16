import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import type { Request, Response } from "express";
import {
  CreateJobRequestSchema,
  isAwaitingStatus,
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
        "Ya hay un job en cola, en revisión o en ejecución. Esperá a que termine o cancelalo.",
      );
    }
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
    if (
      existing.status !== "queued" &&
      existing.status !== "running" &&
      !isAwaitingStatus(existing.status)
    ) {
      return existing;
    }
    abortJob(id);
    const cancelled = await this.engine.cancelJob(id);
    if (!cancelled) throw new NotFoundException("Job not found");
    console.info(JSON.stringify({ msg: "job cancelled", id }));
    return cancelled;
  }

  @Get(":id/script")
  async getScript(@Param("id") id: string) {
    if (!(await this.engine.getJob(id))) throw new NotFoundException("Job not found");
    const script = await this.engine.getScript(id);
    if (!script) throw new NotFoundException("Script not found");
    return script;
  }

  @Patch(":id/script")
  async patchScript(@Param("id") id: string, @Body() body: unknown) {
    return this.wrapPatch(() => this.engine.patchScript(id, body));
  }

  @Post(":id/approve-script")
  async approveScript(@Param("id") id: string) {
    return this.wrapApprove(() => this.engine.approveScript(id));
  }

  @Post(":id/script/regenerate")
  async regenerateScript(@Param("id") id: string, @Body() body: unknown) {
    return this.wrapPatch(() => this.engine.regenerateScript(id, body));
  }

  @Get(":id/storyboard")
  async getStoryboard(@Param("id") id: string) {
    if (!(await this.engine.getJob(id))) throw new NotFoundException("Job not found");
    const sb = await this.engine.getStoryboard(id);
    if (!sb) throw new NotFoundException("Storyboard not found");
    return sb;
  }

  @Patch(":id/storyboard")
  async patchStoryboard(@Param("id") id: string, @Body() body: unknown) {
    return this.wrapPatch(() => this.engine.patchStoryboard(id, body));
  }

  @Post(":id/approve-storyboard")
  async approveStoryboard(@Param("id") id: string) {
    return this.wrapApprove(() => this.engine.approveStoryboard(id));
  }

  @Post(":id/storyboard/regenerate")
  async regenerateStoryboard(@Param("id") id: string, @Body() body: unknown) {
    return this.wrapPatch(() => this.engine.regenerateStoryboard(id, body));
  }

  @Post(":id/storyboard/:scene/regenerate")
  async regenerateStoryboardScene(
    @Param("id") id: string,
    @Param("scene") sceneRaw: string,
    @Body() body: unknown,
  ) {
    const scene = Number(sceneRaw);
    if (!Number.isInteger(scene) || scene < 1) {
      throw new BadRequestException("scene inválido");
    }
    return this.wrapPatch(() =>
      this.engine.regenerateStoryboardScene(id, scene, body),
    );
  }

  @Get(":id/memory")
  async getMemory(@Param("id") id: string) {
    if (!(await this.engine.getJob(id))) throw new NotFoundException("Job not found");
    return this.wrapPatch(() => this.engine.getMemory(id));
  }

  @Patch(":id/memory")
  async patchMemory(@Param("id") id: string, @Body() body: unknown) {
    return this.wrapPatch(() => this.engine.patchMemory(id, body));
  }

  @Get(":id/assets")
  async getAssets(@Param("id") id: string) {
    if (!(await this.engine.getJob(id))) throw new NotFoundException("Job not found");
    const doc = await this.engine.getAssetsDoc(id);
    if (!doc) throw new NotFoundException("Assets not found");
    return doc;
  }

  @Patch(":id/assets")
  async patchAssets(@Param("id") id: string, @Body() body: unknown) {
    return this.wrapPatch(() => this.engine.patchAssetsDoc(id, body));
  }

  @Post(":id/approve-assets")
  async approveAssets(@Param("id") id: string) {
    return this.wrapApprove(() => this.engine.approveAssets(id));
  }

  @Get(":id/voice")
  async getVoice(@Param("id") id: string) {
    if (!(await this.engine.getJob(id))) throw new NotFoundException("Job not found");
    const doc = await this.engine.getVoiceDoc(id);
    if (!doc) throw new NotFoundException("Voice not found");
    return doc;
  }

  @Post(":id/voice/:scene/regenerate")
  async regenerateVoice(
    @Param("id") id: string,
    @Param("scene") sceneRaw: string,
    @Body() body: unknown,
  ) {
    const scene = Number(sceneRaw);
    if (!Number.isInteger(scene) || scene < 1) {
      throw new BadRequestException("scene inválido");
    }
    return this.wrapPatch(() =>
      this.engine.regenerateVoiceScene(id, scene, body),
    );
  }

  @Post(":id/approve-voice")
  async approveVoice(@Param("id") id: string) {
    return this.wrapApprove(() => this.engine.approveVoice(id));
  }

  @Get(":id/preview")
  async getPreview(@Param("id") id: string) {
    if (!(await this.engine.getJob(id))) throw new NotFoundException("Job not found");
    const doc = await this.engine.getPreviewState(id);
    if (!doc) throw new NotFoundException("Preview not found");
    return doc;
  }

  @Post(":id/preview/:scene/lock")
  async lockPreview(
    @Param("id") id: string,
    @Param("scene") sceneRaw: string,
  ) {
    const scene = Number(sceneRaw);
    if (!Number.isInteger(scene) || scene < 1) {
      throw new BadRequestException("scene inválido");
    }
    return this.wrapPatch(() => this.engine.setPreviewLock(id, scene, true));
  }

  @Post(":id/preview/:scene/unlock")
  async unlockPreview(
    @Param("id") id: string,
    @Param("scene") sceneRaw: string,
  ) {
    const scene = Number(sceneRaw);
    if (!Number.isInteger(scene) || scene < 1) {
      throw new BadRequestException("scene inválido");
    }
    return this.wrapPatch(() => this.engine.setPreviewLock(id, scene, false));
  }

  @Post(":id/preview/:scene/regenerate")
  async regeneratePreview(
    @Param("id") id: string,
    @Param("scene") sceneRaw: string,
  ) {
    const scene = Number(sceneRaw);
    if (!Number.isInteger(scene) || scene < 1) {
      throw new BadRequestException("scene inválido");
    }
    return this.wrapPatch(() => this.engine.regeneratePreviewScene(id, scene));
  }

  @Post(":id/approve-preview")
  async approvePreview(@Param("id") id: string) {
    return this.wrapApprove(() => this.engine.approvePreview(id));
  }

  @Get(":id/checklist")
  async getChecklist(@Param("id") id: string) {
    if (!(await this.engine.getJob(id))) throw new NotFoundException("Job not found");
    return this.wrapPatch(() => this.engine.getChecklist(id));
  }

  @Get(":id/versions")
  async getVersions(@Param("id") id: string) {
    if (!(await this.engine.getJob(id))) throw new NotFoundException("Job not found");
    return this.wrapPatch(() => this.engine.getVersions(id));
  }

  /** Legacy: combined draft at assets gate. */
  @Get(":id/draft")
  async getDraft(@Param("id") id: string) {
    if (!(await this.engine.getJob(id))) throw new NotFoundException("Job not found");
    const draft = await this.engine.getDraft(id);
    if (!draft) throw new NotFoundException("Draft not found");
    return draft;
  }

  @Patch(":id/draft")
  async patchDraft(@Param("id") id: string, @Body() body: unknown) {
    return this.wrapPatch(() => this.engine.patchDraft(id, body));
  }

  @Post(":id/approve")
  async approve(@Param("id") id: string) {
    return this.wrapApprove(() => this.engine.approveJob(id));
  }

  @Get(":id/media/voice/:scene")
  async mediaVoice(
    @Param("id") id: string,
    @Param("scene") sceneRaw: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const scene = Number(sceneRaw);
    if (!Number.isInteger(scene) || scene < 1) {
      throw new BadRequestException("scene inválido");
    }
    const filePath = await this.engine.resolveVoicePath(id, scene);
    if (!filePath) throw new NotFoundException("Audio no encontrado");
    await streamFile(req, res, filePath, "audio/mpeg", `scene-${scene}.mp3`);
  }

  @Get(":id/media/preview/:scene")
  async mediaPreview(
    @Param("id") id: string,
    @Param("scene") sceneRaw: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const scene = Number(sceneRaw);
    if (!Number.isInteger(scene) || scene < 1) {
      throw new BadRequestException("scene inválido");
    }
    const filePath = await this.engine.resolvePreviewPath(id, scene);
    if (!filePath) throw new NotFoundException("Preview no encontrado");
    await streamFile(req, res, filePath, "video/mp4", `scene-${scene}.mp4`);
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

    await streamFile(req, res, filePath, "video/mp4", filename, disposition);
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    const job = await this.engine.getJob(id);
    if (!job) throw new NotFoundException("Job not found");
    return job;
  }

  private async wrapPatch<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("not found") || message.includes("not Found")) {
        throw new NotFoundException(message);
      }
      throw new BadRequestException(message);
    }
  }

  private async wrapApprove(fn: () => Promise<unknown>) {
    try {
      const result = await fn();
      if (!result) throw new NotFoundException("Job not found");
      return result;
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      const message = err instanceof Error ? err.message : String(err);
      throw new BadRequestException(message);
    }
  }
}

async function streamFile(
  req: Request,
  res: Response,
  filePath: string,
  contentType: string,
  filename: string,
  disposition?: string,
): Promise<void> {
  const fileStat = await stat(filePath);
  const size = fileStat.size;
  const range = req.headers.range;

  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader("Content-Type", contentType);
  res.setHeader(
    "Content-Disposition",
    disposition ?? `inline; filename="${filename}"`,
  );
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
