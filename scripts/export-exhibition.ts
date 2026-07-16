/**
 * Exporta una Exhibition JSON desde una crónica del monorepo.
 * Uso: npx tsx scripts/export-exhibition.ts el-cruce-de-los-andes > exhibition.json
 */
import { writeFileSync } from "node:fs";
import { cronicas } from "../src/content/cronicas/registro";
import { obtenerAudioguiaSala } from "../src/data/audioguias-salas";
import { piezasDeExhibicion } from "../src/lib/piezas/indice";

const slug = process.argv[2];
if (!slug) {
  console.error("Uso: npx tsx scripts/export-exhibition.ts <slug> [out.json]");
  process.exit(1);
}

const cronica = cronicas.find((c) => c.slug === slug);
if (!cronica) {
  console.error(`Crónica no encontrada: ${slug}`);
  process.exit(1);
}

const guia = obtenerAudioguiaSala(slug);
const piezas = piezasDeExhibicion(slug);
const imageIds = piezas.map((p) => p.id);
if (
  cronica.visual.imagenHero &&
  !imageIds.includes(cronica.visual.imagenHero)
) {
  imageIds.unshift(cronica.visual.imagenHero);
}

const exhibition = {
  id: `cronica:${cronica.slug}`,
  slug: cronica.slug,
  title: cronica.titulo,
  summary: cronica.descripcion,
  periodLabel: cronica.periodo,
  yearStart: cronica.anioInicio,
  yearEnd: cronica.anioFin,
  chronology: (guia?.segmentos ?? []).map((s) => ({
    label: s.titulo,
    detail: s.texto,
  })),
  characters: cronica.protagonista
    ? [
        {
          id: cronica.protagonista.slug,
          name: cronica.protagonista.etiqueta,
          role: "protagonista",
        },
      ]
    : [],
  places: [],
  quotes: [],
  curiosities: [],
  documents: [],
  images: imageIds.map((assetId) => ({ assetId })),
  source: { type: "cronica" as const, externalId: cronica.slug },
};

const out = process.argv[3];
const json = JSON.stringify(exhibition, null, 2);
if (out) {
  writeFileSync(out, json);
  console.error(`Wrote ${out}`);
} else {
  console.log(json);
}
