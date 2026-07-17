import { z } from "zod";
import { ExportFormatSchema, FutureExportFormatSchema } from "./profile";

export const ExportRequestSchema = z.object({
  format: ExportFormatSchema.default("png"),
  /** Stubs accepted in schema for forward-compat; engine rejects. */
  futureFormat: FutureExportFormatSchema.optional(),
});

export type ExportRequest = z.infer<typeof ExportRequestSchema>;

export const SlideExportSchema = z.object({
  slideId: z.string().min(1),
  format: ExportFormatSchema,
  path: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  irHash: z.string().min(1),
});

export type SlideExport = z.infer<typeof SlideExportSchema>;

export const ExportManifestSchema = z.object({
  jobId: z.string().min(1),
  templateId: z.string().min(1),
  templateVersion: z.number().int().positive(),
  themeId: z.string().min(1),
  profileId: z.string().min(1),
  format: ExportFormatSchema,
  slides: z.array(SlideExportSchema),
  createdAt: z.string().datetime(),
});

export type ExportManifest = z.infer<typeof ExportManifestSchema>;
