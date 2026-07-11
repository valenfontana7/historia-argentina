import type { EntidadRef, EntidadTipo, NodoEntidad } from "@/lib/grafo/tipos";
import { descubrir, obtenerNodo } from "@/lib/grafo/queries";
import { PUENTES_EDITORIALES } from "@/lib/grafo/puentes-editoriales";
import { resolverDestinoEditorial } from "@/lib/grafo/validar-puentes";
import { etiquetasTipo } from "@/lib/grafo/rutas";

export type SalidaCurada = {
  nodo: NodoEntidad;
  puente: string;
  tipoDestino: string;
};

function puenteAutomatico(origen: NodoEntidad, destino: NodoEntidad): string {
  const tipo = etiquetasTipo[destino.tipo];
  switch (destino.tipo) {
    case "cronica":
      return `Otra exhibición de la misma época: ${destino.titulo}`;
    case "persona":
      return `Un retrato del Panteón: ${destino.titulo}`;
    case "evento":
      return `Un acontecimiento relacionado: ${destino.titulo}`;
    case "lugar":
      return `Un lugar de la historia: ${destino.titulo}`;
    case "periodo":
      return `La sala de ${destino.titulo}`;
    case "categoria":
      return `Colección temática: ${destino.titulo}`;
    case "pieza":
      return `Pieza de la colección: ${destino.titulo}`;
    default: {
      const _exhaustive: never = destino.tipo;
      return `${tipo}: ${destino.titulo}`;
    }
  }
}

function etiquetaTipoDestino(tipo: EntidadTipo): string {
  switch (tipo) {
    case "cronica":
      return "Exhibición";
    case "persona":
      return "Retrato";
    case "evento":
      return "Acontecimiento";
    case "lugar":
      return "Lugar";
    case "periodo":
      return "Sala";
    case "categoria":
      return "Colección";
    case "pieza":
      return "Pieza";
    default: {
      const _exhaustive: never = tipo;
      return _exhaustive;
    }
  }
}

function resolverPuente(
  origenSlug: string,
  destino: NodoEntidad,
  origen: NodoEntidad,
): string {
  const editoriales = PUENTES_EDITORIALES[origenSlug];
  if (editoriales?.[destino.slug]) return editoriales[destino.slug];
  return puenteAutomatico(origen, destino);
}

function claveNodo(nodo: NodoEntidad | EntidadRef): string {
  return `${nodo.tipo}:${nodo.slug}`;
}

function agregarSalida(
  salidas: SalidaCurada[],
  vistos: Set<string>,
  origen: NodoEntidad,
  destino: NodoEntidad,
  puente: string,
  limite: number,
): void {
  if (salidas.length >= limite) return;
  const key = claveNodo(destino);
  if (vistos.has(key) || key === claveNodo(origen)) return;
  vistos.add(key);
  salidas.push({
    nodo: destino,
    puente,
    tipoDestino: etiquetaTipoDestino(destino.tipo),
  });
}

/** Devuelve 2–3 salidas curadas desde un nodo (regla de las tres puertas). */
export function salidasCuradas(
  origen: NodoEntidad | EntidadRef,
  limite = 3,
): SalidaCurada[] {
  const nodo =
    "relaciones" in origen
      ? origen
      : obtenerNodo(origen.tipo, origen.slug);
  if (!nodo) return [];

  const salidas: SalidaCurada[] = [];
  const vistos = new Set<string>();
  const editoriales = PUENTES_EDITORIALES[nodo.slug];

  if (editoriales) {
    for (const [destSlug, puente] of Object.entries(editoriales)) {
      const destino = resolverDestinoEditorial(destSlug);
      if (!destino) continue;
      agregarSalida(salidas, vistos, nodo, destino, puente, limite);
    }
  }

  if (salidas.length < limite) {
    const candidatos = descubrir(nodo, "relacionados", limite * 3);
    for (const destino of candidatos) {
      agregarSalida(
        salidas,
        vistos,
        nodo,
        destino,
        resolverPuente(nodo.slug, destino, nodo),
        limite,
      );
    }
  }

  return salidas;
}
