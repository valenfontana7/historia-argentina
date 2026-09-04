import path from "node:path";
import type { BrandId } from "@museoargent/video-contracts";

export type VideoBrandProfile = {
  id: BrandId;
  displayName: string;
  handle: string;
  urlLabel: string;
  cta: string;
  promptRole: string;
  ttsVoice: string;
  ttsInstructions: string;
  endCardDurationSec: number;
  colors: { bg: string; bgAlt: string; accent: string; text: string };
  logoSize: number;
  logoY: number;
  logoFile?: string;
};

export const VIDEO_BRANDS: Record<BrandId, VideoBrandProfile> = {
  museoargent: {
    id: "museoargent", displayName: "MuseoArgent", handle: "@museoargent", urlLabel: "museoargent.com.ar",
    cta: "Seguí explorando · @museoargent",
    promptRole: "Explicá de dónde viene el fenómeno: contexto histórico, similitudes, diferencias y límites. No fuerces paralelismos.",
    ttsVoice: "coral", ttsInstructions: "Narración en español rioplatense, cinematográfica y cercana. Ritmo vivo pero reflexivo, sin grandilocuencia ni clickbait.",
    endCardDurationSec: 3.2, colors: { bg: "#0c0a08", bgAlt: "#0c1218", accent: "#c6a15b", text: "#ffffff" }, logoSize: 220, logoY: 620, logoFile: "marca-a.png",
  },
  labrechahoy: {
    id: "labrechahoy", displayName: "La Brecha Hoy", handle: "@labrechahoy", urlLabel: "labrechahoy.com.ar",
    cta: "Seguí el dato · @labrechahoy",
    promptRole: "Explicá qué pasó, qué cambió, a quién afecta y qué dato observar. Separá hechos, análisis e incertidumbre; tono sobrio y no partidario.",
    ttsVoice: "marin", ttsInstructions: "Narración en español rioplatense, clara, directa y sobria. Enfatizá cifras y consecuencias concretas sin gritar ni editorializar.",
    endCardDurationSec: 3.2, colors: { bg: "#07111f", bgAlt: "#0f2745", accent: "#1d4ed8", text: "#f8fafc" }, logoSize: 220, logoY: 620,
  },
};

/** Compatibilidad: todo job antiguo sin brandId sigue siendo MuseoArgent. */
export const VIDEO_BRAND = VIDEO_BRANDS.museoargent;
export function videoBrandFor(brandId: BrandId = "museoargent") { return VIDEO_BRANDS[brandId] ?? VIDEO_BRANDS.museoargent; }
export function videoBrandLogoPath(brandId: BrandId = "museoargent"): string | null {
  const file = videoBrandFor(brandId).logoFile;
  return file ? path.resolve(__dirname, `../../assets/brand/${file}`) : null;
}
export function defaultVideoCta(brandId: BrandId = "museoargent") { return videoBrandFor(brandId).cta; }
