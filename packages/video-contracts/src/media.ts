import { z } from "zod";

export const VoiceTrackSchema = z.object({
  provider: z.string().min(1),
  voice: z.string().optional(),
  fileUri: z.string().min(1),
  durationSec: z.number().positive(),
  sampleRate: z.number().int().positive().optional(),
  scene: z.number().int().positive().optional(),
});

export const SceneAssetBindingSchema = z.object({
  scene: z.number().int().positive(),
  assetId: z.string().min(1),
  score: z.number(),
  reason: z.string().min(1),
  storageUri: z.string().min(1),
});

export const SubtitleCueSchema = z.object({
  index: z.number().int().positive(),
  startSec: z.number().nonnegative(),
  endSec: z.number().positive(),
  text: z.string().min(1),
});

export const SubtitleDocumentSchema = z.object({
  cues: z.array(SubtitleCueSchema).min(1),
  srtUri: z.string().min(1),
  vttUri: z.string().min(1),
  /** ASS con PlayRes 1080×1920 para burn-in correcto. */
  assUri: z.string().min(1).optional(),
});

export const MusicCategorySchema = z.enum([
  "epica",
  "solemne",
  "suspenso",
  "emotiva",
  "institucional",
]);

export const MusicCueSchema = z.object({
  assetId: z.string().min(1),
  category: MusicCategorySchema,
  storageUri: z.string().min(1),
  gainDb: z.number().default(-18),
});

export type VoiceTrack = z.infer<typeof VoiceTrackSchema>;
export type SceneAssetBinding = z.infer<typeof SceneAssetBindingSchema>;
export type SubtitleCue = z.infer<typeof SubtitleCueSchema>;
export type SubtitleDocument = z.infer<typeof SubtitleDocumentSchema>;
export type MusicCategory = z.infer<typeof MusicCategorySchema>;
export type MusicCue = z.infer<typeof MusicCueSchema>;
