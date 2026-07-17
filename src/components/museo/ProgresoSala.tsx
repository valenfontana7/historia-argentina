"use client";

import Link from "next/link";
import { EtiquetaCta } from "@/components/ui/FlechaCta";
import { useStorageSnapshot } from "@/lib/engagement/client-storage-sync";
import { obtenerProgresoSalas } from "@/lib/engagement/visita";
import type { Epoca } from "@/components/ui/Retrato";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  epoca: Epoca;
};

export function ProgresoSala({ epoca }: Props) {
  const salas = useStorageSnapshot(obtenerProgresoSalas, []);
  const sala = salas.find((s) => s.epoca === epoca);

  if (!sala || sala.total === 0) return null;

  const porcentaje =
    sala.total > 0 ? Math.round((sala.vistas / sala.total) * 100) : 0;
  const completa = sala.vistas >= sala.total;

  return (
    <Reveal className="mt-10">
      <div className="rounded-sm border border-linea bg-fondo-2 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.2em] text-oro">
              Tu progreso en esta sala
            </p>
            <p className="mt-1 text-sm text-tinta-suave">
              {sala.vistas} de {sala.total} exhibiciones vistas
              {completa ? " · Sala completada" : ""}
            </p>
          </div>
          {!completa && (
            <Link
              href="/cronicas"
              className="group shrink-0 text-sm text-oro-claro transition-colors hover:text-oro"
            >
              <EtiquetaCta>Completar sala</EtiquetaCta>
            </Link>
          )}
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-linea">
          <div
            className="h-full bg-oro transition-all duration-500"
            style={{ width: `${porcentaje}%` }}
          />
        </div>
      </div>
    </Reveal>
  );
}
