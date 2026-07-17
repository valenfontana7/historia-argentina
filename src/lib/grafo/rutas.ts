import type { EntidadTipo, NodoEntidad } from "@/lib/grafo/tipos";

const rutas: Record<EntidadTipo, string> = {
  persona: "/panteon",
  evento: "/hoy",
  cronica: "/cronicas",
  lugar: "/lugares",
  periodo: "/periodos",
  categoria: "/categorias",
  pieza: "/piezas",
};

export function rutaEntidad(tipo: EntidadTipo, slug: string): string {
  return `${rutas[tipo]}/${slug}`;
}

export function rutaDeNodo(nodo: NodoEntidad): string {
  return rutaEntidad(nodo.tipo, nodo.slug);
}

export const etiquetasTipo: Record<EntidadTipo, string> = {
  persona: "Personaje",
  evento: "Acontecimiento",
  cronica: "Historia",
  lugar: "Lugar",
  periodo: "Época",
  categoria: "Tema",
  pieza: "Objeto",
};
