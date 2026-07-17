"use client";

import { useRouter } from "next/navigation";
import { rutaDeNodo } from "@/lib/grafo/rutas";
import type { NodoEntidad } from "@/lib/grafo/tipos";
import { EtiquetaCta } from "@/components/ui/FlechaCta";

type Props = {
  nodos: NodoEntidad[];
  className?: string;
  etiqueta?: string;
  variante?: "boton" | "bloque";
};

/** Acción de sorpresa curada: un tap a un nodo al azar del universo. */
export function Sorpresa({
  nodos,
  className = "",
  etiqueta = "Mostrame otra",
  variante = "boton",
}: Props) {
  const router = useRouter();

  function irAleatorio() {
    if (nodos.length === 0) return;
    const nodo = nodos[Math.floor(Math.random() * nodos.length)];
    router.push(rutaDeNodo(nodo));
  }

  if (variante === "bloque") {
    return (
      <button
        type="button"
        onClick={irAleatorio}
        className={`group relative w-full overflow-hidden rounded-sm border border-oro/30 bg-fondo-2 px-6 py-10 text-left transition-colors hover:border-oro/60 sm:py-14 ${className}`}
      >
        <p className="kicker text-oro">Sorpresa</p>
        <p className="titulo-display mt-3 text-2xl font-medium text-tinta transition-colors group-hover:text-oro-claro sm:text-3xl">
          {etiqueta}
        </p>
        <p className="mt-2 max-w-md text-sm text-tinta-suave">
          Una historia, un personaje o un día al azar. Sin menús. Sin decidir.
        </p>
        <span className="mt-6 inline-block text-[0.65rem] uppercase tracking-[0.2em] text-oro">
          <EtiquetaCta>Descubrir</EtiquetaCta>
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={irAleatorio}
      className={`rounded-full border border-oro/50 px-6 py-3 text-sm text-oro-claro transition-colors hover:bg-oro/10 ${className}`}
    >
      {etiqueta} ✦
    </button>
  );
}
