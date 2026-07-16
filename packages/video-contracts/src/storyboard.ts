import { z } from "zod";

export const ShotTypeSchema = z.enum([
  "retrato",
  "plano-general",
  "detalle",
  "mapa",
  "documento",
  "simbolo",
]);

export const MotionTypeSchema = z.enum([
  "kenBurns",
  "zoomIn",
  "zoomOut",
  "panLeft",
  "panRight",
  "static",
]);

export const TransitionTypeSchema = z.enum(["cut", "fade", "crossfade"]);

export const AssetHintSchema = z.object({
  preferredTypes: z
    .array(
      z.enum([
        "retrato",
        "pintura",
        "mapa",
        "documento",
        "monumento",
        "fotografia",
        "bandera",
        "ilustracion",
      ]),
    )
    .default([]),
  tags: z.array(z.string()).default([]),
  characters: z.array(z.string()).default([]),
  places: z.array(z.string()).default([]),
  epoch: z.string().optional(),
});

export const StoryboardSceneSchema = z.object({
  scene: z.number().int().positive(),
  durationSec: z.number().positive(),
  narration: z.string().min(1),
  shotType: ShotTypeSchema,
  assetHint: AssetHintSchema,
  motion: MotionTypeSchema,
  transition: TransitionTypeSchema.default("fade"),
  onScreenText: z.string().optional(),
});

export const StoryboardDocumentSchema = z.object({
  scenes: z.array(StoryboardSceneSchema).min(1),
  musicCategoryHint: z
    .enum(["epica", "solemne", "suspenso", "emotiva", "institucional"])
    .optional(),
});

export type ShotType = z.infer<typeof ShotTypeSchema>;
export type MotionType = z.infer<typeof MotionTypeSchema>;
export type TransitionType = z.infer<typeof TransitionTypeSchema>;
export type AssetHint = z.infer<typeof AssetHintSchema>;
export type StoryboardScene = z.infer<typeof StoryboardSceneSchema>;
export type StoryboardDocument = z.infer<typeof StoryboardDocumentSchema>;
