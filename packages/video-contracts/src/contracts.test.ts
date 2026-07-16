import assert from "node:assert/strict";
import { test } from "node:test";
import { ExhibitionSchema, VERTICAL_1080x1920, VideoManifestSchema } from "./index";

test("ExhibitionSchema acepta payload mínimo", () => {
  const parsed = ExhibitionSchema.parse({
    id: "ex-1",
    slug: "el-cruce-de-los-andes",
    title: "El Cruce de los Andes",
    summary: "La travesía del Ejército de los Andes.",
    source: { type: "cronica", externalId: "el-cruce-de-los-andes" },
  });
  assert.equal(parsed.images.length, 0);
});

test("VideoManifestSchema valida manifest v1", () => {
  const manifest = VideoManifestSchema.parse({
    version: 1,
    format: VERTICAL_1080x1920,
    scenes: [
      {
        id: "s1",
        durationSec: 4,
        layers: [{ id: "bg", kind: "solid", color: "#1a1a1a" }],
        animations: [],
      },
    ],
    audio: [],
  });
  assert.equal(manifest.format.width, 1080);
});
