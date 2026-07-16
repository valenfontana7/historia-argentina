import type {
  CreateJobRequest,
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
  /** Pausa tras draft: awaiting_review + hasDraft. */
  markAwaitingReview(jobId: string): Promise<JobView | null>;
  /** Reencola fase render tras aprobación humana. */
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
  /** Marca queued/running/awaiting_review como cancelled. No-op si ya terminó. */
  cancel(jobId: string): Promise<JobView | null>;
  /** Restaura un JobView desde disco (post-reinicio). Opcional. */
  restore?(view: JobView): Promise<JobView>;
}
