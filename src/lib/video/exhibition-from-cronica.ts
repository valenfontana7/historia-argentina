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

/** Arma Exhibition + catálogo de imágenes para el video-engine. */
export function exhibitionFromCronica(
  slug: string,
): ExhibitionFromCronica | null {
  const cronica = cronicas.find((c) => c.slug === slug);
  if (!cronica) return null;

  const guia = obtenerAudioguiaSala(slug);
  const piezas = piezasDeExhibicion(slug);
  const imageIds = piezas.map((p) => p.id);
  if (
    cronica.visual.imagenHero &&
    !imageIds.includes(cronica.visual.imagenHero)
  ) {
    imageIds.unshift(cronica.visual.imagenHero);
  }

  const exhibition = ExhibitionSchema.parse({
    id: `cronica:${cronica.slug}`,
    slug: cronica.slug,
    title: cronica.titulo,
    summary: cronica.descripcion,
    periodLabel: cronica.periodo,
    yearStart: cronica.anioInicio,
    yearEnd: cronica.anioFin,
    chronology: (guia?.segmentos ?? []).map((s) => ({
      label: s.titulo,
      detail: s.texto,
    })),
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
    quotes: [],
    curiosities: [],
    documents: [],
    images: imageIds.map((assetId) => ({ assetId })),
    source: { type: "cronica", externalId: cronica.slug },
  });

  const imageCatalog: Record<string, ImageCatalogEntry> = {};
  for (const id of imageIds) {
    const meta = imagenesCronicas[id];
    if (!meta?.url) continue;
    imageCatalog[id] = {
      id: meta.id,
      url: meta.url,
      credito: meta.credito,
      alt: meta.alt,
      tipo: meta.tipo,
    };
  }

  return { exhibition, imageCatalog, slug: cronica.slug };
}
