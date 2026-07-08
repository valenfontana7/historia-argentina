"use client";

import Link from "next/link";
import { useState } from "react";
import { TarjetaEntidad } from "@/components/exploracion/TarjetaEntidad";
import type { PasoRecorrido } from "@/data/recorridos";
import type { NodoEntidad } from "@/lib/grafo/tipos";

type PasoResuelto = {
  paso: PasoRecorrido;
  nodo: NodoEntidad;
};

type Props = {
  pasos: PasoResuelto[];
};

export function RecorridoPasos({ pasos }: Props) {
  const [actual, setActual] = useState(0);
  const total = pasos.length;
  const progreso = total > 0 ? ((actual + 1) / total) * 100 : 0;
  const { paso, nodo } = pasos[actual];

  return (
    <div>
      <div className="mb-10">
        <div className="flex justify-between text-xs uppercase tracking-[0.2em] text-tinta-tenue">
          <span>
            Paso {actual + 1} de {total}
          </span>
          <span>{Math.round(progreso)}%</span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-linea">
          <div
            className="h-full bg-oro transition-all duration-300"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-oro">Paso {actual + 1}</p>
        {paso.puente && (
          <p className="mt-2 text-sm italic text-tinta-tenue">{paso.puente}</p>
        )}
        <div className="mt-4">
          <TarjetaEntidad nodo={nodo} />
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        {actual > 0 ? (
          <button
            type="button"
            onClick={() => setActual((i) => i - 1)}
            className="text-sm text-tinta-suave transition-colors hover:text-oro-claro"
          >
            ← Paso anterior
          </button>
        ) : (
          <span />
        )}
        {actual < total - 1 ? (
          <button
            type="button"
            onClick={() => setActual((i) => i + 1)}
            className="rounded-full border border-oro/50 px-6 py-3 text-sm font-medium text-oro-claro transition-colors hover:bg-oro/10"
          >
            Siguiente paso →
          </button>
        ) : (
          <Link
            href="/recorridos"
            className="text-sm text-oro-claro transition-colors hover:text-oro"
          >
            Completaste el recorrido ✓
          </Link>
        )}
      </div>
    </div>
  );
}
