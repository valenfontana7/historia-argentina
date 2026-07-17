import { createHash } from "node:crypto";
import { access, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import type { SlideIr } from "@museoargent/carousel-contracts";

const FIXTURE_FILES: Record<string, string> = {
  "fixture://portrait": "fixture-retrato-san-martin.png",
  "fixture://document": "fixture-documento.png",
  "fixture://map": "fixture-mapa.png",
  "fixture://andes": "fixture-andes.png",
};

const ARCHIVAL_PLATES: Record<
  string,
  { c1: string; c2: string; c3: string; label: string }
> = {
  "fixture://portrait": {
    c1: "#2a2218",
    c2: "#4a3a28",
    c3: "#1a1510",
    label: "RETRATO",
  },
  "fixture://document": {
    c1: "#241e16",
    c2: "#3d3428",
    c3: "#16120e",
    label: "DOCUMENTO",
  },
  "fixture://map": {
    c1: "#1a2420",
    c2: "#2a3a34",
    c3: "#0e1412",
    label: "MAPA",
  },
  "fixture://andes": {
    c1: "#1c2430",
    c2: "#2e3a48",
    c3: "#10161c",
    label: "PAISAJE",
  },
};

const MIN_REAL_ASSET_BYTES = 8_000;
/** SVGs de banderas/diagramas suelen pesar < 8 KB y son assets válidos. */
const MIN_SVG_ASSET_BYTES = 80;
const FETCH_TIMEOUT_MS = 25_000;

function minBytesForExt(ext: string): number {
  return ext === ".svg" ? MIN_SVG_ASSET_BYTES : MIN_REAL_ASSET_BYTES;
}

/**
 * Resolve asset URLs for rendering as data-URIs (never file:// in HTML).
 */
export async function composeAssets(
  ir: SlideIr,
  libraryRoot: string,
  cacheRoot?: string,
): Promise<SlideIr> {
  // Serialize HTTP fetches to reduce Wikimedia 429s
  const slots = [];
  for (const slot of ir.slots) {
    if (slot.node.kind !== "image") {
      slots.push(slot);
      continue;
    }
    const src = await resolveSrc(slot.node.src, libraryRoot, cacheRoot);
    slots.push({
      ...slot,
      node: {
        ...slot.node,
        src,
        focusX: slot.node.focusX,
        focusY: slot.node.focusY,
      },
    });
  }
  return { ...ir, slots };
}

/** Prefetch HTTP image URLs into the engine cache (best-effort). */
export async function prewarmHttpAssets(
  urls: string[],
  cacheRoot?: string,
): Promise<void> {
  const seen = new Set<string>();
  for (const url of urls) {
    if (!url.startsWith("http://") && !url.startsWith("https://")) continue;
    if (seen.has(url)) continue;
    seen.add(url);
    await fetchAndCache(url, cacheRoot);
  }
}

async function resolveSrc(
  src: string,
  libraryRoot: string,
  cacheRoot?: string,
): Promise<string> {
  if (src.startsWith("data:")) return src;

  if (src.startsWith("http://") || src.startsWith("https://")) {
    const cached = await fetchAndCache(src, cacheRoot);
    if (cached) return cached;
    return archivalPlateDataUri("fixture://document");
  }

  if (src.startsWith("fixture://")) {
    const file = FIXTURE_FILES[src];
    if (file) {
      const abs = path.join(libraryRoot, file);
      const dataUri = await fileToDataUriIfSubstantial(abs);
      if (dataUri) return dataUri;
    }
    return archivalPlateDataUri(src);
  }

  let abs = src;
  if (src.startsWith("file://")) {
    abs = decodeURIComponent(
      src.replace(/^file:\/\//, "").replace(/^\/([A-Za-z]:)/, "$1"),
    );
  } else if (!path.isAbsolute(src)) {
    abs = path.resolve(src);
  }
  const dataUri = await fileToDataUriIfSubstantial(abs);
  if (dataUri) return dataUri;
  return archivalPlateDataUri("fixture://document");
}

async function fetchAndCache(
  url: string,
  cacheRoot?: string,
): Promise<string | null> {
  const root = cacheRoot ?? path.join(process.cwd(), "data/carousel-engine/cache");
  const hash = createHash("sha256").update(url).digest("hex").slice(0, 24);
  const ext = extFromUrl(url);
  const cachePath = path.join(root, `${hash}${ext}`);

  try {
    await access(cachePath);
    const info = await stat(cachePath);
    if (info.size >= minBytesForExt(ext)) {
      return fileToDataUri(cachePath);
    }
  } catch {
    // miss
  }

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "user-agent":
            "MuseoArgentCarouselEngine/1.0 (historia-argentina; +https://museoargent.com.ar)",
          accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        },
        redirect: "follow",
      });
      clearTimeout(timer);
      if (res.status === 429 || res.status >= 500) {
        await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
        continue;
      }
      if (!res.ok) return null;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < minBytesForExt(ext)) return null;
      await mkdir(root, { recursive: true });
      await writeFile(cachePath, buf);
      const mime =
        mimeFromExt(ext) || res.headers.get("content-type") || "image/jpeg";
      return `data:${mime.split(";")[0]};base64,${buf.toString("base64")}`;
    } catch {
      await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
    }
  }
  return null;
}

function extFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    if (pathname.endsWith(".png")) return ".png";
    if (pathname.endsWith(".webp")) return ".webp";
    if (pathname.endsWith(".gif")) return ".gif";
    if (pathname.endsWith(".svg")) return ".svg";
    if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) return ".jpg";
  } catch {
    // ignore
  }
  return ".jpg";
}

function mimeFromExt(ext: string): string | null {
  switch (ext) {
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    default:
      return null;
  }
}

async function fileToDataUri(absPath: string): Promise<string | null> {
  try {
    const buf = await readFile(absPath);
    const ext = path.extname(absPath).toLowerCase();
    const mime = mimeFromExt(ext) ?? "image/png";
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

async function fileToDataUriIfSubstantial(
  absPath: string,
): Promise<string | null> {
  try {
    await access(absPath);
    const info = await stat(absPath);
    const ext = path.extname(absPath).toLowerCase();
    if (info.size < minBytesForExt(ext)) return null;
    return fileToDataUri(absPath);
  } catch {
    return null;
  }
}

function archivalPlateDataUri(key: string): string {
  const plate = ARCHIVAL_PLATES[key] ?? ARCHIVAL_PLATES["fixture://document"]!;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${plate.c1}"/>
      <stop offset="55%" stop-color="${plate.c2}"/>
      <stop offset="100%" stop-color="${plate.c3}"/>
    </linearGradient>
    <radialGradient id="v" cx="48%" cy="32%" r="70%">
      <stop offset="0%" stop-color="rgba(230,212,180,0.06)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.45)"/>
    </radialGradient>
  </defs>
  <rect width="900" height="1200" fill="url(#g)"/>
  <rect width="900" height="1200" fill="url(#v)"/>
  <rect x="72" y="72" width="756" height="1056" fill="none" stroke="rgba(198,161,91,0.22)" stroke-width="1.5"/>
  <text x="450" y="1120" text-anchor="middle" font-family="Georgia, serif" font-size="14" letter-spacing="0.28em" fill="rgba(198,161,91,0.4)">${plate.label}</text>
</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
