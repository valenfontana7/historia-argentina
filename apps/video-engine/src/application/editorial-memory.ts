import {
  EditorialMemoryPatchSchema,
  EditorialMemorySchema,
  emptyEditorialMemory,
  type EditorialMemory,
  type EditorialMemoryPatch,
} from "@museoargent/video-contracts";
import type { ObjectStorage } from "./ports/object-storage";
import { writeJson } from "./job-artifacts";
import { readFile } from "node:fs/promises";

/** Sanitiza exhibitionId para usarlo como nombre de archivo. */
export function memoryKeyForExhibition(exhibitionId: string): string {
  const safe = exhibitionId
    .replace(/[^a-zA-Z0-9:_-]+/g, "-")
    .replace(/:/g, "__")
    .slice(0, 120);
  return `memory/${safe || "unknown"}.json`;
}

export async function readMemory(
  storage: ObjectStorage,
  exhibitionId: string,
): Promise<EditorialMemory> {
  const key = memoryKeyForExhibition(exhibitionId);
  try {
    const raw = await readFile(storage.resolvePath(key), "utf8");
    return EditorialMemorySchema.parse(JSON.parse(raw) as unknown);
  } catch {
    return emptyEditorialMemory(exhibitionId);
  }
}

export async function writeMemory(
  storage: ObjectStorage,
  memory: EditorialMemory,
): Promise<void> {
  const parsed = EditorialMemorySchema.parse({
    ...memory,
    updatedAt: new Date().toISOString(),
  });
  await writeJson(
    storage,
    memoryKeyForExhibition(parsed.exhibitionId),
    parsed,
  );
}

export async function mergeMemory(
  storage: ObjectStorage,
  exhibitionId: string,
  patch: EditorialMemoryPatch & {
    lastJobId?: string;
    preferredAssetIdsAppend?: string[];
  },
): Promise<EditorialMemory> {
  const current = await readMemory(storage, exhibitionId);
  const p = EditorialMemoryPatchSchema.parse(patch);

  let preferredAssetIds = p.preferredAssetIds ?? current.preferredAssetIds;
  if (patch.preferredAssetIdsAppend?.length) {
    const set = new Set(preferredAssetIds);
    for (const id of patch.preferredAssetIdsAppend) set.add(id);
    preferredAssetIds = [...set];
  }

  const next: EditorialMemory = {
    exhibitionId,
    notes: p.notes ?? current.notes,
    bannedWords: p.bannedWords ?? current.bannedWords,
    preferredTone:
      p.preferredTone === null
        ? undefined
        : (p.preferredTone ?? current.preferredTone),
    preferredAssetIds,
    lastJobId: patch.lastJobId ?? current.lastJobId,
    updatedAt: new Date().toISOString(),
  };
  await writeMemory(storage, next);
  return next;
}
