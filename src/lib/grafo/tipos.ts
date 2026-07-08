import type { Epoca } from "@/components/ui/Retrato";

export type EntidadTipo =
  | "persona"
  | "evento"
  | "lugar"
  | "periodo"
  | "cronica"
  | "categoria";

export type EntidadRef = {
  tipo: EntidadTipo;
  slug: string;
};

export type NodoEntidad = {
  tipo: EntidadTipo;
  slug: string;
  titulo: string;
  resumen: string;
  url: string;
  imagen?: string;
  anio?: number;
  anioFin?: number;
  periodo?: Epoca;
  categorias?: string[];
  relaciones: EntidadRef[];
};

export type FiltroRelacion = {
  tipo?: EntidadTipo;
  limite?: number;
  excluir?: EntidadRef[];
};

export type EstrategiaDescubrir =
  | "sorpresa"
  | "misma-epoca"
  | "misma-categoria"
  | "mismo-anio"
  | "anios-cercanos";

export function refKey(ref: EntidadRef): string {
  return `${ref.tipo}:${ref.slug}`;
}

export function nodoRef(nodo: NodoEntidad): EntidadRef {
  return { tipo: nodo.tipo, slug: nodo.slug };
}
