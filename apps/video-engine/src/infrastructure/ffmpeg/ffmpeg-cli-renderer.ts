import { spawn } from "node:child_process";
import { access, mkdir, writeFile, stat, readFile } from "node:fs/promises";
import path from "node:path";
import type {
  ManifestScene,
  RenderResult,
  VideoManifest,
} from "@museoargent/video-contracts";
import { MissingBinaryError } from "../../domain/errors";
import type { FfmpegRenderer } from "../../application/ports/ffmpeg-renderer";
import type { ObjectStorage } from "../../application/ports/object-storage";
import { VIDEO_BRAND } from "../../branding/video-brand";
import {
  REEL_H,
  REEL_W,
  buildBlurBgFilterComplex,
  buildCoverFilter,
  buildSceneLookFilters,
  buildZoompan,
  mapXfade,
  orientationFromSize,
  shouldUseBlurBackground,
  type ImageOrientation,
} from "./ffmpeg-craft";
import {
  REEL_FONT_FAMILY,
  REEL_FONT_FILE,
  REEL_FONTS_DIR,
  escapeFfmpegPath,
} from "./reel-fonts";

const W = REEL_W;
const H = REEL_H;

/** Encode craft v3.1: nitidez sin mush. */
const X264_ARGS = [
  "-c:v",
  "libx264",
  "-crf",
  "18",
  "-preset",
  "medium",
  "-pix_fmt",
  "yuv420p",
] as const;

export class FfmpegCliRenderer implements FfmpegRenderer {
  constructor(
    private readonly storage: ObjectStorage,
    private readonly ffmpegPath: string,
    private readonly ffprobePath: string,
  ) {}

  async healthcheck(): Promise<boolean> {
    try {
      await run(this.ffmpegPath, ["-version"]);
      await run(this.ffprobePath, ["-version"]);
      return true;
    } catch {
      return false;
    }
  }

  async render(
    manifest: VideoManifest,
    outputUri: string,
  ): Promise<RenderResult> {
    const ok = await this.healthcheck();
    if (!ok) throw new MissingBinaryError(this.ffmpegPath);

    const outPath = this.storage.resolvePath(outputUri);
    await mkdir(path.dirname(outPath), { recursive: true });
    const workDir = path.join(path.dirname(outPath), "ffmpeg-work");
    await mkdir(workDir, { recursive: true });

    const fps = manifest.format.fps;
    const sceneClips: string[] = [];

    for (let i = 0; i < manifest.scenes.length; i++) {
      const scene = manifest.scenes[i];
      const scenePath = path.join(workDir, `scene-${i}.mp4`);
      await this.renderScene(scene, scenePath, fps);
      sceneClips.push(scenePath);
    }

    if (manifest.branding) {
      const brandPath = path.join(workDir, "brand.mp4");
      await this.renderBranding(manifest, brandPath, fps);
      sceneClips.push(brandPath);
    }

    const silentVideo = path.join(workDir, "silent.mp4");
    await this.concatWithTransitions(
      sceneClips,
      manifest.scenes.map((s) => s.transition?.type ?? "fade"),
      silentVideo,
      fps,
    );

    const mixed = path.join(workDir, "mixed.mp4");
    await this.mixAudio(manifest, silentVideo, mixed, workDir);

    if (manifest.subtitles) {
      await this.burnSubtitles(manifest.subtitles.uri, mixed, outPath);
    } else {
      await run(this.ffmpegPath, ["-y", "-i", mixed, "-c", "copy", outPath]);
    }

    const durationSec = await probeDuration(this.ffprobePath, outPath);
    const bytes = (await stat(outPath)).size;
    return {
      mp4Uri: `file://${outPath}`,
      width: W,
      height: H,
      durationSec,
      bytes,
    };
  }

