"use client";

import { useStorageSnapshot } from "@/lib/engagement/client-storage-sync";
import { alternarFavorito, obtenerFavoritos } from "@/lib/engagement/storage";
import type { PaginaReciente } from "@/lib/engagement/storage";

type Props = {
  href: string;
  titulo: string;
  tipo: PaginaReciente["tipo"];
};

export function BotonFavorito({ href, titulo, tipo }: Props) {
  const favoritos = useStorageSnapshot(obtenerFavoritos, []);
  const activo = favoritos.some((f) => f.href === href);

  return (
    <button
      type="button"
      onClick={() => {
        alternarFavorito({ href, titulo, tipo });
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
