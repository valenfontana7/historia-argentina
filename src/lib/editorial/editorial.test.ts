import assert from "node:assert/strict";
import test from "node:test";
import { calculateEditorialScore } from "./scoring";
import { canTransitionAngle, canTransitionStory, canTransitionVariant, LaBrechaBriefSchema, MuseoArgentBriefSchema, storyNextStatuses, angleNextStatuses, variantNextStatuses } from "./contracts";
import { parallelEditorialFixture } from "./fixture";
import { editorialVariantToExhibition } from "./media";

test("score explica saturación invertida y normaliza a 0-100", () => {
  assert.equal(calculateEditorialScore({ freshness: 5, relevance: 5, dailyImpact: 5, sourceQuality: 5, visualPotential: 5, ownAngle: 5, historicalDepth: 5, saturation: 0 }), 100);
  assert.ok(calculateEditorialScore({ freshness: 1, relevance: 1, dailyImpact: 1, sourceQuality: 1, visualPotential: 1, ownAngle: 1, historicalDepth: 1, saturation: 5 }) < 25);
});

test("workflow blocks skips and preserves human gates", () => {
  assert.equal(canTransitionStory("discovered", "researching"), false);
  assert.equal(canTransitionStory("triaged", "researching"), true);
  assert.equal(canTransitionVariant("production_ready", "approved"), false);
  assert.equal(canTransitionVariant("final_review", "approved"), true);
});

test("fixture keeps independent brand theses", () => {
  assert.equal(parallelEditorialFixture.synthetic, true);
  assert.notEqual(parallelEditorialFixture.angles.museoargent.thesis, parallelEditorialFixture.angles.labrechahoy.thesis);
});

test("media adapter carries brand and evidence context into existing Exhibition contract", () => {
  const exhibition = editorialVariantToExhibition({ storyId: "story-1", variantId: "variant-1", brand: "labrechahoy", title: "Dato", body: "Explicación", claims: ["claim-1"], sourceNotes: ["Fuente oficial"] });
  assert.equal(exhibition.brandId, "labrechahoy");
  assert.equal(exhibition.source.type, "editorial_story");
  assert.deepEqual(exhibition.editorialContext?.claims, ["claim-1"]);
});

test("fact-check workflow exposes only the human verification path", () => {
  assert.equal(canTransitionVariant("fact_check_pending", "fact_checked"), true);
  assert.equal(canTransitionVariant("fact_checked", "rendered"), false);
});

test("máquinas de estado cubren todos los estados y rechazan saltos", () => {
  assert.deepEqual(storyNextStatuses("discovered"), ["triaged", "rejected"]);
  assert.deepEqual(angleNextStatuses("proposed"), ["approved", "needs_revision", "rejected"]);
  assert.deepEqual(variantNextStatuses("approved"), ["published", "needs_revision"]);
  assert.equal(canTransitionVariant("production_ready", "final_review"), true);
  assert.equal(canTransitionAngle("rejected", "approved"), false);
  assert.equal(canTransitionVariant("drafted", "rendered"), false);
});

test("briefs estructurados obligan límites y contexto por marca", () => {
  assert.equal(LaBrechaBriefSchema.safeParse({ brand: "labrechahoy", audience: "lectores", thesis: "Una explicación concreta y verificable", tone: "sobrio", whatHappened: "Pasó algo", whatChanged: "Cambió algo", affectedGroups: ["trabajadores"], consequences: ["impacto"], analysisBoundary: "No extrapolar" }).success, true);
  assert.equal(MuseoArgentBriefSchema.safeParse({ brand: "museoargent", audience: "curiosos", thesis: "Un paralelo con límites explícitos", tone: "histórico", historicalAntecedent: "Antecedente", periodContext: "Contexto", similarities: ["similitud"], differences: ["diferencia"], comparisonLimits: ["límite"], editorialReason: "Aporta contexto" }).success, true);
});
