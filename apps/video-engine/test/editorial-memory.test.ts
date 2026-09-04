import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { createEngineRuntime } from "../src/runtime";
import { ExhibitionSchema } from "@museoargent/video-contracts";
import path from "node:path";

process.env.VIDEO_STORAGE_ROOT = path.join(process.cwd(), ".tmp", `video-engine-test-${process.pid}`);
process.env.FFMPEG_PATH = "";
process.env.FFPROBE_PATH = "";

test("editorial memory: inject + regen script/scene", async () => {
  const storageRoot = mkdtempSync(path.join(tmpdir(), "ve-memory-"));
  process.env.VIDEO_USE_FAKE_PROVIDERS = "true";
  process.env.VIDEO_STORAGE_ROOT = storageRoot;
  process.env.VIDEO_DATABASE_URL = "";
  process.env.DATABASE_URL = "";
  process.env.OPENAI_API_KEY = "";

  const engine = await createEngineRuntime(process.env);
  await engine.seed();
  assert.ok(engine.fakeLlm);

  const exhibition = ExhibitionSchema.parse({
    id: "fixture:editorial-memory",
    slug: "editorial-memory",
    title: "Memoria editorial",
    summary: "Prueba de memoria y regen parcial.",
    periodLabel: "1817",
    yearStart: 1817,
    yearEnd: 1817,
    chronology: [
      { year: 1817, label: "A", detail: "Detalle del beat A." },
      { year: 1818, label: "B", detail: "Detalle del beat B." },
      { year: 1819, label: "C", detail: "Detalle del beat C." },
    ],
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
    source: { type: "manual", externalId: "editorial-memory" },
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

  const mem = await engine.patchMemory(job.id, {
    notes: ["Priorizar tono didáctico"],
    bannedWords: ["épico", "leyenda"],
    preferredTone: "sobrio",
  });
  assert.equal(mem.preferredTone, "sobrio");
  assert.deepEqual(mem.bannedWords, ["épico", "leyenda"]);

  await engine.processOne("mem1");
  let view = await engine.getJob(job.id);
  assert.equal(view?.status, "awaiting_script");

  assert.ok(
    engine.fakeLlm.lastUserPrompt.includes("EDITORIAL_MEMORY_JSON"),
    "script generate debe inyectar memoria",
  );
  assert.ok(engine.fakeLlm.lastUserPrompt.includes("sobrio"));
  assert.ok(engine.fakeLlm.lastUserPrompt.includes("épico"));

  const regenerated = await engine.regenerateScript(job.id, {
    hint: "más corta",
  });
  assert.ok(regenerated.scenes.length >= 1);
  assert.ok(
    engine.fakeLlm.lastUserPrompt.includes("EDITORIAL_MEMORY_JSON"),
    "regen script debe inyectar memoria",
  );
  assert.ok(engine.fakeLlm.lastUserPrompt.includes("CURATOR_HINT:"));
  assert.ok(
    regenerated.scenes.some((s) => s.narration.includes("(hint)")),
    "fake LLM debe reflejar hint en narración",
  );

  await engine.approveScript(job.id);
  await engine.processOne("mem2");
  view = await engine.getJob(job.id);
  assert.equal(view?.status, "awaiting_storyboard", view?.error);

  assert.ok(
    engine.fakeLlm.lastUserPrompt.includes("EDITORIAL_MEMORY_JSON"),
    "storyboard generate debe inyectar memoria",
  );

  const sb = await engine.getStoryboard(job.id);
  assert.ok(sb, "storyboard debe existir");
  assert.ok(sb.scenes.length >= 2, `escenas=${sb.scenes.length}`);
  const targetScene = sb.scenes[0].scene;
  const otherScene = sb.scenes[1].scene;
  const otherBefore = sb.scenes.find((s) => s.scene === otherScene)!;

  const afterScene = await engine.regenerateStoryboardScene(
    job.id,
    targetScene,
    { hint: "menos texto" },
  );
  const targetAfter = afterScene.scenes.find((s) => s.scene === targetScene)!;
  const otherAfter = afterScene.scenes.find((s) => s.scene === otherScene)!;

  assert.ok(
    targetAfter.narration.includes("[regen]"),
    "escena regenerada debe cambiar",
  );
  assert.equal(
    otherAfter.narration,
    otherBefore.narration,
    "otras escenas no deben cambiar",
  );
  assert.equal(otherAfter.shotType, otherBefore.shotType);
  assert.ok(engine.fakeLlm.lastUserPrompt.includes("EDITORIAL_MEMORY_JSON"));
  assert.ok(engine.fakeLlm.lastUserPrompt.includes("TASK: Rewrite ONLY"));
});
