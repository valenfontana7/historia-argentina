import type { EntidadRef, NodoEntidad } from "@/lib/grafo/tipos";
import { obtenerNodo } from "@/lib/grafo/queries";
import { salidasCuradas, type SalidaCurada } from "@/lib/grafo/salidas-curadas";

/** Resuelve salidas curadas para una página de detalle del museo. */
export function obtenerSalidasPagina(
  origen: NodoEntidad | EntidadRef | undefined,
  limite = 3,
): SalidaCurada[] {
  if (!origen) return [];
  const nodo =
    "relaciones" in origen
      ? origen
      : obtenerNodo(origen.tipo, origen.slug);
  if (!nodo) return [];
  return salidasCuradas(nodo, limite);
}
