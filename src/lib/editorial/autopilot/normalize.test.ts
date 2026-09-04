import assert from "node:assert/strict";
import test from "node:test";
import { normalizeAutopilotPackage } from "./normalize";

test("normalizeAutopilotPackage repara respuestas malformadas del LLM", () => {
  const normalized = normalizeAutopilotPackage({
    research: {
      sources: [],
      claims: [],
      scoreBreakdown: { relevance: 4 },
      scoreRationale: "",
    },
    angles: ["labrechahoy", "museoargent"],
    variants: [
      { brand: "labrechahoy", format: "article", title: "T", body: { paragraphs: ["Párrafo uno", "Párrafo dos con más texto."] }, claimIndexes: [] },
    ],
  }, {
    title: "Tema de prueba editorial",
    summary: "Resumen suficientemente largo para validar la normalización del paquete.",
    suggestedBrands: ["labrechahoy", "museoargent"],
  }) as {
    research: { sources: unknown[]; claims: unknown[]; scoreBreakdown: Record<string, number> };
    angles: unknown[];
    variants: Array<{ body: string; claimIndexes: number[] }>;
  };

  assert.ok(normalized.research.sources.length >= 1);
  assert.ok(normalized.research.claims.length >= 2);
  assert.equal(typeof normalized.research.scoreBreakdown.freshness, "number");
  assert.equal(normalized.angles.length, 2);
  assert.equal(typeof normalized.variants[0]?.body, "string");
  assert.ok((normalized.variants[0]?.claimIndexes.length ?? 0) >= 1);
});
