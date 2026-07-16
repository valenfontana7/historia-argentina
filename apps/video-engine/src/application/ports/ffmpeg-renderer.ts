import type { RenderResult, VideoManifest } from "@museoargent/video-contracts";

export interface FfmpegRenderer {
  render(manifest: VideoManifest, outputUri: string): Promise<RenderResult>;
  healthcheck(): Promise<boolean>;
}