  private async renderScene(
    scene: ManifestScene,
    outPath: string,
    fps: number,
  ): Promise<void> {
    const imageLayer = scene.layers.find((l) => l.kind === "image");
    const textLayer = scene.layers.find((l) => l.kind === "text" && l.text);
    const solid = scene.layers.find((l) => l.kind === "solid");
    const duration = scene.durationSec;
    const motion = scene.animations[0]?.type ?? "kenBurns";
    const intensity = scene.animations[0]?.intensity ?? 0.1;
    const look = buildSceneLookFilters().join(",");
    const zoom = buildZoompan(motion, duration, fps, intensity);
    const text =
      textLayer?.text != null
        ? `,${drawTextFilter(textLayer.text, textLayer.y ?? 240, textLayer.fontSize ?? 48)}`
        : "";

    if (imageLayer?.uri) {
      const img = this.storage.resolvePath(imageLayer.uri);
      const orientation = await this.probeOrientation(img);
      const useBlur = shouldUseBlurBackground(orientation);

      if (useBlur) {
        const complex = [
          buildBlurBgFilterComplex(),
          zoom === "null"
            ? `[framed]${look}${text},format=yuv420p[vout]`
            : `[framed]${zoom},${look}${text},format=yuv420p[vout]`,
        ].join(";");
        await run(this.ffmpegPath, [
          "-y",
          "-loop",
          "1",
          "-i",
          img,
          "-filter_complex",
          complex,
          "-map",
          "[vout]",
          "-t",
          String(duration),
          "-r",
          String(fps),
          "-an",
          ...X264_ARGS,
          outPath,
        ]);
        return;
      }

      const chain = [
        buildCoverFilter(),
        zoom === "null" ? null : zoom,
        look,
        textLayer?.text
          ? drawTextFilter(
              textLayer.text,
              textLayer.y ?? 240,
              textLayer.fontSize ?? 48,
            )
          : null,
        "format=yuv420p",
      ]
        .filter(Boolean)
        .join(",");

      await run(this.ffmpegPath, [
        "-y",
        "-loop",
        "1",
        "-i",
        img,
        "-vf",
        chain,
        "-t",
        String(duration),
        "-r",
        String(fps),
        "-an",
        ...X264_ARGS,
        outPath,
      ]);
      return;
    }

    const color = (solid?.color ?? "#111111").replace("#", "");
    await run(this.ffmpegPath, [
      "-y",
      "-f",
      "lavfi",
      "-i",
      `color=c=0x${color}:s=${W}x${H}:d=${duration}:r=${fps}`,
      "-vf",
      textLayer?.text
        ? `${drawTextFilter(textLayer.text, textLayer.y ?? 900, textLayer.fontSize ?? 56)},${look},format=yuv420p`
        : `${look},format=yuv420p`,
      "-an",
      ...X264_ARGS,
      outPath,
    ]);
  }

  private async probeOrientation(imgPath: string): Promise<ImageOrientation> {
    try {
      const { width, height } = await probeImageSize(this.ffprobePath, imgPath);
      return orientationFromSize(width, height);
    } catch {
      return "horizontal";
    }
  }

