"use client";

import { useState } from "react";
import type { AdminJob } from "./video-admin-types";
import {
  formatearBytes,
  pillStatus,
  reelDownloadFilename,
  reelMediaUrl,
  tituloDeSlug,
  type CronicaOption,
} from "./video-admin-utils";

type Props = {
  selected: AdminJob | null;
  cronicas: CronicaOption[];
  activo: boolean;
  videoError: string | null;
  onVideoError: (msg: string | null) => void;
  onRegenerar: (job: AdminJob) => void;
  onCancelar?: (job: AdminJob) => void;
  cancelando?: boolean;
  highlight?: boolean;
};

export function VideoPreviewPane({
  selected,
  cronicas,
  activo,
  videoError,
  onVideoError,
  onRegenerar,
  onCancelar,
  cancelando,
  highlight,
}: Props) {
  const [compartiendo, setCompartiendo] = useState(false);
  const [shareMsg, setShareMsg] = useState<string | null>(null);

  if (!selected) {
    return (
      <div className="rounded-sm border border-linea bg-fondo-2 p-5">
        <h2 className="titulo-display text-xl font-semibold">Preview</h2>
        <p className="mt-3 text-sm text-tinta-suave">
          Seleccioná un job del historial o generá uno nuevo.
        </p>
      </div>
    );
  }

  const playable =
    selected.status === "succeeded" && selected.hasMp4 !== false;
  const previewUrl = reelMediaUrl(selected.id, false);
  const downloadUrl = reelMediaUrl(selected.id, true);
  const filename = reelDownloadFilename(selected.slug, selected.id);

  async function compartir() {
    if (!selected) return;
    const job = selected;
    const title = tituloDeSlug(cronicas, job.slug);
    setShareMsg(null);
    setCompartiendo(true);
    try {
      const res = await fetch(downloadUrl);
      if (!res.ok) throw new Error("No se pudo obtener el MP4");
      const blob = await res.blob();
      const file = new File([blob], filename, { type: "video/mp4" });
      const payload: ShareData = {
        files: [file],
        title: "MuseoArgent reel",
        text: title,
      };
      if (
        typeof navigator.share === "function" &&
        (!navigator.canShare || navigator.canShare(payload))
      ) {
        await navigator.share(payload);
        return;
      }
      window.location.href = downloadUrl;
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setShareMsg(
        "No se pudo compartir. Probá Descargar y guardá el video en Fotos.",
      );
      window.open(downloadUrl, "_blank", "noopener,noreferrer");
    } finally {
      setCompartiendo(false);
    }
  }

  return (
    <div
      className={`rounded-sm border bg-fondo-2 p-5 transition-colors ${
        highlight ? "border-oro/60 ring-1 ring-oro/30" : "border-linea"
      }`}
    >
      <h2 className="titulo-display text-xl font-semibold">Preview</h2>
      <div className="mt-4 flex flex-col gap-5 lg:items-start">
        <div className="mx-auto w-full max-w-[min(100%,280px)] lg:mx-0">
          {playable ? (
            <>
              <video
                key={selected.id}
                className="aspect-9/16 max-h-[55vh] w-full rounded-sm border border-linea bg-fondo object-cover sm:max-h-[60vh]"
                controls
                playsInline
                preload="metadata"
                src={previewUrl}
                onError={() =>
                  onVideoError(
                    "No se pudo cargar el MP4. Probá Actualizar o regenerar.",
                  )
                }
                onLoadedData={() => onVideoError(null)}
              />
              {videoError && (
                <p className="mt-2 text-xs text-carmesi" role="alert">
                  {videoError}
                </p>
              )}
            </>
          ) : (
            <div className="flex aspect-9/16 max-h-[55vh] items-center justify-center rounded-sm border border-linea bg-fondo px-4 text-center text-sm text-tinta-tenue sm:max-h-[60vh]">
              {activo
                ? "Renderizando…"
                : selected.status === "failed"
                  ? "Falló la generación"
                  : selected.status === "cancelled"
                    ? "Generación cancelada"
                    : "Sin MP4 aún"}
            </div>
          )}
          {selected.status === "failed" && selected.error && (
            <p className="mt-2 text-xs text-carmesi" role="alert">
              {selected.error}
            </p>
          )}
        </div>

        <div className="w-full space-y-2 text-sm">
          <p>
            <span className="text-tinta-tenue">Exhibición:</span>{" "}
            {tituloDeSlug(cronicas, selected.slug)}
          </p>
          <p className="break-all">
            <span className="text-tinta-tenue">Job:</span> {selected.id}
          </p>
          <p>
            <span className="text-tinta-tenue">Estado:</span>{" "}
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-xs ${pillStatus(selected.status)}`}
            >
              {selected.status}
            </span>
            {selected.stage ? ` · ${selected.stage}` : ""}
          </p>
          {selected.metrics?.outputDurationSec != null && (
            <p>
              <span className="text-tinta-tenue">Duración:</span>{" "}
              {selected.metrics.outputDurationSec.toFixed(1)}s
            </p>
          )}
          <p>
            <span className="text-tinta-tenue">Peso:</span>{" "}
            {formatearBytes(selected.metrics?.outputBytes)}
          </p>

          {playable && (
            <div className="space-y-3 pt-2">
              <div className="flex flex-col gap-2 sm:flex-row">
                <a
                  href={downloadUrl}
                  className="flex min-h-12 flex-1 items-center justify-center rounded-full border border-oro/50 bg-oro/15 px-4 text-sm font-semibold text-oro-claro"
                >
                  Descargar
                </a>
                <button
                  type="button"
                  onClick={() => void compartir()}
                  disabled={compartiendo}
                  className="flex min-h-12 flex-1 items-center justify-center rounded-full border border-linea px-4 text-sm font-semibold text-tinta disabled:opacity-50"
                >
                  {compartiendo ? "Preparando…" : "Compartir"}
                </button>
              </div>
              <p className="text-xs leading-relaxed text-tinta-tenue">
                En iPhone: Descargar o Compartir → Guardar video / Fotos, y
                después subí a Instagram.
              </p>
              {shareMsg && (
                <p className="text-xs text-carmesi" role="status">
                  {shareMsg}
                </p>
              )}
            </div>
          )}

          {(activo ||
            selected.status === "queued" ||
            selected.status === "running" ||
            selected.status === "awaiting_review") &&
            onCancelar && (
              <button
                type="button"
                onClick={() => onCancelar(selected)}
                disabled={cancelando}
                className="mt-3 min-h-11 w-full rounded-full border border-carmesi/40 px-4 py-2 text-sm font-medium text-carmesi hover:bg-carmesi/10 disabled:opacity-50 sm:w-auto"
              >
                {cancelando ? "Cancelando…" : "Cancelar generación"}
              </button>
            )}

          <button
            type="button"
            onClick={() => onRegenerar(selected)}
            disabled={activo || cancelando}
            className="mt-3 min-h-11 w-full rounded-full border border-linea px-4 py-2 text-sm font-medium text-tinta-suave hover:border-oro/40 hover:text-oro-claro disabled:opacity-50 sm:w-auto"
          >
            Regenerar esta crónica
          </button>
        </div>
      </div>
    </div>
  );
}
