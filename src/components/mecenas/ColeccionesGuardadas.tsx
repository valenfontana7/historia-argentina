"use client";

import Link from "next/link";
import { useStorageSnapshot } from "@/lib/engagement/client-storage-sync";
import { obtenerFavoritos, type Favorito } from "@/lib/engagement/storage";

export function ColeccionesGuardadas() {
  const favoritos = useStorageSnapshot(obtenerFavoritos, [] as Favorito[]);

  if (favoritos.length === 0) {
    return (
      <p className="mt-4 text-sm text-tinta-tenue">
        Guardá personajes y eventos con el botón ☆ mientras explorás. Aparecerán acá
        como tu colección personal.
      </p>
    );
  }

  return (
    <ul className="mt-6 flex flex-wrap gap-2">
      {favoritos.map((f) => (
        <li key={f.href}>
          <Link
            href={f.href}
            className="rounded-full border border-oro/30 px-4 py-2 text-sm text-oro-claro transition-colors hover:bg-oro/10"
          >
            {f.titulo}
          </Link>
        </li>
      ))}
    </ul>
  );
}
