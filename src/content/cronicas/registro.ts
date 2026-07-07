import type { ComponentType } from "react";

export type CronicaMeta = {
  slug: string;
  titulo: string;
  subtitulo: string;
  kicker: string;
  periodo: string;
  duracion: string;
  descripcion: string;
  publicada: string;
  /** Ficha del Panteón sugerida al final de la crónica */
  protagonista: { slug: string; etiqueta: string };
};

export const cronicas: CronicaMeta[] = [
  {
    slug: "el-cruce-de-los-andes",
    titulo: "El Cruce de los Andes",
    subtitulo:
      "Cinco mil hombres, una cordillera de más de cuatro mil metros y un plan que nadie creyó posible. La historia de la operación militar más audaz de América.",
    kicker: "Crónica N.º 1 · La Independencia",
    periodo: "Enero — Febrero de 1817",
    duracion: "8 minutos",
    descripcion:
      "La historia completa del cruce de los Andes: el plan continental de San Martín, la guerra de zapa, las seis rutas del Ejército de los Andes y la victoria de Chacabuco, contada como una experiencia visual interactiva.",
    publicada: "2026-07-07",
    protagonista: { slug: "jose-de-san-martin", etiqueta: "La ficha de San Martín" },
  },
  {
    slug: "la-ciudad-que-vencio-a-un-imperio",
    titulo: "La Ciudad que Venció a un Imperio",
    subtitulo:
      "Dos veces desembarcó el ejército más poderoso del mundo en Buenos Aires. Dos veces lo expulsó una ciudad sin murallas, peleando desde las azoteas.",
    kicker: "Crónica N.º 2 · Las Invasiones Inglesas",
    periodo: "Junio de 1806 — Julio de 1807",
    duracion: "8 minutos",
    descripcion:
      "La historia completa de las Invasiones Inglesas: la caída de Buenos Aires en 48 horas, la Reconquista de Liniers, el nacimiento de las milicias criollas y la guerra de las azoteas que humilló a Whitelocke, contada como una experiencia visual interactiva.",
    publicada: "2026-07-07",
    protagonista: { slug: "santiago-de-liniers", etiqueta: "La ficha de Liniers" },
  },
];

export const cargadores: Record<string, () => Promise<{ default: ComponentType }>> = {
  "el-cruce-de-los-andes": () => import("@/content/cronicas/el-cruce-de-los-andes.mdx"),
  "la-ciudad-que-vencio-a-un-imperio": () =>
    import("@/content/cronicas/la-ciudad-que-vencio-a-un-imperio.mdx"),
};

export function obtenerCronica(slug: string): CronicaMeta | undefined {
  return cronicas.find((c) => c.slug === slug);
}
