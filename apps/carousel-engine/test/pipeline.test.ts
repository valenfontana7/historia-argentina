import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { CarouselSchema } from "@museoargent/carousel-contracts";
import { buildRenderPlan } from "../src/application/pipeline";
import { hashSlideIr } from "../src/application/ir-hash";
import { estimateLines } from "../src/application/stages/layout-engine";

const engineRoot = path.resolve(__dirname, "..");
const libraryRoot = path.resolve(
  engineRoot,
  "../../data/video-engine/library",
);
const cacheRoot = path.resolve(engineRoot, "../../data/carousel-engine/cache");

describe("carousel pipeline", () => {
  it("estimates title lines from content length", () => {
    assert.equal(estimateLines("La Cruzada Libertadora", 3, 16), 2);
    assert.equal(estimateLines("OK", 3, 16), 1);
  });

  it("builds a deterministic render plan from the sample fixture", async () => {
    const raw = JSON.parse(
      await readFile(
        path.join(engineRoot, "fixtures/sample-carousel.json"),
        "utf8",
      ),
    );
    const carousel = CarouselSchema.parse(raw);
    const plan = await buildRenderPlan({
      carousel,
      templateId: "museum_classic",
      templateVersion: 1,
      themeId: "museoargent_classic",
      profileId: "instagram_feed",
      engineRoot,
      libraryRoot,
      cacheRoot,
    });

    assert.equal(plan.slides.length, 6);
    assert.equal(plan.templateId, "museum_classic");

    const again = await buildRenderPlan({
      carousel,
      templateId: "museum_classic",
      templateVersion: 1,
      themeId: "museoargent_classic",
      profileId: "instagram_feed",
      engineRoot,
      libraryRoot,
      cacheRoot,
    });

    for (let i = 0; i < plan.slides.length; i++) {
      assert.equal(plan.slides[i]!.irHash, again.slides[i]!.irHash);
      assert.equal(hashSlideIr(plan.slides[i]!.ir), plan.slides[i]!.irHash);
    }
  });

  it("uses full-bleed cover image and data-URI assets", async () => {
    const raw = JSON.parse(
      await readFile(
        path.join(engineRoot, "fixtures/sample-carousel.json"),
        "utf8",
      ),
    );
    const carousel = CarouselSchema.parse(raw);
    const plan = await buildRenderPlan({
      carousel,
      templateId: "museum_classic",
      templateVersion: 1,
      themeId: "museoargent_classic",
      profileId: "instagram_feed",
      engineRoot,
      libraryRoot,
      cacheRoot,
    });

    const cover = plan.slides.find((s) => s.slideId === "s1");
    assert.ok(cover);
    const image = cover!.ir.slots.find((s) => s.node.kind === "image");
    assert.ok(image);
    assert.equal(image!.box.x, 0);
    assert.equal(image!.box.y, 0);
    assert.equal(image!.box.w, cover!.ir.width);
    assert.ok(image!.box.h >= cover!.ir.height * 0.65);

    const title = cover!.ir.slots.find((s) => s.id === "title");
    assert.ok(title);
    assert.ok(title!.box.h >= 100, `title height ${title!.box.h}`);

    assert.ok(image!.node.kind === "image");
    assert.ok(
      image.node.src.startsWith("data:image/jpeg") ||
        image.node.src.startsWith("data:image/png") ||
        image.node.src.startsWith("data:image/webp"),
      `expected raster data-URI (real photo), got ${image.node.src.slice(0, 64)}`,
    );
  });
});

