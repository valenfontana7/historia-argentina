import { createWriteStream } from "node:fs";
import { mkdir, readFile, stat, unlink } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { spawn } from "node:child_process";
import type {
  AssetRecord,
  AssetType,
  Exhibition,
} from "@museoargent/video-contracts";
import type { AssetLibrary } from "../../application/ports/asset-library";
import { resolveFfmpegBinaries } from "../ffmpeg/resolve-binaries";
import { orientationFromSize } from "../ffmpeg/ffmpeg-craft";

export type CatalogImage = {
  id: string;
  url: string;
  credito: string;
  alt: string;
  tipo: "grabado" | "pintura" | "mapa" | "foto";
  origenVisual?: "periodo" | "contemporanea";
};

/** Tag estable en AssetRecord para filtrar reels pre-fotográficos. */
export const ORIGEN_CONTEMPORANEA_TAG = "origen-contemporanea";
export const ORIGEN_PERIODO_TAG = "origen-periodo";

const TIPO_MAP: Record<CatalogImage["tipo"], AssetType> = {
  grabado: "ilustracion",
  pintura: "pintura",
  mapa: "mapa",
  foto: "fotografia",
};

/**
 * Descarga (o reusa cache) las imágenes de la exhibición desde el catálogo
 * y las registra en la AssetLibrary. Fallos de red no abortan el job.
 * Los SVG de Wikimedia se piden como PNG (FFmpeg no decodifica SVG).
 */
export async function cacheExhibitionAssets(input: {
  exhibition: Exhibition;
  catalog: Record<string, CatalogImage>;
  library: AssetLibrary;
  cacheRoot: string;
}): Promise<string[]> {
  const cached: string[] = [];
  const ids = input.exhibition.images.map((i) => i.assetId);
  await mkdir(input.cacheRoot, { recursive: true });
  const { ffprobePath } = resolveFfmpegBinaries(process.env);

  for (const id of ids) {
    const meta = input.catalog[id];
    if (!meta) continue;

    const resolved = resolveRasterDownload(meta.url);
    const filePath = path.join(input.cacheRoot, `${id}${resolved.ext}`);
    try {
      let exists = await fileExists(filePath);
      if (exists && (await isSvgOrCorruptRaster(filePath))) {
        await unlinkQuiet(filePath);
        exists = false;
      }
      // Cache viejo: .jpg que en realidad era SVG
      const legacyJpg = path.join(input.cacheRoot, `${id}.jpg`);
      if (
        legacyJpg !== filePath &&
        (await fileExists(legacyJpg)) &&
        (await isSvgOrCorruptRaster(legacyJpg))
      ) {
        await unlinkQuiet(legacyJpg);
      }

      if (!exists) {
        await downloadToFile(resolved.url, filePath);
        if (await isSvgOrCorruptRaster(filePath)) {
          throw new Error(
            `Asset ${id} sigue siendo SVG tras descarga (${resolved.url})`,
          );
        }
      }

      const dims = await probeImageSize(ffprobePath, filePath);
      if (!dims.width || !dims.height) {
        throw new Error(`ffprobe no pudo leer ${filePath}`);
      }
      const orientation = orientationFromSize(dims.width, dims.height);
      const origen = meta.origenVisual ?? "periodo";
      const origenTag =
        origen === "contemporanea" ? ORIGEN_CONTEMPORANEA_TAG : ORIGEN_PERIODO_TAG;

      const record: AssetRecord = {
        id,
        type: TIPO_MAP[meta.tipo],
        author: meta.credito,
        license: "wikimedia-commons",
        tags: [meta.tipo, origenTag, ...tokenize(meta.alt)],
        characters: inferCharacters(input.exhibition, meta.alt),
        places: [],
        epoch: input.exhibition.periodLabel || undefined,
        weight: 1.4,
        orientation,
        width: dims.width || undefined,
        height: dims.height || undefined,
        storageUri: `file://${filePath}`,
        sourceUrl: meta.url,
      };
      await input.library.upsert(record);
      cached.push(id);
    } catch (err) {
      console.warn(
        JSON.stringify({
          msg: "asset cache skipped",
          id,
          error: err instanceof Error ? err.message : String(err),
        }),
      );
    }
  }

  return cached;
}

