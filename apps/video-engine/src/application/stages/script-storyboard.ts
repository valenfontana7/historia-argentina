import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  ScriptDocumentSchema,
  StoryboardDocumentSchema,
  type Exhibition,
  type ScriptDocument,
  type StoryboardDocument,
  type VideoFormatProfile,
} from "@museoargent/video-contracts";
import type { LlmProvider } from "../ports/llm-provider";

export class ScriptGenerator {
  constructor(
    private readonly llm: LlmProvider,
    private readonly promptsRoot: string,
  ) {}

  async generate(
    exhibition: Exhibition,
    profile: VideoFormatProfile,
  ): Promise<ScriptDocument> {
    const system = await loadPrompt(
      this.promptsRoot,
      profile.id,
      profile.promptVersion,
      "script",
    );
    return this.llm.completeStructured({
      system,
      user: [
        `FORMAT: ${profile.id}`,
        `TARGET_DURATION_SEC: ${profile.targetDurationSec}`,
        `TONE: ${profile.tone}`,
        `CTA: ${profile.cta}`,
        `PACE: ${profile.narrativePace}`,
        `EXHIBITION_JSON: ${JSON.stringify(exhibition)}`,
      ].join("\n"),
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
  ): Promise<StoryboardDocument> {
    const system = await loadPrompt(
      this.promptsRoot,
      profile.id,
      profile.promptVersion,
      "storyboard",
    );
    return this.llm.completeStructured({
      system,
      user: [
        `FORMAT: ${profile.id}`,
        `EXHIBITION_TITLE: ${exhibition.title}`,
        `SCRIPT_JSON: ${JSON.stringify(script)}`,
      ].join("\n"),
      schema: StoryboardDocumentSchema,
      schemaName: "StoryboardDocument",
    }).then((doc) => StoryboardDocumentSchema.parse(doc));
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
    return `Sos el guionista de MuseoArgent. Generá un guion estructurado en escenas para video vertical.
No inventes hechos. Usá solo la exhibición. Incluí CTA al final. Respondé solo con el schema.`;
  }
  return `Sos el director de storyboard de MuseoArgent. Para cada escena del guion definí plano, motion, transición y assetHint.
No inventes assets: solo hints de tipo/tags. Respondé solo con el schema.`;
}
