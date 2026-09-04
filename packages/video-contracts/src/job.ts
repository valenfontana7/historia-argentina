import { z } from "zod";
import { ExhibitionSchema } from "./exhibition";
import { NarrativePaceSchema, VideoFormatIdSchema } from "./format";
import { VoiceTrackSchema } from "./media";
import { ScriptDocumentSchema } from "./script";
import {
  MotionTypeSchema,
  ShotTypeSchema,
  StoryboardDocumentSchema,
  TransitionTypeSchema,
} from "./storyboard";

export const JobStatusSchema = z.enum([
  "queued",
  "running",
  "awaiting_script",
  "awaiting_storyboard",
  "awaiting_assets",
  /** @deprecated Prefer awaiting_assets — kept for hydrated jobs. */
  "awaiting_review",
  "awaiting_voice",
  "awaiting_preview",
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
  "preview",
  "subtitles",
  "music",
  "compose",
  "render",
]);

export const ResumePhaseSchema = z.enum([
  "script",
  "storyboard",
  "assets",
  "voice",
  "preview",
  "render",
  /** @deprecated Mapped to script on read. */
  "draft",
]);

export const VoicesDocumentSchema = z.object({
  tracks: z.array(VoiceTrackSchema).min(1),
});

export const PreviewSceneStateSchema = z.object({
  scene: z.number().int().positive(),
  previewUri: z.string().min(1),
  locked: z.boolean().default(false),
  dirty: z.boolean().default(false),
});

export const PreviewStateSchema = z.object({
  scenes: z.array(PreviewSceneStateSchema).min(1),
});

export const VoiceRegenerateSchema = z.object({
  narration: z.string().min(1).optional(),
});

export const PreRenderChecklistItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  ok: z.boolean(),
  severity: z.enum(["error", "warn"]),
  detail: z.string().optional(),
});

export const PreRenderChecklistSchema = z.object({
  items: z.array(PreRenderChecklistItemSchema),
  canApprove: z.boolean(),
});

export const VersionPhaseSchema = z.enum([
  "script",
  "storyboard",
  "assets",
  "voice",
  "preview",
]);

export const VersionEntrySchema = z.object({
  n: z.number().int().positive(),
  phase: VersionPhaseSchema,
  at: z.string().min(1),
  dir: z.string().min(1),
});

export const VersionsManifestSchema = z.object({
  next: z.number().int().positive(),
  entries: z.array(VersionEntrySchema).default([]),
});

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
  origenVisual: z.enum(["periodo", "contemporanea"]).optional(),
});

export const CreateJobRequestSchema = z.object({
  exhibition: ExhibitionSchema,
  formatId: VideoFormatIdSchema.default("reel"),
  force: z.boolean().default(false),
  useFakeProviders: z.boolean().optional(),
  profileOverrides: ProfileOverridesSchema.optional(),
  imageCatalog: z.record(z.string(), ImageCatalogEntrySchema).optional(),
  /**
   * true (default): pausas multi-gate (script → storyboard → assets → voice → preview).
   * false: pipeline continuo (tests / CLI).
   */
  interactive: z.boolean().default(true),
});

export const JobDraftBindingSchema = z.object({
  scene: z.number().int().positive(),
  assetId: z.string().min(1),
  storageUri: z.string().min(1),
  score: z.number().optional(),
  reason: z.string().optional(),
  locked: z.boolean().optional(),
});

export const JobDraftCatalogItemSchema = z.object({
  id: z.string().min(1),
  url: z.string().url(),
  alt: z.string(),
  tipo: z.enum(["grabado", "pintura", "mapa", "foto"]),
  credito: z.string().optional(),
  origenVisual: z.enum(["periodo", "contemporanea"]).optional(),
});

export const JobBindingsDocumentSchema = z.object({
  bindings: z.array(JobDraftBindingSchema).min(1),
  catalog: z.array(JobDraftCatalogItemSchema).default([]),
  musicCategoryHint: z
    .enum(["epica", "solemne", "suspenso", "emotiva", "institucional"])
    .optional(),
});

/** Legacy combined draft (storyboard + bindings). */
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

