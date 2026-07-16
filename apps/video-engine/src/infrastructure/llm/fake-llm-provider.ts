import type {
  Exhibition,
  ScriptDocument,
  StoryboardDocument,
} from "@museoargent/video-contracts";
import {
  ScriptDocumentSchema,
  StoryboardDocumentSchema,
} from "@museoargent/video-contracts";
import type { z } from "zod";
import type { LlmProvider } from "../../application/ports/llm-provider";

export class FakeLlmProvider implements LlmProvider {
  readonly name = "fake";
  readonly model = "fake-v1";

  /** Último user prompt (tests de inyección de memoria). */
  lastUserPrompt = "";

  async completeStructured<T>(input: {
    system: string;
    user: string;
    schema: z.ZodType<T>;
    schemaName: string;
  }): Promise<T> {
    this.lastUserPrompt = input.user;

    if (input.schemaName === "ScriptDocument") {
      const exhibition = extractExhibition(input.user);
      const beats = exhibition.chronology.slice(0, 4);
      const hintSuffix = input.user.includes("CURATOR_HINT:")
        ? " (hint)"
        : "";
      const scenes = [
        {
          scene: 1,
          durationSec: 6,
          narration: `${exhibition.title}: ${
            beats[0]?.detail ?? exhibition.summary.slice(0, 100)
          }${hintSuffix}`,
        },
        ...beats.slice(0, 3).map((b, i) => ({
          scene: i + 2,
          durationSec: 6,
          narration: `${b.detail ?? b.label}${hintSuffix}`,
        })),
        {
          scene: Math.min(6, beats.length + 2),
          durationSec: 5,
          narration: exhibition.characters[0]
            ? `${exhibition.characters[0].name} marca el rumbo de esta historia.`
            : "Un capítulo decisivo de la historia argentina.",
        },
        {
          scene: Math.min(7, beats.length + 3),
          durationSec: 4,
          narration: "Seguí explorando en MuseoArgent.",
        },
      ];
      const doc: ScriptDocument = {
        musicCategoryHint: "epica",
        scenes: scenes.slice(0, 6).map((s, i) => ({
          ...s,
          scene: i + 1,
          narration: s.narration.slice(0, 220),
        })),
      };
      return ScriptDocumentSchema.parse(doc) as T;
    }

    if (input.schemaName === "StoryboardDocument") {
      if (input.user.includes("TASK: Rewrite ONLY")) {
        const sceneRaw = extractLabeledJson(input.user, "SCENE_JSON");
        const scene = sceneRaw
          ? (JSON.parse(sceneRaw) as StoryboardDocument["scenes"][number])
          : null;
        if (!scene) throw new Error("FakeLlm: SCENE_JSON missing");
        const hintNote = input.user.includes("CURATOR_HINT:")
          ? " [regen]"
          : " [regen]";
        const doc: StoryboardDocument = {
          musicCategoryHint: "epica",
          scenes: [
            {
              ...scene,
              narration: `${scene.narration}${hintNote}`.slice(0, 220),
              shotType: scene.shotType === "retrato" ? "plano-general" : "retrato",
            },
          ],
        };
        return StoryboardDocumentSchema.parse(doc) as T;
      }

      const scriptRaw = extractLabeledJson(input.user, "SCRIPT_JSON");
      const script = ScriptDocumentSchema.parse(
        JSON.parse(scriptRaw ?? "{}"),
      );
      const motions = [
        "kenBurns",
        "zoomIn",
        "panRight",
        "zoomOut",
        "kenBurns",
        "static",
      ] as const;
      const doc: StoryboardDocument = {
        musicCategoryHint: script.musicCategoryHint ?? "epica",
        scenes: script.scenes.map((s, i) => ({
          scene: s.scene,
          durationSec: s.durationSec,
          narration: s.narration,
          shotType:
            i === 1
              ? "mapa"
              : i === 2
                ? "retrato"
                : i === 3
                  ? "documento"
                  : "plano-general",
          assetHint: {
            preferredTypes:
              i === 1
                ? ["mapa"]
                : i === 2
                  ? ["retrato", "pintura"]
                  : i === 3
                    ? ["documento", "pintura"]
                    : ["pintura", "fotografia"],
            tags: [],
            characters: [],
            places: [],
          },
          motion: motions[i % motions.length],
          transition: i === 0 ? "fade" : "crossfade",
          onScreenText:
            i === 0
              ? undefined
              : i === script.scenes.length - 1
                ? "MuseoArgent"
                : s.narration.split(/[.:,]/)[0]?.slice(0, 32) || undefined,
        })),
      };
      return StoryboardDocumentSchema.parse(doc) as T;
    }

    throw new Error(`FakeLlmProvider: unsupported schema ${input.schemaName}`);
  }
}

function extractLabeledJson(user: string, label: string): string | null {
  const marker = `${label}:`;
  const idx = user.indexOf(marker);
  if (idx < 0) return null;
  const start = user.indexOf("{", idx + marker.length);
  if (start < 0) return null;
  let depth = 0;
  for (let i = start; i < user.length; i++) {
    const ch = user[i];
    if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return user.slice(start, i + 1);
    }
  }
  return null;
}

function extractExhibition(user: string): Exhibition {
  const raw = extractLabeledJson(user, "EXHIBITION_JSON");
  if (!raw) {
    return {
      id: "unknown",
      slug: "unknown",
      title: "Historia argentina",
      summary: "Una historia del museo.",
      chronology: [],
      characters: [],
      places: [],
      quotes: [],
      curiosities: [],
      documents: [],
      images: [],
      source: { type: "manual", externalId: "unknown" },
    };
  }
  return JSON.parse(raw) as Exhibition;
}
