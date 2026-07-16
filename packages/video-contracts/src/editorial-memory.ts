import { z } from "zod";

export const EditorialMemorySchema = z.object({
  exhibitionId: z.string().min(1),
  notes: z.array(z.string()).default([]),
  bannedWords: z.array(z.string()).default([]),
  preferredTone: z.string().min(1).optional(),
  preferredAssetIds: z.array(z.string()).default([]),
  lastJobId: z.string().optional(),
  updatedAt: z.string().min(1),
});

export const EditorialMemoryPatchSchema = z.object({
  notes: z.array(z.string()).optional(),
  bannedWords: z.array(z.string()).optional(),
  preferredTone: z.string().min(1).nullable().optional(),
  preferredAssetIds: z.array(z.string()).optional(),
});

export const LlmRegenerateSchema = z.object({
  hint: z.string().min(1).max(500).optional(),
});

export type EditorialMemory = z.infer<typeof EditorialMemorySchema>;
export type EditorialMemoryPatch = z.infer<typeof EditorialMemoryPatchSchema>;
export type LlmRegenerate = z.infer<typeof LlmRegenerateSchema>;

export function emptyEditorialMemory(exhibitionId: string): EditorialMemory {
  return EditorialMemorySchema.parse({
    exhibitionId,
    notes: [],
    bannedWords: [],
    preferredAssetIds: [],
    updatedAt: new Date().toISOString(),
  });
}
