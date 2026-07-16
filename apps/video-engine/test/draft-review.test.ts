import assert from "node:assert/strict";
import { test } from "node:test";
import { createEngineRuntime } from "../src/runtime";
import { ExhibitionSchema } from "@museoargent/video-contracts";

test("interactive job pausa en awaiting_review y approve continúa a MP4", async () => {
  process.env.VIDEO_USE_FAKE_PROVIDERS = "true";
  process.env.VIDEO_DATABASE_URL = "";
  process.env.DATABASE_URL = "";
  delete process.env.OPENAI_API_KEY;

  const engine = await createEngineRuntime(process.env);
  await engine.seed();

  const exhibition = ExhibitionSchema.parse({
    id: "fixture:draft-review",
    slug: "draft-review",
    title: "Draft review",
    summary: "Prueba de aprobación humana.",
    periodLabel: "1817",
    yearStart: 1817,
    yearEnd: 1817,
    chronology: [{ year: 1817, label: "A", detail: "B" }],
    characters: [
      { id: "jose-de-san-martin", name: "José de San Martín", role: "protagonista" },
    ],
    places: [],
    quotes: [],
    curiosities: [],
    documents: [],
    images: [
      { assetId: "fixture-andes" },
      { assetId: "fixture-retrato-san-martin" },
    ],
    source: { type: "manual", externalId: "draft-review" },
  });

  const job = await engine.enqueue({
    exhibition,
    formatId: "reel",
    force: true,
    useFakeProviders: true,
    interactive: true,
    imageCatalog: {
      "fixture-andes": {
        id: "fixture-andes",
        url: "https://example.com/andes.jpg",
        credito: "test",
        alt: "Andes",
        tipo: "pintura",
      },
      "fixture-retrato-san-martin": {
        id: "fixture-retrato-san-martin",
        url: "https://example.com/sm.jpg",
        credito: "test",
        alt: "San Martín",
        tipo: "pintura",
      },
    },
  });

  await engine.processOne("draft-worker");
  const paused = await engine.getJob(job.id);
  assert.equal(paused?.status, "awaiting_review", paused?.error);
  assert.equal(paused?.hasDraft, true);

  const draft = await engine.getDraft(job.id);
  assert.ok(draft);
  assert.ok(draft.storyboard.scenes.length >= 1);

  const firstScene = draft.storyboard.scenes[0].scene;
  const otherAsset =
    draft.bindings[0]?.assetId === "fixture-andes"
      ? "fixture-retrato-san-martin"
      : "fixture-andes";

  const patched = await engine.patchDraft(job.id, {
    scenes: [
      {
        scene: firstScene,
        narration: "Texto corregido a mano para la escena.",
        assetId: otherAsset,
      },
    ],
  });
  const patchedScene = patched.storyboard.scenes.find(
    (s) => s.scene === firstScene,
  );
  assert.equal(patchedScene?.narration, "Texto corregido a mano para la escena.");
  const patchedBinding = patched.bindings.find((b) => b.scene === firstScene);
  assert.equal(patchedBinding?.assetId, otherAsset);

  const approved = await engine.approveJob(job.id);
  assert.equal(approved?.status, "queued");
  assert.equal(approved?.resumePhase, "render");

  await engine.processOne("render-worker");
  const finalJob = await engine.getJob(job.id);
  assert.equal(finalJob?.status, "succeeded", finalJob?.error);
  assert.ok(finalJob?.outputMp4Uri);
});
