import { z } from "zod";
import { ExhibitionSchema } from "./exhibition";
import { NarrativePaceSchema, VideoFormatIdSchema } from "./format";
import { StoryboardDocumentSchema } from "./storyboard";

export const JobStatusSchema = z.enum([
  "queued",
  "running",
  "awaiting_review",
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
  "review",
  "subtitles",
  "music",
  "compose",
  "render",
]);

export const ResumePhaseSchema = z.enum(["draft", "render"]);

export const ProfileOverridesSchema = z.object({
  targetDurationSec: z.number().positive().optional(),
  tone: z.string().min(1).optional(),
  cta: z.string().min(1).optional(),
  narrativePace: NarrativePaceSchema.optional(),
});

/** Metadatos de imagen para cachear assets en el worker (URLs Wikimedia, etc.). */
export const ImageCatalogEntrySchema = z.object({
  id: z.string().min(1),
  url: z.string().url(),
  credito: z.string(),
  alt: z.string(),
  tipo: z.enum(["grabado", "pintura", "mapa", "foto"]),
  /**
   * periodo = imagen de época / archivo histórico (default si se omite).
   * contemporanea = foto o vista actual (paisaje turístico, monumento moderno, etc.).
   */
  origenVisual: z.enum(["periodo", "contemporanea"]).optional(),
});

export const CreateJobRequestSchema = z.object({
  exhibition: ExhibitionSchema,
  formatId: VideoFormatIdSchema.default("reel"),
  force: z.boolean().default(false),
  useFakeProviders: z.boolean().optional(),
  profileOverrides: ProfileOverridesSchema.optional(),
  /** Catálogo de piezas referenciadas por exhibition.images[].assetId */
  imageCatalog: z.record(z.string(), ImageCatalogEntrySchema).optional(),
  /**
   * true (default): pausa tras storyboard+assets para revisión humana.
   * false: pipeline continuo (tests / automatización).
   */
  interactive: z.boolean().default(true),
});

export const JobDraftBindingSchema = z.object({
  scene: z.number().int().positive(),
  assetId: z.string().min(1),
  storageUri: z.string().min(1),
  score: z.number().optional(),
  reason: z.string().optional(),
});

export const JobDraftCatalogItemSchema = z.object({
  id: z.string().min(1),
  url: z.string().url(),
  alt: z.string(),
  tipo: z.enum(["grabado", "pintura", "mapa", "foto"]),
  credito: z.string().optional(),
  origenVisual: z.enum(["periodo", "contemporanea"]).optional(),
});

export const JobDraftSchema = z.object({
  storyboard: StoryboardDocumentSchema,
  bindings: z.array(JobDraftBindingSchema).min(1),
  musicCategoryHint: z
    .enum(["epica", "solemne", "suspenso", "emotiva", "institucional"])
    .optional(),
  catalog: z.array(JobDraftCatalogItemSchema).default([]),
});

export const JobDraftPatchSchema = z.object({
  scenes: z
    .array(
      z.object({
        scene: z.number().int().positive(),
        narration: z.string().min(1).optional(),
        assetId: z.string().min(1).optional(),
      }),
    )
    .min(1),
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
  hasDraft: z.boolean().optional(),
  interactive: z.boolean().optional(),
  resumePhase: ResumePhaseSchema.optional(),
});

export type JobStatus = z.infer<typeof JobStatusSchema>;
export type PipelineStage = z.infer<typeof PipelineStageSchema>;
export type ResumePhase = z.infer<typeof ResumePhaseSchema>;
export type ProfileOverrides = z.infer<typeof ProfileOverridesSchema>;
export type ImageCatalogEntry = z.infer<typeof ImageCatalogEntrySchema>;
export type CreateJobRequest = z.infer<typeof CreateJobRequestSchema>;
export type JobDraftBinding = z.infer<typeof JobDraftBindingSchema>;
export type JobDraftCatalogItem = z.infer<typeof JobDraftCatalogItemSchema>;
export type JobDraft = z.infer<typeof JobDraftSchema>;
export type JobDraftPatch = z.infer<typeof JobDraftPatchSchema>;
export type JobMetrics = z.infer<typeof JobMetricsSchema>;
export type JobView = z.infer<typeof JobViewSchema>;

export const PIPELINE_VERSION = "1.2.0";
