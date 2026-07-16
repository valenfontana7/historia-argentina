import { z } from "zod";

export const AssetTypeSchema = z.enum([
  "retrato",
  "pintura",
  "mapa",
  "documento",
  "monumento",
  "fotografia",
  "bandera",
  "ilustracion",
  "musica",
]);

export const OrientationSchema = z.enum(["vertical", "horizontal", "square"]);

export const AssetRecordSchema = z.object({
  id: z.string().min(1),
  type: AssetTypeSchema,
  author: z.string().optional(),
  license: z.string().min(1),
  dateLabel: z.string().optional(),
  tags: z.array(z.string()).default([]),
  characters: z.array(z.string()).default([]),
  places: z.array(z.string()).default([]),
  epoch: z.string().optional(),
  weight: z.number().default(1),
  orientation: OrientationSchema.default("horizontal"),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  storageUri: z.string().min(1),
  sourceUrl: z.string().optional(),
  checksum: z.string().optional(),
  musicCategory: z
    .enum(["epica", "solemne", "suspenso", "emotiva", "institucional"])
    .optional(),
  durationSec: z.number().positive().optional(),
});

export type AssetType = z.infer<typeof AssetTypeSchema>;
export type Orientation = z.infer<typeof OrientationSchema>;
export type AssetRecord = z.infer<typeof AssetRecordSchema>;
