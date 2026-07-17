import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { createCarouselEngineRuntime } from "../src/runtime";

describe("carousel-engine health", () => {
  it("getHealth reports fake renderer when forced", async () => {
    const storageRoot = await mkdtemp(path.join(tmpdir(), "carousel-health-"));
    const runtime = await createCarouselEngineRuntime({
      CAROUSEL_USE_FAKE_RENDERER: "1",
      CAROUSEL_STORAGE_ROOT: storageRoot,
      CAROUSEL_ENGINE_PORT: "0",
      VIDEO_ENGINE_API_KEY: "test-key",
    });

    try {
      const health = runtime.getHealth();
      assert.equal(health.ok, true);
      assert.equal(health.service, "carousel-engine");
      assert.equal(health.renderer, "fake");
      assert.equal(health.chromiumOk, false);
      assert.ok(typeof health.storageRoot === "string");
      assert.ok(health.storageRoot.length > 0);
    } finally {
      await runtime.dispose();
      await rm(storageRoot, { recursive: true, force: true });
    }
  });
});
