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
  type: z.enum(["cronica", "manual", "efemeride", "editorial_story"]),
  externalId: z.string().min(1),
});

export const BrandIdSchema = z.enum(["museoargent", "labrechahoy"]);
export type BrandId = z.infer<typeof BrandIdSchema>;

export const EditorialContextSchema = z.object({
  storyId: z.string().min(1).optional(),
  angleId: z.string().min(1).optional(),
  variantId: z.string().min(1).optional(),
  claims: z.array(z.string()).default([]),
  sourceNotes: z.array(z.string()).default([]),
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
  brandId: BrandIdSchema.optional(),
  editorialContext: EditorialContextSchema.optional(),
});

export type EntityRef = z.infer<typeof EntityRefSchema>;
export type ChronologyBeat = z.infer<typeof ChronologyBeatSchema>;
export type Quote = z.infer<typeof QuoteSchema>;
export type DocumentRef = z.infer<typeof DocumentRefSchema>;
export type AssetRef = z.infer<typeof AssetRefSchema>;
export type ExhibitionSource = z.infer<typeof ExhibitionSourceSchema>;
export type Exhibition = z.infer<typeof ExhibitionSchema>;
export type EditorialContext = z.infer<typeof EditorialContextSchema>;
