import path from "node:path";

/** Fuente embebida para ASS + drawtext (craft v3.1). */
export const REEL_FONTS_DIR = path.resolve(__dirname, "../../../assets/fonts");
export const REEL_FONT_FILE = path.join(REEL_FONTS_DIR, "Inter-SemiBold.ttf");
/** Nombre de familia que libass / drawtext resuelven vía fontsdir/fontfile. */
export const REEL_FONT_FAMILY = "Inter";

/** Escapa path para filtros FFmpeg (Windows: `C\:\\...`). */
export function escapeFfmpegPath(p: string): string {
  return p.replace(/\\/g, "/").replace(/:/g, "\\:").replace(/'/g, "\\'");
}
