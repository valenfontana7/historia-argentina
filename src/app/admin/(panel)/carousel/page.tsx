import { requireAdminSesion } from "@/lib/admin-auth";
import { AdminCarouselPanel } from "@/components/admin/AdminCarouselPanel";
import { cronicas } from "@/content/cronicas/registro";
import { carouselEngineFetch } from "@/lib/carousel/engine-client";

export default async function AdminCarouselPage() {
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

  let initialJobs: unknown[] = [];
  let initialEngineOffline = false;
  let initialAuthError = false;
  try {
    const res = await carouselEngineFetch("/jobs?limit=20");
    if (res.ok) {
      const data = (await res.json()) as { jobs?: unknown[] };
      initialJobs = data.jobs ?? [];
    } else if (res.status === 401) {
      initialAuthError = true;
    } else if (res.status === 502 || res.status === 503 || res.status >= 500) {
      initialEngineOffline = true;
    }
  } catch {
    initialEngineOffline = true;
    initialJobs = [];
  }

  return (
    <AdminCarouselPanel
      cronicas={opciones}
      initialJobs={initialJobs as Parameters<
        typeof AdminCarouselPanel
      >[0]["initialJobs"]}
      initialEngineOffline={initialEngineOffline}
      initialAuthError={initialAuthError}
    />
  );
}
