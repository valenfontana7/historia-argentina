import Link from "next/link";
import { EditorialActionForm } from "./EditorialActionForm";
import { createEditorialStoryAction } from "./actions";
import { listEditorialStories, queueBucketForStory, type EditorialQueueBucket } from "@/lib/editorial/repository";
import { EditorialSuggestionsPanel } from "./EditorialSuggestionsPanel";

const QUEUES: Array<{ key: EditorialQueueBucket; title: string; description: string }> = [
  { key: "review", title: "Revisión de paquetes", description: "Autopilot terminó: verificá claims, editá variantes y aprobá." },
  { key: "suggestions", title: "Sugerencias", description: "Temas detectados automáticamente sin paquete generado." },
  { key: "triage", title: "Triage", description: "Temas detectados que todavía necesitan una decisión editorial." },
  { key: "research", title: "Investigación", description: "Historias aceptadas que necesitan contexto, fuentes y claims." },
  { key: "evidence", title: "Evidencia faltante", description: "Claims factuales pendientes o sin respaldo suficiente." },
  { key: "angles", title: "Ángulos", description: "Propuestas por marca pendientes de definición o revisión." },
  { key: "production", title: "Producción", description: "Piezas verificadas listas para preparar o renderizar." },
  { key: "final_review", title: "Revisión final", description: "Outputs renderizados que requieren una decisión humana." },
  { key: "done", title: "Cerradas", description: "Historias archivadas, rechazadas o sin una acción inmediata." },
];

export default async function EditorialPage() {
  const stories = await listEditorialStories();
  const grouped = new Map<EditorialQueueBucket, typeof stories>();
  for (const queue of QUEUES) grouped.set(queue.key, []);
  for (const story of stories) grouped.get(queueBucketForStory(story))?.push(story);

  const suggestions = (grouped.get("suggestions") ?? []).map((story) => ({
    id: story.id,
    title: story.title,
    summary: story.summary,
    score: story.score,
    discoverySource: story.discoverySource,
    suggestedBrands: story.suggestedBrands,
    autopilotStatus: story.autopilotStatus,
  }));

  return (
    <div className="space-y-8">
      <header>
        <p className="kicker">Cocina editorial compartida</p>
        <h1 className="titulo-display text-3xl font-semibold">Hoy</h1>
        <p className="mt-2 max-w-3xl text-sm text-tinta-suave">El autopilot descubre temas y arma borradores. Vos verificás, corregís y publicás manualmente.</p>
      </header>
      <EditorialSuggestionsPanel suggestions={suggestions} />
      <section className="rounded-sm border border-linea bg-fondo-2 p-5">
        <h2 className="titulo-display text-xl font-semibold">Ingresar tema manual</h2>
        <EditorialActionForm action={createEditorialStoryAction} label="Crear historia" resetOnSuccess className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-sm"><span>Título de trabajo</span><input name="title" required minLength={3} className="field" /></label>
          <label className="space-y-1 text-sm"><span>Slug</span><input name="slug" required pattern="[a-z0-9-]+" placeholder="tema-del-dia" className="field" /></label>
          <label className="space-y-1 text-sm sm:col-span-2"><span>Qué pasó y por qué importa</span><textarea name="summary" required minLength={10} className="field min-h-24" /></label>
          <label className="space-y-1 text-sm"><span>Fecha del hecho</span><input type="date" name="eventDate" className="field" /></label>
          <label className="space-y-1 text-sm"><span>Etiquetas</span><input name="tags" placeholder="economía, trabajo" className="field" /></label>
        </EditorialActionForm>
      </section>
      <div className="grid gap-6 xl:grid-cols-2">
        {QUEUES.filter((queue) => queue.key !== "suggestions").map((queue) => {
          const items = grouped.get(queue.key) ?? [];
          return <section key={queue.key} className="rounded-sm border border-linea bg-fondo-2 p-5">
            <div className="flex items-start justify-between gap-4"><div><h2 className="titulo-display text-xl font-semibold">{queue.title}</h2><p className="mt-1 text-sm text-tinta-suave">{queue.description}</p></div><span className="rounded-full border border-linea px-3 py-1 text-sm text-oro">{items.length}</span></div>
            <div className="mt-4 space-y-3">{items.length === 0 ? <p className="rounded border border-dashed border-linea p-4 text-sm text-tinta-tenue">Sin pendientes.</p> : items.map((story) => {
              const variants = story.angles.flatMap((angle) => angle.variants);
              const missingEvidence = story.claims.filter((claim) => claim.classification === "fact" && claim.verification !== "verified").length;
              return <Link key={story.id} href={`/admin/editorial/${story.id}`} className="block rounded border border-linea-suave bg-fondo p-4 transition-colors hover:border-oro/60">
                <div className="flex flex-wrap items-start justify-between gap-2"><div><p className="text-xs uppercase tracking-[0.16em] text-tinta-tenue">{story.status} · {story.autopilotStatus}</p><h3 className="mt-1 font-semibold">{story.title}</h3></div>{story.score !== null ? <span className="text-sm text-oro">{story.score}/100</span> : null}</div>
                <p className="mt-2 line-clamp-2 text-sm text-tinta-suave">{story.summary}</p>
                <p className="mt-3 text-xs text-tinta-tenue">{story.discoverySource} · {story.sources.length} fuentes · {missingEvidence} claims pendientes · {story.angles.length} ángulos · {variants.length} variantes</p>
              </Link>;
            })}</div>
          </section>;
        })}
      </div>
    </div>
  );
}
