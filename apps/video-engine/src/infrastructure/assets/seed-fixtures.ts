import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import type { AssetRecord } from "@museoargent/video-contracts";
import type { InMemoryAssetLibrary } from "./in-memory-asset-library";
import type { ObjectStorage } from "../../application/ports/object-storage";

/** PNG 1x1 sólido (RGBA) — suficiente para tests sin ffmpeg. */
function solidPng(_r: number, _g: number, _b: number): Buffer {
  // Precomputed 2x2 PNG (very small) — ignore color for fixture simplicity
  return Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAEklEQVR42mP8z8BQz0AEYBxVSF+FABJADveWkH+mAAAAAElFTkSuQmCC",
    "base64",
  );
}

/** WAV silencioso mínimo (PCM) sin ffmpeg. */
function silentWav(durationSec: number, sampleRate = 8000): Buffer {
  const samples = Math.max(1, Math.floor(durationSec * sampleRate));
  const dataSize = samples * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  return buffer;
}

async function hasFfmpeg(bin: string): Promise<boolean> {
  return new Promise((resolve) => {
    const child = spawn(bin, ["-version"], { stdio: "ignore" });
    child.on("error", () => resolve(false));
    child.on("close", (code) => resolve(code === 0));
  });
}

export async function seedFixtureLibrary(input: {
  library: InMemoryAssetLibrary;
  storage: ObjectStorage;
  ffmpegPath: string;
  root: string;
}): Promise<void> {
  const assetsRoot = path.join(input.root, "library");
  await mkdir(assetsRoot, { recursive: true });
  const useFfmpeg = await hasFfmpeg(input.ffmpegPath);

  const visuals: Array<Omit<AssetRecord, "storageUri"> & { color: string }> = [
    {
      id: "fixture-andes",
      type: "pintura",
      license: "CC0-fixture",
      tags: ["andes", "independencia"],
      characters: ["jose-de-san-martin"],
      places: ["mendoza"],
      epoch: "independencia",
      weight: 1.2,
      orientation: "horizontal",
      width: 1600,
      height: 1000,
      color: "2a2a2a",
    },
    {
      id: "fixture-retrato-san-martin",
      type: "retrato",
      license: "CC0-fixture",
      tags: ["retrato"],
      characters: ["jose-de-san-martin"],
      places: [],
      epoch: "independencia",
      weight: 1.5,
      orientation: "vertical",
      width: 900,
      height: 1200,
      color: "2a2a2a",
    },
    {
      id: "fixture-mapa",
      type: "mapa",
      license: "CC0-fixture",
      tags: ["mapa", "andes"],
      characters: [],
      places: ["andes"],
      epoch: "independencia",
      weight: 1.1,
      orientation: "horizontal",
      width: 1400,
      height: 900,
      color: "2a2a2a",
    },
    {
      id: "fixture-documento",
      type: "documento",
      license: "CC0-fixture",
      tags: ["documento"],
      characters: [],
      places: [],
      epoch: "independencia",
      weight: 1,
      orientation: "vertical",
      width: 800,
      height: 1100,
      color: "2a2a2a",
    },
  ];

  for (const v of visuals) {
    const file = path.join(assetsRoot, `${v.id}.png`);
    if (useFfmpeg) {
      await run(input.ffmpegPath, [
        "-y",
        "-f",
        "lavfi",
        "-i",
        `color=c=0x${v.color}:s=${v.width}x${v.height}:d=1`,
        "-frames:v",
        "1",
        file,
      ]);
    } else {
      await writeFile(file, solidPng(44, 74, 62));
    }
    const { color: _c, ...rest } = v;
    await input.library.upsert({
      ...rest,
      storageUri: `file://${file}`,
    });
  }

  const musicCats = [
    "epica",
    "solemne",
    "suspenso",
    "emotiva",
    "institucional",
  ] as const;
  for (const cat of musicCats) {
    const file = path.join(
      assetsRoot,
      useFfmpeg ? `music-${cat}.mp3` : `music-${cat}.wav`,
    );
    if (useFfmpeg) {
      const freq =
        cat === "epica"
          ? 220
          : cat === "solemne"
            ? 196
            : cat === "suspenso"
              ? 110
              : cat === "emotiva"
                ? 330
                : 262;
      await run(input.ffmpegPath, [
        "-y",
        "-f",
        "lavfi",
        "-i",
        `sine=frequency=${freq}:duration=45`,
        "-af",
        "volume=0.2",
        file,
      ]);
    } else {
      await writeFile(file, silentWav(45));
    }
    await input.library.upsert({
      id: `music-${cat}`,
      type: "musica",
      license: "CC0-fixture",
      tags: [cat],
      characters: [],
      places: [],
      weight: 1,
      orientation: "horizontal",
      storageUri: `file://${file}`,
      musicCategory: cat,
      durationSec: 45,
    });
  }

  await writeFile(
    path.join(assetsRoot, "README.md"),
    "Fixture assets generated for MuseoArgent video-engine.\n",
  );
}

function run(bin: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, { stdio: ["ignore", "ignore", "pipe"] });
    let err = "";
    child.stderr.on("data", (d) => {
      err += String(d);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`seed ffmpeg failed: ${err.slice(-400)}`));
    });
  });
}
