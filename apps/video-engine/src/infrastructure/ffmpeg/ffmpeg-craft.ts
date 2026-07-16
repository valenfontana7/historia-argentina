/**
 * Helpers de craft visual para reels 9:16 (look, framing, motion, xfade).
 * Exportados para unit tests.
 */

export const REEL_W = 1080;
export const REEL_H = 1920;

export type ImageOrientation = "horizontal" | "vertical" | "square";

export function orientationFromSize(
  width: number,
  height: number,
): ImageOrientation {
  if (!width || !height) return "horizontal";
  const ratio = width / height;
  if (ratio > 1.08) return "horizontal";
  if (ratio < 0.92) return "vertical";
  return "square";
}

/** Landscape ancho → letterbox blur; vertical/square → cover crop. */
export function shouldUseBlurBackground(orientation: ImageOrientation): boolean {
  return orientation === "horizontal";
}

export function buildSceneLookFilters(): string[] {
  return [
    "eq=contrast=1.08:saturation=0.92:brightness=0.02",
    "vignette=PI/4",
    "noise=alls=2:allf=t",
  ];
}

/**
 * Framing a 1080×1920.
 * cover: scale+crop
 * blurBg: fondo blur + imagen fit centrada (filter_complex labels)
 */
export function buildCoverFilter(): string {
  return `scale=${REEL_W}:${REEL_H}:force_original_aspect_ratio=increase:flags=lanczos,crop=${REEL_W}:${REEL_H},setsar=1`;
}

/** Cadena filter_complex para letterbox blur; input [0:v] → salida [framed]. */
export function buildBlurBgFilterComplex(): string {
  return [
    `[0:v]scale=${REEL_W}:${REEL_H}:force_original_aspect_ratio=increase:flags=lanczos,crop=${REEL_W}:${REEL_H},gblur=sigma=22[bg]`,
    `[0:v]scale=${REEL_W}:${REEL_H}:force_original_aspect_ratio=decrease:flags=lanczos[fg]`,
    `[bg][fg]overlay=(W-w)/2:(H-h)/2,setsar=1[framed]`,
  ].join(";");
}

export function buildZoompan(
  motion: string,
  duration: number,
  fps: number,
  intensity = 0.1,
): string {
  const frames = Math.max(1, Math.round(duration * fps));
  const i = Math.min(1, Math.max(0.04, intensity));
  const zoomMax = 1 + i * 0.9; // ~1.04–1.9, típico 1.12–1.26
  const zoomStep = (0.00055 + i * 0.0012).toFixed(5);
  const panPx = (0.25 + i * 1.2).toFixed(2);
  const prep = `scale=${Math.round(REEL_W * (1 + i))}:${Math.round(REEL_H * (1 + i))},`;

  switch (motion) {
    case "zoomIn":
      return `${prep}zoompan=z='min(zoom+${zoomStep},${zoomMax.toFixed(3)})':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=${REEL_W}x${REEL_H}:fps=${fps}`;
    case "zoomOut":
      return `${prep}zoompan=z='if(eq(on,1),${zoomMax.toFixed(3)},max(zoom-${zoomStep},1))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=${REEL_W}x${REEL_H}:fps=${fps}`;
    case "panLeft":
      return `${prep}zoompan=z='${(1 + i * 0.5).toFixed(3)}':x='iw/2-(iw/zoom/2)-on*${panPx}':y='ih/2-(ih/zoom/2)':d=${frames}:s=${REEL_W}x${REEL_H}:fps=${fps}`;
    case "panRight":
      return `${prep}zoompan=z='${(1 + i * 0.5).toFixed(3)}':x='iw/2-(iw/zoom/2)+on*${panPx}':y='ih/2-(ih/zoom/2)':d=${frames}:s=${REEL_W}x${REEL_H}:fps=${fps}`;
    case "static":
      return "null";
    case "kenBurns":
    default:
      return `${prep}zoompan=z='min(zoom+${zoomStep},${(1 + i * 0.7).toFixed(3)})':x='iw/2-(iw/zoom/2)+on*${(Number(panPx) * 0.35).toFixed(2)}':y='ih/2-(ih/zoom/2)':d=${frames}:s=${REEL_W}x${REEL_H}:fps=${fps}`;
  }
}

export type XfadeSpec = { transition: string; duration: number };

/** Mapea transition del storyboard a xfade FFmpeg. */
export function mapXfade(tType: string): XfadeSpec {
  switch (tType) {
    case "cut":
      // 0.01 rompe la cadena xfade (offset al borde → clips siguientes se pierden).
      return { transition: "fade", duration: 0.05 };
    case "fade":
      return { transition: "fade", duration: 0.4 };
    case "crossfade":
      return { transition: "dissolve", duration: 0.45 };
    default:
      return { transition: "fade", duration: 0.4 };
  }
}

export function motionIntensityForScene(input: {
  sceneIndex: number;
  shotType: string;
  motion: string;
}): number {
  if (input.sceneIndex === 0) return 0.14;
  if (input.motion === "static") return 0.05;
  if (input.shotType === "detalle" || input.shotType === "mapa") return 0.1;
  if (input.shotType === "retrato") return 0.08;
  return 0.1;
}

/** Boost de score por shotType ↔ asset.type */
export function shotTypeAssetBoost(
  shotType: string,
  assetType: string,
): number {
  const map: Record<string, string[]> = {
    retrato: ["retrato", "pintura", "fotografia"],
    "plano-general": ["pintura", "fotografia", "mapa", "monumento"],
    detalle: ["pintura", "documento", "fotografia", "ilustracion"],
    mapa: ["mapa"],
    documento: ["documento"],
    simbolo: ["bandera", "ilustracion", "monumento", "simbolo"],
  };
  const preferred = map[shotType] ?? [];
  return preferred.includes(assetType) ? 0.28 : 0;
}
