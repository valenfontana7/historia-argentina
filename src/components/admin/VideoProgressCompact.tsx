"use client";

import { useState } from "react";
import { PIPELINE_STAGE_ORDER, type AdminJob } from "./video-admin-types";
import { progressPct, stageIndex } from "./video-admin-utils";

type Props = {
  job: AdminJob;
  activo: boolean;
};

export function VideoProgressCompact({ job, activo }: Props) {
  const [detalle, setDetalle] = useState(false);
  const pct = progressPct(job, activo);
  const idx = stageIndex(job.stage);
  const label =
    job.status === "succeeded"
      ? "Listo"
      : job.status === "failed"
        ? "Falló"
        : job.stage ?? "en cola";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 text-sm">
        <p className="font-medium text-tinta">
          {activo ? "Generando" : "Progreso"}
          <span className="ml-2 text-oro-claro">{label}</span>
        </p>
        <span className="tabular-nums text-tinta-tenue">{pct}%</span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-fondo"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-oro/70 transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <button
        type="button"
        onClick={() => setDetalle((v) => !v)}
        className="min-h-11 w-full text-left text-xs font-semibold text-oro-claro hover:underline"
      >
        {detalle ? "Ocultar etapas" : "Ver etapas"}
      </button>

      {detalle && (
        <ol className="grid gap-2 sm:grid-cols-3">
          {PIPELINE_STAGE_ORDER.map((stage, i) => {
            const done =
              job.status === "succeeded" ||
              (idx > i && Boolean(job.metrics?.stageTimingsMs?.[stage]));
            const current =
              activo && job.stage === stage && job.status !== "succeeded";
            const ms = job.metrics?.stageTimingsMs?.[stage];
            return (
              <li
                key={stage}
                className={`rounded-sm border px-3 py-2 text-xs ${
                  current
                    ? "border-oro/50 bg-oro/10 text-oro-claro"
                    : done
                      ? "border-linea bg-fondo text-tinta-suave"
                      : "border-linea-suave text-tinta-tenue"
                }`}
              >
                <span className="font-medium">{stage}</span>
                {typeof ms === "number" && (
                  <span className="mt-1 block text-tinta-tenue">
                    {(ms / 1000).toFixed(1)}s
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      )}

      {job.error && (
        <p className="text-sm text-carmesi" role="alert">
          {job.error}
        </p>
      )}
    </div>
  );
}
