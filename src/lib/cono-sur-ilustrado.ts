/**
 * Posiciones curadas sobre el viewBox ilustrado (720×440) de BaseMapaConoSur.
 * Calibradas contra las siluetas de Argentina/Chile, no proyección GIS estricta.
 */

export const VIEWBOX_ILU = { w: 720, h: 440 } as const;

export type EtiquetaMapa = "izq" | "der" | "arriba" | "abajo";

export type PosicionMapa = {
  x: number;
  y: number;
  etiqueta?: EtiquetaMapa;
  /** Posición absoluta de la etiqueta (con línea guía desde el punto). */
  etiquetaX?: number;
  etiquetaY?: number;
  /** Etiqueta más corta cuando el nombre completo no entra */
  nombreMapa?: string;
};

/** Anclas geo → ilustrado para interpolar lugares sin entrada manual. */
const ANCLAS = [
  { lat: -34.604, lon: -58.382, x: 578, y: 282 },
  { lat: -32.947, lon: -60.639, x: 498, y: 220 },
  { lat: -31.42, lon: -64.188, x: 402, y: 252 },
  { lat: -26.808, lon: -65.217, x: 452, y: 172 },
  { lat: -24.783, lon: -65.411, x: 372, y: 124 },
  { lat: -32.89, lon: -68.844, x: 328, y: 218 },
  { lat: -33.449, lon: -70.669, x: 238, y: 232 },
  { lat: -27.485, lon: -56.818, x: 566, y: 166 },
] as const;

/** Posiciones fijas por slug (prioridad sobre interpolación). */
export const POSICIONES_LUGAR: Record<string, PosicionMapa> = {
  "buenos-aires": {
    x: 582,
    y: 276,
    etiquetaX: 598,
    etiquetaY: 268,
  },
  cabildo: { x: 576, y: 270, etiqueta: "izq" },
  caseros: {
    x: 548,
    y: 302,
    etiquetaX: 518,
    etiquetaY: 322,
  },
  rosario: {
    x: 498,
    y: 220,
    etiquetaX: 468,
    etiquetaY: 206,
  },
  "san-lorenzo": { x: 538, y: 238, etiqueta: "der" },
  tucuman: {
    x: 452,
    y: 172,
    etiquetaX: 478,
    etiquetaY: 158,
    nombreMapa: "Tucumán",
  },
  cordoba: {
    x: 402,
    y: 252,
    etiquetaX: 368,
    etiquetaY: 268,
  },
  yapeyu: {
    x: 566,
    y: 166,
    etiquetaX: 584,
    etiquetaY: 158,
  },
  mendoza: { x: 328, y: 218, etiqueta: "der" },
  salta: {
    x: 372,
    y: 124,
    etiquetaX: 336,
    etiquetaY: 116,
  },
  "san-salvador-de-jujuy": {
    x: 424,
    y: 96,
    etiquetaX: 448,
    etiquetaY: 82,
    nombreMapa: "Jujuy",
  },
  maipu: { x: 248, y: 238, etiqueta: "der" },
  "puerto-argentino": { x: 612, y: 385, etiquetaX: 548, etiquetaY: 398, nombreMapa: "Malvinas" },
};

function distancia(a: { lat: number; lon: number }, lat: number, lon: number): number {
  const dlat = a.lat - lat;
  const dlon = a.lon - lon;
  return Math.sqrt(dlat * dlat + dlon * dlon);
}

/** Interpolación por distancia inversa desde anclas conocidas. */
export function proyectarIlustrado(lat: number, lon: number): PosicionMapa {
  let wx = 0;
  let wy = 0;
  let wsum = 0;
  for (const a of ANCLAS) {
    const d = Math.max(distancia(a, lat, lon), 0.08);
    const w = 1 / (d * d);
    wx += a.x * w;
    wy += a.y * w;
    wsum += w;
  }
  const x = wx / wsum;
  return {
    x,
    y: wy / wsum,
    etiqueta: x > 500 ? "izq" : "der",
  };
}

export function posicionLugarEnMapa(
  slug: string,
  lat?: number,
  lon?: number,
): PosicionMapa | null {
  const fija = POSICIONES_LUGAR[slug];
  if (fija) return fija;
  if (lat !== undefined && lon !== undefined) return proyectarIlustrado(lat, lon);
  return null;
}

export function nombreEnMapa(slug: string, nombreCompleto: string): string {
  return POSICIONES_LUGAR[slug]?.nombreMapa ?? nombreCompleto;
}

export function etiquetaEnMapa(pos: PosicionMapa): EtiquetaMapa {
  return pos.etiqueta ?? (pos.x > 500 ? "izq" : "der");
}
