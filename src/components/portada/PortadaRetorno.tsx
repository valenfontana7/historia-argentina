"use client";

import Link from "next/link";
import { EtiquetaCta } from "@/components/ui/FlechaCta";
import { useCallback, useMemo } from "react";
import { useStorageSnapshot } from "@/lib/engagement/client-storage-sync";
import {
  obtenerProgreso,
  obtenerRecientes,
  tieneVisitaOnboarding,
  type PaginaReciente,
} from "@/lib/engagement/storage";

export function PortadaRetorno() {
  const visitado = useStorageSnapshot(tieneVisitaOnboarding, false);
  const leerRecientes = useCallback(
    () => obtenerRecientes().slice(0, 3),
    [],
  );
  const recientes = useStorageSnapshot(leerRecientes, [] as PaginaReciente[]);

  const progresoCronica = useMemo(() => {
    const cronica = recientes.find((p) => p.tipo === "cronica");
    if (!cronica) return null;
    const pct = obtenerProgreso(cronica.href);
    if (pct <= 0 || pct >= 100) return null;
    return { href: cronica.href, titulo: cronica.titulo, porcentaje: pct };
  }, [recientes]);

  if (!visitado || recientes.length === 0) return null;

  return (
    <section className="border-b border-linea-suave bg-fondo">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <p className="kicker">Continuar explorando</p>
        {progresoCronica && (
          <div className="mt-6 rounded-sm border border-linea bg-fondo-2 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-tinta-tenue">
              Exhibición en curso · {progresoCronica.porcentaje}% recorrida
            </p>
            <Link
              href={progresoCronica.href}
              className="group titulo-display mt-2 block text-xl font-medium text-oro-claro hover:text-oro"
            >
              <EtiquetaCta>{progresoCronica.titulo}</EtiquetaCta>
            </Link>
          </div>
        )}
        <ul className="mt-6 flex flex-wrap items-start gap-x-3 gap-y-3.5">
          {recientes.map((r) => (
            <li key={r.href} className="max-w-full">
              <Link
                href={r.href}
                className="inline-flex max-w-full rounded-full border border-linea px-5 py-2.5 text-sm leading-snug text-tinta-suave transition-colors hover:border-oro/50 hover:text-oro-claro"
              >
                {r.titulo}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
