import {
  isAwaitingStatus,
  isBusyStatus,
  isFixtureExhibitionId,
  normalizeResumePhase,
  type CreateJobRequest,
  type JobMetrics,
  type JobStatus,
  type JobView,
  type PipelineStage,
  type ResumePhase,
} from "@museoargent/video-contracts";
import type { ClaimedJob, JobQueue } from "../../application/ports/job-queue";

type InternalJob = ClaimedJob & {
  exhibitionJson: unknown;
  useFakeProviders: boolean;
  inputHash: string;
  promptVersion: string;
  pipelineVersion: string;
  stageTimingsMs: Record<string, number>;
  assetsUsed?: string[];
  llmProvider?: string;
  llmModel?: string;
  ttsProvider?: string;
  ttsVoice?: string;
  lockedAt?: string;
  profileOverrides?: CreateJobRequest["profileOverrides"];
  interactive: boolean;
  resumePhase: ResumePhase;
  hasDraft?: boolean;
};

function toView(job: InternalJob): JobView {
  const metrics: JobMetrics = {
    stageTimingsMs: job.stageTimingsMs,
    llmProvider: job.llmProvider,
    llmModel: job.llmModel,
    ttsProvider: job.ttsProvider,
    ttsVoice: job.ttsVoice,
    assetsUsed: job.assetsUsed,
    outputDurationSec: undefined,
    outputBytes: undefined,
    promptVersion: job.promptVersion,
    pipelineVersion: job.pipelineVersion,
  };
  return {
    id: job.id,
    exhibitionId: job.exhibitionId,
    formatId: job.formatId,
    status: job.status,
    stage: job.stage,
    error: job.error,
    outputMp4Uri: job.outputMp4Uri,
    manifestUri: job.manifestUri,
    metrics: {
      ...metrics,
      outputDurationSec: job.metrics?.outputDurationSec,
      outputBytes: job.metrics?.outputBytes,
      wallTimeMs: job.metrics?.wallTimeMs,
    },
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    hasDraft: job.hasDraft,
    interactive: job.interactive,
    resumePhase: normalizeResumePhase(job.resumePhase),
  };
}

export class InMemoryJobQueue implements JobQueue {
  private readonly jobs = new Map<string, InternalJob>();
  private seq = 0;

  async enqueue(
    request: CreateJobRequest & {
      inputHash: string;
      promptVersion: string;
      pipelineVersion: string;
    },
  ): Promise<JobView> {
    const interactive = request.interactive !== false;
    if (!request.force) {
      for (const job of this.jobs.values()) {
        if (
          job.exhibitionId === request.exhibition.id &&
          job.formatId === request.formatId &&
          job.promptVersion === request.promptVersion &&
          job.pipelineVersion === request.pipelineVersion &&
          (isBusyStatus(job.status) || job.status === "succeeded")
        ) {
          return toView(job);
        }
      }
    }

    const now = new Date().toISOString();
    const id = `mem_${++this.seq}_${Date.now()}`;
    const job: InternalJob = {
      id,
      exhibitionId: request.exhibition.id,
      formatId: request.formatId,
      status: "queued",
      exhibitionJson: request.exhibition,
      useFakeProviders: Boolean(request.useFakeProviders),
      inputHash: request.inputHash,
      promptVersion: request.promptVersion,
      pipelineVersion: request.pipelineVersion,
      profileOverrides: request.profileOverrides,
      interactive,
      resumePhase: "script",
      hasDraft: false,
      stageTimingsMs: {},
      createdAt: now,
      updatedAt: now,
      metrics: {
        promptVersion: request.promptVersion,
        pipelineVersion: request.pipelineVersion,
      },
    };
    this.jobs.set(id, job);
    return toView(job);
  }

  async get(jobId: string): Promise<JobView | null> {
    const job = this.jobs.get(jobId);
    return job ? toView(job) : null;
  }

  async list(limit = 50): Promise<JobView[]> {
    const views = [...this.jobs.values()].map(toView);
    views.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
    return views.slice(0, limit);
  }

  async hasActiveJob(): Promise<boolean> {
    for (const job of this.jobs.values()) {
      if (isFixtureExhibitionId(job.exhibitionId)) continue;
      if (isBusyStatus(job.status)) return true;
    }
    return false;
  }

  async claimNext(_workerId: string): Promise<ClaimedJob | null> {
    for (const job of this.jobs.values()) {
      if (job.status === "queued") {
        job.status = "running";
        job.updatedAt = new Date().toISOString();
        job.lockedAt = job.updatedAt;
        return {
          ...job,
          resumePhase: normalizeResumePhase(job.resumePhase),
        };
      }
    }
    return null;
  }

