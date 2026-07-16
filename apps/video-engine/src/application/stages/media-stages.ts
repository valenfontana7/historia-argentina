import type {
  AssetRecord,
  MusicCategory,
  MusicCue,
  SceneAssetBinding,
  StoryboardDocument,
  SubtitleDocument,
  VoiceTrack,
} from "@museoargent/video-contracts";
import { InsufficientAssetScoreError } from "../../domain/errors";
import type { AssetLibrary, AssetRanker } from "../ports/asset-library";
import type { MusicLibrary } from "../ports/music-library";
import type { ObjectStorage } from "../ports/object-storage";
import type { VoiceProvider } from "../ports/voice-provider";
import { ORIGEN_CONTEMPORANEA_TAG } from "../../infrastructure/assets/cache-exhibition-assets";
import { shotTypeAssetBoost } from "../../infrastructure/ffmpeg/ffmpeg-craft";
import { splitNarrationIntoCues, toAss, toSrt, toVtt } from "./subtitle-splitter";

/** Antes de 1900, excluir fotos/vistas contemporáneas del pool del reel. */
export const CONTEMPORARY_EXCLUDE_YEAR_END = 1900;

function isFixtureAssetId(id: string): boolean {
  return id.startsWith("fixture-");
}

function isContemporaryVisual(asset: AssetRecord): boolean {
  return asset.tags.includes(ORIGEN_CONTEMPORANEA_TAG);
}

export type AssetSelectContext = {
  yearEnd?: number;
};

export class VoiceGenerator {
  constructor(
    private readonly voice: VoiceProvider,
    private readonly storage: ObjectStorage,
  ) {}

  async generate(
    jobId: string,
    storyboard: StoryboardDocument,
  ): Promise<VoiceTrack[]> {
    const tracks: VoiceTrack[] = [];
    for (const scene of storyboard.scenes) {
      const key = `jobs/${jobId}/voice/scene-${scene.scene}.mp3`;
      const track = await this.voice.synthesize({
        text: scene.narration,
        outputUri: key,
        scene: scene.scene,
      });
      tracks.push(track);
    }
    return tracks;
  }
}

export class AssetSelector {
  constructor(
    private readonly library: AssetLibrary,
    private readonly ranker: AssetRanker,
    private readonly threshold: number,
  ) {}

