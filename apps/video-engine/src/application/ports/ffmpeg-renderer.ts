import type {
  ManifestScene,
  RenderResult,
  VideoManifest,
} from "@museoargent/video-contracts";

export interface FfmpegRenderer {
  render(
    manifest: VideoManifest,
    outputUri: string,
    signal?: AbortSignal,
  ): Promise<RenderResult>;
  /** Clip silencioso de una escena (preview / incremental). */
  renderSceneClip(
    scene: ManifestScene,
    outputUri: string,
    fps: number,
    signal?: AbortSignal,
  ): Promise<void>;
  /** Concat + audio + subs a partir de clips de escena ya renderizados. */
  stitchFromSceneClips(
    clipUris: string[],
    manifest: VideoManifest,
    outputUri: string,
    signal?: AbortSignal,
  ): Promise<RenderResult>;
  healthcheck(): Promise<boolean>;
}
