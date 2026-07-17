import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  carouselFromCronica,
  pickContentSegments,
} from "./carousel-from-cronica";

describe("carouselFromCronica", () => {
  it("pickContentSegments returns up to 3 substantive segments in chrono order", () => {
    const segs = [
      { label: "A", detail: "x".repeat(60) },
      { label: "B", detail: "short" },
      { label: "C", detail: "y".repeat(80) },
      { label: "D", detail: "z".repeat(70) },
    ];
    const picked = pickContentSegments(segs, "fallback summary here", 3);
    assert.equal(picked.length, 3);
    assert.deepEqual(
      picked.map((p) => p.label),
      ["A", "C", "D"],
    );
  });

  it("builds a valid carousel with HTTP assets for a known slug", () => {
    const result = carouselFromCronica("el-cruce-de-los-andes");
    assert.ok(result, "expected carousel for el-cruce-de-los-andes");
    const { carousel, slug } = result;
    assert.equal(slug, "el-cruce-de-los-andes");
    assert.equal(carousel.id, "cronica:el-cruce-de-los-andes");
    assert.ok(carousel.slides.length >= 4);
    assert.ok(carousel.slides.length <= 8);

    const types = carousel.slides.map((s) => s.type);
    assert.equal(types[0], "cover");
    assert.equal(types[types.length - 1], "ending_cta");
    assert.ok(types.includes("content"));

    const httpSrcs: string[] = [];
    for (const s of carousel.slides) {
      if ("image" in s && s.image?.src?.startsWith("http")) {
        httpSrcs.push(s.image.src);
      }
      if ("images" in s && Array.isArray(s.images)) {
        for (const img of s.images) {
          if (img.src?.startsWith("http")) httpSrcs.push(img.src);
        }
      }
    }
    assert.ok(httpSrcs.length >= 2, "expected HTTP asset urls");
    const unique = new Set(httpSrcs);
    assert.ok(
      unique.size >= Math.min(2, httpSrcs.length),
      "expected mostly distinct image urls",
    );
  });
});
