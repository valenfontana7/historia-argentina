"use client";

import { useState } from "react";
import { EditorialActionForm } from "./EditorialActionForm";
import { discoverTopicsAction, discardSuggestionAction, generatePackageAction, triageSuggestionAction } from "./actions";

type Suggestion = {
  id: string;
  title: string;
  summary: string;
  score: number | null;
  discoverySource: string;
  suggestedBrands: string[];
  autopilotStatus: string;
};

export function EditorialSuggestionsPanel({ suggestions }: { suggestions: Suggestion[] }) {
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function scanNow() {
    setScanning(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/editorial/discover", { method: "POST" });
      const data = (await response.json()) as { ok?: boolean; created?: number; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error ?? "No se pudo escanear.");
      setMessage(`Escaneo listo: ${data.created ?? 0} temas nuevos.`);
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error al escanear.");
    } finally {
      setScanning(false);
    }
  }

  return (
    <section className="rounded-sm border border-linea bg-fondo-2 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="titulo-display text-xl font-semibold">Sugerencias del día</h2>
          <p className="mt-1 text-sm text-tinta-suave">Temas detectados por macro, efemérides, grafo, RSS y búsqueda web. Generá el paquete completo o descartá.</p>
        </div>
        <button type="button" onClick={scanNow} disabled={scanning} className="pill disabled:opacity-50">
          {scanning ? "Escaneando…" : "Escanear ahora"}
        </button>
      </div>
      {message ? <p className="mt-3 text-sm text-oro-claro">{message}</p> : null}
      <div className="mt-4 space-y-3">
        {suggestions.length === 0 ? (
          <p className="rounded border border-dashed border-linea p-4 text-sm text-tinta-tenue">Sin sugerencias pendientes. Usá «Escanear ahora» o el formulario manual.</p>
        ) : suggestions.map((story) => (
          <article key={story.id} className="rounded border border-linea-suave bg-fondo p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-tinta-tenue">{story.discoverySource} · {story.autopilotStatus}</p>
                <h3 className="mt-1 font-semibold">{story.title}</h3>
              </div>
              {story.score !== null ? <span className="text-sm text-oro">{story.score}/100</span> : null}
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-tinta-suave">{story.summary}</p>
            <p className="mt-2 text-xs text-tinta-tenue">Marcas: {story.suggestedBrands.join(", ") || "ambas"}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <EditorialActionForm action={generatePackageAction} label="Generar paquete" className="inline-flex">
                <input type="hidden" name="storyId" value={story.id} />
              </EditorialActionForm>
              <EditorialActionForm action={triageSuggestionAction} label="Solo triage" className="inline-flex">
                <input type="hidden" name="storyId" value={story.id} />
              </EditorialActionForm>
              <EditorialActionForm action={discardSuggestionAction} label="Descartar" className="inline-flex flex-wrap gap-2">
                <input type="hidden" name="storyId" value={story.id} />
                <input name="note" placeholder="Motivo" className="field min-w-48" />
              </EditorialActionForm>
            </div>
          </article>
        ))}
      </div>
      <EditorialActionForm action={discoverTopicsAction} label="Descubrir vía servidor" className="mt-4 hidden">
        <input type="hidden" name="_" value="1" />
      </EditorialActionForm>
    </section>
  );
}