  async select(
    storyboard: StoryboardDocument,
    preferredAssetIds: string[] = [],
    context: AssetSelectContext = {},
  ): Promise<SceneAssetBinding[]> {
    const used = new Set<string>();
    const bindings: SceneAssetBinding[] = [];
    const preferred = new Set(preferredAssetIds);
    const excludeContemporary =
      typeof context.yearEnd === "number" &&
      context.yearEnd < CONTEMPORARY_EXCLUDE_YEAR_END;
    const allVisualRaw = await this.library.listVisual();
    const allVisual = excludeContemporary
      ? allVisualRaw.filter((a) => !isContemporaryVisual(a))
      : allVisualRaw;
    const exhibitionAssets = allVisual.filter(
      (a) => preferred.has(a.id) && !isFixtureAssetId(a.id),
    );
    const hasExhibition = exhibitionAssets.length > 0;
    const nonFixtures = allVisual.filter((a) => !isFixtureAssetId(a.id));

    for (const scene of storyboard.scenes) {
      let candidates = await this.library.search(scene.assetHint);
      if (excludeContemporary) {
        candidates = candidates.filter((c) => !isContemporaryVisual(c));
      }
      if (!candidates.length) {
        candidates = [...allVisual];
      }

      if (hasExhibition) {
        candidates = candidates.filter((c) => !isFixtureAssetId(c.id));
        const preferredHit = candidates.filter((c) => preferred.has(c.id));
        candidates = preferredHit.length ? preferredHit : [...exhibitionAssets];
      }

      const unused = candidates.filter((c) => !used.has(c.id));
      if (unused.length) {
        candidates = unused;
      } else if (hasExhibition) {
        candidates = [...exhibitionAssets];
        if (!candidates.length) candidates = [...nonFixtures];
        if (!candidates.length) candidates = [...allVisual];
      } else if (!candidates.length) {
        candidates = [...allVisual];
      }

      const ranked = await this.ranker.rank(scene.assetHint, candidates);
      for (const r of ranked) {
        if (preferred.has(r.asset.id)) {
          r.score += 0.35;
          r.reason = `${r.reason},exhibition`;
        }
        const shotBoost = shotTypeAssetBoost(scene.shotType, r.asset.type);
        if (shotBoost > 0) {
          r.score += shotBoost;
          r.reason = `${r.reason},shot:${scene.shotType}`;
        }
        if (
          bindings.length &&
          bindings[bindings.length - 1].assetId === r.asset.id
        ) {
          r.score -= 0.4;
          r.reason = `${r.reason},consecutive-penalty`;
        }
        if (isFixtureAssetId(r.asset.id) && nonFixtures.length) {
          r.score -= 0.5;
          r.reason = `${r.reason},fixture-penalty`;
        }
      }
      ranked.sort((a, b) => b.score - a.score);
      const best = ranked[0];
      if (!best || best.score < this.threshold) {
        throw new InsufficientAssetScoreError(
          scene.scene,
          best?.score ?? 0,
          this.threshold,
        );
      }
      used.add(best.asset.id);
      bindings.push({
        scene: scene.scene,
        assetId: best.asset.id,
        score: best.score,
        reason: best.reason,
        storageUri: best.asset.storageUri,
      });
    }
    return bindings;
  }
}

export class SubtitleGenerator {
  constructor(private readonly storage: ObjectStorage) {}

  async generate(
    jobId: string,
    storyboard: StoryboardDocument,
    voices: VoiceTrack[],
  ): Promise<SubtitleDocument> {
    const cues = [];
    let index = 1;
    let cursor = 0;
    for (const scene of storyboard.scenes) {
      const voice = voices.find((v) => v.scene === scene.scene);
      const duration = voice?.durationSec ?? scene.durationSec;
      const start = cursor;
      const end = cursor + duration;
      const sceneCues = splitNarrationIntoCues(
        scene.narration,
        start,
        end,
        index,
      );
      cues.push(...sceneCues);
      index += sceneCues.length;
      cursor = end;
    }
    const srt = toSrt(cues);
    const vtt = toVtt(cues);
    const ass = toAss(cues);
    const srtUri = await this.storage.put(
      `jobs/${jobId}/subs/captions.srt`,
      srt,
      "application/x-subrip",
    );
    const vttUri = await this.storage.put(
      `jobs/${jobId}/subs/captions.vtt`,
      vtt,
      "text/vtt",
    );
    const assUri = await this.storage.put(
      `jobs/${jobId}/subs/captions.ass`,
      ass,
      "text/x-ass",
    );
    return { cues, srtUri, vttUri, assUri };
  }
}

export class MusicSelector {
  constructor(private readonly music: MusicLibrary) {}

  async select(
    categoryHint: MusicCategory | undefined,
  ): Promise<MusicCue> {
    const category = categoryHint ?? "institucional";
    const tracks = await this.music.findByCategory(category);
    const fallbackCategories: MusicCategory[] = [
      "institucional",
      "solemne",
      "epica",
      "emotiva",
      "suspenso",
    ];
    let chosen = tracks[0];
    if (!chosen) {
      for (const cat of fallbackCategories) {
        const list = await this.music.findByCategory(cat);
        if (list[0]) {
          chosen = list[0];
          break;
        }
      }
    }
    if (!chosen) {
      throw new Error(`No music tracks available for category ${category}`);
    }
    return {
      assetId: chosen.id,
      category: (chosen.musicCategory as MusicCategory) ?? category,
      storageUri: chosen.storageUri,
      gainDb: -22,
    };
  }
}
