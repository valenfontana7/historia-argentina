import assert from "node:assert/strict";
import { test } from "node:test";
import { splitNarrationIntoCues, toSrt, toVtt } from "../src/application/stages/subtitle-splitter";
import { cronicaToExhibition } from "../src/infrastructure/adapters/cronica-to-exhibition";
import { HeuristicAssetRanker } from "../src/infrastructure/assets/in-memory-asset-library";

test("subtitle splitter no corta frases cortas", () => {
  const cues = splitNarrationIntoCues(
    "Primera frase. Segunda frase más larga pero razonable.",
    0,
    4,
    1,
  );
  assert.ok(cues.length >= 2);
  assert.match(cues[0].text, /Primera/);
  const srt = toSrt(cues);
  const vtt = toVtt(cues);
  assert.match(srt, /-->/);
  assert.match(vtt, /WEBVTT/);
});

test("cronicaToExhibition produce Exhibition sin HTML", () => {
  const exhibition = cronicaToExhibition({
    cronica: {
      slug: "el-cruce-de-los-andes",
      titulo: "El Cruce de los Andes",
      descripcion: "La travesía del Ejército de los Andes en 1817.",
      periodo: "1817",
      anioInicio: 1817,
      anioFin: 1817,
      protagonista: {
        slug: "jose-de-san-martin",
        etiqueta: "San Martín",
      },
      visual: { imagenHero: "andes-cruce" },
    },
    audioguiaSegmentos: [
      { titulo: "La partida", texto: "Partieron desde Mendoza." },
    ],
    imageIds: ["andes-uspallata"],
  });
  assert.equal(exhibition.source.type, "cronica");
  assert.ok(exhibition.images.some((i) => i.assetId === "andes-cruce"));
  assert.equal(exhibition.characters[0]?.id, "jose-de-san-martin");
});

test("HeuristicAssetRanker prioriza tipo y personaje", async () => {
  const ranker = new HeuristicAssetRanker();
  const ranked = await ranker.rank(
    {
      preferredTypes: ["retrato"],
      tags: [],
      characters: ["jose-de-san-martin"],
      places: [],
    },
    [
      {
        id: "a",
        type: "mapa",
        license: "CC0",
        tags: [],
        characters: [],
        places: [],
        weight: 1,
        orientation: "horizontal",
        storageUri: "file://a",
      },
      {
        id: "b",
        type: "retrato",
        license: "CC0",
        tags: [],
        characters: ["jose-de-san-martin"],
        places: [],
        weight: 1,
        orientation: "vertical",
        storageUri: "file://b",
      },
    ],
  );
  assert.equal(ranked[0].asset.id, "b");
  assert.ok(ranked[0].score > ranked[1].score);
});
