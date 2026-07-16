"use client";

import type { AdminJob } from "./video-admin-types";
import {
  formatearFecha,
  pillStatus,
  tituloDeSlug,
  type CronicaOption,
} from "./video-admin-utils";

type Props = {
  jobs: AdminJob[];
  selectedId: string | null;
  cronicas: CronicaOption[];
  abierto: boolean;
  onAbiertoChange: (open: boolean) => void;
  onSelect: (job: AdminJob) => void;
  onRefresh: () => void;
};

export function VideoJobHistory({
  jobs,
  selectedId,
  cronicas,
  abierto,
  onAbiertoChange,
  onSelect,
  onRefresh,
}: Props) {
  return (
    <section className="rounded-sm border border-linea bg-fondo-2 p-5">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onAbiertoChange(!abierto)}
          className="flex min-h-11 flex-1 items-center justify-between gap-2 text-left"
        >
          <h2 className="titulo-display text-xl font-semibold">Historial</h2>
          <span className="text-xs text-tinta-tenue">
            {abierto ? "Ocultar" : `Mostrar (${jobs.length})`}
          </span>
        </button>
        <button
          type="button"
          onClick={onRefresh}
          className="min-h-11 shrink-0 px-2 text-xs font-semibold text-oro-claro hover:underline"
        >
          Actualizar
        </button>
      </div>

      {abierto && (
        <>
          {jobs.length === 0 ? (
            <p className="mt-3 text-sm text-tinta-suave">
              Todavía no hay jobs en disco.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-linea">
              {jobs.map((job) => {
                const active = job.id === selectedId;
                return (
                  <li key={job.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(job)}
                      className={`flex min-h-14 w-full flex-col gap-1 px-2 py-3 text-left transition-colors sm:flex-row sm:items-center sm:justify-between ${
                        active ? "bg-oro/10" : "hover:bg-fondo"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-tinta">
                          {tituloDeSlug(cronicas, job.slug)}
                        </p>
                        <p className="truncate text-xs text-tinta-tenue">
                          {job.id}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span
                          className={`rounded-full px-2 py-0.5 ${pillStatus(job.status)}`}
                        >
                          {job.status}
                        </span>
                        <span
                          className="text-tinta-tenue"
                          suppressHydrationWarning
                        >
                          {formatearFecha(job.updatedAt)}
                        </span>
                        {job.metrics?.outputDurationSec != null && (
                          <span className="text-tinta-tenue">
                            {job.metrics.outputDurationSec.toFixed(0)}s
                          </span>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
