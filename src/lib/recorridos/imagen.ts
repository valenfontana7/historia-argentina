import type { Recorrido } from "@/data/recorridos";
import { obtenerCronica } from "@/content/cronicas/registro";
import { obtenerImagenCronica } from "@/data/cronicas-imagenes";
import { obtenerImagenPersonaje } from "@/data/personajes-imagenes";
import { resolverNodo } from "@/lib/grafo/queries";

/**
 * Foto representativa de un recorrido: prioriza crónicas, luego personajes,
 * luego cualquier paso con imagen en el grafo.
 */
export function imagenDeRecorrido(recorrido: Recorrido): string | undefined {
  for (const paso of recorrido.pasos) {
    if (paso.tipo !== "cronica") continue;
    const cronica = obtenerCronica(paso.slug);
    if (cronica?.visual.imagenHero) {
      const img = obtenerImagenCronica(cronica.visual.imagenHero);
      if (img) return img.url;
    }
    const nodo = resolverNodo(paso);
    if (nodo?.imagen) return nodo.imagen;
  }

  for (const paso of recorrido.pasos) {
    if (paso.tipo !== "persona") continue;
    const retrato = obtenerImagenPersonaje(paso.slug);
    if (retrato) return retrato.url;
  }

  for (const paso of recorrido.pasos) {
    const nodo = resolverNodo(paso);
    if (nodo?.imagen) return nodo.imagen;
  }

  return obtenerImagenCronica("mayo-cabildo")?.url;
}
