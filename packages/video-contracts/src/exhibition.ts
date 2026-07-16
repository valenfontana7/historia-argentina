import { z } from "zod";

export const EntityRefSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: z.string().optional(),
});

export const ChronologyBeatSchema = z.object({
  year: z.number().int().optional(),
  label: z.string().min(1),
  detail: z.string().optional(),
});

export const QuoteSchema = z.object({
  text: z.string().min(1),
  attribution: z.string().optional(),
});

export const DocumentRefSchema = z.object({
  assetId: z.string().min(1),
  title: z.string().optional(),
});

export const AssetRefSchema = z.object({
  assetId: z.string().min(1),
});

export const ExhibitionSourceSchema = z.object({
  type: z.enum(["cronica", "manual", "efemeride"]),
  externalId: z.string().min(1),
});

export const ExhibitionSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  periodLabel: z.string().optional(),
  yearStart: z.number().int().optional(),
  yearEnd: z.number().int().optional(),
  chronology: z.array(ChronologyBeatSchema).default([]),
  characters: z.array(EntityRefSchema).default([]),
  places: z.array(EntityRefSchema).default([]),
  quotes: z.array(QuoteSchema).default([]),
  curiosities: z.array(z.string()).default([]),
  documents: z.array(DocumentRefSchema).default([]),
  images: z.array(AssetRefSchema).default([]),
  source: ExhibitionSourceSchema,
});

export type EntityRef = z.infer<typeof EntityRefSchema>;
export type ChronologyBeat = z.infer<typeof ChronologyBeatSchema>;
export type Quote = z.infer<typeof QuoteSchema>;
export type DocumentRef = z.infer<typeof DocumentRefSchema>;
export type AssetRef = z.infer<typeof AssetRefSchema>;
export type ExhibitionSource = z.infer<typeof ExhibitionSourceSchema>;
export type Exhibition = z.infer<typeof ExhibitionSchema>;
