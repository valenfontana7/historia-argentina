import type {
  CronicaMetaLite,
  ExhibitionInput,
} from "./cronica-types";

/** Adaptador híbrido: crónicas → Exhibition canónico (sin HTML/MDX). */
export function cronicaToExhibition(input: ExhibitionInput): {
  id: string;
  slug: string;
  title: string;
  summary: string;
  periodLabel?: string;
  yearStart?: number;
  yearEnd?: number;
  chronology: Array<{ year?: number; label: string; detail?: string }>;
  characters: Array<{ id: string; name: string; role?: string }>;
  places: Array<{ id: string; name: string }>;
  quotes: Array<{ text: string; attribution?: string }>;
  curiosities: string[];
  documents: Array<{ assetId: string; title?: string }>;
  images: Array<{ assetId: string }>;
  source: { type: "cronica"; externalId: string };
} {
  const { cronica, audioguiaSegmentos = [], imageIds = [], places = [] } =
    input;

  const chronology = audioguiaSegmentos.map((s) => ({
    label: s.titulo,
    detail: s.texto,
  }));

  if (!chronology.length && cronica.periodo) {
    chronology.push({ label: cronica.periodo, detail: cronica.descripcion });
  }

  const characters = cronica.protagonista
    ? [
        {
          id: cronica.protagonista.slug,
          name: cronica.protagonista.etiqueta,
          role: "protagonista",
        },
      ]
    : [];

  const images = imageIds.map((assetId) => ({ assetId }));
  if (cronica.visual?.imagenHero && !imageIds.includes(cronica.visual.imagenHero)) {
    images.unshift({ assetId: cronica.visual.imagenHero });
  }

  return {
    id: `cronica:${cronica.slug}`,
    slug: cronica.slug,
    title: cronica.titulo,
    summary: cronica.descripcion,
    periodLabel: cronica.periodo,
    yearStart: cronica.anioInicio,
    yearEnd: cronica.anioFin,
    chronology,
    characters,
    places,
    quotes: [],
    curiosities: [],
    documents: [],
    images,
    source: { type: "cronica", externalId: cronica.slug },
  };
}

export type { CronicaMetaLite, ExhibitionInput };
