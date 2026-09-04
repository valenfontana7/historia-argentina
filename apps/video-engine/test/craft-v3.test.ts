import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildCoverFilter,
  buildSceneLookFilters,
  buildZoompan,
  mapXfade,
  motionIntensityForScene,
  orientationFromSize,
  shotTypeAssetBoost,
  shouldUseBlurBackground,
} from "../src/infrastructure/ffmpeg/ffmpeg-craft";
import { splitNarrationIntoCues, toAss } from "../src/application/stages/subtitle-splitter";
import {
  REEL_FONT_FILE,
  REEL_FONTS_DIR,
} from "../src/infrastructure/ffmpeg/reel-fonts";
import { access } from "node:fs/promises";

// These assertions exercise the full craft path even when the developer .env
// defaults the VPS runtime to fast mode.
process.env.VIDEO_RENDER_FAST = "0";

test("orientationFromSize clasifica landscape/vertical/square", () => {
  assert.equal(orientationFromSize(1920, 1080), "horizontal");
  assert.equal(orientationFromSize(1080, 1920), "vertical");
  assert.equal(orientationFromSize(1000, 1000), "square");
  assert.equal(shouldUseBlurBackground("horizontal"), true);
  assert.equal(shouldUseBlurBackground("vertical"), false);
});

test("mapXfade diferencia cut fade crossfade", () => {
  assert.equal(mapXfade("cut").duration, 0.05);
  assert.equal(mapXfade("fade").transition, "fade");
  assert.equal(mapXfade("crossfade").transition, "dissolve");
});

test("buildZoompan honra intensity", () => {
  const soft = buildZoompan("zoomIn", 5, 30, 0.08);
  const hard = buildZoompan("zoomIn", 5, 30, 0.2);
  assert.match(soft, /zoompan/);
  assert.match(hard, /zoompan/);
  assert.notEqual(soft, hard);
  assert.equal(buildZoompan("static", 5, 30), "null");
});

test("motionIntensityForScene más alto en gancho", () => {
  assert.ok(
    motionIntensityForScene({
      sceneIndex: 0,
      shotType: "plano-general",
      motion: "kenBurns",
    }) >
      motionIntensityForScene({
        sceneIndex: 2,
        shotType: "retrato",
        motion: "kenBurns",
      }),
  );
  assert.equal(
    motionIntensityForScene({
      sceneIndex: 2,
      shotType: "retrato",
      motion: "kenBurns",
    }),
    0.08,
  );
});

test("shotTypeAssetBoost prioriza retrato", () => {
  assert.ok(shotTypeAssetBoost("retrato", "retrato") > 0);
  assert.equal(shotTypeAssetBoost("mapa", "retrato"), 0);
});

test("craft v3.1 look: noise suave + lanczos en cover", () => {
  const look = buildSceneLookFilters().join(",");
  assert.match(look, /noise=alls=2/);
  assert.doesNotMatch(look, /alls=4/);
  assert.match(buildCoverFilter(), /flags=lanczos/);
});

test("fuente Inter embebida existe", async () => {
  await access(REEL_FONTS_DIR);
  await access(REEL_FONT_FILE);
});

test("subtitle splitter produce cues cortos", () => {
  const cues = splitNarrationIntoCues(
    "En 1817 San Martín cruzó los Andes con el Ejército Libertador hacia Chile.",
    0,
    6,
    1,
  );
  assert.ok(cues.length >= 2);
  for (const c of cues) {
    const longest = Math.max(...c.text.split("\n").map((l) => l.length));
    assert.ok(longest <= 42, `línea larga: ${c.text}`);
  }
});

test("toAss usa PlayRes 1080x1920", () => {
  const ass = toAss([
    { index: 1, startSec: 0, endSec: 2, text: "Hola\nmundo" },
  ]);
  assert.match(ass, /PlayResX: 1080/);
  assert.match(ass, /PlayResY: 1920/);
  assert.match(ass, /,Inter,52,/);
  assert.match(ass, /\\N/);
});
