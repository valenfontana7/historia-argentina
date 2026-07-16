import { copyFile, mkdir, unlink } from "node:fs/promises";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  AssetsPatchSchema,
  JobBindingsDocumentSchema,
  JobDraftSchema,
  PreviewStateSchema,
  ScriptDocumentSchema,
  ScriptPatchSchema,
  StoryboardDocumentSchema,
  StoryboardPatchSchema,
  VersionsManifestSchema,
  VoicesDocumentSchema,
  type ImageCatalogEntry,
  type JobBindingsDocument,
  type JobDraft,
  type JobDraftCatalogItem,
  type PreviewState,
  type SceneAssetBinding,
  type ScriptDocument,
  type StoryboardDocument,
  type VersionEntry,
  type VersionPhase,
  type VersionsManifest,
  type VoicesDocument,
} from "@museoargent/video-contracts";
import type { AssetLibrary } from "./ports/asset-library";
import type { ObjectStorage } from "./ports/object-storage";
import {
  catalogItemsFromRecord,
  readImageCatalog,
} from "./job-draft";

export async function writeJson(
  storage: ObjectStorage,
  key: string,
  data: unknown,
): Promise<void> {
  await storage.put(key, JSON.stringify(data, null, 2), "application/json");
}

async function readJson<T>(
  storage: ObjectStorage,
  key: string,
  parse: (raw: unknown) => T,
): Promise<T | null> {
  try {
    const filePath = storage.resolvePath(key);
    const raw = await readFile(filePath, "utf8");
    return parse(JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
}

export async function writeScript(
  storage: ObjectStorage,
  jobId: string,
  script: ScriptDocument,
): Promise<void> {
  await writeJson(
    storage,
    `jobs/${jobId}/script.json`,
    ScriptDocumentSchema.parse(script),
  );
}

export async function readScript(
  storage: ObjectStorage,
  jobId: string,
): Promise<ScriptDocument | null> {
  return readJson(storage, `jobs/${jobId}/script.json`, (r) =>
    ScriptDocumentSchema.parse(r),
  );
}

export async function writeStoryboard(
  storage: ObjectStorage,
  jobId: string,
  storyboard: StoryboardDocument,
): Promise<void> {
  await writeJson(
    storage,
    `jobs/${jobId}/storyboard.json`,
    StoryboardDocumentSchema.parse(storyboard),
  );
}

export async function readStoryboard(
  storage: ObjectStorage,
  jobId: string,
): Promise<StoryboardDocument | null> {
  const direct = await readJson(storage, `jobs/${jobId}/storyboard.json`, (r) =>
    StoryboardDocumentSchema.parse(r),
  );
  if (direct) return direct;
  const draft = await readJson(storage, `jobs/${jobId}/draft.json`, (r) =>
    JobDraftSchema.parse(r),
  );
  return draft?.storyboard ?? null;
}

export async function writeBindings(
  storage: ObjectStorage,
  jobId: string,
  doc: JobBindingsDocument,
): Promise<void> {
  const parsed = JobBindingsDocumentSchema.parse(doc);
  await writeJson(storage, `jobs/${jobId}/bindings.json`, parsed);
  // Compat: también draft.json combinado
  const storyboard = await readStoryboard(storage, jobId);
  if (storyboard) {
    await writeJson(storage, `jobs/${jobId}/draft.json`, {
      storyboard,
      bindings: parsed.bindings,
      musicCategoryHint: parsed.musicCategoryHint,
      catalog: parsed.catalog,
    });
  }
}

export async function readBindings(
  storage: ObjectStorage,
  jobId: string,
): Promise<JobBindingsDocument | null> {
  const direct = await readJson(storage, `jobs/${jobId}/bindings.json`, (r) =>
    JobBindingsDocumentSchema.parse(r),
  );
  if (direct) return direct;
  const draft = await readJson(storage, `jobs/${jobId}/draft.json`, (r) =>
    JobDraftSchema.parse(r),
  );
  if (!draft) return null;
  return {
    bindings: draft.bindings,
    catalog: draft.catalog,
    musicCategoryHint: draft.musicCategoryHint,
  };
}

export async function enrichBindingsCatalog(
  storage: ObjectStorage,
  jobId: string,
  doc: JobBindingsDocument,
): Promise<JobBindingsDocument> {
  if (doc.catalog.length) return doc;
  const catalog = catalogItemsFromRecord(await readImageCatalog(storage, jobId));
  return { ...doc, catalog };
}

export function applyScriptPatch(
  script: ScriptDocument,
  patch: unknown,
): ScriptDocument {
  const p = ScriptPatchSchema.parse(patch);
  const scenes = script.scenes.map((s) => ({ ...s }));
  for (const upd of p.scenes) {
    const scene = scenes.find((s) => s.scene === upd.scene);
    if (!scene) throw new Error(`Escena ${upd.scene} no existe en el script`);
    if (upd.narration != null) {
      scene.narration = upd.narration.trim();
      if (!scene.narration) throw new Error(`Narración vacía en escena ${upd.scene}`);
    }
    if (upd.durationSec != null) scene.durationSec = upd.durationSec;
  }
  return ScriptDocumentSchema.parse({ ...script, scenes });
}

export function applyStoryboardPatch(
  storyboard: StoryboardDocument,
  patch: unknown,
): StoryboardDocument {
  const p = StoryboardPatchSchema.parse(patch);
  let scenes = storyboard.scenes.map((s) => ({ ...s }));

  if (p.scenes) {
    for (const upd of p.scenes) {
      const scene = scenes.find((s) => s.scene === upd.scene);
      if (!scene) throw new Error(`Escena ${upd.scene} no existe en el storyboard`);
      if (upd.narration != null) {
        scene.narration = upd.narration.trim();
        if (!scene.narration) {
          throw new Error(`Narración vacía en escena ${upd.scene}`);
        }
      }
      if (upd.durationSec != null) scene.durationSec = upd.durationSec;
      if (upd.shotType != null) scene.shotType = upd.shotType;
      if (upd.motion != null) scene.motion = upd.motion;
      if (upd.transition != null) scene.transition = upd.transition;
      if (upd.onScreenText !== undefined) scene.onScreenText = upd.onScreenText;
    }
  }

  if (p.order?.length) {
    const byNum = new Map(scenes.map((s) => [s.scene, s]));
    if (p.order.length !== scenes.length) {
      throw new Error("order debe incluir todas las escenas");
    }
    const next = p.order.map((n) => {
      const s = byNum.get(n);
      if (!s) throw new Error(`Escena ${n} no existe para reorder`);
      return s;
    });
    scenes = next.map((s, i) => ({ ...s, scene: i + 1 }));
  }

  return StoryboardDocumentSchema.parse({ ...storyboard, scenes });
}

export async function applyAssetsPatch(input: {
  doc: JobBindingsDocument;
  patch: unknown;
  library: AssetLibrary;
}): Promise<JobBindingsDocument> {
  const p = AssetsPatchSchema.parse(input.patch);
  const catalogIds = new Set(input.doc.catalog.map((c) => c.id));
  const bindings = input.doc.bindings.map((b) => ({ ...b }));

  for (const upd of p.scenes) {
    const binding = bindings.find((b) => b.scene === upd.scene);
    if (!binding) throw new Error(`Escena ${upd.scene} no tiene binding`);
    if (catalogIds.size && !catalogIds.has(upd.assetId)) {
      throw new Error(
        `Asset ${upd.assetId} no está en el catálogo de la exhibición`,
      );
    }
    const asset = await input.library.getById(upd.assetId);
    if (!asset?.storageUri) {
      throw new Error(`Asset ${upd.assetId} no encontrado en la library`);
    }
    binding.assetId = upd.assetId;
    binding.storageUri = asset.storageUri;
    binding.score = 1;
    binding.reason = "manual";
    binding.locked = upd.locked ?? true;
  }

  return JobBindingsDocumentSchema.parse({
    ...input.doc,
    bindings,
  });
}

export function bindingsToSceneAssets(
  doc: JobBindingsDocument,
): SceneAssetBinding[] {
  return doc.bindings.map((b) => ({
    scene: b.scene,
    assetId: b.assetId,
    storageUri: b.storageUri,
    score: b.score ?? 1,
    reason: b.reason ?? "draft",
  }));
}

export function buildBindingsDoc(input: {
  bindings: SceneAssetBinding[];
  catalog: JobDraftCatalogItem[];
  musicCategoryHint?: JobBindingsDocument["musicCategoryHint"];
}): JobBindingsDocument {
  return JobBindingsDocumentSchema.parse({
    bindings: input.bindings.map((b) => ({
      scene: b.scene,
      assetId: b.assetId,
      storageUri: b.storageUri,
      score: b.score,
      reason: b.reason,
      locked: false,
    })),
    catalog: input.catalog,
    musicCategoryHint: input.musicCategoryHint,
  });
}

export async function writeVoices(
  storage: ObjectStorage,
  jobId: string,
  doc: VoicesDocument,
): Promise<void> {
  await writeJson(
    storage,
    `jobs/${jobId}/voices.json`,
    VoicesDocumentSchema.parse(doc),
  );
}

export async function readVoices(
  storage: ObjectStorage,
  jobId: string,
): Promise<VoicesDocument | null> {
  return readJson(storage, `jobs/${jobId}/voices.json`, (r) =>
    VoicesDocumentSchema.parse(r),
  );
}

export async function writePreviewState(
  storage: ObjectStorage,
  jobId: string,
  state: PreviewState,
): Promise<void> {
  await writeJson(
    storage,
    `jobs/${jobId}/preview.json`,
    PreviewStateSchema.parse(state),
  );
}

export async function readPreviewState(
  storage: ObjectStorage,
  jobId: string,
): Promise<PreviewState | null> {
  return readJson(storage, `jobs/${jobId}/preview.json`, (r) =>
    PreviewStateSchema.parse(r),
  );
}

export function previewUriForScene(jobId: string, scene: number): string {
  return `jobs/${jobId}/preview/scene-${scene}.mp4`;
}

/** Marca dirty + unlock y borra el clip de preview de una escena. */
export async function invalidatePreviewScene(
  storage: ObjectStorage,
  jobId: string,
  scene: number,
): Promise<void> {
  const state = await readPreviewState(storage, jobId);
  if (state) {
    const next: PreviewState = {
      scenes: state.scenes.map((s) =>
        s.scene === scene
          ? { ...s, dirty: true, locked: false }
          : s,
      ),
    };
    await writePreviewState(storage, jobId, next);
  }
  const key = previewUriForScene(jobId, scene);
  try {
    await unlink(storage.resolvePath(key));
  } catch {
    /* clip ausente */
  }
}

const VERSION_FILES: Record<VersionPhase, string[]> = {
  script: ["script.json"],
  storyboard: ["storyboard.json"],
  assets: ["bindings.json", "draft.json"],
  voice: ["voices.json"],
  preview: ["preview.json", "manifest.json"],
};

export async function readVersionsManifest(
  storage: ObjectStorage,
  jobId: string,
): Promise<VersionsManifest> {
  const direct = await readJson(
    storage,
    `jobs/${jobId}/versions/manifest.json`,
    (r) => VersionsManifestSchema.parse(r),
  );
  return direct ?? { next: 1, entries: [] };
}

export async function listVersions(
  storage: ObjectStorage,
  jobId: string,
): Promise<VersionsManifest> {
  return readVersionsManifest(storage, jobId);
}

/** Copia artefactos JSON de la fase a versions/<n>-<phase>/. */
export async function snapshotVersion(
  storage: ObjectStorage,
  jobId: string,
  phase: VersionPhase,
): Promise<VersionEntry> {
  const manifest = await readVersionsManifest(storage, jobId);
  const n = manifest.next;
  const dir = `jobs/${jobId}/versions/${n}-${phase}`;
  const absDir = storage.resolvePath(dir);
  await mkdir(absDir, { recursive: true });

  for (const file of VERSION_FILES[phase]) {
    const srcKey = `jobs/${jobId}/${file}`;
    if (!(await storage.exists(srcKey))) continue;
    const dest = path.join(absDir, file);
    try {
      await copyFile(storage.resolvePath(srcKey), dest);
    } catch {
      /* archivo ausente entre exists y copy */
    }
  }

  const entry: VersionEntry = {
    n,
    phase,
    at: new Date().toISOString(),
    dir,
  };
  const nextManifest = VersionsManifestSchema.parse({
    next: n + 1,
    entries: [...manifest.entries, entry],
  });
  await writeJson(storage, `jobs/${jobId}/versions/manifest.json`, nextManifest);
  return entry;
}

export type { JobDraft, ImageCatalogEntry };
