import {
  ExhibitionSchema,
  type Exhibition,
  type ImageCatalogEntry,
} from "@museoargent/video-contracts";
import { cronicas } from "@/content/cronicas/registro";
import { imagenesCronicas } from "@/data/cronicas-imagenes";
import { obtenerAudioguiaSala } from "@/data/audioguias-salas";
import { piezasDeExhibicion } from "@/lib/piezas/indice";

export type ExhibitionFromCronica = {
  exhibition: Exhibition;
  imageCatalog: Record<string, ImageCatalogEntry>;
  slug: string;
};

/** Mínimo de assets distintos con URL antes de ampliar el pool (fallback). */
const MIN_REEL_ASSETS = 3;
/** Tope del pool tras fallback (sala + ampliación). */
const MAX_REEL_ASSETS = 12;

type CronicaEntry = (typeof cronicas)[number];

/** Arma Exhibition + catálogo de imágenes para el video-engine. */
export function exhibitionFromCronica(
  slug: string,
): ExhibitionFromCronica | null {
  const cronica = cronicas.find((c) => c.slug === slug);
  if (!cronica) return null;

  const guia = obtenerAudioguiaSala(slug);
  const piezas = piezasDeExhibicion(slug);
  let imageIds = piezas.map((p) => p.id);
  const heroId = cronica.visual.imagenHero;
  if (heroId) {
    imageIds = [heroId, ...imageIds.filter((id) => id !== heroId)];
  }

  const expandedIds = expandReelAssetPool(cronica, imageIds);

  const chronology = (guia?.segmentos ?? []).map((s) => ({
    label: s.titulo,
    detail: s.texto,
  }));

  const quotes = extractQuotesFromSegments(
    chronology,
    cronica.protagonista?.etiqueta,
  );

  const exhibition = ExhibitionSchema.parse({
    id: `cronica:${cronica.slug}`,
    slug: cronica.slug,
    title: cronica.titulo,
    summary: cronica.descripcion,
    periodLabel: cronica.periodo,
    yearStart: cronica.anioInicio,
    yearEnd: cronica.anioFin,
    chronology,
    characters: cronica.protagonista
      ? [
          {
            id: cronica.protagonista.slug,
            name: cronica.protagonista.etiqueta,
            role: "protagonista",
          },
        ]
      : [],
    places: [],
    quotes,
    curiosities: [],
    documents: [],
    images: expandedIds.map((assetId) => ({ assetId })),
    source: { type: "cronica", externalId: cronica.slug },
  });

  const imageCatalog: Record<string, ImageCatalogEntry> = {};
  for (const id of expandedIds) {
    const entry = catalogEntryFor(id);
    if (entry) imageCatalog[id] = entry;
  }

  return { exhibition, imageCatalog, slug: cronica.slug };
}

/**
 * Fallback de pool para reels: no reescribe el índice de sala.
 * Solo completa si hay menos de MIN_REEL_ASSETS con URL válida.
 */
export function expandReelAssetPool(
  cronica: CronicaEntry,
  salaIds: string[],
): string[] {
  const selected: string[] = [];
  const seen = new Set<string>();

  function tryAdd(id: string): boolean {
    if (seen.has(id) || selected.length >= MAX_REEL_ASSETS) return false;
    if (!isEligibleAsset(id, cronica.anioFin)) return false;
    seen.add(id);
    selected.push(id);
    return true;
  }

  for (const id of salaIds) tryAdd(id);

  if (countValidInCatalog(selected) >= MIN_REEL_ASSETS) {
    return selected;
  }

  const preferTipos = missingTipos(selected);

  const fromProtagonista = collectCandidateIds(
    cronicas.filter(
      (c) =>
        c.slug !== cronica.slug &&
        Boolean(cronica.protagonista?.slug) &&
        c.protagonista?.slug === cronica.protagonista?.slug,
    ),
  );
  addPreferringTipos(fromProtagonista, preferTipos, tryAdd, selected);

  if (countValidInCatalog(selected) >= MIN_REEL_ASSETS) {
    return selected;
  }

  const fromPeriodo = collectCandidateIds(
    cronicas.filter(
      (c) =>
        c.slug !== cronica.slug &&
        c.periodo === cronica.periodo &&
        yearsOverlap(
          c.anioInicio,
          c.anioFin,
          cronica.anioInicio,
          cronica.anioFin,
          5,
        ),
    ),
  );
  addPreferringTipos(fromPeriodo, preferTipos, tryAdd, selected);

  return selected;
}

