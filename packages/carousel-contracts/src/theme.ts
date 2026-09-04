import { z } from "zod";

export const ThemeIdSchema = z.enum([
  "museoargent_classic",
  "light",
  "dark",
  "museum",
  "editorial",
  "premium",
  "labrechahoy_editorial",
]);

export type ThemeId = z.infer<typeof ThemeIdSchema>;

export const DEFAULT_THEME: ThemeId = "museoargent_classic";

/** Semantic token names — components never use literal colors. */
export const ColorTokenNameSchema = z.enum([
  "color.bg",
  "color.bgElevated",
  "color.ink",
  "color.inkMuted",
  "color.accent",
  "color.accentSoft",
  "color.line",
]);

export const FontTokenNameSchema = z.enum(["font.display", "font.sans"]);

export const BrandTokenNameSchema = z.enum([
  "brand.mark",
  "brand.handle",
  "brand.url",
  "brand.displayName",
]);

export type ColorTokenName = z.infer<typeof ColorTokenNameSchema>;
export type FontTokenName = z.infer<typeof FontTokenNameSchema>;
export type BrandTokenName = z.infer<typeof BrandTokenNameSchema>;