  private async renderBranding(
    manifest: VideoManifest,
    outPath: string,
    fps: number,
  ): Promise<void> {
    const layers = manifest.branding!.layers;
    const d = manifest.branding!.endCardDurationSec;
    const bg =
      layers.find((l) => l.id === "brand-bg")?.color?.replace("#", "") ??
      VIDEO_BRAND.colors.bg.replace("#", "");
    const title =
      layers.find((l) => l.id === "brand-text")?.text ?? VIDEO_BRAND.displayName;
    const handle =
      layers.find((l) => l.id === "brand-handle")?.text ?? VIDEO_BRAND.handle;
    const cta =
      layers.find((l) => l.id === "brand-cta")?.text ??
      `Seguí explorando · ${VIDEO_BRAND.handle}`;
    const url =
      layers.find((l) => l.id === "brand-url")?.text ?? VIDEO_BRAND.urlLabel;
    const logoLayer = layers.find((l) => l.id === "brand-logo");
    const logoSize = logoLayer?.width ?? VIDEO_BRAND.logoSize;
    const logoY = logoLayer?.y ?? VIDEO_BRAND.logoY;
    const oro = VIDEO_BRAND.colors.oro.replace("#", "0x");

    let logoPath: string | null = null;
    if (logoLayer?.uri) {
      const resolved = this.storage.resolvePath(logoLayer.uri);
      try {
        await access(resolved);
        logoPath = resolved;
      } catch {
        console.warn(
          JSON.stringify({
            msg: "brand logo missing, end card text-only",
            path: resolved,
          }),
        );
      }
    }

    const textFilters = [
      drawTextFilter(title, 900, 72, { color: "white", box: false }),
      drawTextFilter(handle, 990, 40, { color: oro, box: false }),
      drawTextFilter(cta, 1120, 36, { color: "white", box: true }),
      drawTextFilter(url, 1220, 28, { color: "0xaaaaaa", box: false }),
    ];

    if (logoPath) {
      const complex = [
        `[1:v]scale=${logoSize}:${logoSize}:flags=lanczos[logo]`,
        `[0:v][logo]overlay=(W-w)/2:${logoY}[base]`,
        `[base]${textFilters.join(",")},fade=t=in:st=0:d=0.7,format=yuv420p[vout]`,
      ].join(";");
      await run(this.ffmpegPath, [
        "-y",
        "-f",
        "lavfi",
        "-i",
        `color=c=0x${bg}:s=${W}x${H}:d=${d}:r=${fps}`,
        "-loop",
        "1",
        "-i",
        logoPath,
        "-filter_complex",
        complex,
        "-map",
        "[vout]",
        "-t",
        String(d),
        "-r",
        String(fps),
        "-an",
        ...X264_ARGS,
        outPath,
      ]);
      return;
    }

    const vf = [
      ...textFilters,
      `fade=t=in:st=0:d=0.7`,
      "format=yuv420p",
    ].join(",");
    await run(this.ffmpegPath, [
      "-y",
      "-f",
      "lavfi",
      "-i",
      `color=c=0x${bg}:s=${W}x${H}:d=${d}:r=${fps}`,
      "-vf",
      vf,
      "-an",
      ...X264_ARGS,
      outPath,
    ]);
  }

  private async concatWithTransitions(
    clips: string[],
    sceneTransitions: string[],
    outPath: string,
    fps: number,
  ): Promise<void> {
    if (clips.length === 1) {
      await run(this.ffmpegPath, ["-y", "-i", clips[0], "-c", "copy", outPath]);
      return;
    }

    const durations: number[] = [];
    for (const clip of clips) {
      durations.push(await probeDuration(this.ffprobePath, clip));
    }

    const inputs = clips.flatMap((c) => ["-i", c]);
    let filter = "";
    let lastLabel = "[0:v]";
    /** Duración acumulada del stream compuesto (no usar suma naive con cuts cortos). */
    let timelineSec = durations[0];

    for (let i = 1; i < clips.length; i++) {
      const tType =
        i - 1 < sceneTransitions.length ? sceneTransitions[i - 1] : "crossfade";
      const xfade = mapXfade(tType);
      const outLabel = i === clips.length - 1 ? "[vout]" : `[v${i}]`;
      const offset = Math.max(0, Number((timelineSec - xfade.duration).toFixed(3)));
      filter += `${lastLabel}[${i}:v]xfade=transition=${xfade.transition}:duration=${xfade.duration}:offset=${offset},setsar=1${outLabel};`;
      timelineSec = timelineSec + durations[i] - xfade.duration;
      lastLabel = outLabel;
    }

    if (filter.endsWith(";")) filter = filter.slice(0, -1);

    await run(this.ffmpegPath, [
      "-y",
      ...inputs,
      "-filter_complex",
      filter,
      "-map",
      "[vout]",
      "-r",
      String(fps),
      "-an",
      ...X264_ARGS,
      outPath,
    ]);
  }

