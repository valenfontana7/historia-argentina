import assert from "node:assert/strict";
import test from "node:test";
import { canTransitionVariant } from "../contracts";

test("production_ready puede avanzar a final_review para piezas textuales", () => {
  assert.equal(canTransitionVariant("production_ready", "final_review"), true);
});

test("autopilot schemas exigen paquete mínimo", async () => {
  const { AutopilotPackageSchema } = await import("./schemas");
  const parsed = AutopilotPackageSchema.safeParse({
    research: {
      sources: [{ type: "official", title: "Fuente oficial", isPrimary: true }],
      claims: [
        { text: "Claim uno verificable", classification: "fact", sourceIndex: 0 },
        { text: "Claim dos contextual", classification: "context" },
      ],
      scoreBreakdown: {
        freshness: 4, relevance: 4, dailyImpact: 4, sourceQuality: 4,
        visualPotential: 3, ownAngle: 4, historicalDepth: 3, saturation: 2,
      },
      scoreRationale: "Tema relevante con buenas fuentes oficiales.",
    },
    angles: [{
      brand: "labrechahoy",
      audience: "lectores",
      thesis: "Una lectura clara del impacto en el bolsillo",
      tone: "directo",
      whatHappened: "Pasó algo",
      whatChanged: "Cambió algo",
      affectedGroups: ["hogares"],
      consequences: ["impacto"],
      analysisBoundary: "Sin extrapolar",
    }],
    variants: [{
      brand: "labrechahoy",
      format: "article",
      title: "Título",
      body: "Cuerpo suficientemente largo para validar el schema.",
      claimIndexes: [0, 1],
    }],
  });
  assert.equal(parsed.success, true);
});
