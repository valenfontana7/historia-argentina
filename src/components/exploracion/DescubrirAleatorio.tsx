"use client";

import { useRouter } from "next/navigation";
import { rutaDeNodo } from "@/lib/grafo/rutas";
import type { NodoEntidad } from "@/lib/grafo/tipos";

type Props = {
  nodos: NodoEntidad[];
  className?: string;
  etiqueta?: string;
};

export function DescubrirAleatorio({
  nodos,
  className = "",
  etiqueta = "Descubrir algo al azar",
}: Props) {
  const router = useRouter();

  function irAleatorio() {
    if (nodos.length === 0) return;
    const nodo = nodos[Math.floor(Math.random() * nodos.length)];
    router.push(rutaDeNodo(nodo));
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
