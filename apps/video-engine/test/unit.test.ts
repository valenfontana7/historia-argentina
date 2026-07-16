import assert from "node:assert/strict";
import { test } from "node:test";
import { AssetSelector } from "../src/application/stages/media-stages";
import { splitNarrationIntoCues, toSrt, toVtt } from "../src/application/stages/subtitle-splitter";
import { cronicaToExhibition } from "../src/infrastructure/adapters/cronica-to-exhibition";
import { ORIGEN_CONTEMPORANEA_TAG } from "../src/infrastructure/assets/cache-exhibition-assets";
import {
  HeuristicAssetRanker,
  InMemoryAssetLibrary,
} from "../src/infrastructure/assets/in-memory-asset-library";
import type { StoryboardDocument } from "@museoargent/video-contracts";

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

const miniStoryboard = {
  scenes: [
    {
      scene: 1,
      narration: "Cruzaron la cordillera a caballo.",
      durationSec: 4,
      shotType: "plano-general",
      motion: "kenBurns",
      transition: "cut",
      assetHint: {
        preferredTypes: ["pintura", "fotografia"],
        tags: ["andes"],
        characters: [],
        places: [],
      },
    },
  ],
} as StoryboardDocument;

test("AssetSelector excluye origen contemporánea si yearEnd < 1900", async () => {
  const library = new InMemoryAssetLibrary();
  await library.upsert({
    id: "andes-cruce",
    type: "pintura",
    license: "CC0",
    tags: ["pintura", "andes"],
    characters: [],
    places: [],
    weight: 1.4,
    orientation: "horizontal",
    storageUri: "file://pintura",
  });
  await library.upsert({
    id: "andes-uspallata",
    type: "fotografia",
    license: "CC0",
    tags: ["foto", ORIGEN_CONTEMPORANEA_TAG, "andes"],
    characters: [],
    places: [],
    weight: 1.4,
    orientation: "horizontal",
    storageUri: "file://foto-moderna",
  });

  const selector = new AssetSelector(library, new HeuristicAssetRanker(), 0.1);
  const bindings = await selector.select(
    miniStoryboard,
    ["andes-cruce", "andes-uspallata"],
    { yearEnd: 1817 },
  );
  assert.equal(bindings.length, 1);
  assert.equal(bindings[0].assetId, "andes-cruce");
});

test("AssetSelector permite origen contemporánea si yearEnd >= 1900", async () => {
  const library = new InMemoryAssetLibrary();
  await library.upsert({
    id: "paisaje-actual",
    type: "fotografia",
    license: "CC0",
    tags: ["foto", ORIGEN_CONTEMPORANEA_TAG, "paisaje"],
    characters: [],
    places: [],
    weight: 1.4,
    orientation: "horizontal",
    storageUri: "file://foto-moderna",
  });

  const selector = new AssetSelector(library, new HeuristicAssetRanker(), 0.1);
  const bindings = await selector.select(
    miniStoryboard,
    ["paisaje-actual"],
    { yearEnd: 1952 },
  );
  assert.equal(bindings.length, 1);
  assert.equal(bindings[0].assetId, "paisaje-actual");
});
