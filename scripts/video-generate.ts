#!/usr/bin/env npx tsx
/**
 * Genera un reel desde una crónica: exporta Exhibition, cachea piezas, renderiza.
 *
 * Uso:
 *   npm run video:generate -- el-cruce-de-los-andes
 *   npm run video:generate -- el-cruce-de-los-andes --force --format reel --duration 40
 */
import path from "node:path";
import { config as loadDotenv } from "dotenv";
import {
  ExhibitionSchema,
  NarrativePaceSchema,
  VideoFormatIdSchema,
  type ProfileOverrides,
  type VideoFormatId,
} from "@museoargent/video-contracts";
import { cronicas } from "../src/content/cronicas/registro";
import { imagenesCronicas } from "../src/data/cronicas-imagenes";
import { obtenerAudioguiaSala } from "../src/data/audioguias-salas";
import { piezasDeExhibicion } from "../src/lib/piezas/indice";
import { createEngineRuntime } from "../apps/video-engine/src/runtime";

loadDotenv({ path: path.resolve(process.cwd(), ".env"), override: false });

async function main() {
  const args = process.argv.slice(2);
  const slug = args.find((a) => !a.startsWith("--"));
  const force = args.includes("--force");
  const formatRaw = flag(args, "--format") ?? "reel";
  const formatParsed = VideoFormatIdSchema.safeParse(formatRaw);
  const formatId: VideoFormatId = formatParsed.success
    ? formatParsed.data
    : "reel";

  if (!slug) {
    console.error(
      "Uso: npm run video:generate -- <slug> [--format reel] [--force] [--duration N] [--pace rapido|medio|pausado] [--cta ...] [--tone ...]",
    );
    process.exit(1);
  }

  console.info(JSON.stringify({ msg: "generate starting", slug }));

  const profileOverrides = buildProfileOverrides(args);

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

  const exhibition = ExhibitionSchema.parse({
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
    source: { type: "cronica", externalId: cronica.slug },
  });

  console.info(
    JSON.stringify({
      msg: "video:generate start",
      slug,
      images: imageIds.length,
      formatId,
      profileOverrides: profileOverrides ?? null,
      llmModel: process.env.OPENAI_LLM_MODEL ?? null,
      ttsVoice: process.env.OPENAI_TTS_VOICE ?? null,
    }),
  );

  const engine = await createEngineRuntime(process.env);
  console.info(
    JSON.stringify({
      msg: "engine ready",
      ffmpeg: engine.config.ffmpegPath,
      fakeProviders: engine.config.useFakeProvidersDefault,
      llmProvider: engine.config.useFakeProvidersDefault ? "fake" : "openai",
      llmModel: engine.config.openaiLlmModel,
      ttsProvider: engine.config.useFakeProvidersDefault ? "fake" : "openai",
      ttsVoice: engine.config.openaiTtsVoice,
    }),
  );

  await engine.seed();

  const job = await engine.enqueue({
    exhibition,
    formatId,
    force,
    useFakeProviders: engine.config.useFakeProvidersDefault,
    profileOverrides,
  });
  // Emitir id YA: el admin espera este log (cache de assets puede tardar >60s).
  console.info(JSON.stringify({ msg: "job enqueued", id: job.id }));

  const cached = await engine.prepareExhibitionAssets(
    exhibition,
    imagenesCronicas,
  );
  console.info(JSON.stringify({ msg: "assets cached", cached }));

  await engine.processOne("video-generate");
  const finalJob = await engine.getJob(job.id);

  console.log(JSON.stringify(finalJob, null, 2));

  if (finalJob?.status === "succeeded" && finalJob.outputMp4Uri) {
    const local = finalJob.outputMp4Uri.replace(/^file:\/\//, "");
    console.error(`\nMP4: ${path.resolve(local)}\n`);
  }

  if (finalJob?.status !== "succeeded") process.exitCode = 1;
}

function buildProfileOverrides(args: string[]): ProfileOverrides | undefined {
  const overrides: ProfileOverrides = {};
  const durationRaw = flag(args, "--duration");
  if (durationRaw) {
    const n = Number(durationRaw);
    if (Number.isFinite(n) && n > 0) overrides.targetDurationSec = n;
  }
  const paceRaw = flag(args, "--pace");
  if (paceRaw) {
    const pace = NarrativePaceSchema.safeParse(paceRaw);
    if (pace.success) overrides.narrativePace = pace.data;
  }
  const cta = flag(args, "--cta");
  if (cta?.trim()) overrides.cta = cta.trim();
  const tone = flag(args, "--tone");
  if (tone?.trim()) overrides.tone = tone.trim();

  return Object.keys(overrides).length ? overrides : undefined;
}

function flag(args: string[], name: string): string | undefined {
  const i = args.indexOf(name);
  if (i === -1) return undefined;
  return args[i + 1];
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
