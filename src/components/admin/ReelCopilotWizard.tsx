"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  EditorialMemory,
  JobBindingsDocument,
  JobDraftCatalogItem,
  PreRenderChecklist,
  ScriptDocument,
  StoryboardDocument,
} from "@museoargent/video-contracts";
import type { AdminJob } from "./video-admin-types";
import { normalizeAdminJob } from "@/lib/admin-job-normalize";

type Props = {
  job: AdminJob;
  onJobUpdate: (job: AdminJob) => void;
  onError: (message: string) => void;
};

const SHOTS = [
  "retrato",
  "plano-general",
  "detalle",
  "mapa",
  "documento",
  "simbolo",
] as const;
const MOTIONS = [
  "kenBurns",
  "zoomIn",
  "zoomOut",
  "panLeft",
  "panRight",
  "static",
] as const;
const TRANSITIONS = ["cut", "fade", "crossfade"] as const;

const FIELD =
  "mt-1 w-full min-h-11 rounded-sm border border-linea bg-fondo px-3 py-2 text-base text-tinta sm:min-h-10 sm:text-sm";
const FIELD_COMPACT =
  "mt-1 w-full min-h-10 rounded-sm border border-linea bg-fondo px-2 py-1.5 text-base text-tinta sm:text-sm";
const SECONDARY_BTN =
  "inline-flex min-h-11 w-full items-center justify-center rounded-full border border-linea px-4 text-sm font-medium text-oro-claro hover:border-oro/40 disabled:opacity-50 sm:w-auto";

export function ReelCopilotWizard({ job, onJobUpdate, onError }: Props) {
  const status = job.status;

  if (
    status === "awaiting_script" ||
    status === "awaiting_storyboard" ||
    status === "awaiting_assets" ||
    status === "awaiting_review" ||
    status === "awaiting_voice" ||
    status === "awaiting_preview"
  ) {
    return (
      <section className="rounded-sm border border-sky-500/30 bg-fondo-2 p-5">
        <StepsIndicator status={status} />
        {status === "awaiting_script" && (
          <ScriptStep jobId={job.id} onJobUpdate={onJobUpdate} onError={onError} />
        )}
        {status === "awaiting_storyboard" && (
          <StoryboardStep
            jobId={job.id}
            onJobUpdate={onJobUpdate}
            onError={onError}
          />
        )}
        {(status === "awaiting_assets" || status === "awaiting_review") && (
          <AssetsStep jobId={job.id} onJobUpdate={onJobUpdate} onError={onError} />
        )}
        {status === "awaiting_voice" && (
          <VoiceStep jobId={job.id} onJobUpdate={onJobUpdate} onError={onError} />
        )}
        {status === "awaiting_preview" && (
          <PreviewStep
            jobId={job.id}
            onJobUpdate={onJobUpdate}
            onError={onError}
          />
        )}
      </section>
    );
  }

  return null;
}

