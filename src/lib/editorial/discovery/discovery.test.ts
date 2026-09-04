import assert from "node:assert/strict";
import test from "node:test";
import { dedupeCandidates, dedupeKeyFromParts, rankCandidates, slugifyTitle } from "./dedupe";
import type { TopicCandidate } from "./types";

const sample: TopicCandidate = {
  dedupeKey: dedupeKeyFromParts("test", "a"),
  title: "Tema A",
  summary: "Resumen de prueba con suficiente longitud.",
  slug: slugifyTitle("Tema A"),
  tags: ["test"],
  discoverySource: "macro",
  discoveryMeta: { ingestor: "macro" },
  suggestedBrands: ["labrechahoy"],
  scoreHints: { freshness: 5, relevance: 4, dailyImpact: 4, sourceQuality: 4, visualPotential: 3, ownAngle: 3, historicalDepth: 2, saturation: 2 },
};

test("slugifyTitle normaliza acentos y espacios", () => {
  assert.equal(slugifyTitle("Medida Económica 2026"), "medida-economica-2026");
});

test("dedupeCandidates elimina duplicados por dedupeKey", () => {
  const dup = { ...sample, title: "Otro título" };
  const unique = dedupeCandidates([sample, dup]);
  assert.equal(unique.length, 1);
});

test("rankCandidates ordena por scoreHints", () => {
  const weak = { ...sample, dedupeKey: dedupeKeyFromParts("weak"), scoreHints: { freshness: 1 } };
  const ranked = rankCandidates([weak, sample]);
  assert.equal(ranked[0]?.title, "Tema A");
});
