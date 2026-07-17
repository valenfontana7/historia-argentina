import { z } from "zod";

export const ExportFormatSchema = z.enum(["png", "webp"]);

export type ExportFormat = z.infer<typeof ExportFormatSchema>;

/** Future export formats (stubs). */
export const FutureExportFormatSchema = z.enum(["pdf", "svg", "zip"]);

export const RenderingProfileIdSchema = z.enum([
  "instagram_feed",
  "instagram_square",
  "instagram_portrait",
  "linkedin_carousel",
  "pinterest_story",
]);

export type RenderingProfileId = z.infer<typeof RenderingProfileIdSchema>;

export const RenderingProfileSchema = z.object({
  id: RenderingProfileIdSchema,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  aspectRatio: z.string().min(1),
  paddingPx: z.number().int().nonnegative(),
  safeBottomPx: z.number().int().nonnegative(),
  branding: z.boolean(),
  exportFormat: ExportFormatSchema,
});

export type RenderingProfile = z.infer<typeof RenderingProfileSchema>;

export const DEFAULT_RENDERING_PROFILES: Record<
  RenderingProfileId,
  RenderingProfile
> = {
  instagram_feed: {
    id: "instagram_feed",
    width: 1080,
    height: 1350,
    aspectRatio: "4:5",
    paddingPx: 72,
    safeBottomPx: 96,
    branding: true,
    exportFormat: "png",
  },
  instagram_square: {
    id: "instagram_square",
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
    paddingPx: 64,
    safeBottomPx: 80,
    branding: true,
    exportFormat: "png",
  },
  instagram_portrait: {
    id: "instagram_portrait",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
    paddingPx: 72,
    safeBottomPx: 160,
    branding: true,
    exportFormat: "png",
  },
  linkedin_carousel: {
    id: "linkedin_carousel",
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
    paddingPx: 64,
    safeBottomPx: 72,
    branding: true,
    exportFormat: "png",
  },
  pinterest_story: {
    id: "pinterest_story",
    width: 1000,
    height: 1500,
    aspectRatio: "2:3",
    paddingPx: 64,
    safeBottomPx: 96,
    branding: true,
    exportFormat: "png",
  },
};

export const DEFAULT_PROFILE_ID: RenderingProfileId = "instagram_feed";

export const IMPLEMENTED_PROFILES: readonly RenderingProfileId[] = [
  "instagram_feed",
  "instagram_square",
];