  async markStage(
    jobId: string,
    stage: PipelineStage,
    timingMs?: number,
  ): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;
    job.stage = stage;
    job.updatedAt = new Date().toISOString();
    if (typeof timingMs === "number") {
      job.stageTimingsMs[stage] = timingMs;
    }
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
    const job = this.jobs.get(jobId);
    if (!job) return null;
    if (job.status === "cancelled") return toView(job);
    job.status = status;
    job.stage = "review";
    job.hasDraft = true;
    if (status === "awaiting_script") job.resumePhase = "script";
    else if (status === "awaiting_storyboard") job.resumePhase = "storyboard";
    else if (status === "awaiting_voice") job.resumePhase = "voice";
    else if (status === "awaiting_preview") job.resumePhase = "preview";
    else job.resumePhase = "assets";
    job.updatedAt = new Date().toISOString();
    return toView(job);
  }

  async approvePhase(
    jobId: string,
    nextPhase: Exclude<ResumePhase, "draft">,
  ): Promise<JobView | null> {
    const job = this.jobs.get(jobId);
    if (!job) return null;
    if (!isAwaitingStatus(job.status)) return toView(job);
    job.resumePhase = nextPhase;
    job.status = "queued";
    job.stage = "review";
    job.error = undefined;
    job.updatedAt = new Date().toISOString();
    return toView(job);
  }

  async markAwaitingReview(jobId: string): Promise<JobView | null> {
    return this.markAwaiting(jobId, "awaiting_assets");
  }

  async approveForRender(jobId: string): Promise<JobView | null> {
    return this.approvePhase(jobId, "render");
  }

  async appendEvent(): Promise<void> {}

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
    const job = this.jobs.get(jobId);
    if (!job) return;
    if (job.status === "cancelled") return;
    job.status = "succeeded";
    job.outputMp4Uri = result.outputMp4Uri;
    job.manifestUri = result.manifestUri;
    job.assetsUsed = result.assetsUsed;
    job.llmProvider = result.llmProvider;
    job.llmModel = result.llmModel;
    job.ttsProvider = result.ttsProvider;
    job.ttsVoice = result.ttsVoice;
    job.stageTimingsMs = result.stageTimingsMs;
    job.updatedAt = new Date().toISOString();
    job.metrics = {
      ...job.metrics,
      assetsUsed: result.assetsUsed,
      outputBytes: result.outputBytes,
      outputDurationSec: result.outputDurationSec,
      llmProvider: result.llmProvider,
      llmModel: result.llmModel,
      ttsProvider: result.ttsProvider,
      ttsVoice: result.ttsVoice,
      stageTimingsMs: result.stageTimingsMs,
      promptVersion: job.promptVersion,
      pipelineVersion: job.pipelineVersion,
    };
  }

  async fail(jobId: string, error: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;
    if (
      job.status === "cancelled" ||
      job.status === "succeeded" ||
      isAwaitingStatus(job.status)
    ) {
      return;
    }
    job.status = "failed";
    job.error = error;
    job.updatedAt = new Date().toISOString();
  }

  async cancel(jobId: string): Promise<JobView | null> {
    const job = this.jobs.get(jobId);
    if (!job) return null;
    if (
      job.status !== "queued" &&
      job.status !== "running" &&
      !isAwaitingStatus(job.status)
    ) {
      return toView(job);
    }
    job.status = "cancelled";
    job.error = "Cancelado por el admin";
    job.updatedAt = new Date().toISOString();
    return toView(job);
  }

  async restore(view: JobView): Promise<JobView> {
    const seqMatch = /^mem_(\d+)_/.exec(view.id);
    if (seqMatch) {
      this.seq = Math.max(this.seq, Number(seqMatch[1]));
    }

    const orphan = view.status === "queued" || view.status === "running";
    const now = new Date().toISOString();
    let status = orphan ? ("failed" as JobStatus) : view.status;
    // Legacy awaiting_review → awaiting_assets
    if (status === "awaiting_review") status = "awaiting_assets";
    // Fixtures de tests no deben quedar bloqueando la cola al hidratar.
    const dropFixture =
      isFixtureExhibitionId(view.exhibitionId) && isBusyStatus(status);
    if (dropFixture) status = "cancelled";

    const job: InternalJob = {
      id: view.id,
      exhibitionId: view.exhibitionId,
      formatId: view.formatId,
      status,
      stage: view.stage,
      error: orphan
        ? "Interrumpido por reinicio del worker"
        : dropFixture
          ? "Fixture de test cancelado al hidratar"
          : view.error,
      outputMp4Uri: view.outputMp4Uri,
      manifestUri: view.manifestUri,
      exhibitionJson: { id: view.exhibitionId },
      useFakeProviders: false,
      inputHash: "restored",
      promptVersion: view.metrics?.promptVersion ?? "unknown",
      pipelineVersion: view.metrics?.pipelineVersion ?? "unknown",
      stageTimingsMs: view.metrics?.stageTimingsMs ?? {},
      assetsUsed: view.metrics?.assetsUsed,
      llmProvider: view.metrics?.llmProvider,
      llmModel: view.metrics?.llmModel,
      ttsProvider: view.metrics?.ttsProvider,
      ttsVoice: view.metrics?.ttsVoice,
      metrics: view.metrics,
      interactive: view.interactive !== false,
      resumePhase: normalizeResumePhase(view.resumePhase),
      hasDraft: view.hasDraft ?? isAwaitingStatus(status),
      createdAt: view.createdAt,
      updatedAt: orphan ? now : view.updatedAt,
    };
    this.jobs.set(job.id, job);
    return toView(job);
  }
}
