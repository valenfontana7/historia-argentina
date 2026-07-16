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

  async completeStructured<T>(input: {
    system: string;
    user: string;
    schema: z.ZodType<T>;
    schemaName: string;
  }): Promise<T> {
    if (input.schemaName === "ScriptDocument") {
      const exhibition = extractExhibition(input.user);
      const beats = exhibition.chronology.slice(0, 4);
      const scenes = [
        {
          scene: 1,
          durationSec: 6,
          narration: `${exhibition.title}: ${
            beats[0]?.detail ?? exhibition.summary.slice(0, 100)
          }`,
        },
        ...beats.slice(0, 3).map((b, i) => ({
          scene: i + 2,
          durationSec: 6,
          narration: b.detail ?? b.label,
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
      // Normalize scene numbers 1..n
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
      const script = ScriptDocumentSchema.parse(
        JSON.parse(extractJsonBlock(input.user) ?? "{}"),
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
            i === 1 ? "mapa" : i === 2 ? "retrato" : i === 3 ? "documento" : "plano-general",
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

function extractExhibition(user: string): Exhibition {
  const match = user.match(/EXHIBITION_JSON:\s*(\{[\s\S]*\})\s*$/);
  if (!match) {
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
  return JSON.parse(match[1]) as Exhibition;
}

function extractJsonBlock(user: string): string | null {
  const match = user.match(/SCRIPT_JSON:\s*(\{[\s\S]*\})\s*$/);
  return match?.[1] ?? null;
}
