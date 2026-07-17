import {
  isAwaitingStatus,
  isBusyStatus,
  normalizeResumePhase,
  type CreateJobRequest,
  type JobStatus,
  type JobView,
  type PipelineStage,
  type ResumePhase,
  type VideoFormatId,
} from "@museoargent/video-contracts";
import type { PrismaClient, VideoJob } from "../../generated/prisma";

import type { ClaimedJob, JobQueue } from "../../application/ports/job-queue";

function mapJob(job: VideoJob): JobView {
  const timings =
    job.stageTimingsMs && typeof job.stageTimingsMs === "object"
      ? (job.stageTimingsMs as Record<string, number>)
      : undefined;
  const assetsUsed = Array.isArray(job.assetsUsed)
    ? (job.assetsUsed as string[])
    : undefined;
  const wallTimeMs =
    job.startedAt && job.finishedAt
      ? job.finishedAt.getTime() - job.startedAt.getTime()
      : undefined;
  const row = job as VideoJob & {
    interactive?: boolean;
    resumePhase?: string;
    hasDraft?: boolean;
  };

  return {
    id: job.id,
    exhibitionId: job.exhibitionId,
    formatId: job.formatId as VideoFormatId,
    status: job.status,
    stage: job.stage ?? undefined,
    error: job.error ?? undefined,
    outputMp4Uri: job.outputMp4Uri ?? undefined,
    manifestUri: job.manifestUri ?? undefined,
    metrics: {
      wallTimeMs,
      stageTimingsMs: timings,
      llmProvider: job.llmProvider ?? undefined,
      llmModel: job.llmModel ?? undefined,
      ttsProvider: job.ttsProvider ?? undefined,
      ttsVoice: job.ttsVoice ?? undefined,
      assetsUsed,
      outputDurationSec: job.outputDurationSec ?? undefined,
      outputBytes: job.outputBytes ?? undefined,
      promptVersion: job.promptVersion,
      pipelineVersion: job.pipelineVersion,
    },
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
    interactive: row.interactive !== false,
    resumePhase: normalizeResumePhase(
      (row.resumePhase as ResumePhase | undefined) ?? "script",
    ),
    hasDraft: Boolean(row.hasDraft),
  };
}

function toClaimed(job: VideoJob): ClaimedJob {
  const view = mapJob(job);
  return {
    ...view,
    exhibitionJson: job.exhibitionJson,
    useFakeProviders: job.useFakeProviders,
    inputHash: job.inputHash,
    promptVersion: job.promptVersion,
    pipelineVersion: job.pipelineVersion,
    interactive: view.interactive !== false,
    resumePhase: normalizeResumePhase(view.resumePhase),
  };
}

export class PostgresJobQueue implements JobQueue {
  constructor(private readonly prisma: PrismaClient) {}

  async enqueue(
    request: CreateJobRequest & {
      inputHash: string;
      promptVersion: string;
      pipelineVersion: string;
    },
  ): Promise<JobView> {
    const interactive = request.interactive !== false;
    if (!request.force) {
      const existing = await this.prisma.videoJob.findUnique({
        where: {
          exhibitionId_formatId_promptVersion_pipelineVersion: {
            exhibitionId: request.exhibition.id,
            formatId: request.formatId,
            promptVersion: request.promptVersion,
            pipelineVersion: request.pipelineVersion,
          },
        },
      });
      if (
        existing &&
        (isBusyStatus(existing.status as JobStatus) ||
          existing.status === "succeeded")
      ) {
        return mapJob(existing);
      }
      if (existing) {
        await this.prisma.videoJob.delete({ where: { id: existing.id } });
      }
    } else {
      await this.prisma.videoJob.deleteMany({
        where: {
          exhibitionId: request.exhibition.id,
          formatId: request.formatId,
          promptVersion: request.promptVersion,
          pipelineVersion: request.pipelineVersion,
        },
      });
    }

    const created = await this.prisma.videoJob.create({
      data: {
        exhibitionId: request.exhibition.id,
        formatId: request.formatId,
        inputHash: request.inputHash,
        promptVersion: request.promptVersion,
        pipelineVersion: request.pipelineVersion,
        exhibitionJson: request.exhibition,
        force: request.force,
        useFakeProviders: Boolean(request.useFakeProviders),
        status: "queued",
        interactive,
        resumePhase: "script",
        hasDraft: false,
      } as Parameters<PrismaClient["videoJob"]["create"]>[0]["data"],
    });
    await this.appendEvent(created.id, "info", "Job enqueued");
    return mapJob(created);
  }

