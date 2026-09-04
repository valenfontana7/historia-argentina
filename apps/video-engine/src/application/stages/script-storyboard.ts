import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  ScriptDocumentSchema,
  StoryboardDocumentSchema,
  type EditorialMemory,
  type Exhibition,
  type ScriptDocument,
  type StoryboardDocument,
  type VideoFormatProfile,
} from "@museoargent/video-contracts";
import type { LlmProvider } from "../ports/llm-provider";
import { videoBrandFor } from "../../branding/video-brand";

export type LlmGenOptions = {
  memory?: EditorialMemory | null;
  hint?: string;
};

function memoryPromptBlock(memory?: EditorialMemory | null): string {
  if (!memory) return "";
  const useful =
    memory.notes.length > 0 ||
    memory.bannedWords.length > 0 ||
    memory.preferredTone ||
    memory.preferredAssetIds.length > 0;
  if (!useful) return "";
  return `EDITORIAL_MEMORY_JSON: ${JSON.stringify({
    notes: memory.notes,
    bannedWords: memory.bannedWords,
    preferredTone: memory.preferredTone,
    preferredAssetIds: memory.preferredAssetIds,
  })}`;
}

function hintBlock(hint?: string): string {
  const t = hint?.trim();
  return t ? `CURATOR_HINT: ${t}` : "";
}

export class ScriptGenerator {
  constructor(
    private readonly llm: LlmProvider,
    private readonly promptsRoot: string,
  ) {}

  async generate(
    exhibition: Exhibition,
    profile: VideoFormatProfile,
    options: LlmGenOptions = {},
  ): Promise<ScriptDocument> {
    const baseSystem = await loadPrompt(
      this.promptsRoot,
      profile.id,
      profile.promptVersion,
      "script",
    );
    const brand = videoBrandFor(exhibition.brandId ?? "museoargent");
    const system = `${baseSystem}\n\nBRAND_ROLE: ${brand.promptRole}`;
    const parts = [
      `FORMAT: ${profile.id}`,
      `TARGET_DURATION_SEC: ${profile.targetDurationSec}`,
      `TONE: ${options.memory?.preferredTone ?? profile.tone}`,
      `CTA: ${profile.cta}`,
      `BRAND: ${brand.id}`,
      `PACE: ${profile.narrativePace}`,
      `EXHIBITION_JSON: ${JSON.stringify(exhibition)}`,
      memoryPromptBlock(options.memory),
      hintBlock(options.hint),
    ].filter(Boolean);
    return this.llm.completeStructured({
      system,
      user: parts.join("\n"),
      schema: ScriptDocumentSchema,
      schemaName: "ScriptDocument",
    });
  }
}

export class StoryboardGenerator {
  constructor(
    private readonly llm: LlmProvider,
    private readonly promptsRoot: string,
  ) {}

  async generate(
    exhibition: Exhibition,
    profile: VideoFormatProfile,
    script: ScriptDocument,
    options: LlmGenOptions = {},
  ): Promise<StoryboardDocument> {
    const system = await loadPrompt(
      this.promptsRoot,
      profile.id,
      profile.promptVersion,
      "storyboard",
    );
    const parts = [
      `FORMAT: ${profile.id}`,
      `EXHIBITION_TITLE: ${exhibition.title}`,
      `SCRIPT_JSON: ${JSON.stringify(script)}`,
      memoryPromptBlock(options.memory),
      hintBlock(options.hint),
    ].filter(Boolean);
    return this.llm
      .completeStructured({
        system,
        user: parts.join("\n"),
        schema: StoryboardDocumentSchema,
        schemaName: "StoryboardDocument",
      })
      .then((doc) => StoryboardDocumentSchema.parse(doc));
  }

  /** Regenera una sola escena del storyboard; el resto queda igual. */
  async regenerateScene(
    exhibition: Exhibition,
    profile: VideoFormatProfile,
    storyboard: StoryboardDocument,
    sceneNum: number,
    options: LlmGenOptions = {},
  ): Promise<StoryboardDocument> {
    const scene = storyboard.scenes.find((s) => s.scene === sceneNum);
    if (!scene) throw new Error(`Escena ${sceneNum} no existe en el storyboard`);

    const system = await loadPrompt(
      this.promptsRoot,
      profile.id,
      profile.promptVersion,
      "storyboard",
    );
    const parts = [
      `FORMAT: ${profile.id}`,
      `EXHIBITION_TITLE: ${exhibition.title}`,
      `TASK: Rewrite ONLY the following storyboard scene. Return a StoryboardDocument with exactly one scene (scene=${sceneNum}).`,
      `SCENE_JSON: ${JSON.stringify(scene)}`,
      `FULL_STORYBOARD_CONTEXT: ${JSON.stringify(storyboard)}`,
      memoryPromptBlock(options.memory),
      hintBlock(options.hint),
    ].filter(Boolean);

    const partial = await this.llm.completeStructured({
      system,
      user: parts.join("\n"),
      schema: StoryboardDocumentSchema,
      schemaName: "StoryboardDocument",
    });
    const rewritten =
      partial.scenes.find((s) => s.scene === sceneNum) ?? partial.scenes[0];
    if (!rewritten) throw new Error("LLM no devolvió escena regenerada");

    const nextScenes = storyboard.scenes.map((s) =>
      s.scene === sceneNum
        ? {
            ...rewritten,
            scene: sceneNum,
            durationSec: rewritten.durationSec || s.durationSec,
          }
        : s,
    );
    return StoryboardDocumentSchema.parse({
      ...storyboard,
      musicCategoryHint:
        partial.musicCategoryHint ?? storyboard.musicCategoryHint,
      scenes: nextScenes,
    });
  }
}

async function loadPrompt(
  root: string,
  formatId: string,
  version: string,
  kind: "script" | "storyboard",
): Promise<string> {
  const file = path.join(root, formatId, `${version}-${kind}.md`);
  try {
    return await readFile(file, "utf8");
  } catch {
    return defaultPrompt(kind);
  }
}

function defaultPrompt(kind: "script" | "storyboard"): string {
  if (kind === "script") {
    return `Sos un guionista editorial argentino. Generá un guion estructurado en escenas para video vertical.
No inventes hechos. Usá sólo la exhibición y sus fuentes. Separá hechos de análisis e incluí el CTA al final.
Si hay EDITORIAL_MEMORY_JSON, respetá notes, bannedWords y preferredTone.
Respondé sólo con el schema.`;
  }
  return `Sos un director de storyboard editorial. Para cada escena del guion definí plano, motion, transición y assetHint.
No inventes assets: solo hints de tipo/tags.
Si hay EDITORIAL_MEMORY_JSON, respetá notes, bannedWords, preferredTone y preferredAssetIds en assetHint.
Respondé solo con el schema.`;
}
