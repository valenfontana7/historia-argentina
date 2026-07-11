import type { NodoEntidad } from "@/lib/grafo/tipos";

/** Título contextual para la sección de exploración según el nodo de origen. */
export function tituloExploracionDesde(origen: NodoEntidad): string {
  switch (origen.tipo) {
    case "evento":
      return `Después de «${origen.titulo}», seguí por…`;
    case "persona":
      return `En la órbita de ${origen.titulo}…`;
    case "cronica":
      return "Para profundizar esta historia…";
    case "lugar":
      return `Quién pasó por ${origen.titulo}…`;
    case "periodo":
      return "Más de esta época…";
    case "categoria":
      return "Más en este tema…";
    case "pieza":
      return "Desde esta pieza del patrimonio…";
    default: {
      const _exhaustive: never = origen.tipo;
      return _exhaustive;
    }
  }
}
