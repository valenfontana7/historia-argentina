"use client";

import Link from "next/link";
import { SIGLOS_COMPARAR, statsSiglo } from "@/lib/timeline/indice";

export function ComparadorSiglos() {
  const stats = SIGLOS_COMPARAR.map((s) => statsSiglo(s));

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((s) => (
        <div
          key={s.siglo}
          className="rounded-sm border border-linea bg-fondo-2 p-6 transition-colors hover:border-oro/30"
        >
          <p className="kicker text-oro">{s.label}</p>
          <p className="titulo-display mt-2 text-3xl font-semibold">
            {s.siglo}s
          </p>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between border-b border-linea-suave pb-2">
              <dt className="text-tinta-tenue">Efemérides</dt>
              <dd className="text-tinta">{s.eventos}</dd>
            </div>
            <div className="flex justify-between border-b border-linea-suave pb-2">
              <dt className="text-tinta-tenue">Años con eventos</dt>
              <dd className="text-tinta">{s.aniosConEventos}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-tinta-tenue">Presencias de personajes</dt>
              <dd className="text-tinta">{s.personajes}</dd>
            </div>
          </dl>
          <Link
            href={`/timelines/${s.siglo + 50}`}
            className="mt-6 inline-block text-xs uppercase tracking-wider text-oro-claro hover:text-oro"
          >
            Explorar {s.siglo + 50} →
          </Link>
        </div>
      ))}
    </div>
  );
}
