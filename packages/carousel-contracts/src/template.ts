import { z } from "zod";

export const TemplateIdSchema = z.enum([
  "museum_classic",
  "museum_editorial",
  "museum_documentary",
  "museum_dark",
  "museum_premium",
]);

export type TemplateId = z.infer<typeof TemplateIdSchema>;

export const TemplateRefSchema = z.object({
  id: TemplateIdSchema,
  version: z.number().int().positive(),
});

export type TemplateRef = z.infer<typeof TemplateRefSchema>;

export const DEFAULT_TEMPLATE: TemplateRef = {
  id: "museum_classic",
  version: 1,
};

export const LayoutRecipeIdSchema = z.enum([
  "cover-hero",
  "content-split",
  "quote-centered",
  "statistic-focus",
  "gallery-grid",
  "ending-cta",
]);

export type LayoutRecipeId = z.infer<typeof LayoutRecipeIdSchema>;

export const TypographyStepSchema = z.enum([
  "default",
  "titleScale-1",
  "titleScale-2",
  "bodyCompact",
  "bodyCompact-2",
]);

export type TypographyStep = z.infer<typeof TypographyStepSchema>;
