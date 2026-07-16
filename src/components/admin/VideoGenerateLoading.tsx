"use client";

import type { AdminJob } from "./video-admin-types";
import { VideoProgressCompact } from "./VideoProgressCompact";

type Props = {
  /** Arranque / buscando job en disco. */
  arrancando: boolean;
  /** Job ya conocido y en cola/running. */
  job: AdminJob | null;
  activo: boolean;
  mensaje?: string | null;
  onCancelar?: () => void;
  cancelando?: boolean;
};

export function VideoGenerateLoading({
  arrancando,
  job,
  activo,
  mensaje,
  onCancelar,
  cancelando,
}: Props) {
  if (!arrancando && !(job && activo)) return null;

  const fase =
    arrancando && !job
      ? mensaje?.trim() || "Arrancando motor…"
      : job?.stage
        ? `Generando · ${job.stage}`
        : "En cola…";

  return (
    <div
      className="mt-6 scroll-mt-24 space-y-4 rounded-sm border border-oro/30 bg-oro/5 p-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center gap-3">
        <span
          className="inline-block size-5 shrink-0 animate-spin rounded-full border-2 border-oro/25 border-t-oro"
          aria-hidden
        />
        <p className="text-sm font-medium text-oro-claro">{fase}</p>
      </div>

      {arrancando && !job && (
        <div className="h-1.5 overflow-hidden rounded-full bg-fondo">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-oro/60" />
        </div>
      )}

      {job?.stage === "render" && activo && (
        <p className="text-xs text-tinta-tenue">
          Render en curso. En PC de escritorio (craft completo) suele tardar
          unos minutos; en VPS 1 GB usá el perfil rápido.
        </p>
      )}

      {job && (activo || job.stage || job.status === "failed") && (
        <VideoProgressCompact job={job} activo={activo} />
      )}

      {activo && onCancelar && (
        <button
          type="button"
          onClick={onCancelar}
          disabled={cancelando}
          className="min-h-11 w-full rounded-full border border-carmesi/40 px-4 py-2 text-sm font-medium text-carmesi hover:bg-carmesi/10 disabled:opacity-50 sm:w-auto"
        >
          {cancelando ? "Cancelando…" : "Cancelar"}
        </button>
      )}
    </div>
  );
}
