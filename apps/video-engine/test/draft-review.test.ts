import assert from "node:assert/strict";
import { test } from "node:test";
import { createEngineRuntime } from "../src/runtime";
import { ExhibitionSchema } from "@museoargent/video-contracts";
import path from "node:path";

process.env.VIDEO_STORAGE_ROOT = path.join(process.cwd(), ".tmp", `video-engine-test-${process.pid}`);
process.env.FFMPEG_PATH = "";
process.env.FFPROBE_PATH = "";

/** Compat: legacy draft/approve en gate de assets. */
test("legacy draft/approve en awaiting_assets", async () => {
  process.env.VIDEO_USE_FAKE_PROVIDERS = "true";
  process.env.VIDEO_DATABASE_URL = "";
  process.env.DATABASE_URL = "";
  delete process.env.OPENAI_API_KEY;

  const engine = await createEngineRuntime(process.env);
  await engine.seed();

  const exhibition = ExhibitionSchema.parse({
    id: "fixture:legacy-draft",
    slug: "legacy-draft",
    title: "Legacy draft",
    summary: "Compat approve.",
    periodLabel: "1817",
    yearStart: 1817,
    yearEnd: 1817,
    chronology: [{ year: 1817, label: "A", detail: "B" }],
    characters: [],
    places: [],
    quotes: [],
    curiosities: [],
    documents: [],
    images: [{ assetId: "fixture-andes" }],
    source: { type: "manual", externalId: "legacy-draft" },
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
        credito: "t",
        alt: "Andes",
        tipo: "pintura",
      },
    },
  });

  // Avanzar hasta assets
  await engine.processOne("l1");
  await engine.approveScript(job.id);
  await engine.processOne("l2");
  await engine.approveStoryboard(job.id);
  await engine.processOne("l3");

  const paused = await engine.getJob(job.id);
  assert.equal(paused?.status, "awaiting_assets");

  const draft = await engine.getDraft(job.id);
  assert.ok(draft);

  await engine.approveJob(job.id);
  await engine.processOne("l4");
  let view = await engine.getJob(job.id);
  assert.equal(view?.status, "awaiting_voice", view?.error);
  await engine.approveVoice(job.id);
  await engine.processOne("l5");
  view = await engine.getJob(job.id);
  assert.equal(view?.status, "awaiting_preview", view?.error);
  await engine.approvePreview(job.id);
  await engine.processOne("l6");
  const finalJob = await engine.getJob(job.id);
  assert.equal(finalJob?.status, "succeeded", finalJob?.error);
});
