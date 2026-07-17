"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { VideoCronicaPicker } from "./VideoCronicaPicker";
import type { CronicaOption } from "./video-admin-utils";

type JobView = {
  id: string;
  status: string;
  title?: string;
  slideCount: number;
  slideOrder: string[];
  renderedSlideIds: string[];
  dirtySlideIds: string[];
  updatedAt: string;
  meta: {
    templateId: string;
    templateVersion: number;
    themeId: string;
    profileId: string;
  };
  error?: string;
};

type CarouselDoc = {
  id: string;
  title?: string;
  locale?: string;
  slides: Array<Record<string, unknown> & { id: string; type: string }>;
};

type HealthStatus = {
  ok: boolean;
  mode: "local" | "tunnel";
  videoOk?: boolean;
  carouselOk: boolean;
  renderer?: "playwright" | "fake";
  chromiumOk?: boolean;
  mensaje?: string;
  warning?: string;
};

const OFFLINE_HINT =
  "Engine offline — ¿video-engine + carousel-engine + túnel arriba?";

const AUTH_HINT =
  "API key inválida — Next debe usar la misma VIDEO_ENGINE_API_KEY que apps/video-engine/.env";

const FAKE_RENDERER_HINT =
  "Renderer fake (PNG placeholder) — en apps/carousel-engine: npm run playwright:install y reiniciá el engine.";

function slideUrl(jobId: string, slideId: string, bust: string) {
  return `/api/admin/carousel/jobs/${jobId}/slides/${slideId}?t=${bust}`;
}

function isOfflinePayload(data: unknown, status: number): boolean {
  if (status === 502 || status === 501) return true;
  if (!data || typeof data !== "object") return false;
  const msg = String(
    (data as { mensaje?: string; error?: string }).mensaje ??
      (data as { error?: string }).error ??
      "",
  ).toLowerCase();
  return (
    msg.includes("offline") ||
    msg.includes("túnel") ||
    msg.includes("tunnel")
  );
}

/** Nest/Zod a veces anidan `{ message: { message, code } }`. */
function apiErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback;
  const d = data as {
    mensaje?: unknown;
    message?: unknown;
    code?: unknown;
    error?: unknown;
  };
  if (typeof d.mensaje === "string" && d.mensaje.trim()) return d.mensaje;
  if (typeof d.message === "string" && d.message.trim()) return d.message;
  if (d.message && typeof d.message === "object") {
    const nested = d.message as { message?: unknown; code?: unknown };
    if (typeof nested.message === "string" && nested.message.trim()) {
      return nested.code
        ? `${String(nested.code)}: ${nested.message}`
        : nested.message;
    }
  }
  if (typeof d.error === "string" && d.error.trim() && d.error !== "Bad Request") {
    return d.error;
  }
  return fallback;
}

function slugFromCarouselId(carouselId: string | undefined): string | null {
  if (!carouselId?.startsWith("cronica:")) return null;
  return carouselId.slice("cronica:".length) || null;
}

function jobChipLabel(job: JobView, index: number): string {
  const title = (job.title ?? "").trim();
  if (title) {
    const short = title.length > 22 ? `${title.slice(0, 20)}…` : title;
    return `${index + 1}. ${short}`;
  }
  const shortId = job.id.replace(/^car_/, "").slice(0, 8);
  return `${index + 1}. ${shortId}`;
}

function editableFieldsForSlide(
  slide: Record<string, unknown> & { type: string },
): { key: string; label: string; multiline?: boolean }[] {
  switch (slide.type) {
    case "cover":
      return [
        { key: "title", label: "Título" },
        { key: "subtitle", label: "Subtítulo", multiline: true },
        { key: "kicker", label: "Kicker" },
      ];
    case "content":
      return [
        { key: "title", label: "Título" },
        { key: "body", label: "Cuerpo", multiline: true },
      ];
    case "quote":
      return [
        { key: "quote", label: "Cita", multiline: true },
        { key: "attribution", label: "Atribución" },
      ];
    case "statistic":
      return [
        { key: "value", label: "Valor" },
        { key: "label", label: "Etiqueta" },
        { key: "context", label: "Contexto", multiline: true },
      ];
    case "gallery":
      return [{ key: "caption", label: "Caption", multiline: true }];
    case "ending_cta":
      return [
        { key: "title", label: "Título" },
        { key: "body", label: "Cuerpo", multiline: true },
        { key: "cta", label: "CTA" },
      ];
    default:
      return [];
  }
}

