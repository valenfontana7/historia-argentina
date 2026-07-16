import { requireAdminSesion } from "@/lib/admin-auth";
import { listJobsFromDisk } from "@/lib/admin-video-jobs";
import { cronicas } from "@/content/cronicas/registro";
import { AdminVideoPanel } from "@/components/admin/AdminVideoPanel";

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

  const jobs = await listJobsFromDisk();

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
