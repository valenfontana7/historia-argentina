import type { AdminJob, PipelineStage } from "./video-admin-types";
import { PIPELINE_STAGE_ORDER } from "./video-admin-types";

export type CronicaOption = { slug: string; titulo: string };

export function tituloDeSlug(
  cronicas: CronicaOption[],
  slug: string | undefined,
): string {
  if (!slug) return "Sin crónica";
  return cronicas.find((c) => c.slug === slug)?.titulo ?? slug;
}

export function formatearFecha(iso: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function formatearBytes(bytes?: number): string {
  if (bytes == null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Nombre amigable para guardar/compartir el MP4 (iOS / desktop). */
export function reelDownloadFilename(
  slug: string | undefined,
  jobId: string,
): string {
  const safeSlug =
    (slug ?? "reel")
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || "reel";
  const shortId = jobId.replace(/[^a-zA-Z0-9_-]/g, "").slice(-8) || "job";
  return `museoargent-${safeSlug}-${shortId}.mp4`;
}

export function reelMediaUrl(jobId: string, download = false): string {
  const base = `/api/admin/reels/media/${encodeURIComponent(jobId)}`;
  return download ? `${base}?download=1` : base;
}

export function pillStatus(status: string): string {
  switch (status) {
    case "succeeded":
      return "bg-oro/15 text-oro-claro";
    case "running":
    case "queued":
      return "bg-amber-500/15 text-amber-200";
    case "failed":
    case "cancelled":
      return "bg-carmesi/15 text-carmesi";
    default:
      return "bg-tinta-tenue/20 text-tinta-tenue";
  }
}

export function stageIndex(stage?: PipelineStage): number {
  if (!stage) return -1;
  return PIPELINE_STAGE_ORDER.indexOf(stage);
}

export function progressPct(job: AdminJob | null, activo: boolean): number {
  if (!job) return 0;
  if (job.status === "succeeded") return 100;
  if (job.status === "failed") return 0;
  const idx = stageIndex(job.stage);
  if (idx < 0) return activo ? 5 : 0;
  return Math.min(95, Math.round(((idx + 1) / PIPELINE_STAGE_ORDER.length) * 100));
}
