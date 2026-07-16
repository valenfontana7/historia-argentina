import { requireAdminSesion } from "@/lib/admin-auth";
import { normalizeAdminJobs } from "@/lib/admin-job-normalize";
import { listJobsFromDisk } from "@/lib/admin-video-jobs";
import { cronicas } from "@/content/cronicas/registro";
import { AdminVideoPanel } from "@/components/admin/AdminVideoPanel";
import type { JobView } from "@museoargent/video-contracts";
import {
  engineFetch,
  usarVideoEngineRemoto,
} from "@/lib/video/engine-client";

async function loadInitialJobs() {
  if (usarVideoEngineRemoto()) {
    try {
      const res = await engineFetch("/jobs");
      if (!res.ok) return [];
      const data = (await res.json()) as { jobs?: JobView[] };
      return normalizeAdminJobs(data.jobs ?? []);
    } catch {
      return [];
    }
  }
  return listJobsFromDisk();
}

export default async function AdminVideoPage() {
  await requireAdminSesion();

  const opciones = [...cronicas]
    .filter(
      (c) =>
        c.acceso === "publico" ||
        c.acceso === "mecenas" ||
        c.acceso === "anticipo",
    )
    .map((c) => ({ slug: c.slug, titulo: c.titulo }))
    .sort((a, b) => a.titulo.localeCompare(b.titulo, "es"));

  const jobs = await loadInitialJobs();

  return (
    <div className="space-y-5 sm:space-y-8">
      <div>
        <p className="kicker">Producción</p>
        <h1 className="titulo-display text-2xl font-semibold sm:text-3xl">
          Video / Reels
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-tinta-suave">
          Generá y previsualizá MP4 verticales 1080×1920.
        </p>
      </div>

      <AdminVideoPanel cronicas={opciones} initialJobs={jobs} />
    </div>
  );
}
