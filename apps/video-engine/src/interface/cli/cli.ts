#!/usr/bin/env node
import path from "node:path";
import { config as loadDotenv } from "dotenv";
import { readFile } from "node:fs/promises";
import {
  CreateJobRequestSchema,
  ExhibitionSchema,
} from "@museoargent/video-contracts";
import { cronicaToExhibition } from "../../infrastructure/adapters/cronica-to-exhibition";
import { createEngineRuntime } from "../../runtime";

loadDotenv({
  path: path.resolve(__dirname, "../../../../../.env"),
  override: false,
});
loadDotenv({ path: path.resolve(process.cwd(), ".env"), override: false });

async function main() {
  const [cmd, ...args] = process.argv.slice(2);
  const engine = await createEngineRuntime();
  console.info(
    JSON.stringify({
      msg: "cli ready",
      llmProvider: engine.config.useFakeProvidersDefault ? "fake" : "openai",
      ttsProvider: engine.config.useFakeProvidersDefault ? "fake" : "openai",
      ttsVoice: engine.config.openaiTtsVoice,
    }),
  );

  switch (cmd) {
    case "seed": {
      await engine.seed();
      console.log(JSON.stringify({ ok: true, msg: "fixtures seeded" }));
      break;
    }
    case "enqueue": {
      await engine.seed();
      const file = flag(args, "--file");
      const formatId = (flag(args, "--format") ?? "reel") as "reel";
      const force = args.includes("--force");
      const fake = args.includes("--fake") || !process.env.OPENAI_API_KEY;
      if (!file) {
        throw new Error("Usage: cli enqueue --file exhibition.json [--format reel] [--force] [--fake]");
      }
      const raw = JSON.parse(await readFile(resolveInputPath(file), "utf8"));
      const exhibition = ExhibitionSchema.parse(raw);
      const job = await engine.enqueue(
        CreateJobRequestSchema.parse({
          exhibition,
          formatId,
          force,
          useFakeProviders: fake,
        }),
      );
      console.log(JSON.stringify(job, null, 2));
      break;
    }
    case "enqueue-cronica": {
      await engine.seed();
      const slug = flag(args, "--slug");
      const formatId = (flag(args, "--format") ?? "reel") as "reel";
      const force = args.includes("--force");
      if (!slug) {
        throw new Error("Usage: cli enqueue-cronica --slug <slug> [--format reel] [--force]");
      }
      const exhibition = await loadCronicaExhibition(slug);
      const job = await engine.enqueue({
        exhibition,
        formatId,
        force,
        useFakeProviders: true,
      });
      console.log(JSON.stringify(job, null, 2));
      break;
    }
    case "status": {
      const id = flag(args, "--id") ?? args[0];
      if (!id) throw new Error("Usage: cli status --id <jobId>");
      const job = await engine.getJob(id);
      console.log(JSON.stringify(job, null, 2));
      break;
    }
    case "process": {
      await engine.seed();
      const did = await engine.processOne("cli");
      console.log(JSON.stringify({ processed: did }));
      break;
    }
    case "run": {
      await engine.seed();
      const file = flag(args, "--file");
      const slug = flag(args, "--slug");
      const formatId = (flag(args, "--format") ?? "reel") as "reel";
      const force = args.includes("--force");
      let exhibition;
      if (file) {
        exhibition = ExhibitionSchema.parse(
          JSON.parse(await readFile(resolveInputPath(file), "utf8")),
        );
      } else if (slug) {
        exhibition = await loadCronicaExhibition(slug);
      } else {
        throw new Error("Usage: cli run (--file exhibition.json | --slug <slug>) [--format reel]");
      }
      const job = await engine.enqueue({
        exhibition,
        formatId,
        force,
        useFakeProviders: true,
      });
      await engine.processOne("cli-run");
      const finalJob = await engine.getJob(job.id);
      console.log(JSON.stringify(finalJob, null, 2));
      if (finalJob?.status !== "succeeded") process.exitCode = 1;
      break;
    }
    default:
      console.log(`MuseoArgent video-engine CLI

Commands:
  seed
  enqueue --file exhibition.json [--format reel] [--force] [--fake]
  enqueue-cronica --slug <slug> [--format reel] [--force]
  status --id <jobId>
  process
  run (--file exhibition.json | --slug <slug>) [--format reel] [--force]
`);
      process.exitCode = cmd ? 1 : 0;
  }
}

