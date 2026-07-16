import type {
  CreateJobRequest,
  JobStatus,
  JobView,
  PipelineStage,
  ProfileOverrides,
  ResumePhase,
} from "@museoargent/video-contracts";

export type ClaimedJob = JobView & {
  exhibitionJson: unknown;
  useFakeProviders: boolean;
  inputHash: string;
  promptVersion: string;
  pipelineVersion: string;
  profileOverrides?: ProfileOverrides;
  interactive: boolean;
  resumePhase: ResumePhase;
};

export interface JobQueue {
  enqueue(request: CreateJobRequest & { inputHash: string; promptVersion: string; pipelineVersion: string }): Promise<JobView>;
  get(jobId: string): Promise<JobView | null>;
  list(limit?: number): Promise<JobView[]>;
  hasActiveJob(): Promise<boolean>;
  claimNext(workerId: string): Promise<ClaimedJob | null>;
  markStage(jobId: string, stage: PipelineStage, timingMs?: number): Promise<void>;
  /** Pausa humana en un awaiting_* y fija resumePhase. */
  markAwaiting(
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
  ): Promise<JobView | null>;
  /** Reencola con nueva resumePhase tras approve. */
  approvePhase(
    jobId: string,
    nextPhase: Exclude<ResumePhase, "draft">,
  ): Promise<JobView | null>;
  /** @deprecated use markAwaiting(awaiting_assets) */
  markAwaitingReview(jobId: string): Promise<JobView | null>;
  /** @deprecated use approvePhase('render') */
  approveForRender(jobId: string): Promise<JobView | null>;
  appendEvent(jobId: string, level: string, message: string, data?: unknown): Promise<void>;
  complete(
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
  ): Promise<void>;
  fail(jobId: string, error: string): Promise<void>;
  cancel(jobId: string): Promise<JobView | null>;
  restore?(view: JobView): Promise<JobView>;
}
