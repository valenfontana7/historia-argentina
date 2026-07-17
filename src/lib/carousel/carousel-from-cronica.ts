import {
  CarouselSchema,
  type Carousel,
  type Slide,
} from "@museoargent/carousel-contracts";
import type { ImageCatalogEntry } from "@museoargent/video-contracts";
import { cronicas } from "@/content/cronicas/registro";
import { exhibitionFromCronica } from "@/lib/video/exhibition-from-cronica";

const BODY_MAX = 320;
/** Alineado a museum-classic charBudgets + maxLines (cpl 28 × 4 en último step). */
const SUBTITLE_MAX = 110;
const TITLE_MAX = 56;
const CONTENT_MIN_CHARS = 48;
const CONTENT_MAX_SLIDES = 3;
const GALLERY_MIN = 2;
const GALLERY_MAX = 4;

export type CarouselFromCronica = {
  carousel: Carousel;
  slug: string;
};

/** Arma un Carousel determinístico desde una crónica (sin IA). */
export function carouselFromCronica(slug: string): CarouselFromCronica | null {
  const packed = exhibitionFromCronica(slug);
  if (!packed) return null;

  const { exhibition, imageCatalog } = packed;
  const catalogEntries = Object.values(imageCatalog).filter((e) =>
    Boolean(e.url),
  );
  const usedImageIds = new Set<string>();

  const takeImage = (
    prefer?: (e: ImageCatalogEntry) => boolean,
  ): ImageCatalogEntry | undefined => {
    const pool = catalogEntries.filter((e) => !usedImageIds.has(e.id));
    const preferred = prefer ? pool.find(prefer) : undefined;
    const pick = preferred ?? pool[0];
    if (pick) usedImageIds.add(pick.id);
    return pick;
  };

  const focusFor = (tipo?: string): { focusX: number; focusY: number } => {
    if (tipo === "pintura") {
      return { focusX: 0.48, focusY: 0.28 };
    }
    if (tipo === "mapa") return { focusX: 0.5, focusY: 0.45 };
    return { focusX: 0.5, focusY: 0.4 };
  };

  const slides: Slide[] = [];
  let n = 0;
  const nextId = (prefix: string) => `${prefix}-${++n}`;

  const periodYears =
    exhibition.yearStart == null || exhibition.yearEnd == null
      ? ""
      : exhibition.yearStart === exhibition.yearEnd
        ? String(exhibition.yearStart)
        : `${exhibition.yearStart}–${exhibition.yearEnd}`;

  const kickerParts = [exhibition.periodLabel, periodYears].filter(Boolean);
  const kicker = kickerParts.join(" · ");

  const hero =
    takeImage((e) => e.id === exhibition.images[0]?.assetId) ??
    takeImage((e) => e.tipo === "pintura" || e.tipo === "foto") ??
    takeImage();

  // Preferir subtítulo del registro (blurb corto); la descripción suele pasarse del budget.
  const cronica = cronicas.find((c) => c.slug === slug);
  const shortBlurb =
    cronica?.subtitulo?.trim() || exhibition.summary;

  slides.push({
    id: nextId("cover"),
    type: "cover",
    title: softTruncate(exhibition.title, TITLE_MAX) || exhibition.title,
    subtitle: softTruncate(shortBlurb, SUBTITLE_MAX),
    kicker: kicker || undefined,
    ...(hero
      ? {
          image: {
            id: hero.id,
            src: hero.url,
            alt: hero.alt,
            credit: hero.credito,
            ...focusFor(hero.tipo),
          },
          credit: hero.credito,
        }
      : {}),
  });

  const chronology = exhibition.chronology ?? [];
  const contentSources = pickContentSegments(
    chronology,
    exhibition.summary,
    CONTENT_MAX_SLIDES,
  );

  for (const seg of contentSources) {
    const body = softTruncate(seg.detail, BODY_MAX);
    if (!body) continue;
    const imgEntry =
      takeImage((e) => e.tipo === "foto" || e.tipo === "grabado") ??
      takeImage();
    slides.push({
      id: nextId("content"),
      type: "content",
      title: softTruncate(seg.label, 48) || undefined,
      body,
      ...(imgEntry
        ? {
            image: {
              id: imgEntry.id,
              src: imgEntry.url,
              alt: imgEntry.alt,
              credit: imgEntry.credito,
              ...focusFor(imgEntry.tipo),
            },
            caption: imgEntry.credito
              ? softTruncate(imgEntry.credito, 72)
              : undefined,
          }
        : {}),
    });
  }

  const quote = extractQuote(exhibition, chronology);
  if (quote) {
    slides.push({
      id: nextId("quote"),
      type: "quote",
      quote: quote.text,
      attribution: quote.attribution,
    });
  }

  if (
    exhibition.yearStart != null &&
    exhibition.yearEnd != null &&
    periodYears
  ) {
    slides.push({
      id: nextId("stat"),
      type: "statistic",
      value: periodYears,
      label: exhibition.periodLabel || "Periodo",
      context: softTruncate(shortBlurb, 110) || undefined,
    });
  }

  const galleryImages: ImageCatalogEntry[] = [];
  while (galleryImages.length < GALLERY_MAX) {
    const next = takeImage(
      (e) => !galleryImages.some((g) => g.id === e.id),
    );
    if (!next) break;
    galleryImages.push(next);
  }

  if (galleryImages.length >= GALLERY_MIN) {
    const creditOne = galleryImages.find((e) => e.credito)?.credito;
    slides.push({
      id: nextId("gallery"),
      type: "gallery",
      images: galleryImages.map((e) => ({
        id: e.id,
        src: e.url,
        alt: e.alt,
        credit: e.credito,
        ...focusFor(e.tipo),
      })),
      caption: softTruncate(creditOne || "Piezas de la sala", 80),
    });
  }

  slides.push({
    id: nextId("ending"),
    type: "ending_cta",
    title: "Seguí en MuseoArgent",
    body: softTruncate(
      `Leé «${exhibition.title}» · Historia argentina para explorar.`,
      160,
    ),
    cta: "@museoargent",
  });

  const carousel = CarouselSchema.parse({
    id: `cronica:${exhibition.slug}`,
    title: exhibition.title,
    locale: "es-AR",
    slides,
  });

  return { carousel, slug: exhibition.slug };
}