function flag(args: string[], name: string): string | undefined {
  const i = args.indexOf(name);
  if (i === -1) return undefined;
  return args[i + 1];
}

function resolveInputPath(file: string): string {
  const path = require("node:path") as typeof import("node:path");
  const fs = require("node:fs") as typeof import("node:fs");
  if (path.isAbsolute(file) && fs.existsSync(file)) return file;
  if (fs.existsSync(file)) return file;
  const fromRepo = path.resolve(process.cwd(), file);
  if (fs.existsSync(fromRepo)) return fromRepo;
  const stripped = file.replace(/^apps\/video-engine\//, "");
  const local = path.resolve(process.cwd(), stripped);
  if (fs.existsSync(local)) return local;
  return file;
}

async function loadCronicaExhibition(slug: string) {
  // Best-effort: load from monorepo at runtime via tsx; stub if unavailable.
  try {
    const path = await import("node:path");
    const { pathToFileURL } = await import("node:url");
    const root = path.resolve(__dirname, "../../../../../");
    const registroUrl = pathToFileURL(
      path.join(root, "src/content/cronicas/registro.ts"),
    ).href;
    const registro = await import(registroUrl);
    const cronica = registro.cronicas?.find(
      (c: { slug: string }) => c.slug === slug,
    );
    if (!cronica) throw new Error(`Crónica no encontrada: ${slug}`);

    let segmentos: Array<{ titulo: string; texto: string }> = [];
    try {
      const audioguiasUrl = pathToFileURL(
        path.join(root, "src/data/audioguias-salas.ts"),
      ).href;
      const audioguias = await import(audioguiasUrl);
      const guia = audioguias.obtenerAudioguiaExhibicion?.(slug);
      segmentos = (guia?.segmentos ?? []).map(
        (s: { titulo: string; texto: string }) => ({
          titulo: s.titulo,
          texto: s.texto,
        }),
      );
    } catch {
      // optional
    }

    let imageIds: string[] = [];
    try {
      const piezasUrl = pathToFileURL(
        path.join(root, "src/lib/piezas/indice.ts"),
      ).href;
      const piezas = await import(piezasUrl);
      imageIds = (piezas.piezasDeExhibicion?.(slug) ?? []).map(
        (p: { id: string }) => p.id,
      );
    } catch {
      if (cronica.visual?.imagenHero) imageIds = [cronica.visual.imagenHero];
    }

    return cronicaToExhibition({
      cronica: {
        slug: cronica.slug,
        titulo: cronica.titulo,
        descripcion: cronica.descripcion,
        periodo: cronica.periodo,
        anioInicio: cronica.anioInicio,
        anioFin: cronica.anioFin,
        protagonista: cronica.protagonista,
        visual: cronica.visual,
      },
      audioguiaSegmentos: segmentos,
      imageIds,
    });
  } catch (err) {
    console.warn(
      "No se pudo cargar crónica del monorepo; usando stub:",
      err instanceof Error ? err.message : err,
    );
    return cronicaToExhibition({
      cronica: {
        slug,
        titulo: slug.replace(/-/g, " "),
        descripcion: `Exhibición ${slug}`,
        periodo: "Historia argentina",
        protagonista: {
          slug: "jose-de-san-martin",
          etiqueta: "San Martín",
        },
        visual: { imagenHero: "fixture-andes" },
      },
      imageIds: [
        "fixture-andes",
        "fixture-retrato-san-martin",
        "fixture-mapa",
        "fixture-documento",
      ],
      audioguiaSegmentos: [
        {
          titulo: "Inicio",
          texto: "Una travesía que cambió el rumbo de la independencia.",
        },
      ],
    });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