export function AdminCarouselPanel({
  cronicas,
  initialJobs,
  initialEngineOffline = false,
  initialAuthError = false,
}: {
  cronicas: CronicaOption[];
  initialJobs: JobView[];
  initialEngineOffline?: boolean;
  initialAuthError?: boolean;
}) {
  const [jobs, setJobs] = useState(initialJobs);
  const [activeId, setActiveId] = useState<string | null>(
    initialJobs[0]?.id ?? null,
  );
  const [slug, setSlug] = useState(cronicas[0]?.slug ?? "");
  const [profileId, setProfileId] = useState("instagram_feed");
  const [themeId, setThemeId] = useState("museoargent_classic");
  const [templateId, setTemplateId] = useState("museum_classic");
  const [message, setMessage] = useState<string | null>(null);
  const [engineOffline, setEngineOffline] = useState(initialEngineOffline);
  const [authError, setAuthError] = useState(initialAuthError);
  const [offlineDetail, setOfflineDetail] = useState<string | null>(null);
  const [fakeRenderer, setFakeRenderer] = useState(false);
  const [focusX, setFocusX] = useState(0.5);
  const [focusY, setFocusY] = useState(0.4);
  const [slideIndex, setSlideIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [shareMsg, setShareMsg] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [carouselDoc, setCarouselDoc] = useState<CarouselDoc | null>(null);
  const [editDraft, setEditDraft] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const touchStartX = useRef<number | null>(null);

  const active = jobs.find((j) => j.id === activeId) ?? null;
  const slideOrder = active?.slideOrder ?? [];
  const safeIndex =
    slideOrder.length === 0
      ? 0
      : Math.min(slideIndex, Math.max(0, slideOrder.length - 1));
  const currentSlideId = slideOrder[safeIndex] ?? null;
  const currentRendered =
    !!active &&
    !!currentSlideId &&
    active.renderedSlideIds.includes(currentSlideId);
  const currentSlide =
    carouselDoc?.slides.find((s) => s.id === currentSlideId) ?? null;
  const editFields = currentSlide ? editableFieldsForSlide(currentSlide) : [];

  useEffect(() => {
    setSlideIndex(0);
  }, [activeId]);

  useEffect(() => {
    if (!activeId) {
      setCarouselDoc(null);
      return;
    }
    let cancelled = false;
    void (async () => {
      const res = await fetch(`/api/admin/carousel/jobs/${activeId}/carousel`);
      const data = await res.json().catch(() => null);
      if (cancelled || !res.ok || !data) return;
      setCarouselDoc(data as CarouselDoc);
    })();
    return () => {
      cancelled = true;
    };
  }, [activeId, active?.updatedAt]);

  useEffect(() => {
    if (!currentSlide) {
      setEditDraft({});
      setFocusX(0.5);
      setFocusY(0.4);
      return;
    }
    const next: Record<string, string> = {};
    for (const f of editableFieldsForSlide(currentSlide)) {
      const v = currentSlide[f.key];
      next[f.key] = typeof v === "string" ? v : "";
    }
    setEditDraft(next);
    const img = currentSlide.image as
      | { focusX?: number; focusY?: number }
      | undefined;
    if (img && typeof img === "object") {
      setFocusX(typeof img.focusX === "number" ? img.focusX : 0.5);
      setFocusY(typeof img.focusY === "number" ? img.focusY : 0.4);
    } else {
      setFocusX(0.5);
      setFocusY(0.4);
    }
  }, [currentSlideId, currentSlide?.id, active?.updatedAt]);

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- nav helpers stable enough
  }, [fullscreen, safeIndex, slideOrder.length]);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/admin/carousel/health");
        const data = (await res.json().catch(() => ({}))) as HealthStatus;
        if (data.ok) {
          setEngineOffline(false);
          setFakeRenderer(
            data.renderer === "fake" ||
              data.chromiumOk === false ||
              data.warning === "fake_renderer",
          );
          if (data.warning === "fake_renderer" && data.mensaje) {
            setOfflineDetail(data.mensaje);
          } else if (!data.warning) {
            setOfflineDetail(null);
          }
        } else if (data.mensaje) {
          setOfflineDetail(data.mensaje);
          if (initialEngineOffline || engineOffline) setEngineOffline(true);
        }
      } catch {
        /* keep banner */
      }
    })();
  }, [initialEngineOffline, engineOffline]);

  function goPrev() {
    setSlideIndex((i) => Math.max(0, i - 1));
  }

  function goNext() {
    setSlideIndex((i) =>
      slideOrder.length ? Math.min(slideOrder.length - 1, i + 1) : 0,
    );
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null;
  }

  function onTouchEnd(e: React.TouchEvent) {
    const start = touchStartX.current;
    touchStartX.current = null;
    const end = e.changedTouches[0]?.clientX;
    if (start == null || end == null) return;
    const delta = end - start;
    if (Math.abs(delta) < 48) return;
    if (delta > 0) goPrev();
    else goNext();
  }

  const refreshJob = useCallback(async (id: string) => {
    const res = await fetch(`/api/admin/carousel/jobs/${id}`);
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      setAuthError(true);
      return;
    }
    if (isOfflinePayload(data, res.status)) {
      setEngineOffline(true);
      return;
    }
    if (!res.ok) return;
    setEngineOffline(false);
    setAuthError(false);
    setOfflineDetail(null);
    const job = data as JobView;
    setJobs((prev) => {
      const rest = prev.filter((j) => j.id !== id);
      return [job, ...rest];
    });
  }, []);

  async function renderJob(id: string, slideIds?: string[]) {
    const res = await fetch(`/api/admin/carousel/jobs/${id}/render`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(slideIds ? { slideIds } : {}),
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      setAuthError(true);
      throw new Error(AUTH_HINT);
    }
    if (isOfflinePayload(data, res.status)) {
      setEngineOffline(true);
      throw new Error(offlineDetail ?? OFFLINE_HINT);
    }
    if (!res.ok) {
      const detail =
        (data as { message?: string; mensaje?: string; error?: string })
          .message ??
        (data as { mensaje?: string }).mensaje ??
        (data as { error?: string }).error ??
        "Error al renderizar";
      throw new Error(
        typeof detail === "string" ? detail : JSON.stringify(detail),
      );
    }
    setEngineOffline(false);
    setAuthError(false);
    await refreshJob(id);
    return data as JobView;
  }

  function createJob(body: Record<string, unknown>, label: string) {
    startTransition(async () => {
      setMessage(null);
      setShareMsg(null);
      const res = await fetch("/api/admin/carousel/jobs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...body,
          profileId,
          themeId,
          templateId,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setAuthError(true);
        setMessage(AUTH_HINT);
        return;
      }
      if (isOfflinePayload(data, res.status)) {
        setEngineOffline(true);
        setMessage(offlineDetail ?? OFFLINE_HINT);
        return;
      }
      if (!res.ok) {
        setMessage(apiErrorMessage(data, `Error al crear ${label}`));
        return;
      }
      setEngineOffline(false);
      setAuthError(false);
      setJobs((prev) => [data as JobView, ...prev]);
      setActiveId((data as JobView).id);
      setMessage(`${label} creado · renderizando…`);
      try {
        const rendered = await renderJob((data as JobView).id);
        setMessage(
          `Render OK · ${rendered.renderedSlideIds?.length ?? 0} slides`,
        );
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Error al renderizar");
      }
    });
  }

  function createFromFixture() {
    createJob({ useFixture: true }, "Fixture");
  }

  function createFromCronica() {
    if (!slug) {
      setMessage("Elegí una crónica");
      return;
    }
    createJob({ slug }, "Carrusel");
  }

  function regenerateFromCronica() {
    const fromDoc = slugFromCarouselId(carouselDoc?.id);
    const target = fromDoc ?? slug;
    if (!target) {
      setMessage("Este job no viene de una crónica");
      return;
    }
    setSlug(target);
    createJob({ slug: target }, "Carrusel");
  }

  function saveFocus() {
    if (!activeId || !carouselDoc || !currentSlideId || !currentSlide) return;
    if (!("image" in currentSlide) || !currentSlide.image) {
      setMessage("Este slide no tiene imagen");
      return;
    }
    const nextSlides = carouselDoc.slides.map((s) => {
      if (s.id !== currentSlideId) return s;
      const img = s.image as Record<string, unknown> | undefined;
      if (!img) return s;
      return {
        ...s,
        image: { ...img, focusX, focusY },
      };
    });
    const nextDoc = { ...carouselDoc, slides: nextSlides };
    setCarouselDoc(nextDoc);
    patchActive(
      { carousel: nextDoc },
      { rerender: true, slideIds: [currentSlideId] },
    );
  }

  function renderActive(slideIds?: string[]) {
    if (!activeId) return;
    startTransition(async () => {
      setMessage(null);
      try {
        const data = await renderJob(activeId, slideIds);
        setMessage(`Render OK · ${data.renderedSlideIds?.length ?? 0} slides`);
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Error al renderizar");
      }
    });
  }

  function patchActive(
    body: Record<string, unknown>,
    opts?: { rerender?: boolean; slideIds?: string[] },
  ) {
    if (!activeId) return;
    const id = activeId;
    startTransition(async () => {
      setMessage(null);
      const res = await fetch(`/api/admin/carousel/jobs/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setAuthError(true);
        setMessage(AUTH_HINT);
        return;
      }
      if (isOfflinePayload(data, res.status)) {
        setEngineOffline(true);
        setMessage(offlineDetail ?? OFFLINE_HINT);
        return;
      }
      if (!res.ok) {
        setMessage(
          (data as { mensaje?: string; message?: string }).mensaje ??
            (data as { message?: string }).message ??
            "Error al actualizar",
        );
        return;
      }
      setAuthError(false);
      await refreshJob(id);
      if (opts?.rerender) {
        setMessage("Actualizado · renderizando…");
        try {
          const rendered = await renderJob(id, opts.slideIds);
          setMessage(
            `Render OK · ${rendered.renderedSlideIds?.length ?? 0} slides`,
          );
        } catch (err) {
          setMessage(
            err instanceof Error ? err.message : "Error al renderizar",
          );
        }
      } else {
        setMessage("Job actualizado");
      }
    });
  }

  function saveSlideEdits() {
    if (!activeId || !carouselDoc || !currentSlideId || !currentSlide) return;
    const nextSlides = carouselDoc.slides.map((s) => {
      if (s.id !== currentSlideId) return s;
      const updated = { ...s };
      for (const [k, v] of Object.entries(editDraft)) {
        const optional =
          k === "subtitle" ||
          k === "attribution" ||
          k === "context" ||
          k === "caption" ||
          (k === "body" && s.type !== "content");
        if (v.trim() === "" && optional) {
          delete updated[k];
        } else {
          updated[k] = v;
        }
      }
      return updated;
    });
    const nextDoc = { ...carouselDoc, slides: nextSlides };
    setCarouselDoc(nextDoc);
    patchActive(
      { carousel: nextDoc },
      { rerender: true, slideIds: [currentSlideId] },
    );
  }

  function deleteActiveJob() {
    if (!activeId) return;
    if (!window.confirm("¿Borrar este job y sus PNG?")) return;
    const id = activeId;
    startTransition(async () => {
      setMessage(null);
      const res = await fetch(`/api/admin/carousel/jobs/${id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(
          (data as { mensaje?: string }).mensaje ?? "No se pudo borrar",
        );
        return;
      }
      setJobs((prev) => prev.filter((j) => j.id !== id));
      setActiveId((prev) => {
        if (prev !== id) return prev;
        const rest = jobs.filter((j) => j.id !== id);
        return rest[0]?.id ?? null;
      });
      setMessage("Job borrado");
    });
  }

  function exportZip() {
    if (!activeId) return;
    const a = document.createElement("a");
    a.href = `/api/admin/carousel/jobs/${activeId}/export-zip`;
    a.download = `${active?.title ?? activeId}.zip`;
    a.click();
  }

  function moveSlide(slideId: string, dir: -1 | 1) {
    if (!active) return;
    const order = [...active.slideOrder];
    const i = order.indexOf(slideId);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j]!, order[i]!];
    const newIndex = order.indexOf(slideId);
    setSlideIndex(newIndex);
    patchActive({ slideOrder: order });
  }

  async function compartirSlide() {
    if (!active || !currentSlideId || !currentRendered) return;
    const url = slideUrl(active.id, currentSlideId, active.updatedAt);
    const filename = `${active.title ?? "carousel"}-${currentSlideId}.png`
      .replace(/[^\w.\-áéíóúñÁÉÍÓÚÑ ]+/gi, "")
      .replace(/\s+/g, "-");
    setShareMsg(null);
    setSharing(true);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("No se pudo obtener el PNG");
      const blob = await res.blob();
      const file = new File([blob], filename, { type: "image/png" });
      const payload: ShareData = {
        files: [file],
        title: active.title ?? "MuseoArgent carousel",
        text: `${active.title ?? "Carousel"} · ${currentSlideId}`,
      };
      if (
        typeof navigator.share === "function" &&
        (!navigator.canShare || navigator.canShare(payload))
      ) {
        await navigator.share(payload);
        return;
      }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setShareMsg(
        "No se pudo compartir. Probá Descargar y guardá la imagen en Fotos.",
      );
      window.open(url, "_blank", "noopener,noreferrer");
    } finally {
      setSharing(false);
    }
  }

  function descargarSlide() {
    if (!active || !currentSlideId || !currentRendered) return;
    const url = slideUrl(active.id, currentSlideId, active.updatedAt);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentSlideId}.png`;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
  }

  const btnPrimary =
    "min-h-11 rounded-full border border-oro/50 px-4 py-2.5 text-sm font-semibold text-oro-claro hover:bg-oro/10 disabled:opacity-50";
  const btnSecondary =
    "min-h-11 rounded-full border border-linea px-4 py-2.5 text-sm hover:bg-fondo-2 disabled:opacity-50";
  const selectClass =
    "min-h-11 w-full rounded-sm border border-linea bg-fondo-2 px-3 py-2 text-base sm:text-sm";

  function applyTheme() {
    patchActive(
      { profileId, themeId, templateId },
      { rerender: true },
    );
  }

  const createAndOptions = (
    <div className="space-y-3">
      {cronicas.length > 0 ? (
        <>
          <VideoCronicaPicker
            cronicas={cronicas}
            slug={slug}
            onSlugChange={setSlug}
            showForce={false}
            disabled={pending}
          />
          <button
            type="button"
            disabled={pending || !slug}
            onClick={createFromCronica}
            className={`${btnPrimary} w-full`}
          >
            Crear desde crónica
          </button>
          {carouselDoc?.id?.startsWith("cronica:") ? (
            <button
              type="button"
              disabled={pending}
              onClick={regenerateFromCronica}
              className={`${btnSecondary} w-full`}
            >
              Regenerar desde crónica
            </button>
          ) : null}
        </>
      ) : null}
      <div className="grid w-full min-w-0 grid-cols-1 gap-2 sm:grid-cols-3">
        <select
          className={selectClass}
          value={profileId}
          onChange={(e) => setProfileId(e.target.value)}
        >
          <option value="instagram_feed">Feed 4:5</option>
          <option value="instagram_square">Square 1:1</option>
        </select>
        <select
          className={selectClass}
          value={themeId}
          onChange={(e) => setThemeId(e.target.value)}
        >
          <option value="museoargent_classic">Classic</option>
        </select>
        <select
          className={selectClass}
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
        >
          <option value="museum_classic">Museum Classic</option>
        </select>
      </div>
      {active ? (
        <button
          type="button"
          disabled={pending}
          onClick={applyTheme}
          className={`${btnSecondary} w-full lg:hidden`}
        >
          Aplicar theme
        </button>
      ) : null}
    </div>
  );

  return (
    <div className="w-full min-w-0 space-y-4 overflow-x-hidden pb-28 sm:space-y-6 lg:pb-0">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="titulo-display text-2xl font-semibold sm:text-3xl">
            Carousel
          </h1>
          <p className="mt-1 hidden text-sm text-tinta-suave sm:block">
            Composición editorial · Museum Classic · MuseoArgent Classic.
          </p>
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={createFromFixture}
          className={`${btnPrimary} hidden shrink-0 sm:inline-flex`}
        >
          + Fixture
        </button>
      </div>

      {engineOffline ? (
        <p
          className="rounded-sm border border-oro/40 bg-oro/10 px-4 py-3 text-sm text-oro-claro"
          role="alert"
        >
          {offlineDetail ?? OFFLINE_HINT}
        </p>
      ) : null}
      {fakeRenderer && !engineOffline ? (
        <p
          className="rounded-sm border border-oro/40 bg-oro/10 px-4 py-3 text-sm text-oro-claro"
          role="status"
        >
          {offlineDetail?.includes("fake") || offlineDetail?.includes("Chromium")
            ? offlineDetail
            : FAKE_RENDERER_HINT}
        </p>
      ) : null}
      {authError ? (
        <p
          className="rounded-sm border border-oro/40 bg-oro/10 px-4 py-3 text-sm text-oro-claro"
          role="alert"
        >
          {AUTH_HINT}
        </p>
      ) : null}

      <details
        key={activeId ? "opts-job" : "opts-empty"}
        className="rounded-sm border border-linea bg-fondo-2/40 lg:hidden"
        {...(!active ? { open: true } : {})}
      >
        <summary className="flex min-h-11 cursor-pointer list-none items-center px-3 text-sm font-medium text-tinta-suave marker:content-none [&::-webkit-details-marker]:hidden">
          Nueva / opciones
        </summary>
        <div className="border-t border-linea p-3">{createAndOptions}</div>
      </details>
      <div className="hidden space-y-4 rounded-sm border border-linea bg-fondo-2/40 p-4 lg:block">
        {createAndOptions}
      </div>

      {message ? (
        <p className="text-sm text-tinta-suave" role="status">
          {message}
        </p>
      ) : null}
      {shareMsg ? (
        <p className="text-sm text-oro-claro" role="status">
          {shareMsg}
        </p>
      ) : null}

      <div className="grid w-full min-w-0 gap-4 lg:grid-cols-[200px_1fr] lg:gap-6">
        <aside className="w-full min-w-0 space-y-2">
          <h2 className="text-xs uppercase tracking-[0.14em] text-tinta-tenue">
            Jobs
          </h2>
          {jobs.length === 0 ? (
            <p className="text-sm text-tinta-suave">Sin jobs aún.</p>
          ) : (
            <>
              <div className="w-full min-w-0 max-w-full overflow-x-auto pb-1 lg:hidden">
                <div className="flex w-max gap-2">
                  {jobs.map((job, index) => (
                    <button
                      key={job.id}
                      type="button"
                      onClick={() => setActiveId(job.id)}
                      className={`min-h-11 shrink-0 rounded-full border px-3.5 py-2 text-left text-xs ${
                        job.id === activeId
                          ? "border-oro/60 bg-oro/15 text-oro-claro"
                          : "border-linea bg-fondo-2"
                      }`}
                    >
                      <span className="font-medium">
                        {jobChipLabel(job, index)}
                      </span>
                      <span className="ml-1.5 text-tinta-tenue">
                        {job.slideCount}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="hidden space-y-2 lg:block">
                {jobs.map((job) => (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => setActiveId(job.id)}
                    className={`block w-full rounded-sm border px-3 py-2 text-left text-sm ${
                      job.id === activeId
                        ? "border-oro/60 bg-fondo-2"
                        : "border-linea bg-fondo"
                    }`}
                  >
                    <div className="truncate font-medium">
                      {job.title ?? job.id}
                    </div>
                    <div className="text-xs text-tinta-tenue">
                      {job.status} · {job.slideCount} slides
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </aside>

        {active && currentSlideId ? (
          <section className="w-full min-w-0 space-y-3">
            <div className="hidden w-full min-w-0 grid-cols-2 gap-2 lg:grid">
              <button
                type="button"
                disabled={pending}
                onClick={() => renderActive()}
                className={`${btnPrimary} w-full`}
              >
                Renderizar
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={applyTheme}
                className={`${btnSecondary} w-full`}
              >
                Aplicar theme
              </button>
            </div>

            {active.error ? (
              <p className="text-sm text-oro-claro">{active.error}</p>
            ) : null}

            <div
              className="w-full min-w-0 sm:mx-auto sm:max-w-md"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <button
                type="button"
                onClick={() => currentRendered && setFullscreen(true)}
                className="relative block w-full overflow-hidden rounded-sm border border-linea bg-fondo-2"
                aria-label="Ver slide a pantalla completa"
              >
                <div className="aspect-4/5 max-h-[min(65vh,640px)]">
                  {currentRendered ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={slideUrl(
                        active.id,
                        currentSlideId,
                        active.updatedAt,
                      )}
                      alt={currentSlideId}
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-tinta-tenue">
                      Sin render
                    </div>
                  )}
                </div>
                <span className="absolute bottom-2 right-2 rounded-full bg-fondo/80 px-3 py-1 text-xs text-tinta-suave">
                  {safeIndex + 1}/{slideOrder.length}
                </span>
                {currentSlideId &&
                (active.dirtySlideIds.includes(currentSlideId) ||
                  !currentRendered) ? (
                  <span className="absolute left-2 top-2 rounded-sm bg-oro/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-fondo">
                    {currentRendered ? "Editado" : "Sin render"}
                  </span>
                ) : null}
              </button>

              <div className="mt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  disabled={safeIndex <= 0}
                  onClick={goPrev}
                  className="min-h-11 min-w-11 rounded-full border border-linea text-sm disabled:opacity-40"
                >
                  ←
                </button>
                <div className="flex max-w-[min(100%,14rem)] flex-wrap justify-center gap-0.5">
                  {slideOrder.map((id, i) => (
                    <button
                      key={id}
                      type="button"
                      aria-label={`Slide ${i + 1}`}
                      onClick={() => setSlideIndex(i)}
                      className="flex min-h-11 min-w-11 items-center justify-center"
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          i === safeIndex ? "bg-oro" : "bg-linea"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  disabled={safeIndex >= slideOrder.length - 1}
                  onClick={goNext}
                  className="min-h-11 min-w-11 rounded-full border border-linea text-sm disabled:opacity-40"
                >
                  →
                </button>
              </div>
            </div>

            <div className="w-full min-w-0 max-w-full overflow-x-auto pb-1">
              <div className="flex w-max gap-2">
                {slideOrder.map((slideId, index) => {
                  const rendered = active.renderedSlideIds.includes(slideId);
                  const dirty = active.dirtySlideIds.includes(slideId);
                  return (
                    <button
                      key={slideId}
                      type="button"
                      title={
                        dirty
                          ? "Editado — falta re-render"
                          : !rendered
                            ? "Sin render"
                            : `Slide ${index + 1}`
                      }
                      onClick={() => setSlideIndex(index)}
                      className={`relative min-h-11 min-w-14 shrink-0 overflow-hidden rounded-sm border ${
                        index === safeIndex
                          ? "border-oro/70 ring-1 ring-oro/40"
                          : "border-linea"
                      }`}
                    >
                      <div className="aspect-4/5 w-14 bg-fondo-2">
                        {rendered ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={slideUrl(
                              active.id,
                              slideId,
                              active.updatedAt,
                            )}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] text-tinta-tenue">
                            {index + 1}
                          </div>
                        )}
                      </div>
                      {dirty || !rendered ? (
                        <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-oro" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            {editFields.length > 0 ? (
              <div className="space-y-2 rounded-sm border border-linea p-3">
                <h3 className="text-xs uppercase tracking-[0.14em] text-tinta-tenue">
                  Editar slide
                </h3>
                {editFields.map((f) =>
                  f.multiline ? (
                    <label key={f.key} className="block">
                      <span className="text-xs text-tinta-tenue">{f.label}</span>
                      <textarea
                        value={editDraft[f.key] ?? ""}
                        onChange={(e) =>
                          setEditDraft((d) => ({
                            ...d,
                            [f.key]: e.target.value,
                          }))
                        }
                        rows={3}
                        className="mt-1 w-full rounded-sm border border-linea bg-fondo px-3 py-2 text-base sm:text-sm"
                      />
                    </label>
                  ) : (
                    <label key={f.key} className="block">
                      <span className="text-xs text-tinta-tenue">{f.label}</span>
                      <input
                        type="text"
                        value={editDraft[f.key] ?? ""}
                        onChange={(e) =>
                          setEditDraft((d) => ({
                            ...d,
                            [f.key]: e.target.value,
                          }))
                        }
                        className="mt-1 min-h-11 w-full rounded-sm border border-linea bg-fondo px-3 py-2 text-base sm:text-sm"
                      />
                    </label>
                  ),
                )}
                <button
                  type="button"
                  disabled={pending}
                  onClick={saveSlideEdits}
                  className={`${btnPrimary} w-full`}
                >
                  Guardar y re-render
                </button>
                {"image" in (currentSlide ?? {}) && currentSlide?.image ? (
                  <div className="space-y-2 border-t border-linea pt-3">
                    <h4 className="text-xs uppercase tracking-[0.14em] text-tinta-tenue">
                      Focus imagen
                    </h4>
                    <label className="block text-xs text-tinta-tenue">
                      X {focusX.toFixed(2)}
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={focusX}
                        onChange={(e) => setFocusX(Number(e.target.value))}
                        className="mt-1 w-full"
                      />
                    </label>
                    <label className="block text-xs text-tinta-tenue">
                      Y {focusY.toFixed(2)}
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={focusY}
                        onChange={(e) => setFocusY(Number(e.target.value))}
                        className="mt-1 w-full"
                      />
                    </label>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={saveFocus}
                      className={`${btnSecondary} w-full`}
                    >
                      Aplicar focus
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="grid w-full min-w-0 grid-cols-2 gap-2">
              <button
                type="button"
                disabled={!currentRendered || sharing || pending}
                onClick={() => void compartirSlide()}
                className={`${btnPrimary} hidden w-full lg:inline-flex`}
              >
                {sharing ? "…" : "Compartir"}
              </button>
              <button
                type="button"
                disabled={!currentRendered}
                onClick={descargarSlide}
                className={`${btnSecondary} w-full`}
              >
                Descargar
              </button>
              <button
                type="button"
                disabled={pending || !currentRendered}
                onClick={exportZip}
                className={`${btnSecondary} hidden w-full lg:inline-flex`}
              >
                Export ZIP
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={deleteActiveJob}
                className={`${btnSecondary} w-full text-oro-claro`}
              >
                Borrar job
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => renderActive([currentSlideId])}
                className={`${btnSecondary} w-full`}
              >
                Re-render
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={pending || safeIndex <= 0}
                  onClick={() => moveSlide(currentSlideId, -1)}
                  className={`${btnSecondary} w-full`}
                  aria-label="Subir slide"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={pending || safeIndex >= slideOrder.length - 1}
                  onClick={() => moveSlide(currentSlideId, 1)}
                  className={`${btnSecondary} w-full`}
                  aria-label="Bajar slide"
                >
                  ↓
                </button>
              </div>
            </div>
          </section>
        ) : (
          <p className="text-sm text-tinta-suave">
            Elegí una crónica o creá un fixture para previsualizar.
          </p>
        )}
      </div>

      {fullscreen && active && currentSlideId && currentRendered ? (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-fondo pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-label="Vista completa del slide"
        >
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-tinta-suave">
              {safeIndex + 1}/{slideOrder.length}
            </span>
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              className="min-h-11 min-w-11 rounded-full border border-linea px-4 text-sm"
            >
              Cerrar
            </button>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center px-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slideUrl(active.id, currentSlideId, active.updatedAt)}
              alt={currentSlideId}
              className="max-h-full max-w-full object-contain"
              draggable={false}
            />
          </div>
          <div className="flex items-center justify-between gap-2 px-4 py-4">
            <button
              type="button"
              disabled={safeIndex <= 0}
              onClick={goPrev}
              className="min-h-11 min-w-11 rounded-full border border-linea px-5 disabled:opacity-40"
            >
              ←
            </button>
            <button
              type="button"
              disabled={sharing}
              onClick={() => void compartirSlide()}
              className="min-h-11 rounded-full border border-oro/50 px-5 text-sm font-semibold text-oro-claro"
            >
              Compartir
            </button>
            <button
              type="button"
              disabled={safeIndex >= slideOrder.length - 1}
              onClick={goNext}
              className="min-h-11 min-w-11 rounded-full border border-linea px-5 disabled:opacity-40"
            >
              →
            </button>
          </div>
        </div>
      ) : null}

      {active && currentSlideId && !fullscreen ? (
        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-linea bg-fondo-2/95 px-4 pt-3 backdrop-blur-sm lg:hidden"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div className="mx-auto flex max-w-5xl gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => renderActive()}
              className={`${btnPrimary} min-h-12 flex-1`}
            >
              Renderizar
            </button>
            <button
              type="button"
              disabled={!currentRendered || sharing || pending}
              onClick={() => void compartirSlide()}
              className={`${btnPrimary} min-h-12 flex-1`}
            >
              {sharing ? "…" : "Compartir"}
            </button>
            <button
              type="button"
              disabled={pending || !currentRendered}
              onClick={exportZip}
              className={`${btnSecondary} min-h-12 shrink-0 px-3`}
            >
              ZIP
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
