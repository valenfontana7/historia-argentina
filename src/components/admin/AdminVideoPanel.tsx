"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AdminJob } from "./video-admin-types";
import {
  tituloDeSlug,
  reelMediaUrl,
  type CronicaOption,
} from "./video-admin-utils";
import { VideoCronicaPicker } from "./VideoCronicaPicker";
import {
  defaultVideoGenerateOptions,
  VideoGenerateOptions,
  type VideoGenerateOptionsValue,
} from "./VideoGenerateOptions";
import { VideoGenerateLoading } from "./VideoGenerateLoading";
import { VideoPreviewPane } from "./VideoPreviewPane";
import { VideoJobHistory } from "./VideoJobHistory";

type Props = {
  cronicas: CronicaOption[];
  initialJobs: AdminJob[];
};

const RECOVER_POLL_MS = 1500;
const RECOVER_MAX_MS = 180_000;

export function AdminVideoPanel({ cronicas, initialJobs }: Props) {
  const [slug, setSlug] = useState(cronicas[0]?.slug ?? "");
  const [force, setForce] = useState(true);
  const [options, setOptions] = useState<VideoGenerateOptionsValue>(
    defaultVideoGenerateOptions,
  );
  const [jobs, setJobs] = useState<AdminJob[]>(initialJobs);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialJobs[0]?.id ?? null,
  );
  const [selected, setSelected] = useState<AdminJob | null>(
    initialJobs[0] ?? null,
  );
  const [iniciando, setIniciando] = useState(false);
  const [esperandoJob, setEsperandoJob] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [historialAbierto, setHistorialAbierto] = useState(
    () => !initialJobs.some((j) => j.status === "queued" || j.status === "running"),
  );
  const [previewHighlight, setPreviewHighlight] = useState(false);

  const progressRef = useRef<HTMLDivElement>(null);
  const previewMobileRef = useRef<HTMLDivElement>(null);
  const previewDesktopRef = useRef<HTMLDivElement>(null);
  const prevStatus = useRef<string | undefined>(undefined);

  function scrollToPreview() {
    const desktop =
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1024px)").matches;
    const el = desktop
      ? previewDesktopRef.current
      : previewMobileRef.current;
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const activo =
    selected?.status === "queued" || selected?.status === "running";
  const ocupado = iniciando || esperandoJob || activo;

  const refreshList = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/reels/jobs");
      if (!res.ok) return null;
      const data = (await res.json()) as { jobs?: AdminJob[] };
      if (data.jobs) {
        setJobs(data.jobs);
        return data.jobs;
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  const fetchJob = useCallback(async (id: string) => {
    try {
      const res = await fetch(
        `/api/admin/reels/jobs/${encodeURIComponent(id)}`,
      );
      if (!res.ok) return null;
      return (await res.json()) as AdminJob;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    void (async () => {
      const job = await fetchJob(selectedId);
      if (!cancelled && job) setSelected(job);
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedId, fetchJob]);

  useEffect(() => {
    if (!activo || !selectedId) return;
    const tick = async () => {
      const job = await fetchJob(selectedId);
      if (job) {
        setSelected(job);
        setJobs((prev) => {
          const without = prev.filter((j) => j.id !== job.id);
          return [job, ...without].sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          );
        });
      }
    };
    const id = window.setInterval(() => {
      void tick();
    }, 1500);
    void tick();
    return () => window.clearInterval(id);
  }, [activo, selectedId, fetchJob]);

  useEffect(() => {
    const status = selected?.status;
    if (
      status === "succeeded" &&
      prevStatus.current &&
      prevStatus.current !== "succeeded"
    ) {
      scrollToPreview();
      setPreviewHighlight(true);
      const t = window.setTimeout(() => setPreviewHighlight(false), 1800);
      prevStatus.current = status;
      return () => window.clearTimeout(t);
    }
    prevStatus.current = status;
  }, [selected?.status]);

  async function adoptJob(job: AdminJob) {
    setSelectedId(job.id);
    setSelected(job);
    setJobs((prev) => [job, ...prev.filter((j) => j.id !== job.id)]);
    setMensaje(`Job ${job.id} en cola.`);
    setVideoError(null);
    setEsperandoJob(false);
    setIniciando(false);
    await refreshList();
    requestAnimationFrame(() => {
      progressRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  async function waitForJobBySlug(
    targetSlug: string,
    startedAt: number,
  ): Promise<AdminJob | null> {
    const deadline = Date.now() + RECOVER_MAX_MS;
    const minCreated = startedAt - 5_000;

    while (Date.now() < deadline) {
      const list = await refreshList();
      const match = (list ?? [])
        .filter((j) => j.slug === targetSlug)
        .filter((j) => new Date(j.createdAt).getTime() >= minCreated)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )[0];
      if (match) return match;
      await sleep(RECOVER_POLL_MS);
    }
    return null;
  }

  async function generar() {
    const startedAt = Date.now();
    setMensaje(null);
    setError(null);
    setIniciando(true);
    setEsperandoJob(false);
    setHistorialAbierto(false);
    try {
      const res = await fetch("/api/admin/reels/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          slug,
          force,
          formatId: options.formatId,
          targetDurationSec: options.targetDurationSec,
          narrativePace: options.narrativePace,
          cta: options.cta,
          tone: options.tone,
          ttsVoice: options.ttsVoice,
          ttsInstructions: options.ttsInstructions,
          llmModel: options.llmModel,
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        mensaje?: string;
        jobId?: string;
        pending?: boolean;
        slug?: string;
      };

      if (data.ok && data.jobId) {
        const job = await fetchJob(data.jobId);
        if (job) {
          await adoptJob(job);
        } else {
          await adoptJob({
            id: data.jobId,
            exhibitionId: `cronica:${slug}`,
            formatId: options.formatId,
            status: "queued",
            slug,
            hasMp4: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
        return;
      }

      const shouldRecover =
        data.pending === true ||
        (typeof data.mensaje === "string" &&
          data.mensaje.includes("Timeout esperando enqueue"));

      if (shouldRecover) {
        setIniciando(false);
        setEsperandoJob(true);
        setMensaje("El arranque está tardando; buscando el job…");
        const found = await waitForJobBySlug(slug, startedAt);
        if (found) {
          await adoptJob(found);
          return;
        }
        setError(
          "No apareció el job a tiempo. Recargá la página: puede que el video ya esté listo.",
        );
        setMensaje(null);
        setEsperandoJob(false);
        return;
      }

      setError(data.mensaje ?? "Error al iniciar la generación");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIniciando(false);
    }
  }

  function regenerarDesde(job: AdminJob) {
    setSlug(job.slug);
    setForce(true);
    setSelectedId(job.id);
    setSelected(job);
    setMensaje(`Listo para regenerar «${tituloDeSlug(cronicas, job.slug)}».`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function seleccionarJob(job: AdminJob) {
    setSelectedId(job.id);
    setSelected(job);
    setVideoError(null);
    requestAnimationFrame(() => {
      scrollToPreview();
    });
  }

  const ctaLabel = iniciando || esperandoJob
    ? iniciando
      ? "Iniciando…"
      : "Buscando job…"
    : activo
      ? `Generando…${selected?.stage ? ` · ${selected.stage}` : ""}`
      : "Generar reel 9:16";
  const ctaDisabled = ocupado || !slug;
  const playable =
    selected?.status === "succeeded" && selected.hasMp4 !== false;
  const stickyDownloadUrl =
    playable && selected ? reelMediaUrl(selected.id, true) : null;

  const generateBlock = (
    <section className="rounded-sm border border-linea bg-fondo-2 p-5">
      <h2 className="titulo-display text-xl font-semibold">Generar</h2>
      <p className="mt-2 text-sm text-tinta-suave">
        Reel vertical 1080×1920. Elegí la crónica y generá.
      </p>

      <div className="mt-5">
        <VideoCronicaPicker
          cronicas={cronicas}
          slug={slug}
          onSlugChange={setSlug}
          force={force}
          onForceChange={setForce}
          disabled={ocupado}
        />
      </div>

      <div className="mt-4">
        <VideoGenerateOptions
          value={options}
          onChange={setOptions}
          disabled={ocupado}
        />
      </div>

      <button
        type="button"
        onClick={() => void generar()}
        disabled={ctaDisabled}
        className="mt-5 hidden min-h-11 w-full rounded-full border border-oro/50 bg-oro/10 px-5 py-2.5 text-sm font-semibold text-oro-claro transition-colors hover:bg-oro/20 disabled:opacity-50 lg:inline-flex lg:w-auto lg:items-center lg:justify-center"
      >
        {ctaLabel}
      </button>

      {mensaje && !ocupado && (
        <p className="mt-4 text-sm text-oro-claro" role="status">
          {mensaje}
        </p>
      )}
      {error && (
        <p className="mt-4 text-sm text-carmesi" role="alert">
          {error}
        </p>
      )}

      <div ref={progressRef}>
        <VideoGenerateLoading
          arrancando={iniciando || esperandoJob}
          job={activo || selected?.status === "failed" ? selected : null}
          activo={activo}
          mensaje={mensaje}
        />
      </div>
    </section>
  );

  return (
    <div className="pb-28 lg:pb-0">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] lg:items-start">
        <div className="space-y-6">
          {generateBlock}

          <div ref={previewMobileRef} className="scroll-mt-20 lg:hidden">
            <VideoPreviewPane
              selected={selected}
              cronicas={cronicas}
              activo={activo}
              videoError={videoError}
              onVideoError={setVideoError}
              onRegenerar={regenerarDesde}
              highlight={previewHighlight}
            />
          </div>

          <VideoJobHistory
            jobs={jobs}
            selectedId={selectedId}
            cronicas={cronicas}
            abierto={historialAbierto}
            onAbiertoChange={setHistorialAbierto}
            onSelect={seleccionarJob}
            onRefresh={() => void refreshList()}
          />
        </div>

        <div
          ref={previewDesktopRef}
          className="hidden scroll-mt-6 lg:block lg:sticky lg:top-6"
        >
          <VideoPreviewPane
            selected={selected}
            cronicas={cronicas}
            activo={activo}
            videoError={videoError}
            onVideoError={setVideoError}
            onRegenerar={regenerarDesde}
            highlight={previewHighlight}
          />
        </div>
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-linea bg-fondo-2/95 px-4 pt-3 backdrop-blur-sm lg:hidden"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        {stickyDownloadUrl && !ocupado ? (
          <a
            href={stickyDownloadUrl}
            className="flex min-h-12 w-full items-center justify-center rounded-full border border-oro/50 bg-oro/15 px-5 text-sm font-semibold text-oro-claro"
          >
            Descargar MP4
          </a>
        ) : (
          <button
            type="button"
            onClick={() => void generar()}
            disabled={ctaDisabled}
            className="flex min-h-12 w-full items-center justify-center rounded-full border border-oro/50 bg-oro/15 px-5 text-sm font-semibold text-oro-claro disabled:opacity-50"
          >
            {ctaLabel}
          </button>
        )}
      </div>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
