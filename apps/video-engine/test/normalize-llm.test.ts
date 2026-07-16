import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ScriptDocumentSchema,
  StoryboardDocumentSchema,
} from "@museoargent/video-contracts";
import { normalizeLlmPayload } from "../src/infrastructure/llm/normalize-llm-payload";

test("normalizeLlmPayload mapea text/number a narration/scene", () => {
  const normalized = normalizeLlmPayload("ScriptDocument", {
    scenes: [
      { number: 1, duration: 6, text: "Hook del cruce." },
      { id: 2, seconds: 5, dialogue: "San Martín lidera." },
    ],
    music_category: "epica",
  });
  const parsed = ScriptDocumentSchema.parse(normalized);
  assert.equal(parsed.scenes[0].scene, 1);
  assert.equal(parsed.scenes[0].narration, "Hook del cruce.");
  assert.equal(parsed.scenes[1].narration, "San Martín lidera.");
  assert.equal(parsed.musicCategoryHint, "epica");
});

test("normalizeLlmPayload unwrappea wrapper script", () => {
  const normalized = normalizeLlmPayload("ScriptDocument", {
    script: {
      scenes: [{ scene: 1, durationSec: 4, narration: "Ok" }],
    },
  });
  const parsed = ScriptDocumentSchema.parse(normalized);
  assert.equal(parsed.scenes.length, 1);
});

test("normalizeLlmPayload mapea plano-detalle a detalle", () => {
  const normalized = normalizeLlmPayload("StoryboardDocument", {
    scenes: [
      {
        scene: 1,
        durationSec: 5,
        narration: "Detalle del paso.",
        shotType: "plano-detalle",
        motion: "zoom-in",
        transition: "cross-fade",
        assetHint: { preferredTypes: ["painting"], tags: [] },
      },
    ],
  });
  const parsed = StoryboardDocumentSchema.parse(normalized);
  assert.equal(parsed.scenes[0].shotType, "detalle");
  assert.equal(parsed.scenes[0].motion, "zoomIn");
  assert.equal(parsed.scenes[0].transition, "crossfade");
  assert.deepEqual(parsed.scenes[0].assetHint.preferredTypes, ["pintura"]);
});
