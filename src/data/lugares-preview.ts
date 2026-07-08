/** Slugs de lugares visibles en el mapa y grid público (preview). */
export const LUGARES_PREVIEW_SLUGS = [
  "buenos-aires",
  "tucuman",
  "rosario",
  "cordoba",
  "yapeyu",
  "san-lorenzo",
  "caseros",
] as const;

export function esLugarPreview(slug: string): boolean {
  return (LUGARES_PREVIEW_SLUGS as readonly string[]).includes(slug);
}