  private async mixAudio(
    manifest: VideoManifest,
    silentVideo: string,
    outPath: string,
    workDir: string,
  ): Promise<void> {
    const narration = manifest.audio.find((a) => a.role === "narration");
    const music = manifest.audio.find((a) => a.role === "music");
    const videoDur = await probeDuration(this.ffprobePath, silentVideo);

    const args = ["-y", "-i", silentVideo];
    let narrPath: string | null = null;
    if (narration) {
      narrPath = await this.resolveAudio(narration.uri, workDir);
      if (narrPath) args.push("-i", narrPath);
    }

    let musicPath: string | null = null;
    if (music) {
      musicPath = this.storage.resolvePath(music.uri);
      args.push("-stream_loop", "-1", "-i", musicPath);
    }

    const filters: string[] = [];
    const hasNarr = Boolean(narrPath);
    const hasMusic = Boolean(musicPath);
    const musicGain = Math.pow(10, (music?.gainDb ?? -22) / 20);

    if (hasNarr && hasMusic) {
      filters.push(
        `[1:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=mono,volume=1,asplit=2[a1][a1sc]`,
      );
      filters.push(
        `[2:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=mono,volume=${musicGain.toFixed(4)}[a2raw]`,
      );
      filters.push(
        `[a2raw][a1sc]sidechaincompress=threshold=0.05:ratio=6:attack=50:release=300[a2]`,
      );
      filters.push(
        `[a1][a2]amix=inputs=2:duration=first:dropout_transition=2,atrim=0:${videoDur.toFixed(3)},asetpts=PTS-STARTPTS[aout]`,
      );
    } else if (hasNarr) {
      filters.push(
        `[1:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=mono,atrim=0:${videoDur.toFixed(3)},asetpts=PTS-STARTPTS[aout]`,
      );
    } else if (hasMusic) {
      filters.push(
        `[1:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=mono,volume=${musicGain.toFixed(4)},atrim=0:${videoDur.toFixed(3)},asetpts=PTS-STARTPTS[aout]`,
      );
    }

    if (filters.length) {
      args.push(
        "-filter_complex",
        filters.join(";"),
        "-map",
        "0:v",
        "-map",
        "[aout]",
        "-c:v",
        "copy",
        "-c:a",
        "aac",
        "-shortest",
        "-movflags",
        "+faststart",
        outPath,
      );
    } else {
      args.push("-c:v", "copy", "-an", outPath);
    }
    await run(this.ffmpegPath, args);
  }

  private async burnSubtitles(
    subUri: string,
    inputPath: string,
    outPath: string,
  ): Promise<void> {
    const resolved = this.storage.resolvePath(subUri);
    const escaped = escapeFfmpegPath(resolved);
    const fontsDir = escapeFfmpegPath(REEL_FONTS_DIR);
    const isAss = resolved.toLowerCase().endsWith(".ass");
    // ASS propio (PlayRes 1080×1920): filter ass= + fontsdir.
    // SRT legacy: force_style con PlayRes explícito (evitar escala 384×288).
    const vf = isAss
      ? `ass='${escaped}':fontsdir='${fontsDir}'`
      : `subtitles='${escaped}':fontsdir='${fontsDir}':force_style='FontName=${REEL_FONT_FAMILY},FontSize=52,PrimaryColour=&H00FFFFFF&,OutlineColour=&H00000000&,BorderStyle=1,Outline=3,Shadow=0,MarginV=160,Alignment=2,Bold=1,PlayResX=1080,PlayResY=1920'`;
    try {
      await run(this.ffmpegPath, [
        "-y",
        "-i",
        inputPath,
        "-vf",
        vf,
        ...X264_ARGS,
        "-c:a",
        "copy",
        "-movflags",
        "+faststart",
        outPath,
      ]);
    } catch (err) {
      console.warn(
        JSON.stringify({
          msg: "subtitle burn-in failed, copying without subs",
          error: err instanceof Error ? err.message : String(err),
        }),
      );
      await run(this.ffmpegPath, ["-y", "-i", inputPath, "-c", "copy", outPath]);
    }
  }