function collectCandidateIds(salas: CronicaEntry[]): string[] {
  const ids: string[] = [];
  for (const c of salas) {
    if (c.visual.imagenHero) ids.push(c.visual.imagenHero);
    for (const p of piezasDeExhibicion(c.slug)) ids.push(p.id);
  }
  return ids;
}

function addPreferringTipos(
  candidates: string[],
  preferTipos: Set<string>,
  tryAdd: (id: string) => boolean,
  selected: string[],
): void {
  const preferred = candidates.filter((id) => {
    const tipo = imagenesCronicas[id]?.tipo;
    return tipo && preferTipos.has(tipo);
  });
  const rest = candidates.filter((id) => !preferred.includes(id));
  for (const id of [...preferred, ...rest]) {
    if (countValidInCatalog(selected) >= MIN_REEL_ASSETS) break;
    if (tryAdd(id) && imagenesCronicas[id]?.tipo) {
      preferTipos.delete(imagenesCronicas[id]!.tipo);
    }
  }
}

function missingTipos(selected: string[]): Set<string> {
  const have = new Set(
    selected
      .map((id) => imagenesCronicas[id]?.tipo)
      .filter((t): t is NonNullable<typeof t> => Boolean(t)),
  );
  const want = ["mapa", "foto", "pintura", "grabado"] as const;
  return new Set(want.filter((t) => !have.has(t)));
}

function yearsOverlap(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
  pad: number,
): boolean {
  return aStart - pad <= bEnd + pad && bStart - pad <= aEnd + pad;
}

function isEligibleAsset(id: string, anioFin: number): boolean {
  const meta = imagenesCronicas[id];
  if (!meta?.url) return false;
  if (anioFin < 1900 && meta.origenVisual === "contemporanea") return false;
  return true;
}

function countValidInCatalog(ids: string[]): number {
  return ids.filter((id) => Boolean(imagenesCronicas[id]?.url)).length;
}

function catalogEntryFor(id: string): ImageCatalogEntry | null {
  const meta = imagenesCronicas[id];
  if (!meta?.url) return null;
  return {
    id: meta.id,
    url: meta.url,
    credito: meta.credito,
    alt: meta.alt,
    tipo: meta.tipo,
    ...(meta.origenVisual ? { origenVisual: meta.origenVisual } : {}),
  };
}

/** Extrae citas tipográficas «…» de segmentos de audioguía. */
export function extractQuotesFromSegments(
  segments: { label: string; detail?: string }[],
  attributionFallback?: string,
): { text: string; attribution?: string }[] {
  const out: { text: string; attribution?: string }[] = [];
  for (const seg of segments) {
    const detail = seg.detail ?? "";
    const match = detail.match(/[«"]([^»"]{12,180})[»"]/);
    if (!match?.[1]) continue;
    out.push({
      text: match[1].trim(),
      attribution: attributionFallback ?? seg.label,
    });
    if (out.length >= 2) break;
  }
  // Si no hay comillas, usar el último segmento corto como “voz de sala”
  if (out.length === 0 && segments.length > 0) {
    const cierre =
      segments.find((s) => /legado|cierre|epílogo|hoy/i.test(s.label)) ??
      segments[segments.length - 1];
    const text = (cierre?.detail ?? "").replace(/\s+/g, " ").trim();
    if (text.length >= 40 && text.length <= 180) {
      out.push({
        text,
        attribution: attributionFallback ?? cierre?.label,
      });
    }
  }
  return out;
}
