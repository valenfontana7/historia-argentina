"use client";

import Link from "next/link";
import { useCallback } from "react";
import { useStorageSnapshot } from "@/lib/engagement/client-storage-sync";
import { obtenerRecientes, type PaginaReciente } from "@/lib/engagement/storage";

type Props = {
  excluirHref?: string;
  limite?: number;
};

export function RecientementeVisitado({ excluirHref, limite = 6 }: Props) {
  const leerRecientes = useCallback(
    () =>
      obtenerRecientes()
        .filter((r) => r.href !== excluirHref)
        .slice(0, limite),
    [excluirHref, limite],
  );
  const recientes = useStorageSnapshot(leerRecientes, [] as PaginaReciente[]);

  if (recientes.length === 0) return null;

  return (
    <section className="mt-16">
      <p className="kicker">Recientemente visitado</p>
      <ul className="mt-4 flex flex-wrap gap-3">
        {recientes.map((r) => (
          <li key={r.href}>
            <Link
              href={r.href}
              className="rounded-full border border-linea px-5 py-2.5 text-sm text-tinta-suave transition-colors hover:border-oro/50 hover:text-oro-claro"
            >
              {r.titulo}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
