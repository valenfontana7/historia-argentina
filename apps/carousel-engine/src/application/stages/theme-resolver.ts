import { readFile } from "node:fs/promises";
import path from "node:path";
import { CarouselEngineError } from "../../domain/errors";

export type ThemeTokens = {
  id: string;
  displayName: string;
  tokens: Record<string, string>;
};

const CACHE = new Map<string, ThemeTokens>();

export async function resolveTheme(
  engineRoot: string,
  themeId: string,
): Promise<ThemeTokens> {
  const cached = CACHE.get(themeId);
  if (cached) return cached;

  const folder = themeId.replace(/_/g, "-");
  const themeDir = path.join(engineRoot, "themes", folder);
  const file = path.join(themeDir, "tokens.json");
  let raw: string;
  try {
    raw = await readFile(file, "utf8");
  } catch {
    throw new CarouselEngineError(
      `Theme not found: ${themeId}`,
      "theme_not_found",
    );
  }
  const theme = JSON.parse(raw) as ThemeTokens;
  if (theme.id !== themeId) {
    throw new CarouselEngineError(
      `Theme id mismatch: ${themeId}`,
      "theme_mismatch",
    );
  }

  // Embed logo as data-URI so Playwright never needs file://
  const logoRel = theme.tokens["brand.logoFile"] ?? "logo.png";
  try {
    const logoBuf = await readFile(path.join(themeDir, logoRel));
    const ext = path.extname(logoRel).toLowerCase();
    const mime =
      ext === ".webp"
        ? "image/webp"
        : ext === ".jpg" || ext === ".jpeg"
          ? "image/jpeg"
          : "image/png";
    theme.tokens["brand.logoSrc"] =
      `data:${mime};base64,${logoBuf.toString("base64")}`;
  } catch {
    // optional — footer falls back to typographic mark
  }

  CACHE.set(themeId, theme);
  return theme;
}
