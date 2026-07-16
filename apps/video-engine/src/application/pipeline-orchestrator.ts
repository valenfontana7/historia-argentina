import { readFile } from "node:fs/promises";
import {
  DEFAULT_FORMAT_PROFILES,
  ExhibitionSchema,
  type Exhibition,
  type ProfileOverrides,
  type VideoFormatId,
  type VideoFormatProfile,
} from "@museoargent/video-contracts";
import type { ClaimedJob, JobQueue } from "./ports/job-queue";
import type { LlmProvider } from "./ports/llm-provider";
import type { VoiceProvider } from "./ports/voice-provider";
import type { ObjectStorage } from "./ports/object-storage";
import type { AssetLibrary, AssetRanker } from "./ports/asset-library";
import type { MusicLibrary } from "./ports/music-library";
import type { FfmpegRenderer } from "./ports/ffmpeg-renderer";
import type { EngineConfig } from "./config";
import type { RenderResult } from "@museoargent/video-contracts";
import type { PipelineStage } from "@museoargent/video-contracts";
import { ScriptGenerator, StoryboardGenerator } from "./stages/script-storyboard";
import {
  AssetSelector,
  MusicSelector,
  SubtitleGenerator,
  VoiceGenerator,
} from "./stages/media-stages";
import { SceneComposer } from "./stages/scene-composer";

export function mergeFormatProfile(
  formatId: VideoFormatId | string,
  overrides?: ProfileOverrides,
): VideoFormatProfile {
  const base =
    DEFAULT_FORMAT_PROFILES[formatId as VideoFormatId] ??
    DEFAULT_FORMAT_PROFILES.reel;
  if (!overrides) return base;
  return {
    ...base,
    ...(overrides.targetDurationSec != null
      ? { targetDurationSec: overrides.targetDurationSec }
      : {}),
    ...(overrides.tone ? { tone: overrides.tone } : {}),
    ...(overrides.cta ? { cta: overrides.cta } : {}),
    ...(overrides.narrativePace
      ? { narrativePace: overrides.narrativePace }
      : {}),
  };
}

export class PipelineOrchestrator {
  constructor(
    private readonly deps: {
      queue: JobQueue;
      storage: ObjectStorage;
      llm: LlmProvider;
      voice: VoiceProvider;
      assets: AssetLibrary;
      ranker: AssetRanker;
      music: MusicLibrary;
      renderer: FfmpegRenderer;
      config: EngineConfig;
      promptsRoot: string;
      fakeLlm?: LlmProvider;
      fakeVoice?: VoiceProvider;
    },
  ) {}

  async run(job: ClaimedJob): Promise<void> {
    const started = Date.now();
    const timings: Record<string, number> = {};
    const useFake = job.useFakeProviders || this.deps.config.useFakeProvidersDefault;
    const llm = useFake && this.deps.fakeLlm ? this.deps.fakeLlm : this.deps.llm;
    const voice =
      useFake && this.deps.fakeVoice ? this.deps.fakeVoice : this.deps.voice;

    try {
      const exhibition = ExhibitionSchema.parse(job.exhibitionJson);
      const overrides =
        job.profileOverrides ?? (await this.loadProfileOverrides(job.id));
      const profile = mergeFormatProfile(job.formatId, overrides);

      await this.timed(job.id, "ingest", timings, async () => undefined);

      const scriptGen = new ScriptGenerator(llm, this.deps.promptsRoot);
      const script = await this.timed(job.id, "script", timings, () =>
        scriptGen.generate(exhibition, profile),
      );

      const storyGen = new StoryboardGenerator(llm, this.deps.promptsRoot);
      const storyboard = await this.timed(job.id, "storyboard", timings, () =>
        storyGen.generate(exhibition, profile, script),
      );

      const voiceGen = new VoiceGenerator(voice, this.deps.storage);
      const voices = await this.timed(job.id, "voice", timings, () =>
        voiceGen.generate(job.id, storyboard),
      );

      const assetSel = new AssetSelector(
        this.deps.assets,
        this.deps.ranker,
        this.deps.config.assetScoreThreshold,
      );
      const assets = await this.timed(job.id, "assets", timings, () =>
        assetSel.select(
          storyboard,
          exhibition.images.map((i) => i.assetId),
        ),
      );

      const subGen = new SubtitleGenerator(this.deps.storage);
      const subtitles = await this.timed(job.id, "subtitles", timings, () =>
        subGen.generate(job.id, storyboard, voices),
      );

      const musicSel = new MusicSelector(this.deps.music);
      const music = await this.timed(job.id, "music", timings, () =>
        musicSel.select(storyboard.musicCategoryHint ?? script.musicCategoryHint),
      );

      const composer = new SceneComposer(this.deps.storage);
      const { manifest, manifestUri } = await this.timed(
        job.id,
        "compose",
        timings,
        () =>
          composer.compose({
            jobId: job.id,
            storyboard,
            assets,
            voices,
            subtitles,
            music,
            cta: profile.cta,
          }),
      );

      const outputKey = `jobs/${job.id}/output.mp4`;
      const render: RenderResult = await this.timed(job.id, "render", timings, () =>
        this.deps.renderer.render(manifest, outputKey),
      );

      await this.deps.queue.complete(job.id, {
        outputMp4Uri: render.mp4Uri,
        outputBytes: render.bytes,
        outputDurationSec: render.durationSec,
        manifestUri,
        assetsUsed: assets.map((a) => a.assetId),
        llmProvider: llm.name,
        llmModel: llm.model,
        ttsProvider: voice.name,
        ttsVoice: voices[0]?.voice,
        stageTimingsMs: {
          ...timings,
          wall: Date.now() - started,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await this.deps.queue.fail(job.id, message);
      throw err;
    }
  }

  private async loadProfileOverrides(
    jobId: string,
  ): Promise<ProfileOverrides | undefined> {
    try {
      const filePath = this.deps.storage.resolvePath(
        `jobs/${jobId}/profile-overrides.json`,
      );
      const raw = await readFile(filePath, "utf8");
      return JSON.parse(raw) as ProfileOverrides;
    } catch {
      return undefined;
    }
  }

  private async timed<T>(
    jobId: string,
    stage: PipelineStage,
    timings: Record<string, number>,
    fn: () => Promise<T>,
  ): Promise<T> {
    const t0 = Date.now();
    await this.deps.queue.markStage(jobId, stage);
    const result = await fn();
    const ms = Date.now() - t0;
    timings[stage] = ms;
    await this.deps.queue.markStage(jobId, stage, ms);
    return result;
  }
}

export function validateExhibition(input: unknown): Exhibition {
  return ExhibitionSchema.parse(input);
}
