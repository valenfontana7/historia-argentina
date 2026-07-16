import path from "node:path";

/** Pack de marca para end cards de reels (independiente de Next). */
export const VIDEO_BRAND = {
  displayName: "MuseoArgent",
  handle: "@museoargent",
  urlLabel: "museoargent.com.ar",
  endCardDurationSec: 3.2,
  colors: {
    bg: "#0c0a08",
    bgAlt: "#0c1218",
    oro: "#c6a15b",
    text: "#ffffff",
  },
  /** Tamaño del logo en el end card (px). */
  logoSize: 220,
  logoY: 620,
} as const;

/** Ruta absoluta al PNG de la marca «A». */
export function videoBrandLogoPath(): string {
  return path.resolve(__dirname, "../../assets/brand/marca-a.png");
}

export function defaultVideoCta(): string {
  return `Seguí explorando · ${VIDEO_BRAND.handle}`;
}
