import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

function canRun(bin: string): boolean {
  const r = spawnSync(bin, ["-version"], {
    encoding: "utf8",
    windowsHide: true,
  });
  return r.status === 0;
}

function findUnderWinGet(name: "ffmpeg" | "ffprobe"): string | undefined {
  const base = path.join(
    process.env.LOCALAPPDATA ?? path.join(homedir(), "AppData", "Local"),
    "Microsoft",
    "WinGet",
    "Packages",
  );
  if (!existsSync(base)) return undefined;

  try {
    for (const pkg of readdirSync(base)) {
      if (!/ffmpeg/i.test(pkg)) continue;
      const pkgDir = path.join(base, pkg);
      for (const child of readdirSync(pkgDir)) {
        if (!child.startsWith("ffmpeg-")) continue;
        const bin = path.join(pkgDir, child, "bin", `${name}.exe`);
        if (existsSync(bin) && canRun(bin)) return bin;
      }
    }
  } catch {
    return undefined;
  }
  return undefined;
}

/** Resuelve rutas absolutas a ffmpeg/ffprobe (PATH, env, o instalación WinGet). */
export function resolveFfmpegBinaries(env: NodeJS.ProcessEnv = process.env): {
  ffmpegPath: string;
  ffprobePath: string;
} {
  const ffmpegEnv = env.FFMPEG_PATH;
  const ffprobeEnv = env.FFPROBE_PATH;

  let ffmpegPath = ffmpegEnv && existsSync(ffmpegEnv) ? ffmpegEnv : "ffmpeg";
  let ffprobePath =
    ffprobeEnv && existsSync(ffprobeEnv) ? ffprobeEnv : "ffprobe";

  if (!canRun(ffmpegPath)) {
    ffmpegPath = findUnderWinGet("ffmpeg") ?? ffmpegPath;
  }
  if (!canRun(ffprobePath)) {
    const sibling =
      ffmpegPath !== "ffmpeg"
        ? path.join(path.dirname(ffmpegPath), "ffprobe.exe")
        : undefined;
    if (sibling && existsSync(sibling) && canRun(sibling)) {
      ffprobePath = sibling;
    } else {
      ffprobePath = findUnderWinGet("ffprobe") ?? ffprobePath;
    }
  }

  return { ffmpegPath, ffprobePath };
}