  async get(jobId: string): Promise<JobView | null> {
    const job = await this.prisma.videoJob.findUnique({ where: { id: jobId } });
    return job ? mapJob(job) : null;
  }

  async list(limit = 50): Promise<JobView[]> {
    const rows = await this.prisma.videoJob.findMany({
      orderBy: { updatedAt: "desc" },
      take: limit,
    });
    return rows.map(mapJob);
  }

  async hasActiveJob(): Promise<boolean> {
    const n = await this.prisma.videoJob.count({
      where: {
        status: {
          in: [
            "queued",
            "running",
            "awaiting_script",
            "awaiting_storyboard",
            "awaiting_assets",
            "awaiting_review",
            "awaiting_voice",
            "awaiting_preview",
          ],
        },
        NOT: { exhibitionId: { startsWith: "fixture:" } },
      },
    });
    return n > 0;
  }

  async claimNext(workerId: string): Promise<ClaimedJob | null> {
    const rows = await this.prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM "VideoJob"
      WHERE status = 'queued'
      ORDER BY "createdAt" ASC
      FOR UPDATE SKIP LOCKED
      LIMIT 1
    `;
    if (!rows.length) return null;

    const updated = await this.prisma.videoJob.update({
      where: { id: rows[0].id },
      data: {
        status: "running",
        lockedAt: new Date(),
        startedAt: new Date(),
      },
    });
    await this.appendEvent(updated.id, "info", "Job claimed", { workerId });
    return toClaimed(updated);
  }

  async markStage(
    jobId: string,
    stage: PipelineStage,
    timingMs?: number,
  ): Promise<void> {
    const job = await this.prisma.videoJob.findUnique({ where: { id: jobId } });
    if (!job) return;
    const timings =
      job.stageTimingsMs && typeof job.stageTimingsMs === "object"
        ? { ...(job.stageTimingsMs as Record<string, number>) }
        : {};
    if (typeof timingMs === "number") {
      timings[stage] = timingMs;
    }
    await this.prisma.videoJob.update({
      where: { id: jobId },
      data: {
        stage,
        stageTimingsMs: timings,
      },
    });
    await this.appendEvent(jobId, "info", `Stage ${stage}`, { timingMs });
  }

  async markAwaiting(
    jobId: string,
    status: Extract<
      JobStatus,
      | "awaiting_script"
      | "awaiting_storyboard"
      | "awaiting_assets"
      | "awaiting_review"
      | "awaiting_voice"
      | "awaiting_preview"
    >,
  ): Promise<JobView | null> {
    const current = await this.prisma.videoJob.findUnique({ where: { id: jobId } });
    if (!current) return null;
    if (current.status === "cancelled") return mapJob(current);
    const resumePhase =
      status === "awaiting_script"
        ? "script"
        : status === "awaiting_storyboard"
          ? "storyboard"
          : status === "awaiting_voice"
            ? "voice"
            : status === "awaiting_preview"
              ? "preview"
              : "assets";
    const updated = await this.prisma.videoJob.update({
      where: { id: jobId },
      data: {
        status,
        stage: "review",
        hasDraft: true,
        resumePhase,
        lockedAt: null,
      } as Parameters<PrismaClient["videoJob"]["update"]>[0]["data"],
    });
    await this.appendEvent(jobId, "info", `Awaiting ${status}`);
    return mapJob(updated);
  }

  async approvePhase(
    jobId: string,
    nextPhase: Exclude<ResumePhase, "draft">,
  ): Promise<JobView | null> {
    const current = await this.prisma.videoJob.findUnique({ where: { id: jobId } });
    if (!current) return null;
    if (!isAwaitingStatus(current.status as JobStatus)) return mapJob(current);
    const updated = await this.prisma.videoJob.update({
      where: { id: jobId },
      data: {
        status: "queued",
        stage: "review",
        resumePhase: nextPhase,
        error: null,
      } as Parameters<PrismaClient["videoJob"]["update"]>[0]["data"],
    });
    await this.appendEvent(jobId, "info", `Approved → ${nextPhase}`);
    return mapJob(updated);
  }

  async markAwaitingReview(jobId: string): Promise<JobView | null> {
    return this.markAwaiting(jobId, "awaiting_assets");
  }

  async approveForRender(jobId: string): Promise<JobView | null> {
    return this.approvePhase(jobId, "render");
  }

  async appendEvent(
    jobId: string,
    level: string,
    message: string,
    data?: unknown,
  ): Promise<void> {
    await this.prisma.videoJobEvent.create({
      data: {
        jobId,
        level,
        message,
        data: data === undefined ? undefined : (data as object),
      },
    });
  }

  async complete(
    jobId: string,
    result: {
      outputMp4Uri: string;
      outputBytes: number;
      outputDurationSec: number;
      manifestUri: string;
      assetsUsed: string[];
      llmProvider?: string;
      llmModel?: string;
      ttsProvider?: string;
      ttsVoice?: string;
      stageTimingsMs: Record<string, number>;
    },
  ): Promise<void> {
    const current = await this.prisma.videoJob.findUnique({ where: { id: jobId } });
    if (!current || current.status === "cancelled") return;

    await this.prisma.videoJob.update({
      where: { id: jobId },
      data: {
        status: "succeeded",
        outputMp4Uri: result.outputMp4Uri,
        outputBytes: result.outputBytes,
        outputDurationSec: result.outputDurationSec,
        manifestUri: result.manifestUri,
        assetsUsed: result.assetsUsed,
        llmProvider: result.llmProvider,
        llmModel: result.llmModel,
        ttsProvider: result.ttsProvider,
        ttsVoice: result.ttsVoice,
        stageTimingsMs: result.stageTimingsMs,
        finishedAt: new Date(),
        lockedAt: null,
      },
    });
    await this.appendEvent(jobId, "info", "Job succeeded", {
      outputMp4Uri: result.outputMp4Uri,
    });
  }

  async fail(jobId: string, error: string): Promise<void> {
    const current = await this.prisma.videoJob.findUnique({ where: { id: jobId } });
    if (
      !current ||
      current.status === "cancelled" ||
      current.status === "succeeded" ||
      isAwaitingStatus(current.status as JobStatus)
    ) {
      return;
    }
    await this.prisma.videoJob.update({
      where: { id: jobId },
      data: {
        status: "failed",
        error,
        finishedAt: new Date(),
        lockedAt: null,
      },
    });
    await this.appendEvent(jobId, "error", "Job failed", { error });
  }

  async cancel(jobId: string): Promise<JobView | null> {
    const current = await this.prisma.videoJob.findUnique({ where: { id: jobId } });
    if (!current) return null;
    if (
      current.status !== "queued" &&
      current.status !== "running" &&
      !isAwaitingStatus(current.status as JobStatus)
    ) {
      return mapJob(current);
    }
    const updated = await this.prisma.videoJob.update({
      where: { id: jobId },
      data: {
        status: "cancelled",
        error: "Cancelado por el admin",
        finishedAt: new Date(),
        lockedAt: null,
      },
    });
    await this.appendEvent(jobId, "info", "Job cancelled");
    return mapJob(updated);
  }
}
