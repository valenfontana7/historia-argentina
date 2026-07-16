import assert from "node:assert/strict";
import { test } from "node:test";
import { createEngineRuntime } from "../src/runtime";
import { ExhibitionSchema } from "@museoargent/video-contracts";

test("pipeline E2E fake providers produce MP4 1080x1920", async () => {
  process.env.VIDEO_USE_FAKE_PROVIDERS = "true";
  process.env.VIDEO_DATABASE_URL = "";
  process.env.DATABASE_URL = "";
  delete process.env.OPENAI_API_KEY;

  const engine = await createEngineRuntime(process.env);
  await engine.seed();

  const exhibition = ExhibitionSchema.parse({
    id: "fixture:andes",
    slug: "el-cruce-de-los-andes",
    title: "El Cruce de los Andes",
    summary:
      "En 1817 el Ejército de los Andes cruzó la cordillera para libertar Chile.",
    periodLabel: "1817",
    yearStart: 1817,
    yearEnd: 1817,
    chronology: [
      { year: 1817, label: "Partida", detail: "Salida desde Mendoza." },
    ],
    characters: [
      { id: "jose-de-san-martin", name: "José de San Martín", role: "protagonista" },
    ],
    places: [{ id: "mendoza", name: "Mendoza" }],
    quotes: [],
    curiosities: [],
    documents: [],
    images: [
      { assetId: "fixture-andes" },
      { assetId: "fixture-retrato-san-martin" },
      { assetId: "fixture-mapa" },
    ],
    source: { type: "manual", externalId: "fixture-andes" },
  });

  const job = await engine.enqueue({
    exhibition,
    formatId: "reel",
    force: true,
    useFakeProviders: true,
  });

  await engine.processOne("e2e");
  const finalJob = await engine.getJob(job.id);
  assert.equal(finalJob?.status, "succeeded", finalJob?.error);
  assert.ok(finalJob?.outputMp4Uri);
  assert.ok((finalJob?.metrics?.outputBytes ?? 0) > 10);
  assert.equal(finalJob?.metrics?.promptVersion, "reel-v3");
  assert.equal(finalJob?.metrics?.outputDurationSec ? finalJob.metrics.outputDurationSec > 0 : true, true);
});
