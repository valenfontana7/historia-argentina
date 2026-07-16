import type {
  CreateJobRequest,
  JobView,
  PipelineStage,
  VideoFormatId,
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
  };
}

function toClaimed(job: VideoJob): ClaimedJob {
  return {
    ...mapJob(job),
    exhibitionJson: job.exhibitionJson,
    useFakeProviders: job.useFakeProviders,
    inputHash: job.inputHash,
    promptVersion: job.promptVersion,
    pipelineVersion: job.pipelineVersion,
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
        (existing.status === "queued" ||
          existing.status === "running" ||
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
      },
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
      where: { status: { in: ["queued", "running"] } },
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
}
