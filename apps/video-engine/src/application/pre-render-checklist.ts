import {
  finalizePreRenderChecklist,
  type JobBindingsDocument,
  type PreRenderChecklist,
  type PreRenderChecklistItem,
  type PreviewState,
  type StoryboardDocument,
  type VoicesDocument,
} from "@museoargent/video-contracts";
import type { ObjectStorage } from "./ports/object-storage";
import {
  previewUriForScene,
  readBindings,
  readPreviewState,
  readStoryboard,
  readVoices,
} from "./job-artifacts";

export type ChecklistTarget = {
  targetDurationSec?: number;
};

export async function evaluateJobPreRenderChecklist(
  storage: ObjectStorage,
  jobId: string,
  target: ChecklistTarget = {},
): Promise<PreRenderChecklist> {
  const storyboard = await readStoryboard(storage, jobId);
  const bindings = await readBindings(storage, jobId);
  const voices = await readVoices(storage, jobId);
  const preview = await readPreviewState(storage, jobId);

  const voiceFiles: Record<number, boolean> = {};
  const previewFiles: Record<number, boolean> = {};
  if (storyboard) {
    for (const s of storyboard.scenes) {
      const track = voices?.tracks.find((t) => t.scene === s.scene);
      const voiceKey =
        track?.fileUri ?? `jobs/${jobId}/voice/scene-${s.scene}.mp3`;
      voiceFiles[s.scene] = await storage.exists(voiceKey);
      const previewKey =
        preview?.scenes.find((p) => p.scene === s.scene)?.previewUri ??
        previewUriForScene(jobId, s.scene);
      previewFiles[s.scene] = await storage.exists(previewKey);
    }
  }

  return evaluatePreRenderChecklist({
    storyboard,
    bindings,
    voices,
    preview,
    voiceFiles,
    previewFiles,
    targetDurationSec: target.targetDurationSec,
  });
}

export function evaluatePreRenderChecklist(input: {
  storyboard: StoryboardDocument | null;
  bindings: JobBindingsDocument | null;
  voices: VoicesDocument | null;
  preview: PreviewState | null;
  voiceFiles: Record<number, boolean>;
  previewFiles: Record<number, boolean>;
  targetDurationSec?: number;
}): PreRenderChecklist {
  const items: PreRenderChecklistItem[] = [];
  const scenes = input.storyboard?.scenes ?? [];

  items.push({
    id: "storyboard_scenes",
    label: "Storyboard con escenas",
    ok: scenes.length > 0,
    severity: "error",
    detail:
      scenes.length > 0
        ? `${scenes.length} escena(s)`
        : "No hay storyboard o está vacío",
  });

  const emptyNarration = scenes.filter((s) => !s.narration?.trim());
  items.push({
    id: "narration_nonempty",
    label: "Narración en todas las escenas",
    ok: scenes.length > 0 && emptyNarration.length === 0,
    severity: "error",
    detail:
      emptyNarration.length === 0
        ? undefined
        : `Vacía en escena(s): ${emptyNarration.map((s) => s.scene).join(", ")}`,
  });

  const bindingScenes = new Set(input.bindings?.bindings.map((b) => b.scene) ?? []);
  const missingBindings = scenes.filter((s) => !bindingScenes.has(s.scene));
  items.push({
    id: "bindings_complete",
    label: "Imagen asignada por escena",
    ok: scenes.length > 0 && missingBindings.length === 0,
    severity: "error",
    detail:
      missingBindings.length === 0
        ? undefined
        : `Sin binding: ${missingBindings.map((s) => s.scene).join(", ")}`,
  });

  const trackScenes = new Set(
    (input.voices?.tracks ?? [])
      .filter((t) => t.scene != null)
      .map((t) => t.scene as number),
  );
  const missingVoiceMeta = scenes.filter((s) => !trackScenes.has(s.scene));
  const missingVoiceFiles = scenes.filter((s) => !input.voiceFiles[s.scene]);
  const voicesOk =
    scenes.length > 0 &&
    missingVoiceMeta.length === 0 &&
    missingVoiceFiles.length === 0;
  items.push({
    id: "voices_complete",
    label: "Voz generada por escena",
    ok: voicesOk,
    severity: "error",
    detail: voicesOk
      ? undefined
      : [
          missingVoiceMeta.length
            ? `Sin track: ${missingVoiceMeta.map((s) => s.scene).join(", ")}`
            : null,
          missingVoiceFiles.length
            ? `Sin archivo: ${missingVoiceFiles.map((s) => s.scene).join(", ")}`
            : null,
        ]
          .filter(Boolean)
          .join("; "),
  });

  const previewByScene = new Map(
    (input.preview?.scenes ?? []).map((s) => [s.scene, s]),
  );
  const dirtyOrMissing = scenes.filter((s) => {
    const p = previewByScene.get(s.scene);
    if (!p || p.dirty) return true;
    return !input.previewFiles[s.scene];
  });
  items.push({
    id: "preview_clips",
    label: "Clips de preview listos",
    ok: scenes.length > 0 && dirtyOrMissing.length === 0,
    severity: "error",
    detail:
      dirtyOrMissing.length === 0
        ? undefined
        : `Dirty o ausente: ${dirtyOrMissing.map((s) => s.scene).join(", ")}`,
  });

  const totalDuration = scenes.reduce((n, s) => n + (s.durationSec || 0), 0);
  const target = input.targetDurationSec;
  if (target != null && target > 0 && scenes.length > 0) {
    const ratio = totalDuration / target;
    const ok = ratio >= 0.6 && ratio <= 1.4;
    items.push({
      id: "duration_vs_target",
      label: "Duración vs objetivo",
      ok,
      severity: "warn",
      detail: `${totalDuration.toFixed(1)}s vs target ${target}s (${Math.round(ratio * 100)}%)`,
    });
  } else {
    items.push({
      id: "duration_vs_target",
      label: "Duración vs objetivo",
      ok: true,
      severity: "warn",
      detail:
        scenes.length > 0
          ? `Total ${totalDuration.toFixed(1)}s (sin target)`
          : "Sin escenas",
    });
  }

  return finalizePreRenderChecklist(items);
}
