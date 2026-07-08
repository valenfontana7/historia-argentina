"use client";

import { useEffect, useState } from "react";
import { alternarFavorito, esFavorito } from "@/lib/engagement/storage";
import type { PaginaReciente } from "@/lib/engagement/storage";

type Props = {
  href: string;
  titulo: string;
  tipo: PaginaReciente["tipo"];
};

export function BotonFavorito({ href, titulo, tipo }: Props) {
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    setActivo(esFavorito(href));
  }, [href]);

  return (
    <button
      type="button"
      onClick={() => {
        const nuevo = alternarFavorito({ href, titulo, tipo });
        setActivo(nuevo);
      }}
      className={`rounded-full border px-5 py-2.5 text-sm transition-colors ${
        activo
          ? "border-oro bg-oro/10 text-oro-claro"
          : "border-linea text-tinta-suave hover:border-oro/50 hover:text-oro-claro"
      }`}
      aria-pressed={activo}
    >
      {activo ? "★ En favoritos" : "☆ Guardar"}
    </button>
  );
}
