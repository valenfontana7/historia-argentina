import { z } from "zod";

export const ScriptSceneSchema = z.object({
  scene: z.number().int().positive(),
  durationSec: z.number().positive(),
  narration: z.string().min(1),
});

export const ScriptDocumentSchema = z.object({
  scenes: z.array(ScriptSceneSchema).min(1),
  musicCategoryHint: z
    .enum(["epica", "solemne", "suspenso", "emotiva", "institucional"])
    .optional(),
});

export type ScriptScene = z.infer<typeof ScriptSceneSchema>;
export type ScriptDocument = z.infer<typeof ScriptDocumentSchema>;
