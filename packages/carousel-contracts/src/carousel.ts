import { z } from "zod";
import { RenderedSlideTypeSchema, SlideTypeSchema } from "./slide-types";

export const CarouselAssetRefSchema = z.object({
  id: z.string().min(1),
  src: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  alt: z.string().optional(),
  credit: z.string().optional(),
  /** Normalized focus point 0–1; used by AssetComposer only. */
  focusX: z.number().min(0).max(1).optional(),
  focusY: z.number().min(0).max(1).optional(),
});

export type CarouselAssetRef = z.infer<typeof CarouselAssetRefSchema>;

const SlideBase = {
  id: z.string().min(1),
};

export const CoverSlideSchema = z.object({
  ...SlideBase,
  type: z.literal("cover"),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  kicker: z.string().optional(),
  image: CarouselAssetRefSchema.optional(),
  credit: z.string().optional(),
});

export const ContentSlideSchema = z.object({
  ...SlideBase,
  type: z.literal("content"),
  title: z.string().optional(),
  body: z.string().min(1),
  image: CarouselAssetRefSchema.optional(),
  caption: z.string().optional(),
});

export const QuoteSlideSchema = z.object({
  ...SlideBase,
  type: z.literal("quote"),
  quote: z.string().min(1),
  attribution: z.string().optional(),
  image: CarouselAssetRefSchema.optional(),
});

export const StatisticSlideSchema = z.object({
  ...SlideBase,
  type: z.literal("statistic"),
  value: z.string().min(1),
  label: z.string().min(1),
  context: z.string().optional(),
});

export const GallerySlideSchema = z.object({
  ...SlideBase,
  type: z.literal("gallery"),
  images: z.array(CarouselAssetRefSchema).min(2).max(4),
  caption: z.string().optional(),
});

export const EndingCtaSlideSchema = z.object({
  ...SlideBase,
  type: z.literal("ending_cta"),
  title: z.string().min(1),
  body: z.string().optional(),
  cta: z.string().min(1),
});

/** Reserved shapes: typed for forward-compat; engine rejects render. */
export const ReservedSlideSchema = z.object({
  ...SlideBase,
  type: z.enum([
    "section",
    "timeline",
    "comparison",
    "map",
    "checklist",
    "artifact",
    "portrait",
    "callout",
  ]),
  title: z.string().optional(),
  body: z.string().optional(),
  payload: z.record(z.unknown()).optional(),
});

export const RenderedSlideSchema = z.discriminatedUnion("type", [
  CoverSlideSchema,
  ContentSlideSchema,
  QuoteSlideSchema,
  StatisticSlideSchema,
  GallerySlideSchema,
  EndingCtaSlideSchema,
]);

export const SlideSchema = z.union([RenderedSlideSchema, ReservedSlideSchema]);

export const CarouselSchema = z.object({
  id: z.string().min(1),
  title: z.string().optional(),
  locale: z.string().min(2).default("es-AR"),
  slides: z.array(SlideSchema).min(1),
});

export type CoverSlide = z.infer<typeof CoverSlideSchema>;
export type ContentSlide = z.infer<typeof ContentSlideSchema>;
export type QuoteSlide = z.infer<typeof QuoteSlideSchema>;
export type StatisticSlide = z.infer<typeof StatisticSlideSchema>;
export type GallerySlide = z.infer<typeof GallerySlideSchema>;
export type EndingCtaSlide = z.infer<typeof EndingCtaSlideSchema>;
export type RenderedSlide = z.infer<typeof RenderedSlideSchema>;
export type Slide = z.infer<typeof SlideSchema>;
export type Carousel = z.infer<typeof CarouselSchema>;

export function isRenderedSlideType(
  type: z.infer<typeof SlideTypeSchema>,
): type is z.infer<typeof RenderedSlideTypeSchema> {
  return (RenderedSlideTypeSchema.options as string[]).includes(type);
}