export const ScriptPatchSchema = z.object({
  scenes: z
    .array(
      z.object({
        scene: z.number().int().positive(),
        narration: z.string().min(1).optional(),
        durationSec: z.number().positive().optional(),
      }),
    )
    .min(1),
});

export const StoryboardPatchSchema = z.object({
  scenes: z
    .array(
      z.object({
        scene: z.number().int().positive(),
        narration: z.string().min(1).optional(),
        durationSec: z.number().positive().optional(),
        shotType: ShotTypeSchema.optional(),
        motion: MotionTypeSchema.optional(),
        transition: TransitionTypeSchema.optional(),
        onScreenText: z.string().optional(),
      }),
    )
    .optional(),
  /** Nuevo orden de números de escena (permutación). */
  order: z.array(z.number().int().positive()).optional(),
});

export const AssetsPatchSchema = z.object({
  scenes: z
    .array(
      z.object({
        scene: z.number().int().positive(),
        assetId: z.string().min(1),
        locked: z.boolean().optional(),
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
  useFakeProviders: z.boolean().optional(),
});

export type JobStatus = z.infer<typeof JobStatusSchema>;
export type PipelineStage = z.infer<typeof PipelineStageSchema>;
export type ResumePhase = z.infer<typeof ResumePhaseSchema>;
export type ProfileOverrides = z.infer<typeof ProfileOverridesSchema>;
export type ImageCatalogEntry = z.infer<typeof ImageCatalogEntrySchema>;
export type CreateJobRequest = z.infer<typeof CreateJobRequestSchema>;
export type JobDraftBinding = z.infer<typeof JobDraftBindingSchema>;
export type JobDraftCatalogItem = z.infer<typeof JobDraftCatalogItemSchema>;
export type JobBindingsDocument = z.infer<typeof JobBindingsDocumentSchema>;
export type JobDraft = z.infer<typeof JobDraftSchema>;
export type JobDraftPatch = z.infer<typeof JobDraftPatchSchema>;
export type ScriptPatch = z.infer<typeof ScriptPatchSchema>;
export type StoryboardPatch = z.infer<typeof StoryboardPatchSchema>;
export type AssetsPatch = z.infer<typeof AssetsPatchSchema>;
export type VoicesDocument = z.infer<typeof VoicesDocumentSchema>;
export type PreviewSceneState = z.infer<typeof PreviewSceneStateSchema>;
export type PreviewState = z.infer<typeof PreviewStateSchema>;
export type VoiceRegenerate = z.infer<typeof VoiceRegenerateSchema>;
export type PreRenderChecklistItem = z.infer<typeof PreRenderChecklistItemSchema>;
export type PreRenderChecklist = z.infer<typeof PreRenderChecklistSchema>;
export type VersionPhase = z.infer<typeof VersionPhaseSchema>;
export type VersionEntry = z.infer<typeof VersionEntrySchema>;
export type VersionsManifest = z.infer<typeof VersionsManifestSchema>;
export type JobMetrics = z.infer<typeof JobMetricsSchema>;
export type JobView = z.infer<typeof JobViewSchema>;

export { ScriptDocumentSchema };

export const PIPELINE_VERSION = "1.6.0";

export function finalizePreRenderChecklist(
  items: PreRenderChecklistItem[],
): PreRenderChecklist {
  return PreRenderChecklistSchema.parse({
    items,
    canApprove: items.every((i) => i.ok || i.severity === "warn"),
  });
}

export function normalizeResumePhase(
  phase: ResumePhase | undefined,
): Exclude<ResumePhase, "draft"> {
  if (!phase || phase === "draft") return "script";
  return phase;
}

export function isAwaitingStatus(status: JobStatus): boolean {
  return (
    status === "awaiting_script" ||
    status === "awaiting_storyboard" ||
    status === "awaiting_assets" ||
    status === "awaiting_review" ||
    status === "awaiting_voice" ||
    status === "awaiting_preview"
  );
}

export function isBusyStatus(status: JobStatus): boolean {
  return status === "queued" || status === "running" || isAwaitingStatus(status);
}

/** Jobs de tests (`fixture:…`); no deben bloquear la cola de producción. */
export function isFixtureExhibitionId(exhibitionId: string): boolean {
  return exhibitionId.startsWith("fixture:");
}
