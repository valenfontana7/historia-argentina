import {
  imagenesCronicas,
  type ImagenCronica,
  type TipoImagenCronica,
} from "@/data/cronicas-imagenes";
import { cronicas } from "@/content/cronicas/registro";
import { exhibicionesPorPiezaMdx } from "@/lib/piezas/exhibiciones-por-pieza-mdx";

export type Pieza = ImagenCronica & {
  /** Slugs de exhibiciones que muestran esta pieza. */
  exhibiciones: string[];
};

const indiceExhibiciones: Map<string, string[]> = (() => {
  const mapa = new Map<string, Set<string>>();

  function agregar(id: string, slug: string) {
    const set = mapa.get(id) ?? new Set<string>();
    set.add(slug);
    mapa.set(id, set);
  }

  for (const cronica of cronicas) {
    const id = cronica.visual.imagenHero;
    if (id) agregar(id, cronica.slug);
  }

  for (const [id, slugs] of Object.entries(exhibicionesPorPiezaMdx)) {
    for (const slug of slugs) agregar(id, slug);
  }

  return new Map(
    [...mapa.entries()].map(([id, set]) => [id, [...set].sort()]),
  );
})();

function enriquecerPieza(imagen: ImagenCronica): Pieza {
  return {
    ...imagen,
    exhibiciones: indiceExhibiciones.get(imagen.id) ?? [],
  };
}

export function todasLasPiezas(): Pieza[] {
  return Object.values(imagenesCronicas).map(enriquecerPieza);
}

export function obtenerPieza(id: string): Pieza | undefined {
  const imagen = imagenesCronicas[id];
  return imagen ? enriquecerPieza(imagen) : undefined;
}

export function piezasPorTipo(tipo: TipoImagenCronica): Pieza[] {
  return todasLasPiezas().filter((p) => p.tipo === tipo);
}

export function piezasDeExhibicion(slug: string): Pieza[] {
  return todasLasPiezas().filter((p) => p.exhibiciones.includes(slug));
}

export function piezasDestacadas(limite = 12): Pieza[] {
  return todasLasPiezas()
    .filter((p) => p.exhibiciones.length > 0)
    .slice(0, limite);
}

export const ETIQUETAS_TIPO_PIEZA: Record<TipoImagenCronica, string> = {
  grabado: "Grabado",
  pintura: "Pintura",
  mapa: "Mapa histórico",
  foto: "Fotografía",
};
