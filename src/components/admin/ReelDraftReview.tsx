"use client";

import { useCallback, useEffect, useState } from "react";
import type { JobDraft, JobDraftCatalogItem } from "@museoargent/video-contracts";
import type { AdminJob } from "./video-admin-types";
import { normalizeAdminJob } from "@/lib/admin-job-normalize";

type Props = {
  job: AdminJob;
  onJobUpdate: (job: AdminJob) => void;
  onError: (message: string) => void;
};

type SceneEdit = {
  scene: number;
  narration: string;
  assetId: string;
};

export function ReelDraftReview({ job, onJobUpdate, onError }: Props) {
  const [draft, setDraft] = useState<JobDraft | null>(null);
  const [edits, setEdits] = useState<SceneEdit[]>([]);
  const [pickerScene, setPickerScene] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [approving, setApproving] = useState(false);

  const loadDraft = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/reels/jobs/${encodeURIComponent(job.id)}/draft`,
      );
      const data = (await res.json().catch(() => ({}))) as JobDraft & {
        error?: string;
        message?: string;
      };
      if (!res.ok) {
        onError(data.error ?? data.message ?? "No se pudo cargar el borrador");
        return;
      }
      setDraft(data);
      setEdits(
        data.storyboard.scenes.map((s) => {
          const binding = data.bindings.find((b) => b.scene === s.scene);
          return {
            scene: s.scene,
            narration: s.narration,
            assetId: binding?.assetId ?? "",
          };
        }),
      );
    } catch (err) {
      onError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [job.id, onError]);

  useEffect(() => {
    void loadDraft();
  }, [loadDraft]);

  function catalogItem(id: string): JobDraftCatalogItem | undefined {
    return draft?.catalog.find((c) => c.id === id);
  }

  function updateScene(scene: number, patch: Partial<SceneEdit>) {
    setEdits((prev) =>
      prev.map((e) => (e.scene === scene ? { ...e, ...patch } : e)),
    );
  }

  async function saveAndApprove() {
    if (!draft) return;
    setSaving(true);
    setApproving(true);
    onError("");
    try {
      const patchRes = await fetch(
        `/api/admin/reels/jobs/${encodeURIComponent(job.id)}/draft`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            scenes: edits.map((e) => ({
              scene: e.scene,
              narration: e.narration,
              assetId: e.assetId,
            })),
          }),
        },
      );
      const patchData = (await patchRes.json().catch(() => ({}))) as JobDraft & {
        error?: string;
        message?: string;
      };
      if (!patchRes.ok) {
        onError(
          patchData.error ??
            patchData.message ??
            "No se pudo guardar el borrador",
        );
        return;
      }
      setDraft(patchData);

      const approveRes = await fetch(
        `/api/admin/reels/jobs/${encodeURIComponent(job.id)}/approve`,
        { method: "POST" },
      );
      const approveData = (await approveRes.json().catch(() => ({}))) as AdminJob & {
        error?: string;
        message?: string;
      };
      if (!approveRes.ok) {
        onError(
          approveData.error ??
            approveData.message ??
            "No se pudo aprobar el borrador",
        );
        return;
      }
      onJobUpdate(normalizeAdminJob(approveData));
    } catch (err) {
      onError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
      setApproving(false);
    }
  }

  if (loading) {
    return (
      <section className="rounded-sm border border-linea bg-fondo-2 p-5">
        <p className="text-sm text-tinta-suave">Cargando borrador…</p>
      </section>
    );
  }

  if (!draft) {
    return (
      <section className="rounded-sm border border-linea bg-fondo-2 p-5">
        <p className="text-sm text-carmesi">No hay borrador para este job.</p>
      </section>
    );
  }

  return (
    <section className="rounded-sm border border-sky-500/30 bg-fondo-2 p-5">
      <h2 className="titulo-display text-xl font-semibold">Revisar borrador</h2>
      <p className="mt-2 text-sm text-tinta-suave">
        Corregí el texto y elegí la imagen de cada escena. Al aprobar se genera
        la voz y el MP4.
      </p>

      <ul className="mt-5 space-y-6">
        {edits.map((edit) => {
          const item = catalogItem(edit.assetId);
          return (
            <li
              key={edit.scene}
              className="border-t border-linea pt-5 first:border-t-0 first:pt-0"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-tinta-tenue">
                Escena {edit.scene}
              </p>
              <label className="mt-2 block text-sm text-tinta-suave">
                Narración
                <textarea
                  value={edit.narration}
                  onChange={(e) =>
                    updateScene(edit.scene, { narration: e.target.value })
                  }
                  rows={3}
                  className="mt-1 w-full rounded-sm border border-linea bg-fondo px-3 py-2 text-sm text-tinta"
                />
              </label>

              <div className="mt-3 flex flex-wrap items-start gap-3">
                {item ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="h-28 w-20 object-cover"
                  />
                ) : (
                  <div className="flex h-28 w-20 items-center justify-center bg-fondo text-xs text-tinta-tenue">
                    Sin imagen
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-tinta">{item?.alt ?? edit.assetId}</p>
                  <p className="text-xs text-tinta-tenue">{item?.tipo}</p>
                  <button
                    type="button"
                    onClick={() =>
                      setPickerScene(
                        pickerScene === edit.scene ? null : edit.scene,
                      )
                    }
                    className="mt-2 text-sm font-medium text-oro-claro underline-offset-2 hover:underline"
                  >
                    {pickerScene === edit.scene
                      ? "Cerrar catálogo"
                      : "Elegir imagen"}
                  </button>
                </div>
              </div>

              {pickerScene === edit.scene && (
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {draft.catalog.map((c) => {
                    const selected = c.id === edit.assetId;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          updateScene(edit.scene, { assetId: c.id });
                          setPickerScene(null);
                        }}
                        className={`overflow-hidden border text-left ${
                          selected
                            ? "border-oro"
                            : "border-linea hover:border-oro/50"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={c.url}
                          alt={c.alt}
                          className="aspect-9/16 w-full object-cover"
                        />
                        <span className="block truncate px-1 py-1 text-[10px] text-tinta-tenue">
                          {c.id}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        disabled={saving || approving || edits.some((e) => !e.narration.trim())}
        onClick={() => void saveAndApprove()}
        className="mt-6 flex min-h-11 w-full items-center justify-center rounded-full border border-oro/50 bg-oro/10 px-5 py-2.5 text-sm font-semibold text-oro-claro transition-colors hover:bg-oro/20 disabled:opacity-50 lg:w-auto"
      >
        {approving ? "Aprobando…" : "Aprobar y renderizar"}
      </button>
    </section>
  );
}
