import assert from "node:assert/strict";
import { test } from "node:test";
import { createEngineRuntime } from "../src/runtime";
import { ExhibitionSchema } from "@museoargent/video-contracts";
import {
  readPreviewState,
  writePreviewState,
} from "../src/application/job-artifacts";

test("multi-gate: script → storyboard → assets → voice → preview → render", async () => {
  process.env.VIDEO_USE_FAKE_PROVIDERS = "true";
  process.env.VIDEO_DATABASE_URL = "";
  process.env.DATABASE_URL = "";
  delete process.env.OPENAI_API_KEY;

  const engine = await createEngineRuntime(process.env);
  await engine.seed();

  const exhibition = ExhibitionSchema.parse({
    id: "fixture:multi-gate",
    slug: "multi-gate",
    title: "Multi gate",
    summary: "Prueba de cinco aprobaciones.",
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
    source: { type: "manual", externalId: "multi-gate" },
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

  await engine.processOne("g1");
  let view = await engine.getJob(job.id);
  assert.equal(view?.status, "awaiting_script");

  const script = await engine.getScript(job.id);
  assert.ok(script && script.scenes.length >= 1);
  const first = script.scenes[0].scene;
  await engine.patchScript(job.id, {
    scenes: [{ scene: first, narration: "Narración editada en gate script." }],
  });
  await engine.approveScript(job.id);

  await engine.processOne("g2");
  view = await engine.getJob(job.id);
  assert.equal(view?.status, "awaiting_storyboard");

  const sb = await engine.getStoryboard(job.id);
  assert.ok(sb);
  await engine.patchStoryboard(job.id, {
    scenes: [
      {
        scene: sb.scenes[0].scene,
        narration: "Narración en storyboard editada.",
        shotType: "plano-general",
      },
    ],
  });
  await engine.approveStoryboard(job.id);

  await engine.processOne("g3");
  view = await engine.getJob(job.id);
  assert.equal(view?.status, "awaiting_assets");

  const assets = await engine.getAssetsDoc(job.id);
  assert.ok(assets);
  const bind = assets.bindings[0];
  const other =
    bind.assetId === "fixture-andes"
      ? "fixture-retrato-san-martin"
      : "fixture-andes";
  await engine.patchAssetsDoc(job.id, {
    scenes: [{ scene: bind.scene, assetId: other, locked: true }],
  });
  await engine.approveAssets(job.id);

  await engine.processOne("g4");
  view = await engine.getJob(job.id);
  assert.equal(view?.status, "awaiting_voice", view?.error);

  const voiceDoc = await engine.getVoiceDoc(job.id);
  assert.ok(voiceDoc && voiceDoc.scenes.length >= 1);
  const voiceScene = voiceDoc.scenes[0].scene;
  await engine.regenerateVoiceScene(job.id, voiceScene, {
    narration: "Narración regenerada en gate voice.",
  });
  const voiceAfter = await engine.getVoiceDoc(job.id);
  assert.equal(
    voiceAfter?.scenes.find((s) => s.scene === voiceScene)?.narration,
    "Narración regenerada en gate voice.",
  );
  await engine.approveVoice(job.id);

  await engine.processOne("g5");
  view = await engine.getJob(job.id);
  assert.equal(view?.status, "awaiting_preview", view?.error);

  const preview = await engine.getPreviewState(job.id);
  assert.ok(preview && preview.scenes.length >= 1);
  const prevScene = preview.scenes[0].scene;
  await engine.setPreviewLock(job.id, prevScene, true);
  const locked = await engine.getPreviewState(job.id);
  assert.equal(locked?.scenes.find((s) => s.scene === prevScene)?.locked, true);

  if (preview.scenes.length > 1) {
    const unlocked = preview.scenes.find((s) => s.scene !== prevScene)!;
    await engine.regeneratePreviewScene(job.id, unlocked.scene);
  }

  let checklist = await engine.getChecklist(job.id);
  assert.equal(checklist.canApprove, true, JSON.stringify(checklist.items));

  const dirtyState = await readPreviewState(engine.storage, job.id);
  assert.ok(dirtyState);
  await writePreviewState(engine.storage, job.id, {
    scenes: dirtyState.scenes.map((s) =>
      s.scene === prevScene ? { ...s, dirty: true, locked: false } : s,
    ),
  });
  checklist = await engine.getChecklist(job.id);
  assert.equal(checklist.canApprove, false);
  await assert.rejects(
    () => engine.approvePreview(job.id),
    /Checklist incompleto/,
  );

  await writePreviewState(engine.storage, job.id, dirtyState);
  await engine.setPreviewLock(job.id, prevScene, true);
  checklist = await engine.getChecklist(job.id);
  assert.equal(checklist.canApprove, true);

  const versionsBefore = await engine.getVersions(job.id);
  assert.ok(versionsBefore.entries.length >= 4);
  assert.ok(versionsBefore.entries.some((e) => e.phase === "script"));
  assert.ok(versionsBefore.entries.some((e) => e.phase === "voice"));

  await engine.approvePreview(job.id);
  const versionsAfter = await engine.getVersions(job.id);
  assert.ok(versionsAfter.entries.some((e) => e.phase === "preview"));

  await engine.processOne("g6");
  view = await engine.getJob(job.id);
  assert.equal(view?.status, "succeeded", view?.error);
  assert.ok(view?.outputMp4Uri);
});
