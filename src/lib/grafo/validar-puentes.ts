import type { EntidadTipo } from "@/lib/grafo/tipos";
import { PUENTES_EDITORIALES } from "@/lib/grafo/puentes-editoriales";
import { obtenerNodo } from "@/lib/grafo/queries";

const TIPOS_RESOLUCION: EntidadTipo[] = [
  "cronica",
  "persona",
  "evento",
  "periodo",
  "lugar",
  "categoria",
  "pieza",
];

/** Resuelve un slug editorial probando todos los tipos de nodo del grafo. */
export function resolverDestinoEditorial(slug: string) {
  for (const tipo of TIPOS_RESOLUCION) {
    const nodo = obtenerNodo(tipo, slug);
    if (nodo) return nodo;
  }
  return undefined;
}

export function validarPuentesEditoriales(): { ok: boolean; problemas: string[] } {
  const problemas: string[] = [];

  for (const [origen, destinos] of Object.entries(PUENTES_EDITORIALES)) {
    if (!resolverDestinoEditorial(origen)) {
      problemas.push(`origen "${origen}": no existe en el grafo`);
    }
    for (const destino of Object.keys(destinos)) {
      if (!resolverDestinoEditorial(destino)) {
        problemas.push(`${origen} → "${destino}": destino inexistente`);
      }
    }
  }

  return { ok: problemas.length === 0, problemas };
}
