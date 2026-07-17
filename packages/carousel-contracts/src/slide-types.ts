import { z } from "zod";

/** Slide types with a renderer in v1. */
export const RenderedSlideTypeSchema = z.enum([
  "cover",
  "content",
  "quote",
  "statistic",
  "gallery",
  "ending_cta",
]);

/** Reserved types (schema only; no renderer yet). */
export const ReservedSlideTypeSchema = z.enum([
  "section",
  "timeline",
  "comparison",
  "map",
  "checklist",
  "artifact",
  "portrait",
  "callout",
]);

export const SlideTypeSchema = z.enum([
  ...RenderedSlideTypeSchema.options,
  ...ReservedSlideTypeSchema.options,
]);

export type RenderedSlideType = z.infer<typeof RenderedSlideTypeSchema>;
export type ReservedSlideType = z.infer<typeof ReservedSlideTypeSchema>;
export type SlideType = z.infer<typeof SlideTypeSchema>;

export const RENDERED_SLIDE_TYPES: readonly RenderedSlideType[] =
  RenderedSlideTypeSchema.options;
