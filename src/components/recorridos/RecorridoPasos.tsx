"use client";

import Link from "next/link";
import { useState } from "react";
import type { PasoRecorrido } from "@/data/recorridos";
import { etiquetasTipo, rutaDeNodo } from "@/lib/grafo/rutas";
import type { NodoEntidad } from "@/lib/grafo/tipos";

type PasoResuelto = {
  paso: PasoRecorrido;
  nodo: NodoEntidad;
};

type Props = {
  pasos: PasoResuelto[];
};

function VistaPasoRecorrido({ nodo }: { nodo: NodoEntidad }) {
  return (
    <div className="rounded-sm border border-linea bg-fondo-2 p-5">
      <p className="kicker text-[0.65rem]">{etiquetasTipo[nodo.tipo]}</p>
      <h3 className="titulo-display mt-2 text-lg font-medium leading-snug text-tinta">
        {nodo.titulo}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-tinta-tenue">
        {nodo.resumen}
      </p>
      {nodo.anio && <p className="mt-3 text-xs text-oro">{nodo.anio}</p>}
    </div>
  );
}

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
          <VistaPasoRecorrido nodo={nodo} />
        </div>
        <Link
          href={rutaDeNodo(nodo)}
          className="mt-4 inline-block text-sm text-tinta-suave underline-offset-4 transition-colors hover:text-oro-claro hover:underline"
        >
          Abrir ficha completa →
        </Link>
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
            className="rounded-full bg-oro px-6 py-3 text-sm font-semibold text-fondo transition-colors hover:bg-oro-claro"
          >
            Siguiente paso →
          </button>
        ) : (
          <Link
            href="/recorridos"
            className="rounded-full border border-oro/50 px-6 py-3 text-sm font-medium text-oro-claro transition-colors hover:bg-oro/10"
          >
            Completaste el recorrido ✓
          </Link>
        )}
      </div>
    </div>
  );
}
