"use client";

import Link from "next/link";
import { useStorageSnapshot } from "@/lib/engagement/client-storage-sync";
import {
  obtenerProgreso,
  obtenerRecientes,
} from "@/lib/engagement/storage";

/**
 * Fila compacta de retorno: continuar lectura + recientes.
 * Solo se muestra si hay señal local.
 */
export function SeguirRetomar() {
  const recientes = useStorageSnapshot(obtenerRecientes, []);
  const enCurso = recientes.find((r) => r.tipo === "cronica");
  const progreso = useStorageSnapshot(
    () => (enCurso ? obtenerProgreso(enCurso.href) : 0),
    0,
  );

  if (recientes.length === 0) return null;

  const otros = recientes.filter((r) => r.href !== enCurso?.href).slice(0, 2);

  return (
    <section className="border-y border-linea-suave bg-fondo-2" aria-label="Continuar">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:py-10">
        <p className="kicker">Tu exploración</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch">
          {enCurso && (
            <Link
              href={enCurso.href}
              prefetch
              className="group flex flex-1 flex-col justify-center rounded-sm border border-oro/35 bg-fondo px-5 py-4 transition-colors hover:border-oro/60"
            >
              <p className="text-[0.6rem] uppercase tracking-[0.2em] text-oro">
                Continuar
                {progreso > 0 && progreso < 100 ? ` · ${progreso}%` : ""}
              </p>
              <p className="titulo-display mt-1 text-lg font-medium transition-colors group-hover:text-oro-claro">
                {enCurso.titulo}
              </p>
            </Link>
          )}
          {otros.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="flex min-w-[140px] flex-col justify-center rounded-sm border border-linea px-4 py-3 transition-colors hover:border-oro/40 sm:max-w-[200px]"
            >
              <p className="line-clamp-2 text-sm text-tinta-suave transition-colors hover:text-oro-claro">
                {r.titulo}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
