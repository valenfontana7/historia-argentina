"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import {
  ANIO_MAX,
  ANIO_MIN,
  HITOS_TIMELINE,
  previewAnio,
  type PreviewAnio,
} from "@/lib/timeline/indice";

type Props = {
  anioInicial?: number;
};

export function TimelineExplorer({ anioInicial = 1810 }: Props) {
  const [anio, setAnio] = useState(anioInicial);
  const [preview, setPreview] = useState<PreviewAnio>(() => previewAnio(anioInicial));

  const actualizar = useCallback((nuevo: number) => {
    const clamped = Math.min(ANIO_MAX, Math.max(ANIO_MIN, nuevo));
    setAnio(clamped);
    setPreview(previewAnio(clamped));
  }, []);

  const pct = ((anio - ANIO_MIN) / (ANIO_MAX - ANIO_MIN)) * 100;

  return (
    <div className="rounded-sm border border-linea bg-fondo-2 p-6 sm:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <p className="kicker">Explorador temporal</p>
        <p className="titulo-display text-3xl font-semibold text-oro sm:text-4xl">{anio}</p>
      </div>

      {preview.periodo && (
        <p className="mt-2 text-sm text-tinta-suave">
          <Link
            href={`/periodos/${preview.periodo.slug}`}
            className="text-oro-claro hover:text-oro"
          >
            {preview.periodo.nombre}
          </Link>
        </p>
      )}

      <div className="relative mt-8">
        <div className="relative h-2 rounded-full bg-fondo-3">
          <div
            className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-oro bg-oro/20"
            style={{ left: `${pct}%` }}
            aria-hidden
          />
          {HITOS_TIMELINE.map((h) => {
            const hp = ((h.anio - ANIO_MIN) / (ANIO_MAX - ANIO_MIN)) * 100;
            return (
              <button
                key={h.anio}
                type="button"
                title={`${h.anio} — ${h.label}`}
                onClick={() => actualizar(h.anio)}
                className="absolute top-1/2 flex min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                style={{ left: `${hp}%` }}
                aria-label={`Ir a ${h.anio}, ${h.label}`}
              >
                <span className="h-3 w-3 rounded-full bg-oro/40 transition-colors hover:bg-oro" />
              </button>
            );
          })}
        </div>
        <input
          type="range"
          min={ANIO_MIN}
          max={ANIO_MAX}
          value={anio}
          onChange={(e) => actualizar(Number(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") actualizar(anio - 1);
            if (e.key === "ArrowRight") actualizar(anio + 1);
          }}
          className="absolute inset-0 h-8 w-full cursor-pointer opacity-0"
          aria-valuenow={anio}
          aria-valuemin={ANIO_MIN}
          aria-valuemax={ANIO_MAX}
          aria-label="Año en la línea del tiempo"
        />
        <div className="mt-3 flex justify-between text-xs text-tinta-tenue">
          <span>{ANIO_MIN}</span>
          <span>{ANIO_MAX}</span>
        </div>
      </div>

      <div className="mt-4 block sm:hidden">
        <p className="kicker text-[0.65rem]">Hitos clave</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {HITOS_TIMELINE.map((h) => (
            <button
              key={h.anio}
              type="button"
              onClick={() => actualizar(h.anio)}
              className={`min-h-11 rounded-full border px-3 py-2 text-xs transition-colors ${
                anio === h.anio
                  ? "border-oro/50 bg-oro/10 text-oro-claro"
                  : "border-linea text-tinta-suave hover:border-oro/30"
              }`}
            >
              {h.anio}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="kicker text-[0.65rem]">Eventos en {anio}</p>
          {preview.eventos.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {preview.eventos.map((e) => (
                <li key={e.slug}>
                  <Link
                    href={`/hoy/${e.slug}`}
                    className="text-sm text-tinta-suave transition-colors hover:text-oro-claro"
                  >
                    {e.titulo} →
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-tinta-tenue">
              Sin efemérides indexadas para este año.
            </p>
          )}
        </div>
        <div>
          <p className="kicker text-[0.65rem]">Personajes activos</p>
          {preview.personajes.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {preview.personajes.slice(0, 8).map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/panteon/${p.slug}`}
                    className="rounded-full border border-linea px-3 py-1 text-xs text-tinta-suave transition-colors hover:border-oro/50 hover:text-oro-claro"
                  >
                    {p.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-tinta-tenue">Ningún personaje del Panteón en este año.</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={`/timelines/${anio}`}
          className="rounded-full border border-oro/50 px-6 py-3 text-sm text-oro-claro transition-colors hover:bg-oro/10"
        >
          Ver {anio} completo →
        </Link>
        <Link
          href="/timelines/comparar"
          className="rounded-full border border-linea px-6 py-3 text-sm text-tinta-suave transition-colors hover:border-oro/40 hover:text-oro-claro"
        >
          Comparar siglos
        </Link>
      </div>
    </div>
  );
}
