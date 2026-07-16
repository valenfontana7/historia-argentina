import { readFile } from "node:fs/promises";
import {
  DEFAULT_FORMAT_PROFILES,
  ExhibitionSchema,
  type Exhibition,
  type ProfileOverrides,
  type SceneAssetBinding,
  type StoryboardDocument,
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
import {
  clearJobAbort,
  jobAbortSignal,
  registerJobAbort,
} from "./job-abort";
import {
  JobCancelledError,
  isJobCancelledError,
} from "./job-cancelled-error";
import {
  bindingsFromDraft,
  buildDraft,
  catalogItemsFromRecord,
  readImageCatalog,
  readJobDraft,
  writeJobDraft,
} from "./job-draft";

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

    const signal = registerJobAbort(job.id);

    try {
      await this.throwIfCancelled(job.id);

      const exhibition = await this.loadExhibition(job);
      const overrides =
        job.profileOverrides ?? (await this.loadProfileOverrides(job.id));
      const profile = mergeFormatProfile(job.formatId, overrides);

      if (job.resumePhase === "render") {
        await this.runRenderPhase({
          job,
          exhibition,
          profile,
          llm,
          voice,
          timings,
          started,
          signal,
        });
        return;
      }

      await this.timed(job.id, "ingest", timings, async () => undefined);

      const scriptGen = new ScriptGenerator(llm, this.deps.promptsRoot);
      const script = await this.timed(job.id, "script", timings, () =>
        scriptGen.generate(exhibition, profile),
      );

      const storyGen = new StoryboardGenerator(llm, this.deps.promptsRoot);
      const storyboard = await this.timed(job.id, "storyboard", timings, () =>
        storyGen.generate(exhibition, profile, script),
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
          { yearEnd: exhibition.yearEnd },
        ),
      );

      const catalogRecord = await readImageCatalog(this.deps.storage, job.id);
      const draft = buildDraft({
        storyboard,
        bindings: assets,
        musicCategoryHint:
          storyboard.musicCategoryHint ?? script.musicCategoryHint,
        catalog: catalogItemsFromRecord(catalogRecord),
      });
      await writeJobDraft(this.deps.storage, job.id, draft);

      const interactive = job.interactive !== false;
      if (interactive) {
        await this.deps.queue.markAwaitingReview(job.id);
        console.info(
          JSON.stringify({
            msg: "job awaiting review",
            id: job.id,
            scenes: storyboard.scenes.length,
          }),
        );
        return;
      }

      await this.runRenderFromDraft({
        job,
        exhibition,
        profile,
        llm,
        voice,
        storyboard,
        assets,
        musicCategoryHint: draft.musicCategoryHint,
        timings,
        started,
        signal,
      });
    } catch (err) {
      if (isJobCancelledError(err) || signal.aborted) {
        return;
      }
      const message = err instanceof Error ? err.message : String(err);
      const current = await this.deps.queue.get(job.id);
      if (current?.status === "cancelled" || current?.status === "awaiting_review") {
        return;
      }
      await this.deps.queue.fail(job.id, message);
      throw err;
    } finally {
      clearJobAbort(job.id);
    }
  }

  private async runRenderPhase(input: {
    job: ClaimedJob;
    exhibition: Exhibition;
    profile: VideoFormatProfile;
    llm: LlmProvider;
    voice: VoiceProvider;
    timings: Record<string, number>;
    started: number;
    signal: AbortSignal;
  }): Promise<void> {
    const draft = await readJobDraft(this.deps.storage, input.job.id);
    if (!draft) {
      throw new Error(`Draft no encontrado para job ${input.job.id}`);
    }
    await this.runRenderFromDraft({
      job: input.job,
      exhibition: input.exhibition,
      profile: input.profile,
      llm: input.llm,
      voice: input.voice,
      storyboard: draft.storyboard,
      assets: bindingsFromDraft(draft),
      musicCategoryHint: draft.musicCategoryHint,
      timings: input.timings,
      started: input.started,
      signal: input.signal,
    });
  }

  private async runRenderFromDraft(input: {
    job: ClaimedJob;
    exhibition: Exhibition;
    profile: VideoFormatProfile;
    llm: LlmProvider;
    voice: VoiceProvider;
    storyboard: StoryboardDocument;
    assets: SceneAssetBinding[];
    musicCategoryHint?: StoryboardDocument["musicCategoryHint"];
    timings: Record<string, number>;
    started: number;
    signal: AbortSignal;
  }): Promise<void> {
    const voiceGen = new VoiceGenerator(input.voice, this.deps.storage);
    const voices = await this.timed(input.job.id, "voice", input.timings, () =>
      voiceGen.generate(input.job.id, input.storyboard),
    );

    const subGen = new SubtitleGenerator(this.deps.storage);
    const subtitles = await this.timed(
      input.job.id,
      "subtitles",
      input.timings,
      () => subGen.generate(input.job.id, input.storyboard, voices),
    );

    const musicSel = new MusicSelector(this.deps.music);
    const music = await this.timed(input.job.id, "music", input.timings, () =>
      musicSel.select(
        input.musicCategoryHint ?? input.storyboard.musicCategoryHint,
      ),
    );

    const composer = new SceneComposer(this.deps.storage);
    const { manifest, manifestUri } = await this.timed(
      input.job.id,
      "compose",
      input.timings,
      () =>
        composer.compose({
          jobId: input.job.id,
          storyboard: input.storyboard,
          assets: input.assets,
          voices,
          subtitles,
          music,
          cta: input.profile.cta,
        }),
    );

    const outputKey = `jobs/${input.job.id}/output.mp4`;
    const render: RenderResult = await this.timed(
      input.job.id,
      "render",
      input.timings,
      () => this.deps.renderer.render(manifest, outputKey, input.signal),
    );

    await this.throwIfCancelled(input.job.id);

    await this.deps.queue.complete(input.job.id, {
      outputMp4Uri: render.mp4Uri,
      outputBytes: render.bytes,
      outputDurationSec: render.durationSec,
      manifestUri,
      assetsUsed: input.assets.map((a) => a.assetId),
      llmProvider: input.llm.name,
      llmModel: input.llm.model,
      ttsProvider: input.voice.name,
      ttsVoice: voices[0]?.voice,
      stageTimingsMs: {
        ...input.timings,
        wall: Date.now() - input.started,
      },
    });
  }

  private async throwIfCancelled(jobId: string): Promise<void> {
    if (jobAbortSignal(jobId)?.aborted) {
      throw new JobCancelledError(jobId);
    }
    const view = await this.deps.queue.get(jobId);
    if (view?.status === "cancelled") {
      throw new JobCancelledError(jobId);
    }
  }

  private async loadExhibition(job: ClaimedJob): Promise<Exhibition> {
    const fromClaim = ExhibitionSchema.safeParse(job.exhibitionJson);
    if (fromClaim.success) return fromClaim.data;
    try {
      const filePath = this.deps.storage.resolvePath(
        `jobs/${job.id}/exhibition.json`,
      );
      const raw = await readFile(filePath, "utf8");
      return ExhibitionSchema.parse(JSON.parse(raw) as unknown);
    } catch {
      throw new Error(
        `No se pudo cargar la exhibición del job ${job.id} (memoria ni disco)`,
      );
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
    await this.throwIfCancelled(jobId);
    const t0 = Date.now();
    await this.deps.queue.markStage(jobId, stage);
    const result = await fn();
    await this.throwIfCancelled(jobId);
    const ms = Date.now() - t0;
    timings[stage] = ms;
    await this.deps.queue.markStage(jobId, stage, ms);
    return result;
  }
}

export function validateExhibition(input: unknown): Exhibition {
  return ExhibitionSchema.parse(input);
}
