import type {
  CreateJobRequest,
  JobView,
  PipelineStage,
  ProfileOverrides,
} from "@museoargent/video-contracts";

export type ClaimedJob = JobView & {
  exhibitionJson: unknown;
  useFakeProviders: boolean;
  inputHash: string;
  promptVersion: string;
  pipelineVersion: string;
  profileOverrides?: ProfileOverrides;
};

export interface JobQueue {
  enqueue(request: CreateJobRequest & { inputHash: string; promptVersion: string; pipelineVersion: string }): Promise<JobView>;
  get(jobId: string): Promise<JobView | null>;
  list(limit?: number): Promise<JobView[]>;
  hasActiveJob(): Promise<boolean>;
  claimNext(workerId: string): Promise<ClaimedJob | null>;
  markStage(jobId: string, stage: PipelineStage, timingMs?: number): Promise<void>;
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
}