  private async resolveAudio(
    uri: string,
    workDir: string,
  ): Promise<string | null> {
    const resolved = this.storage.resolvePath(uri);
    if (resolved.endsWith(".json")) {
      const raw = await readFile(resolved, "utf8");
      const list = JSON.parse(raw) as string[];
      if (!list.length) return null;
      const out = path.join(workDir, "narration.wav");
      const parts: string[] = [];
      for (let i = 0; i < list.length; i++) {
        const src = this.storage.resolvePath(list[i]);
        const part = path.join(workDir, `narr-part-${i}.wav`);
        await run(this.ffmpegPath, [
          "-y",
          "-i",
          src,
          "-ac",
          "1",
          "-ar",
          "44100",
          part,
        ]);
        parts.push(part);
      }
      const concat = path.join(workDir, "narration-concat.txt");
      await writeFile(
        concat,
        parts.map((p) => `file '${p.replace(/\\/g, "/")}'`).join("\n"),
      );
      await run(this.ffmpegPath, [
        "-y",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        concat,
        "-c",
        "copy",
        out,
      ]);
      return out;
    }
    const out = path.join(workDir, "narration-single.wav");
    await run(this.ffmpegPath, [
      "-y",
      "-i",
      resolved,
      "-ac",
      "1",
      "-ar",
      "44100",
      out,
    ]);
    return out;
  }
}

function drawTextFilter(
  text: string,
  y: number,
  fontSize: number,
  opts?: { color?: string; box?: boolean },
): string {
  const escaped = text
    .replace(/\\/g, "\\\\")
    .replace(/:/g, "\\:")
    .replace(/'/g, "\\'")
    .replace(/%/g, "\\%");
  const fontfile = escapeFfmpegPath(REEL_FONT_FILE);
  const color = opts?.color ?? "white";
  const box =
    opts?.box === false
      ? "box=0"
      : "box=1:boxcolor=black@0.45:boxborderw=12";
  return `drawtext=fontfile='${fontfile}':text='${escaped}':fontcolor=${color}:fontsize=${fontSize}:borderw=2:bordercolor=black@0.7:${box}:x=(w-text_w)/2:y=${y}`;
}

function run(bin: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    // -threads 1: protege VPS con poca RAM (p. ej. 1 GB).
    const withThreads =
      bin.includes("ffprobe") || args.includes("-threads")
        ? args
        : ["-threads", "1", ...args];
    const child = spawn(bin, withThreads, {
      stdio: ["ignore", "ignore", "pipe"],
    });
    let err = "";
    child.stderr.on("data", (d) => {
      err += String(d);
    });
    child.on("error", (e) => reject(e));
    child.on("close", (code) => {
      if (code === 0) resolve();
      else
        reject(
          new Error(
            `${bin} failed (${code}): ${args.slice(0, 8).join(" ")}… ${err.slice(-900)}`,
          ),
        );
    });
  });
}

function probeDuration(ffprobe: string, file: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      ffprobe,
      [
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "default=noprint_wrappers=1:nokey=1",
        file,
      ],
      { stdio: ["ignore", "pipe", "pipe"] },
    );
    let out = "";
    child.stdout.on("data", (d) => {
      out += String(d);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) reject(new Error("ffprobe failed"));
      else resolve(Math.max(0.1, Number(out.trim()) || 1));
    });
  });
}

function probeImageSize(
  ffprobe: string,
  file: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
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
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error("ffprobe image size failed"));
        return;
      }
      const [w, h] = out
        .trim()
        .split("x")
        .map((n) => Number(n));
      if (!w || !h) reject(new Error("invalid image size"));
      else resolve({ width: w, height: h });
    });
  });
}