function tokenize(alt: string): string[] {
  return alt
    .toLowerCase()
    .split(/[^a-záéíóúñü0-9]+/i)
    .filter((w) => w.length > 3)
    .slice(0, 8);
}

function inferCharacters(exhibition: Exhibition, alt: string): string[] {
  const hits: string[] = [];
  for (const c of exhibition.characters) {
    const name = c.name.toLowerCase();
    const last = name.split(/\s+/).pop() ?? name;
    if (alt.toLowerCase().includes(last) || alt.toLowerCase().includes(name)) {
      hits.push(c.id);
    }
  }
  return hits;
}

function guessExt(url: string): string {
  const clean = url.split("?")[0].toLowerCase();
  if (clean.endsWith(".png")) return ".png";
  if (clean.endsWith(".webp")) return ".webp";
  if (clean.endsWith(".gif")) return ".gif";
  if (clean.endsWith(".svg")) return ".svg";
  return ".jpg";
}

/** Wikimedia SVG → PNG raster (FFmpeg no tiene decoder SVG). */
export function wikimediaSvgThumbUrl(url: string, px = 1920): string | null {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("upload.wikimedia.org")) return null;
    const parts = u.pathname.split("/").filter(Boolean);
    // wikipedia/commons/3/3e/File.svg  OR already thumb
    const commonsIdx = parts.indexOf("commons");
    if (commonsIdx < 0) return null;
    if (parts[commonsIdx + 1] === "thumb") {
      // already a thumb URL; if .svg.png keep it
      return url;
    }
    const a = parts[commonsIdx + 1];
    const b = parts[commonsIdx + 2];
    const file = parts[commonsIdx + 3];
    if (!a || !b || !file || !file.toLowerCase().endsWith(".svg")) return null;
    u.pathname = `/wikipedia/commons/thumb/${a}/${b}/${file}/${px}px-${file}.png`;
    return u.toString();
  } catch {
    return null;
  }
}

function resolveRasterDownload(url: string): { url: string; ext: string } {
  const clean = url.split("?")[0].toLowerCase();
  if (clean.endsWith(".svg")) {
    const thumb = wikimediaSvgThumbUrl(url, 1920);
    if (thumb) return { url: thumb, ext: ".png" };
  }
  return { url, ext: guessExt(url) };
}

async function isSvgOrCorruptRaster(filePath: string): Promise<boolean> {
  try {
    const buf = await readFile(filePath);
    const sample = buf.subarray(0, 256).toString("utf8").trimStart().toLowerCase();
    return sample.startsWith("<svg") || sample.startsWith("<?xml");
  } catch {
    return false;
  }
}

async function unlinkQuiet(filePath: string): Promise<void> {
  try {
    await unlink(filePath);
  } catch {
    // ignore
  }
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function sleep(ms: number): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}

async function downloadToFile(url: string, dest: string): Promise<void> {
  await mkdir(path.dirname(dest), { recursive: true });
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt > 0) await sleep(1000 * attempt);
    const res = await fetch(url, {
      headers: {
        "user-agent":
          "MuseoArgent-VideoEngine/1.0 (educational; contact@museoargent)",
        accept: "image/*,*/*",
      },
    });
    if (res.status === 429 || res.status >= 500) {
      lastError = new Error(`Failed to download ${url}: ${res.status}`);
      continue;
    }
    if (!res.ok || !res.body) {
      throw new Error(`Failed to download ${url}: ${res.status}`);
    }
    const nodeStream = Readable.fromWeb(
      res.body as import("stream/web").ReadableStream,
    );
    await pipeline(nodeStream, createWriteStream(dest));
    return;
  }
  throw lastError ?? new Error(`Failed to download ${url}`);
}

function probeImageSize(
  ffprobe: string,
  file: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const child = spawn(
      ffprobe,
      [
        "-v",
        "error",
        "-select_streams",
        "v:0",
        "-show_entries",
        "stream=width,height",
        "-of",
        "csv=p=0:s=x",
        file,
      ],
      { stdio: ["ignore", "pipe", "pipe"] },
    );
    let out = "";
    child.stdout.on("data", (d) => {
      out += String(d);
    });
    child.on("error", () => resolve({ width: 0, height: 0 }));
    child.on("close", () => {
      const [w, h] = out
        .trim()
        .split("x")
        .map((n) => Number(n));
      resolve({ width: w || 0, height: h || 0 });
    });
  });
}
