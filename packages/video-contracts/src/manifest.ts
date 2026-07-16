import { z } from "zod";
import { MotionTypeSchema, TransitionTypeSchema } from "./storyboard";

export const LayerKindSchema = z.enum(["image", "text", "solid", "branding"]);

export const LayerSchema = z.object({
  id: z.string().min(1),
  kind: LayerKindSchema,
  uri: z.string().optional(),
  text: z.string().optional(),
  color: z.string().optional(),
  x: z.number().optional(),
  y: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  opacity: z.number().min(0).max(1).optional(),
  fontSize: z.number().optional(),
});

export const AnimationSchema = z.object({
  type: MotionTypeSchema,
  startSec: z.number().nonnegative().default(0),
  endSec: z.number().positive().optional(),
  intensity: z.number().min(0).max(1).default(0.08),
});

export const TransitionSchema = z.object({
  type: TransitionTypeSchema,
  durationSec: z.number().positive().default(0.4),
});

export const ManifestSceneSchema = z.object({
  id: z.string().min(1),
  durationSec: z.number().positive(),
  layers: z.array(LayerSchema).min(1),
  animations: z.array(AnimationSchema).default([]),
  transition: TransitionSchema.optional(),
});

export const AudioTrackSchema = z.object({
  role: z.enum(["narration", "music"]),
  uri: z.string().min(1),
  gainDb: z.number().optional(),
});

export const VideoFormatSpecSchema = z.object({
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  fps: z.number().int().positive().default(30),
  aspectRatio: z.enum(["9:16", "1:1", "16:9"]),
});

export const VideoManifestSchema = z.object({
  version: z.literal(1),
  format: VideoFormatSpecSchema,
  scenes: z.array(ManifestSceneSchema).min(1),
  audio: z.array(AudioTrackSchema).default([]),
  subtitles: z
    .object({
      format: z.enum(["srt", "vtt", "ass"]),
      uri: z.string().min(1),
    })
    .optional(),
  branding: z
    .object({
      endCardDurationSec: z.number().positive(),
      layers: z.array(LayerSchema).min(1),
    })
    .optional(),
});

export const RenderResultSchema = z.object({
  mp4Uri: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  durationSec: z.number().positive(),
  bytes: z.number().int().nonnegative(),
});

export type Layer = z.infer<typeof LayerSchema>;
export type Animation = z.infer<typeof AnimationSchema>;
export type Transition = z.infer<typeof TransitionSchema>;
export type ManifestScene = z.infer<typeof ManifestSceneSchema>;
export type AudioTrack = z.infer<typeof AudioTrackSchema>;
export type VideoFormatSpec = z.infer<typeof VideoFormatSpecSchema>;
export type VideoManifest = z.infer<typeof VideoManifestSchema>;
export type RenderResult = z.infer<typeof RenderResultSchema>;

export const VERTICAL_1080x1920: VideoFormatSpec = {
  width: 1080,
  height: 1920,
  fps: 30,
  aspectRatio: "9:16",
};
