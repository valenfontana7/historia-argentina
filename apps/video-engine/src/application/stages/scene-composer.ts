import {
  VERTICAL_1080x1920,
  type MusicCue,
  type SceneAssetBinding,
  type StoryboardDocument,
  type SubtitleDocument,
  type VideoFormatProfile,
  type VideoManifest,
  type VoiceTrack,
} from "@museoargent/video-contracts";
import type { ObjectStorage } from "../ports/object-storage";
import { motionIntensityForScene } from "../../infrastructure/ffmpeg/ffmpeg-craft";
import {
  VIDEO_BRAND,
  defaultVideoCta,
  videoBrandLogoPath,
} from "../../branding/video-brand";

export class SceneComposer {
  constructor(private readonly storage: ObjectStorage) {}

  async compose(input: {
    jobId: string;
    storyboard: StoryboardDocument;
    assets: SceneAssetBinding[];
    voices: VoiceTrack[];
    subtitles: SubtitleDocument;
    music: MusicCue;
    cta?: string;
  }): Promise<{ manifest: VideoManifest; manifestUri: string }> {
    const cta = input.cta?.trim() || defaultVideoCta();
    const scenes = input.storyboard.scenes.map((scene, sceneIndex) => {
      const binding = input.assets.find((a) => a.scene === scene.scene);
      if (!binding) {
        throw new Error(`Missing asset binding for scene ${scene.scene}`);
      }
      const intensity = motionIntensityForScene({
        sceneIndex,
        shotType: scene.shotType,
        motion: scene.motion,
      });
      return {
        id: `scene-${scene.scene}`,
        durationSec: scene.durationSec,
        layers: [
          {
            id: `img-${scene.scene}`,
            kind: "image" as const,
            uri: binding.storageUri,
          },
          ...(scene.onScreenText
            ? [
                {
                  id: `txt-${scene.scene}`,
                  kind: "text" as const,
                  text: sanitizeOnScreenText(scene.onScreenText),
                  y: 240,
                  fontSize: 48,
                },
              ]
            : []),
        ],
        animations: [
          {
            type: scene.motion,
            startSec: 0,
            intensity,
          },
        ],
        transition: {
          type: scene.transition,
          durationSec: scene.transition === "cut" ? 0.01 : 0.4,
        },
      };
    });

    for (const scene of scenes) {
      const n = Number(scene.id.replace("scene-", ""));
      const voice = input.voices.find((v) => v.scene === n);
      if (voice?.durationSec && Number.isFinite(voice.durationSec)) {
        // Evitar renders infinitos si un provider reporta duración absurda.
        scene.durationSec = Math.max(
          0.4,
          Math.min(45, voice.durationSec),
        );
      }
    }

    const narrationUri =
      input.voices.length === 1
        ? input.voices[0].fileUri
        : await this.concatPlaceholder(input.jobId, input.voices);

    const logoPath = videoBrandLogoPath();
    const manifest: VideoManifest = {
      version: 1,
      format: VERTICAL_1080x1920,
      scenes,
      audio: [
        { role: "narration", uri: narrationUri, gainDb: 0 },
        {
          role: "music",
          uri: input.music.storageUri,
          gainDb: input.music.gainDb,
        },
      ],
      subtitles: input.subtitles.assUri
        ? { format: "ass" as const, uri: input.subtitles.assUri }
        : { format: "srt" as const, uri: input.subtitles.srtUri },
      branding: {
        endCardDurationSec: VIDEO_BRAND.endCardDurationSec,
        layers: [
          {
            id: "brand-bg",
            kind: "solid",
            color: VIDEO_BRAND.colors.bg,
          },
          {
            id: "brand-logo",
            kind: "image",
            uri: `file://${logoPath}`,
            y: VIDEO_BRAND.logoY,
            width: VIDEO_BRAND.logoSize,
            height: VIDEO_BRAND.logoSize,
          },
          {
            id: "brand-text",
            kind: "text",
            text: VIDEO_BRAND.displayName,
            fontSize: 72,
            y: 900,
          },
          {
            id: "brand-handle",
            kind: "text",
            text: VIDEO_BRAND.handle,
            fontSize: 40,
            y: 990,
          },
          {
            id: "brand-cta",
            kind: "text",
            text: cta,
            fontSize: 36,
            y: 1120,
          },
          {
            id: "brand-url",
            kind: "text",
            text: VIDEO_BRAND.urlLabel,
            fontSize: 28,
            y: 1220,
          },
        ],
      },
    };

    const manifestUri = await this.storage.put(
      `jobs/${input.jobId}/manifest.json`,
      JSON.stringify(manifest, null, 2),
      "application/json",
    );
    return { manifest, manifestUri };
  }

  private async concatPlaceholder(
    jobId: string,
    voices: VoiceTrack[],
  ): Promise<string> {
    const playlist = voices.map((v) => v.fileUri);
    return this.storage.put(
      `jobs/${jobId}/voice/playlist.json`,
      JSON.stringify(playlist),
      "application/json",
    );
  }
}

/** Hook corto, sin punto final, máx ~28 chars para drawtext. */
function sanitizeOnScreenText(raw: string): string {
  let t = raw.trim().replace(/\.+$/, "");
  if (t.length > 28) {
    const cut = t.slice(0, 28);
    const sp = cut.lastIndexOf(" ");
    t = (sp > 12 ? cut.slice(0, sp) : cut).trim();
  }
  return t;
}

/** Helper tipado para el orchestrator. */
export type ComposerCta = Pick<VideoFormatProfile, "cta">;
