import { z } from "zod";
import { CarouselSchema } from "./carousel";
import { ExportFormatSchema } from "./profile";
import { TemplateIdSchema } from "./template";
import { ThemeIdSchema } from "./theme";
import { RenderingProfileIdSchema } from "./profile";

export const CAROUSEL_PIPELINE_VERSION = "1.0.0";

export const CarouselJobStatusSchema = z.enum([
  "draft",
  "ready",
  "rendering",
  "succeeded",
  "failed",
]);

export type CarouselJobStatus = z.infer<typeof CarouselJobStatusSchema>;

export const CarouselJobMetaSchema = z.object({
  templateId: TemplateIdSchema,
  templateVersion: z.number().int().positive(),
  themeId: ThemeIdSchema,
  profileId: RenderingProfileIdSchema,
  exportFormat: ExportFormatSchema,
  pipelineVersion: z.string().min(1),
});

export type CarouselJobMeta = z.infer<typeof CarouselJobMetaSchema>;

export const CarouselJobSchema = z.object({
  id: z.string().min(1),
  status: CarouselJobStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  carouselId: z.string().min(1),
  slideOrder: z.array(z.string().min(1)),
  dirtySlideIds: z.array(z.string().min(1)),
  meta: CarouselJobMetaSchema,
  error: z.string().optional(),
  renderedSlideIds: z.array(z.string().min(1)).default([]),
});

export type CarouselJob = z.infer<typeof CarouselJobSchema>;

export const CreateCarouselJobRequestSchema = z.object({
  carousel: CarouselSchema,
  templateId: TemplateIdSchema.default("museum_classic"),
  templateVersion: z.number().int().positive().default(1),
  themeId: ThemeIdSchema.default("museoargent_classic"),
  profileId: RenderingProfileIdSchema.default("instagram_feed"),
  exportFormat: ExportFormatSchema.default("png"),
});

export type CreateCarouselJobRequest = z.infer<
  typeof CreateCarouselJobRequestSchema
>;

export const PatchCarouselJobSchema = z.object({
  slideOrder: z.array(z.string().min(1)).optional(),
  duplicateSlideId: z.string().min(1).optional(),
  deleteSlideId: z.string().min(1).optional(),
  templateId: TemplateIdSchema.optional(),
  templateVersion: z.number().int().positive().optional(),
  themeId: ThemeIdSchema.optional(),
  profileId: RenderingProfileIdSchema.optional(),
  exportFormat: ExportFormatSchema.optional(),
  carousel: CarouselSchema.optional(),
});

export type PatchCarouselJob = z.infer<typeof PatchCarouselJobSchema>;

export const RenderCarouselRequestSchema = z.object({
  slideIds: z.array(z.string().min(1)).optional(),
  format: ExportFormatSchema.optional(),
});

export type RenderCarouselRequest = z.infer<typeof RenderCarouselRequestSchema>;

export const CarouselJobViewSchema = CarouselJobSchema.extend({
  title: z.string().optional(),
  slideCount: z.number().int().nonnegative(),
});

export type CarouselJobView = z.infer<typeof CarouselJobViewSchema>;
