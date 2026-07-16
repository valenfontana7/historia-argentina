import { z } from "zod";
import { ExhibitionSchema } from "./exhibition";
import { NarrativePaceSchema, VideoFormatIdSchema } from "./format";

export const JobStatusSchema = z.enum([
  "queued",
  "running",
  "succeeded",
  "failed",
  "cancelled",
]);

export const PipelineStageSchema = z.enum([
  "ingest",
  "script",
  "storyboard",
  "voice",
  "assets",
  "subtitles",
  "music",
  "compose",
  "render",
]);

export const ProfileOverridesSchema = z.object({
  targetDurationSec: z.number().positive().optional(),
  tone: z.string().min(1).optional(),
  cta: z.string().min(1).optional(),
  narrativePace: NarrativePaceSchema.optional(),
});

export const CreateJobRequestSchema = z.object({
  exhibition: ExhibitionSchema,
  formatId: VideoFormatIdSchema.default("reel"),
  force: z.boolean().default(false),
  useFakeProviders: z.boolean().optional(),
  profileOverrides: ProfileOverridesSchema.optional(),
});

export const JobMetricsSchema = z.object({
  wallTimeMs: z.number().nonnegative().optional(),
  stageTimingsMs: z.record(z.string(), z.number()).optional(),
  llmProvider: z.string().optional(),
  llmModel: z.string().optional(),
  ttsProvider: z.string().optional(),
  ttsVoice: z.string().optional(),
  assetsUsed: z.array(z.string()).optional(),
  outputDurationSec: z.number().optional(),
  outputBytes: z.number().optional(),
  promptVersion: z.string().optional(),
  pipelineVersion: z.string().optional(),
});

export const JobViewSchema = z.object({
  id: z.string(),
  exhibitionId: z.string(),
  formatId: VideoFormatIdSchema,
  status: JobStatusSchema,
  stage: PipelineStageSchema.optional(),
  error: z.string().optional(),
  outputMp4Uri: z.string().optional(),
  manifestUri: z.string().optional(),
  metrics: JobMetricsSchema.optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type JobStatus = z.infer<typeof JobStatusSchema>;
export type PipelineStage = z.infer<typeof PipelineStageSchema>;
export type ProfileOverrides = z.infer<typeof ProfileOverridesSchema>;
export type CreateJobRequest = z.infer<typeof CreateJobRequestSchema>;
export type JobMetrics = z.infer<typeof JobMetricsSchema>;
export type JobView = z.infer<typeof JobViewSchema>;

export const PIPELINE_VERSION = "1.1.0";