function StepsIndicator({ status }: { status: string }) {
  const steps = [
    { id: "script", label: "1. Guion" },
    { id: "storyboard", label: "2. Storyboard" },
    { id: "assets", label: "3. Imágenes" },
    { id: "voice", label: "4. Voz" },
    { id: "preview", label: "5. Preview" },
  ];
  const active =
    status === "awaiting_script"
      ? "script"
      : status === "awaiting_storyboard"
        ? "storyboard"
        : status === "awaiting_voice"
          ? "voice"
          : status === "awaiting_preview"
            ? "preview"
            : "assets";

  return (
    <div className="mb-5 -mx-1 overflow-x-auto px-1 pb-1">
      <div className="flex snap-x snap-mandatory flex-nowrap gap-2 text-xs">
        {steps.map((s) => (
          <span
            key={s.id}
            className={`inline-flex min-h-9 shrink-0 snap-start items-center rounded-full px-3 py-1.5 ${
              s.id === active
                ? "bg-sky-500/20 text-sky-200"
                : "bg-fondo text-tinta-tenue"
            }`}
          >
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function MemoryEditor({
  jobId,
  onError,
  collapsed = false,
}: {
  jobId: string;
  onError: (m: string) => void;
  collapsed?: boolean;
}) {
  const [memory, setMemory] = useState<EditorialMemory | null>(null);
  const [notesText, setNotesText] = useState("");
  const [bannedText, setBannedText] = useState("");
  const [tone, setTone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void (async () => {
      const res = await fetch(
        `/api/admin/reels/jobs/${encodeURIComponent(jobId)}/memory`,
      );
      const data = await res.json();
      if (!res.ok) {
        onError(data.error ?? data.message ?? "No se pudo cargar memoria");
        return;
      }
      const m = data as EditorialMemory;
      setMemory(m);
      setNotesText(m.notes.join("\n"));
      setBannedText(m.bannedWords.join(", "));
      setTone(m.preferredTone ?? "");
    })();
  }, [jobId, onError]);

  async function save() {
    setSaving(true);
    onError("");
    try {
      const res = await fetch(
        `/api/admin/reels/jobs/${encodeURIComponent(jobId)}/memory`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            notes: notesText
              .split("\n")
              .map((l) => l.trim())
              .filter(Boolean),
            bannedWords: bannedText
              .split(",")
              .map((w) => w.trim())
              .filter(Boolean),
            preferredTone: tone.trim() || null,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        onError(data.error ?? data.message ?? "Error al guardar memoria");
        return;
      }
      setMemory(data as EditorialMemory);
    } finally {
      setSaving(false);
    }
  }

  if (!memory) {
    return (
      <p className="mb-4 text-xs text-tinta-tenue">Cargando memoria editorial…</p>
    );
  }

  const body = (
    <>
      {!collapsed && (
        <>
          <h3 className="text-sm font-semibold text-tinta">Memoria editorial</h3>
          <p className="mt-1 text-xs text-tinta-tenue">
            Preferencias por exhibición: se inyectan en el LLM al regenerar.
          </p>
        </>
      )}
      <label className="mt-3 block text-xs text-tinta-tenue">
        Notas (una por línea)
        <textarea
          value={notesText}
          onChange={(e) => setNotesText(e.target.value)}
          rows={3}
          className={`${FIELD} bg-fondo-2`}
        />
      </label>
      <label className="mt-2 block text-xs text-tinta-tenue">
        Palabras vetadas (separadas por coma)
        <input
          value={bannedText}
          onChange={(e) => setBannedText(e.target.value)}
          className={`${FIELD} bg-fondo-2`}
        />
      </label>
      <label className="mt-2 block text-xs text-tinta-tenue">
        Tono preferido
        <input
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          placeholder="ej. solemne, íntimo"
          className={`${FIELD} bg-fondo-2`}
        />
      </label>
      <button
        type="button"
        disabled={saving}
        onClick={() => void save()}
        className={`mt-3 ${SECONDARY_BTN}`}
      >
        {saving ? "Guardando…" : "Guardar memoria"}
      </button>
    </>
  );

  if (collapsed) {
    return (
      <details className="mb-5 rounded-sm border border-linea bg-fondo">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-tinta marker:content-none [&::-webkit-details-marker]:hidden">
          <span className="flex min-h-11 items-center justify-between gap-2">
            Memoria editorial
            <span className="text-xs font-normal text-tinta-tenue">Editar</span>
          </span>
        </summary>
        <div className="border-t border-linea px-4 pb-4">{body}</div>
      </details>
    );
  }

  return (
    <div className="mb-5 rounded-sm border border-linea bg-fondo p-4">{body}</div>
  );
}

function ScriptStep({
  jobId,
  onJobUpdate,
  onError,
}: {
  jobId: string;
  onJobUpdate: (job: AdminJob) => void;
  onError: (m: string) => void;
}) {
  const [script, setScript] = useState<ScriptDocument | null>(null);
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState("");
  const [regenBusy, setRegenBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      const res = await fetch(
        `/api/admin/reels/jobs/${encodeURIComponent(jobId)}/script`,
      );
      const data = await res.json();
      if (!res.ok) {
        onError(data.error ?? data.message ?? "No se pudo cargar el script");
        return;
      }
      setScript(data as ScriptDocument);
    })();
  }, [jobId, onError]);

  async function regenerate() {
    setRegenBusy(true);
    onError("");
    try {
      const res = await fetch(
        `/api/admin/reels/jobs/${encodeURIComponent(jobId)}/script/regenerate`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(hint.trim() ? { hint: hint.trim() } : {}),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        onError(data.error ?? data.message ?? "Error al regenerar guion");
        return;
      }
      setScript(data as ScriptDocument);
    } finally {
      setRegenBusy(false);
    }
  }

  async function saveAndApprove() {
    if (!script) return;
    setBusy(true);
    onError("");
    try {
      const patchRes = await fetch(
        `/api/admin/reels/jobs/${encodeURIComponent(jobId)}/script`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            scenes: script.scenes.map((s) => ({
              scene: s.scene,
              narration: s.narration,
              durationSec: s.durationSec,
            })),
          }),
        },
      );
      if (!patchRes.ok) {
        const d = await patchRes.json();
        onError(d.error ?? d.message ?? "Error al guardar script");
        return;
      }
      const approveRes = await fetch(
        `/api/admin/reels/jobs/${encodeURIComponent(jobId)}/approve-script`,
        { method: "POST" },
      );
      const job = await approveRes.json();
      if (!approveRes.ok) {
        onError(job.error ?? job.message ?? "Error al aprobar script");
        return;
      }
      onJobUpdate(normalizeAdminJob(job));
    } finally {
      setBusy(false);
    }
  }

  if (!script) {
    return <p className="text-sm text-tinta-suave">Cargando guion…</p>;
  }

  return (
    <div>
      <h2 className="titulo-display text-xl font-semibold">Revisar guion</h2>
      <p className="mt-2 text-sm text-tinta-suave">
        Editá la narración de cada beat. Al aprobar se genera el storyboard.
      </p>
      <MemoryEditor jobId={jobId} onError={onError} />
      <ul className="mt-4 space-y-4">
        {script.scenes.map((s, idx) => (
          <li key={s.scene}>
            <label className="block text-sm text-tinta-suave">
              Beat {s.scene}
              <textarea
                value={s.narration}
                rows={3}
                onChange={(e) => {
                  const narration = e.target.value;
                  setScript({
                    ...script,
                    scenes: script.scenes.map((x, i) =>
                      i === idx ? { ...x, narration } : x,
                    ),
                  });
                }}
                className={FIELD}
              />
            </label>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
        <label className="block flex-1 text-xs text-tinta-tenue">
          Hint para regenerar (opcional)
          <input
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            placeholder="ej. más corta, menos épica"
            className={FIELD}
          />
        </label>
        <button
          type="button"
          disabled={regenBusy || busy}
          onClick={() => void regenerate()}
          className={SECONDARY_BTN}
        >
          {regenBusy ? "Regenerando…" : "Regenerar con IA"}
        </button>
      </div>
      <ApproveButton
        label="Aprobar guion"
        busy={busy}
        onClick={() => void saveAndApprove()}
      />
    </div>
  );
}

function StoryboardStep({
  jobId,
  onJobUpdate,
  onError,
}: {
  jobId: string;
  onJobUpdate: (job: AdminJob) => void;
  onError: (m: string) => void;
}) {
  const [sb, setSb] = useState<StoryboardDocument | null>(null);
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState("");
  const [regenBusy, setRegenBusy] = useState(false);
  const [regenScene, setRegenScene] = useState<number | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await fetch(
        `/api/admin/reels/jobs/${encodeURIComponent(jobId)}/storyboard`,
      );
      const data = await res.json();
      if (!res.ok) {
        onError(data.error ?? data.message ?? "No se pudo cargar el storyboard");
        return;
      }
      setSb(data as StoryboardDocument);
    })();
  }, [jobId, onError]);

  async function regenerateAll() {
    setRegenBusy(true);
    onError("");
    try {
      const res = await fetch(
        `/api/admin/reels/jobs/${encodeURIComponent(jobId)}/storyboard/regenerate`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(hint.trim() ? { hint: hint.trim() } : {}),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        onError(data.error ?? data.message ?? "Error al regenerar storyboard");
        return;
      }
      setSb(data as StoryboardDocument);
    } finally {
      setRegenBusy(false);
    }
  }

  async function regenerateOne(scene: number) {
    setRegenScene(scene);
    onError("");
    try {
      const res = await fetch(
        `/api/admin/reels/jobs/${encodeURIComponent(jobId)}/storyboard/${scene}/regenerate`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(hint.trim() ? { hint: hint.trim() } : {}),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        onError(data.error ?? data.message ?? "Error al regenerar escena");
        return;
      }
      setSb(data as StoryboardDocument);
    } finally {
      setRegenScene(null);
    }
  }

  async function saveAndApprove() {
    if (!sb) return;
    setBusy(true);
    onError("");
    try {
      const patchRes = await fetch(
        `/api/admin/reels/jobs/${encodeURIComponent(jobId)}/storyboard`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            scenes: sb.scenes.map((s) => ({
              scene: s.scene,
              narration: s.narration,
              durationSec: s.durationSec,
              shotType: s.shotType,
              motion: s.motion,
              transition: s.transition,
              onScreenText: s.onScreenText,
            })),
          }),
        },
      );
      if (!patchRes.ok) {
        const d = await patchRes.json();
        onError(d.error ?? d.message ?? "Error al guardar storyboard");
        return;
      }
      const approveRes = await fetch(
        `/api/admin/reels/jobs/${encodeURIComponent(jobId)}/approve-storyboard`,
        { method: "POST" },
      );
      const job = await approveRes.json();
      if (!approveRes.ok) {
        onError(job.error ?? job.message ?? "Error al aprobar storyboard");
        return;
      }
      onJobUpdate(normalizeAdminJob(job));
    } finally {
      setBusy(false);
    }
  }

  if (!sb) {
    return <p className="text-sm text-tinta-suave">Cargando storyboard…</p>;
  }

  return (
    <div>
      <h2 className="titulo-display text-xl font-semibold">Revisar storyboard</h2>
      <p className="mt-2 text-sm text-tinta-suave">
        Ajustá texto, plano, movimiento y transición. Al aprobar se proponen
        imágenes.
      </p>
      <MemoryEditor jobId={jobId} onError={onError} collapsed />
      <ul className="mt-4 space-y-5">
        {sb.scenes.map((s, idx) => (
          <li key={s.scene} className="border-t border-linea pt-4 first:border-0 first:pt-0">
            <p className="text-xs uppercase text-tinta-tenue">Escena {s.scene}</p>
            <textarea
              value={s.narration}
              rows={2}
              onChange={(e) => {
                const narration = e.target.value;
                setSb({
                  ...sb,
                  scenes: sb.scenes.map((x, i) =>
                    i === idx ? { ...x, narration } : x,
                  ),
                });
              }}
              className={`mt-2 ${FIELD}`}
            />
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <SelectField
                label="Plano"
                value={s.shotType}
                options={SHOTS}
                onChange={(shotType) =>
                  setSb({
                    ...sb,
                    scenes: sb.scenes.map((x, i) =>
                      i === idx ? { ...x, shotType } : x,
                    ),
                  })
                }
              />
              <SelectField
                label="Motion"
                value={s.motion}
                options={MOTIONS}
                onChange={(motion) =>
                  setSb({
                    ...sb,
                    scenes: sb.scenes.map((x, i) =>
                      i === idx ? { ...x, motion } : x,
                    ),
                  })
                }
              />
              <SelectField
                label="Transición"
                value={s.transition}
                options={TRANSITIONS}
                onChange={(transition) =>
                  setSb({
                    ...sb,
                    scenes: sb.scenes.map((x, i) =>
                      i === idx ? { ...x, transition } : x,
                    ),
                  })
                }
              />
            </div>
            <label className="mt-2 block text-xs text-tinta-tenue">
              Duración (s)
              <input
                type="number"
                min={1}
                step={0.5}
                value={s.durationSec}
                onChange={(e) => {
                  const durationSec = Number(e.target.value) || s.durationSec;
                  setSb({
                    ...sb,
                    scenes: sb.scenes.map((x, i) =>
                      i === idx ? { ...x, durationSec } : x,
                    ),
                  });
                }}
                className="mt-1 min-h-10 w-28 rounded-sm border border-linea bg-fondo px-2 py-1.5 text-base text-tinta sm:text-sm"
              />
            </label>
            <button
              type="button"
              disabled={regenScene === s.scene || regenBusy || busy}
              onClick={() => void regenerateOne(s.scene)}
              className={`mt-2 ${SECONDARY_BTN}`}
            >
              {regenScene === s.scene ? "Regenerando…" : "Regenerar escena con IA"}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
        <label className="block flex-1 text-xs text-tinta-tenue">
          Hint para regenerar (opcional)
          <input
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            placeholder="ej. más quieta, menos texto on-screen"
            className={FIELD}
          />
        </label>
        <button
          type="button"
          disabled={regenBusy || busy}
          onClick={() => void regenerateAll()}
          className={SECONDARY_BTN}
        >
          {regenBusy ? "Regenerando…" : "Regenerar storyboard con IA"}
        </button>
      </div>
      <ApproveButton
        label="Aprobar storyboard"
        busy={busy}
        onClick={() => void saveAndApprove()}
      />
    </div>
  );
}

function AssetsStep({
  jobId,
  onJobUpdate,
  onError,
}: {
  jobId: string;
  onJobUpdate: (job: AdminJob) => void;
  onError: (m: string) => void;
}) {
  const [doc, setDoc] = useState<JobBindingsDocument | null>(null);
  const [storyboard, setStoryboard] = useState<StoryboardDocument | null>(null);
  const [pickerScene, setPickerScene] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [aRes, sRes] = await Promise.all([
      fetch(`/api/admin/reels/jobs/${encodeURIComponent(jobId)}/assets`),
      fetch(`/api/admin/reels/jobs/${encodeURIComponent(jobId)}/storyboard`),
    ]);
    const aData = await aRes.json();
    const sData = await sRes.json();
    if (!aRes.ok) {
      onError(aData.error ?? aData.message ?? "No se pudieron cargar assets");
      return;
    }
    setDoc(aData as JobBindingsDocument);
    if (sRes.ok) setStoryboard(sData as StoryboardDocument);
  }, [jobId, onError]);

  useEffect(() => {
    void load();
  }, [load]);

  function catalogItem(id: string): JobDraftCatalogItem | undefined {
    return doc?.catalog.find((c) => c.id === id);
  }

  function setAsset(scene: number, assetId: string) {
    if (!doc) return;
    setDoc({
      ...doc,
      bindings: doc.bindings.map((b) =>
        b.scene === scene
          ? { ...b, assetId, reason: "manual", locked: true }
          : b,
      ),
    });
    setPickerScene(null);
  }

  async function saveAndApprove() {
    if (!doc) return;
    setBusy(true);
    onError("");
    try {
      const patchRes = await fetch(
        `/api/admin/reels/jobs/${encodeURIComponent(jobId)}/assets`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            scenes: doc.bindings.map((b) => ({
              scene: b.scene,
              assetId: b.assetId,
              locked: true,
            })),
          }),
        },
      );
      if (!patchRes.ok) {
        const d = await patchRes.json();
        onError(d.error ?? d.message ?? "Error al guardar imágenes");
        return;
      }
      const approveRes = await fetch(
        `/api/admin/reels/jobs/${encodeURIComponent(jobId)}/approve-assets`,
        { method: "POST" },
      );
      const job = await approveRes.json();
      if (!approveRes.ok) {
        onError(job.error ?? job.message ?? "Error al aprobar imágenes");
        return;
      }
      onJobUpdate(normalizeAdminJob(job));
    } finally {
      setBusy(false);
    }
  }

  if (!doc) {
    return <p className="text-sm text-tinta-suave">Cargando imágenes…</p>;
  }

  return (
    <div>
      <h2 className="titulo-display text-xl font-semibold">Elegir imágenes</h2>
      <p className="mt-2 text-sm text-tinta-suave">
        Confirmá o reemplazá la imagen de cada escena. Al aprobar se genera la
        voz para revisión.
      </p>
      <ul className="mt-4 space-y-5">
        {doc.bindings.map((b) => {
          const item = catalogItem(b.assetId);
          const narration = storyboard?.scenes.find(
            (s) => s.scene === b.scene,
          )?.narration;
          return (
            <li key={b.scene} className="border-t border-linea pt-4 first:border-0 first:pt-0">
              <p className="text-xs uppercase text-tinta-tenue">Escena {b.scene}</p>
              {narration && (
                <p className="mt-1 text-sm text-tinta-suave">{narration}</p>
              )}
              <div className="mt-2 flex gap-3">
                {item ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="h-28 w-20 object-cover"
                  />
                ) : (
                  <div className="flex h-28 w-20 items-center justify-center bg-fondo text-xs text-tinta-tenue">
                    —
                  </div>
                )}
                <div>
                  <p className="text-sm text-tinta">{item?.alt ?? b.assetId}</p>
                  <button
                    type="button"
                    className={`mt-2 ${SECONDARY_BTN}`}
                    onClick={() =>
                      setPickerScene(pickerScene === b.scene ? null : b.scene)
                    }
                  >
                    {pickerScene === b.scene ? "Cerrar" : "Elegir otra"}
                  </button>
                </div>
              </div>
              {pickerScene === b.scene && (
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {doc.catalog.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setAsset(b.scene, c.id)}
                      className={`overflow-hidden border ${
                        c.id === b.assetId ? "border-oro" : "border-linea"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={c.url}
                        alt={c.alt}
                        className="aspect-9/16 w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <ApproveButton
        label="Aprobar y generar voces"
        busy={busy}
        onClick={() => void saveAndApprove()}
      />
    </div>
  );
}

type VoiceSceneRow = {
  scene: number;
  narration: string;
  durationSec: number;
  fileUri: string;
};

function VoiceStep({
  jobId,
  onJobUpdate,
  onError,
}: {
  jobId: string;
  onJobUpdate: (job: AdminJob) => void;
  onError: (message: string) => void;
}) {
  const [scenes, setScenes] = useState<VoiceSceneRow[] | null>(null);
  const [edits, setEdits] = useState<Record<number, string>>({});
  const [busy, setBusy] = useState(false);
  const [regenScene, setRegenScene] = useState<number | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(
      `/api/admin/reels/jobs/${encodeURIComponent(jobId)}/voice`,
    );
    const data = await res.json();
    if (!res.ok) {
      onError(data.error ?? data.message ?? "Error al cargar voces");
      return;
    }
    const rows = data.scenes as VoiceSceneRow[];
    setScenes(rows);
    setEdits(Object.fromEntries(rows.map((r) => [r.scene, r.narration])));
  }, [jobId, onError]);

  useEffect(() => {
    void load();
  }, [load]);

  async function regenerate(scene: number) {
    setRegenScene(scene);
    onError("");
    try {
      const narration = edits[scene]?.trim();
      const res = await fetch(
        `/api/admin/reels/jobs/${encodeURIComponent(jobId)}/voice/${scene}/regenerate`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(narration ? { narration } : {}),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        onError(data.error ?? data.message ?? "Error al regenerar voz");
        return;
      }
      await load();
    } finally {
      setRegenScene(null);
    }
  }

  async function approve() {
    setBusy(true);
    onError("");
    try {
      const res = await fetch(
        `/api/admin/reels/jobs/${encodeURIComponent(jobId)}/approve-voice`,
        { method: "POST" },
      );
      const job = await res.json();
      if (!res.ok) {
        onError(job.error ?? job.message ?? "Error al aprobar voces");
        return;
      }
      onJobUpdate(normalizeAdminJob(job));
    } finally {
      setBusy(false);
    }
  }

  if (!scenes) {
    return <p className="text-sm text-tinta-suave">Cargando voces…</p>;
  }

  return (
    <div>
      <h2 className="titulo-display text-xl font-semibold">Revisar voces</h2>
      <p className="mt-2 text-sm text-tinta-suave">
        Escuchá cada escena. Podés editar la narración y regenerar solo ese
        segmento.
      </p>
      <ul className="mt-4 space-y-5">
        {scenes.map((s) => (
          <li
            key={s.scene}
            className="border-t border-linea pt-4 first:border-0 first:pt-0"
          >
            <p className="text-xs uppercase text-tinta-tenue">
              Escena {s.scene} · {s.durationSec.toFixed(1)}s
            </p>
            <textarea
              value={edits[s.scene] ?? s.narration}
              onChange={(e) =>
                setEdits((prev) => ({ ...prev, [s.scene]: e.target.value }))
              }
              rows={3}
              className={`mt-2 ${FIELD}`}
            />
            <audio
              key={`${s.scene}-${s.fileUri}`}
              controls
              className="mt-2 w-full"
              src={`/api/admin/reels/media/${encodeURIComponent(jobId)}/voice/${s.scene}`}
            />
            <button
              type="button"
              disabled={regenScene === s.scene}
              onClick={() => void regenerate(s.scene)}
              className={`mt-2 ${SECONDARY_BTN}`}
            >
              {regenScene === s.scene ? "Regenerando…" : "Regenerar voz"}
            </button>
          </li>
        ))}
      </ul>
      <ApproveButton
        label="Aprobar voces y generar preview"
        busy={busy}
        onClick={() => void approve()}
      />
    </div>
  );
}

function PreviewStep({
  jobId,
  onJobUpdate,
  onError,
}: {
  jobId: string;
  onJobUpdate: (job: AdminJob) => void;
  onError: (message: string) => void;
}) {
  const [scenes, setScenes] = useState<
    { scene: number; locked: boolean; dirty: boolean; bust: number }[] | null
  >(null);
  const [checklist, setChecklist] = useState<PreRenderChecklist | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionScene, setActionScene] = useState<number | null>(null);

  const loadChecklist = useCallback(async () => {
    const res = await fetch(
      `/api/admin/reels/jobs/${encodeURIComponent(jobId)}/checklist`,
    );
    const data = await res.json();
    if (!res.ok) {
      onError(data.error ?? data.message ?? "Error al cargar checklist");
      return;
    }
    setChecklist(data as PreRenderChecklist);
  }, [jobId, onError]);

  const load = useCallback(async () => {
    const res = await fetch(
      `/api/admin/reels/jobs/${encodeURIComponent(jobId)}/preview`,
    );
    const data = await res.json();
    if (!res.ok) {
      onError(data.error ?? data.message ?? "Error al cargar preview");
      return;
    }
    setScenes(
      (data.scenes as { scene: number; locked: boolean; dirty: boolean }[]).map(
        (s) => ({ ...s, bust: Date.now() }),
      ),
    );
    await loadChecklist();
  }, [jobId, onError, loadChecklist]);

  useEffect(() => {
    void load();
  }, [load]);

  async function toggleLock(scene: number, locked: boolean) {
    setActionScene(scene);
    onError("");
    try {
      const action = locked ? "unlock" : "lock";
      const res = await fetch(
        `/api/admin/reels/jobs/${encodeURIComponent(jobId)}/preview/${scene}/${action}`,
        { method: "POST" },
      );
      const data = await res.json();
      if (!res.ok) {
        onError(data.error ?? data.message ?? "Error al cambiar lock");
        return;
      }
      setScenes(
        (data.scenes as { scene: number; locked: boolean; dirty: boolean }[]).map(
          (s) => ({
            ...s,
            bust: scenes?.find((x) => x.scene === s.scene)?.bust ?? Date.now(),
          }),
        ),
      );
      await loadChecklist();
    } finally {
      setActionScene(null);
    }
  }

  async function regenerate(scene: number) {
    setActionScene(scene);
    onError("");
    try {
      const res = await fetch(
        `/api/admin/reels/jobs/${encodeURIComponent(jobId)}/preview/${scene}/regenerate`,
        { method: "POST" },
      );
      const data = await res.json();
      if (!res.ok) {
        onError(data.error ?? data.message ?? "Error al regenerar preview");
        return;
      }
      setScenes(
        (data.scenes as { scene: number; locked: boolean; dirty: boolean }[]).map(
          (s) => ({
            ...s,
            bust:
              s.scene === scene
                ? Date.now()
                : (scenes?.find((x) => x.scene === s.scene)?.bust ?? Date.now()),
          }),
        ),
      );
      await loadChecklist();
    } finally {
      setActionScene(null);
    }
  }

  async function approve() {
    if (checklist && !checklist.canApprove) {
      onError("Completá el checklist antes de renderizar");
      return;
    }
    setBusy(true);
    onError("");
    try {
      const res = await fetch(
        `/api/admin/reels/jobs/${encodeURIComponent(jobId)}/approve-preview`,
        { method: "POST" },
      );
      const job = await res.json();
      if (!res.ok) {
        onError(job.error ?? job.message ?? "Error al aprobar preview");
        await loadChecklist();
        return;
      }
      onJobUpdate(normalizeAdminJob(job));
    } finally {
      setBusy(false);
    }
  }

  if (!scenes) {
    return <p className="text-sm text-tinta-suave">Cargando preview…</p>;
  }

  return (
    <div>
      <h2 className="titulo-display text-xl font-semibold">Preview por escena</h2>
      <p className="mt-2 text-sm text-tinta-suave">
        Revisá el clip visual de cada escena. Bloqueá las que están bien; al
        aprobar se ensambla el MP4 final.
      </p>
      <ul className="mt-4 space-y-5">
        {scenes.map((s) => (
          <li
            key={s.scene}
            className="border-t border-linea pt-4 first:border-0 first:pt-0"
          >
            <p className="text-xs uppercase text-tinta-tenue">
              Escena {s.scene}
              {s.locked ? " · locked" : ""}
              {s.dirty ? " · dirty" : ""}
            </p>
            <video
              key={`${s.scene}-${s.bust}`}
              controls
              playsInline
              className="mt-2 aspect-9/16 max-h-72 w-full bg-fondo"
              src={`/api/admin/reels/media/${encodeURIComponent(jobId)}/preview/${s.scene}?t=${s.bust}`}
            />
            <audio
              controls
              className="mt-2 w-full"
              src={`/api/admin/reels/media/${encodeURIComponent(jobId)}/voice/${s.scene}`}
            />
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                disabled={actionScene === s.scene}
                onClick={() => void toggleLock(s.scene, s.locked)}
                className={SECONDARY_BTN}
              >
                {s.locked ? "Desbloquear" : "Bloquear"}
              </button>
              <button
                type="button"
                disabled={actionScene === s.scene || s.locked}
                onClick={() => void regenerate(s.scene)}
                className={SECONDARY_BTN}
              >
                Regenerar clip
              </button>
            </div>
          </li>
        ))}
      </ul>

      {checklist && (
        <div className="mt-6 border-t border-linea pt-4">
          <h3 className="text-sm font-semibold text-tinta">Checklist pre-render</h3>
          <ul className="mt-3 space-y-2">
            {checklist.items.map((item) => (
              <li
                key={item.id}
                className={`text-sm ${
                  item.ok
                    ? "text-tinta-suave"
                    : item.severity === "error"
                      ? "text-carmesi"
                      : "text-amber-200"
                }`}
              >
                <span className="mr-2 font-mono text-xs">
                  {item.ok ? "OK" : item.severity === "error" ? "ERR" : "WARN"}
                </span>
                {item.label}
                {item.detail ? (
                  <span className="ml-1 text-tinta-tenue">— {item.detail}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ApproveButton
        label="Aprobar y renderizar MP4"
        busy={busy}
        disabled={Boolean(checklist && !checklist.canApprove)}
        onClick={() => void approve()}
      />
      {checklist && !checklist.canApprove && (
        <p className="mt-2 text-xs text-carmesi">
          Resolvé los errores del checklist para continuar.
        </p>
      )}
    </div>
  );
}

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <label className="block text-xs text-tinta-tenue">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={FIELD_COMPACT}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function ApproveButton({
  label,
  busy,
  disabled,
  onClick,
}: {
  label: string;
  busy: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={busy || disabled}
      onClick={onClick}
      className="mt-6 flex min-h-11 w-full items-center justify-center rounded-full border border-oro/50 bg-oro/10 px-5 py-2.5 text-sm font-semibold text-oro-claro hover:bg-oro/20 disabled:opacity-50 lg:w-auto"
    >
      {busy ? "Guardando…" : label}
    </button>
  );
}
