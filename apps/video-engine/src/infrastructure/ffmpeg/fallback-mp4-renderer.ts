import { mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import type { RenderResult, VideoManifest } from "@museoargent/video-contracts";
import type { FfmpegRenderer } from "../../application/ports/ffmpeg-renderer";
import type { ObjectStorage } from "../../application/ports/object-storage";

/** MP4 mínimo (ftyp + mdat vacío) para CI sin binario ffmpeg. */
const MINIMAL_MP4 = Buffer.from([
  0x00, 0x00, 0x00, 0x1c, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d, 0x00,
  0x00, 0x02, 0x00, 0x69, 0x73, 0x6f, 0x6d, 0x69, 0x73, 0x6f, 0x32, 0x6d, 0x70,
  0x34, 0x31, 0x00, 0x00, 0x00, 0x08, 0x66, 0x72, 0x65, 0x65, 0x00, 0x00, 0x00,
  0x08, 0x6d, 0x64, 0x61, 0x74,
]);

/**
 * Renderer de emergencia cuando ffmpeg/ffprobe no están en PATH.
 * El renderer de producción es `FfmpegCliRenderer`.
 */
export class FallbackMp4Renderer implements FfmpegRenderer {
  constructor(private readonly storage: ObjectStorage) {}

  async healthcheck(): Promise<boolean> {
    return true;
  }

  async render(
    manifest: VideoManifest,
    outputUri: string,
  ): Promise<RenderResult> {
    const outPath = this.storage.resolvePath(outputUri);
    await mkdir(path.dirname(outPath), { recursive: true });
    const durationSec =
      manifest.scenes.reduce((n, s) => n + s.durationSec, 0) +
      (manifest.branding?.endCardDurationSec ?? 0);
    await writeFile(outPath, MINIMAL_MP4);
    const bytes = (await stat(outPath)).size;
    return {
      mp4Uri: `file://${outPath}`,
      width: manifest.format.width,
      height: manifest.format.height,
      durationSec,
      bytes,
    };
  }
}
