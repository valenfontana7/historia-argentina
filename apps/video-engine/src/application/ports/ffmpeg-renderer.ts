import type { RenderResult, VideoManifest } from "@museoargent/video-contracts";

export interface FfmpegRenderer {
  render(
    manifest: VideoManifest,
    outputUri: string,
    signal?: AbortSignal,
  ): Promise<RenderResult>;
  healthcheck(): Promise<boolean>;
}
