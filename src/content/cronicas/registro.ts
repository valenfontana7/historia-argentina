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
  },
];

export const cargadores: Record<string, () => Promise<{ default: ComponentType }>> = {
  "el-cruce-de-los-andes": () => import("@/content/cronicas/el-cruce-de-los-andes.mdx"),
};

export function obtenerCronica(slug: string): CronicaMeta | undefined {
  return cronicas.find((c) => c.slug === slug);
}