/** Elige hasta N segmentos con sustancia (sin truncar agresivo en la selección). */
export function pickContentSegments(
  chronology: { label: string; detail?: string }[],
  summary: string,
  max: number,
): { label: string; detail: string }[] {
  const scored = chronology
    .map((s) => ({
      label: s.label,
      detail: (s.detail ?? "").replace(/\s+/g, " ").trim(),
    }))
    .filter((s) => s.detail.length >= CONTENT_MIN_CHARS)
    .sort((a, b) => b.detail.length - a.detail.length);

  const picked = scored.slice(0, max);
  // Restaurar orden cronológico original
  picked.sort(
    (a, b) =>
      chronology.findIndex((c) => c.label === a.label) -
      chronology.findIndex((c) => c.label === b.label),
  );

  if (picked.length > 0) return picked;
  if (summary.trim()) {
    return [{ label: "Resumen", detail: summary.trim() }];
  }
  return [];
}

/** Soft truncate: solo si supera presupuesto; el engine recompone tipografía. */
function softTruncate(text: string | undefined, max: number): string {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.5 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

function extractQuote(
  exhibition: {
    quotes?: { text?: string; attribution?: string }[];
    characters?: { name: string }[];
  },
  chronology: { label: string; detail?: string }[],
): { text: string; attribution?: string } | null {
  for (const q of exhibition.quotes ?? []) {
    if (q.text?.trim()) {
      return {
        text: softTruncate(q.text, 180),
        attribution: q.attribution,
      };
    }
  }

  for (const seg of chronology) {
    const detail = seg.detail ?? "";
    const match = detail.match(/[«"]([^»"]{12,180})[»"]/);
    if (match?.[1]) {
      return {
        text: softTruncate(match[1], 180),
        attribution:
          exhibition.characters?.[0]?.name ?? softTruncate(seg.label, 40),
      };
    }
  }

  return null;
}
