import type { ComponentType } from "react";

export type AccesoCronica = "publico" | "mecenas" | "anticipo";

export type CronicaMeta = {
  slug: string;
  titulo: string;
  subtitulo: string;
  kicker: string;
  periodo: string;
  duracion: string;
  descripcion: string;
  publicada: string;
  acceso: AccesoCronica;
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
    acceso: "publico",
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
    acceso: "publico",
    protagonista: { slug: "santiago-de-liniers", etiqueta: "La ficha de Liniers" },
  },
  {
    slug: "las-48-horas-de-mayo",
    titulo: "Las 48 Horas de Mayo",
    subtitulo:
      "Del cabildo abierto a la Primera Junta: cómo una ciudad armada aprovechó la prisión de un rey para tomar el poder.",
    kicker: "Exclusiva Mecenas · Mayo de 1810",
    periodo: "22 — 25 de mayo de 1810",
    duracion: "8 minutos",
    descripcion:
      "Una crónica exclusiva para mecenas sobre las cuarenta y ocho horas que terminaron con el virreinato en Buenos Aires: milicias, cabildo abierto y la continuidad secreta con las Invasiones Inglesas.",
    publicada: "2026-07-07",
    acceso: "mecenas",
    protagonista: { slug: "mariano-moreno", etiqueta: "La ficha de Mariano Moreno" },
  },
];

export const cargadores: Record<string, () => Promise<{ default: ComponentType }>> = {
  "el-cruce-de-los-andes": () => import("@/content/cronicas/el-cruce-de-los-andes.mdx"),
  "la-ciudad-que-vencio-a-un-imperio": () =>
    import("@/content/cronicas/la-ciudad-que-vencio-a-un-imperio.mdx"),
  "las-48-horas-de-mayo": () => import("@/content/cronicas/las-48-horas-de-mayo.mdx"),
};

export function obtenerCronica(slug: string): CronicaMeta | undefined {
  return cronicas.find((c) => c.slug === slug);
}

export function cronicasPublicas(): CronicaMeta[] {
  return cronicas.filter((c) => c.acceso === "publico");
}

export function requiereMecenas(cronica: CronicaMeta): boolean {
  return cronica.acceso === "mecenas" || cronica.acceso === "anticipo";
}
