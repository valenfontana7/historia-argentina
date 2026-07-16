import { readFile } from "node:fs/promises";
import {
  JobDraftPatchSchema,
  JobDraftSchema,
  type ImageCatalogEntry,
  type JobDraft,
  type JobDraftCatalogItem,
  type JobDraftPatch,
  type SceneAssetBinding,
  type StoryboardDocument,
} from "@museoargent/video-contracts";
import type { AssetLibrary } from "./ports/asset-library";
import type { ObjectStorage } from "./ports/object-storage";

export async function writeJobDraft(
  storage: ObjectStorage,
  jobId: string,
  draft: JobDraft,
): Promise<void> {
  const parsed = JobDraftSchema.parse(draft);
  await storage.put(
    `jobs/${jobId}/draft.json`,
    JSON.stringify(parsed, null, 2),
    "application/json",
  );
}

export async function readJobDraft(
  storage: ObjectStorage,
  jobId: string,
): Promise<JobDraft | null> {
  try {
    const filePath = storage.resolvePath(`jobs/${jobId}/draft.json`);
    const raw = await readFile(filePath, "utf8");
    return JobDraftSchema.parse(JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
}

export async function writeImageCatalog(
  storage: ObjectStorage,
  jobId: string,
  catalog: Record<string, ImageCatalogEntry>,
): Promise<void> {
  await storage.put(
    `jobs/${jobId}/image-catalog.json`,
    JSON.stringify(catalog, null, 2),
    "application/json",
  );
}

export async function readImageCatalog(
  storage: ObjectStorage,
  jobId: string,
): Promise<Record<string, ImageCatalogEntry>> {
  try {
    const filePath = storage.resolvePath(`jobs/${jobId}/image-catalog.json`);
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as Record<string, ImageCatalogEntry>;
  } catch {
    return {};
  }
}

export function catalogItemsFromRecord(
  catalog: Record<string, ImageCatalogEntry>,
): JobDraftCatalogItem[] {
  return Object.values(catalog).map((c) => ({
    id: c.id,
    url: c.url,
    alt: c.alt,
    tipo: c.tipo,
    credito: c.credito,
    origenVisual: c.origenVisual,
  }));
}

export function buildDraft(input: {
  storyboard: StoryboardDocument;
  bindings: SceneAssetBinding[];
  musicCategoryHint?: JobDraft["musicCategoryHint"];
  catalog: JobDraftCatalogItem[];
}): JobDraft {
  return JobDraftSchema.parse({
    storyboard: input.storyboard,
    bindings: input.bindings.map((b) => ({
      scene: b.scene,
      assetId: b.assetId,
      storageUri: b.storageUri,
      score: b.score,
      reason: b.reason,
    })),
    musicCategoryHint:
      input.musicCategoryHint ?? input.storyboard.musicCategoryHint,
    catalog: input.catalog,
  });
}

export async function applyDraftPatch(input: {
  draft: JobDraft;
  patch: unknown;
  library: AssetLibrary;
}): Promise<JobDraft> {
  const patch: JobDraftPatch = JobDraftPatchSchema.parse(input.patch);
  const catalogIds = new Set(input.draft.catalog.map((c) => c.id));
  const storyboard: StoryboardDocument = {
    ...input.draft.storyboard,
    scenes: input.draft.storyboard.scenes.map((s) => ({ ...s })),
  };
  const bindings = input.draft.bindings.map((b) => ({ ...b }));

  for (const upd of patch.scenes) {
    const scene = storyboard.scenes.find((s) => s.scene === upd.scene);
    const binding = bindings.find((b) => b.scene === upd.scene);
    if (!scene || !binding) {
      throw new Error(`Escena ${upd.scene} no existe en el borrador`);
    }
    if (upd.narration != null) {
      scene.narration = upd.narration.trim();
      if (!scene.narration) {
        throw new Error(`Narración vacía en escena ${upd.scene}`);
      }
    }
    if (upd.assetId != null) {
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
    }
  }

  return JobDraftSchema.parse({
    ...input.draft,
    storyboard,
    bindings,
  });
}

export function bindingsFromDraft(draft: JobDraft): SceneAssetBinding[] {
  return draft.bindings.map((b) => ({
    scene: b.scene,
    assetId: b.assetId,
    storageUri: b.storageUri,
    score: b.score ?? 1,
    reason: b.reason ?? "draft",
  }));
}
