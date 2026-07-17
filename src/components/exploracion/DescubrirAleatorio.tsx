"use client";

import { Sorpresa } from "@/components/exploracion/Sorpresa";
import type { NodoEntidad } from "@/lib/grafo/tipos";

type Props = {
  nodos: NodoEntidad[];
  className?: string;
  etiqueta?: string;
};

/** @deprecated Preferir Sorpresa */
export function DescubrirAleatorio({
  nodos,
  className = "",
  etiqueta = "Mostrame otra",
}: Props) {
  return (
    <Sorpresa nodos={nodos} className={className} etiqueta={etiqueta} />
  );
}
