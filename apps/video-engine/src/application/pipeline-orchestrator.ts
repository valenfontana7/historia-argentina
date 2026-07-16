import { access, readFile } from "node:fs/promises";
import {
  DEFAULT_FORMAT_PROFILES,
  ExhibitionSchema,
  normalizeResumePhase,
  type Exhibition,
  type PreviewState,
  type ProfileOverrides,
  type SceneAssetBinding,
  type ScriptDocument,
  type StoryboardDocument,
  type VideoFormatId,
  type VideoFormatProfile,
  type VideoManifest,
  type VoiceTrack,
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
import { catalogItemsFromRecord, readImageCatalog } from "./job-draft";
import {
  bindingsToSceneAssets,
  buildBindingsDoc,
  previewUriForScene,
  readBindings,
  readPreviewState,
  readScript,
  readStoryboard,
  readVoices,
  writeBindings,
  writePreviewState,
  writeScript,
  writeStoryboard,
  writeVoices,
} from "./job-artifacts";
import { mergeMemory, readMemory } from "./editorial-memory";

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
    const interactive = job.interactive !== false;
    const phase = normalizeResumePhase(job.resumePhase);

    const signal = registerJobAbort(job.id);

    try {
      await this.throwIfCancelled(job.id);

      const exhibition = await this.loadExhibition(job);
      const overrides =
        job.profileOverrides ?? (await this.loadProfileOverrides(job.id));
      const profile = mergeFormatProfile(job.formatId, overrides);

      if (phase === "render") {
        await this.runFinalRenderPhase({
          job,
          profile,
          llm,
          voice,
          timings,
          started,
          signal,
        });
        return;
      }

      if (phase === "preview") {
        await this.runPreviewPhase({
          job,
          profile,
          interactive,
          timings,
          signal,
        });
        if (interactive) return;
        await this.runFinalRenderPhase({
          job,
          profile,
          llm,
          voice,
          timings,
          started,
          signal,
        });
        return;
      }

      if (phase === "voice") {
        await this.runVoicePhase({
          job,
          voice,
          interactive,
          timings,
        });
        if (interactive) return;
        await this.runPreviewPhase({
          job,
          profile,
          interactive,
          timings,
          signal,
        });
        await this.runFinalRenderPhase({
          job,
          profile,
          llm,
          voice,
          timings,
          started,
          signal,
        });
        return;
      }

      if (phase === "assets") {
        await this.runAssetsPhase({
          job,
          exhibition,
          interactive,
          timings,
        });
        if (interactive) return;
        await this.runPostAssetsAutopilot({
          job,
          profile,
          llm,
          voice,
          timings,
          started,
          signal,
        });
        return;
      }

      if (phase === "storyboard") {
        const script = await readScript(this.deps.storage, job.id);
        if (!script) throw new Error(`Script no encontrado para job ${job.id}`);
        await this.runStoryboardPhase({
          job,
          exhibition,
          profile,
          llm,
          script,
          interactive,
          timings,
        });
        if (interactive) return;
        await this.runAssetsPhase({
          job,
          exhibition,
          interactive,
          timings,
        });
        await this.runPostAssetsAutopilot({
          job,
          profile,
          llm,
          voice,
          timings,
          started,
          signal,
        });
        return;
      }

      // phase === script (inicio)
      await this.timed(job.id, "ingest", timings, async () => undefined);

      const memory = await readMemory(this.deps.storage, exhibition.id);
      const scriptGen = new ScriptGenerator(llm, this.deps.promptsRoot);
      const script = await this.timed(job.id, "script", timings, () =>
        scriptGen.generate(exhibition, profile, { memory }),
      );
      await writeScript(this.deps.storage, job.id, script);

      if (interactive) {
        await this.deps.queue.markAwaiting(job.id, "awaiting_script");
        console.info(
          JSON.stringify({ msg: "job awaiting_script", id: job.id }),
        );
        return;
      }

      await this.runStoryboardPhase({
        job,
        exhibition,
        profile,
        llm,
        script,
        interactive,
        timings,
      });
      await this.runAssetsPhase({
        job,
        exhibition,
        interactive,
        timings,
      });
      await this.runPostAssetsAutopilot({
        job,
        profile,
        llm,
        voice,
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
      if (
        current?.status === "cancelled" ||
        current?.status === "awaiting_script" ||
        current?.status === "awaiting_storyboard" ||
        current?.status === "awaiting_assets" ||
        current?.status === "awaiting_review" ||
        current?.status === "awaiting_voice" ||
        current?.status === "awaiting_preview"
      ) {
        return;
      }
      await this.deps.queue.fail(job.id, message);
      throw err;
    } finally {
      clearJobAbort(job.id);
    }
  }

  private async runPostAssetsAutopilot(input: {
    job: ClaimedJob;
    profile: VideoFormatProfile;
    llm: LlmProvider;
    voice: VoiceProvider;
    timings: Record<string, number>;
    started: number;
    signal: AbortSignal;
  }): Promise<void> {
    await this.runVoicePhase({
      job: input.job,
      voice: input.voice,
      interactive: false,
      timings: input.timings,
    });
    await this.runPreviewPhase({
      job: input.job,
      profile: input.profile,
      interactive: false,
      timings: input.timings,
      signal: input.signal,
    });
    await this.runFinalRenderPhase({
      job: input.job,
      profile: input.profile,
      llm: input.llm,
      voice: input.voice,
      timings: input.timings,
      started: input.started,
      signal: input.signal,
    });
  }

  private async runStoryboardPhase(input: {
    job: ClaimedJob;
    exhibition: Exhibition;
    profile: VideoFormatProfile;
    llm: LlmProvider;
    script: ScriptDocument;
    interactive: boolean;
    timings: Record<string, number>;
  }): Promise<StoryboardDocument> {
    const memory = await readMemory(
      this.deps.storage,
      input.exhibition.id,
    );
    const storyGen = new StoryboardGenerator(input.llm, this.deps.promptsRoot);
    const storyboard = await this.timed(
      input.job.id,
      "storyboard",
      input.timings,
      () =>
        storyGen.generate(input.exhibition, input.profile, input.script, {
          memory,
        }),
    );
    await writeStoryboard(this.deps.storage, input.job.id, storyboard);
    if (input.interactive) {
      await this.deps.queue.markAwaiting(input.job.id, "awaiting_storyboard");
      console.info(
        JSON.stringify({ msg: "job awaiting_storyboard", id: input.job.id }),
      );
    }
    return storyboard;
  }

  private async runAssetsPhase(input: {
    job: ClaimedJob;
    exhibition: Exhibition;
    interactive: boolean;
    timings: Record<string, number>;
  }): Promise<SceneAssetBinding[]> {
    const storyboard = await readStoryboard(this.deps.storage, input.job.id);
    if (!storyboard) {
      throw new Error(`Storyboard no encontrado para job ${input.job.id}`);
    }
    const script = await readScript(this.deps.storage, input.job.id);

    const assetSel = new AssetSelector(
      this.deps.assets,
      this.deps.ranker,
      this.deps.config.assetScoreThreshold,
    );
    const assets = await this.timed(input.job.id, "assets", input.timings, () =>
      assetSel.select(
        storyboard,
        input.exhibition.images.map((i) => i.assetId),
        { yearEnd: input.exhibition.yearEnd },
      ),
    );

    const catalogRecord = await readImageCatalog(
      this.deps.storage,
      input.job.id,
    );
    const doc = buildBindingsDoc({
      bindings: assets,
      catalog: catalogItemsFromRecord(catalogRecord),
      musicCategoryHint:
        storyboard.musicCategoryHint ?? script?.musicCategoryHint,
    });
    await writeBindings(this.deps.storage, input.job.id, doc);

    if (input.interactive) {
      await this.deps.queue.markAwaiting(input.job.id, "awaiting_assets");
      console.info(
        JSON.stringify({ msg: "job awaiting_assets", id: input.job.id }),
      );
    }
    return assets;
  }

  private async runVoicePhase(input: {
    job: ClaimedJob;
    voice: VoiceProvider;
    interactive: boolean;
    timings: Record<string, number>;
  }): Promise<VoiceTrack[]> {
    const storyboard = await readStoryboard(this.deps.storage, input.job.id);
    if (!storyboard) {
      throw new Error(`Storyboard no encontrado para job ${input.job.id}`);
    }

    const voiceGen = new VoiceGenerator(input.voice, this.deps.storage);
    const tracks = await this.timed(input.job.id, "voice", input.timings, () =>
      voiceGen.generate(input.job.id, storyboard),
    );
    await writeVoices(this.deps.storage, input.job.id, { tracks });

    if (input.interactive) {
      await this.deps.queue.markAwaiting(input.job.id, "awaiting_voice");
      console.info(
        JSON.stringify({ msg: "job awaiting_voice", id: input.job.id }),
      );
    }
    return tracks;
  }

  private async runPreviewPhase(input: {
    job: ClaimedJob;
    profile: VideoFormatProfile;
    interactive: boolean;
    timings: Record<string, number>;
    signal: AbortSignal;
  }): Promise<PreviewState> {
    const storyboard = await readStoryboard(this.deps.storage, input.job.id);
    const bindingsDoc = await readBindings(this.deps.storage, input.job.id);
    const voicesDoc = await readVoices(this.deps.storage, input.job.id);
    if (!storyboard || !bindingsDoc || !voicesDoc) {
      throw new Error(`Artefactos incompletos para preview job ${input.job.id}`);
    }
    const assets = bindingsToSceneAssets(bindingsDoc);
    const voices = voicesDoc.tracks;

    const subGen = new SubtitleGenerator(this.deps.storage);
    const subtitles = await this.timed(
      input.job.id,
      "subtitles",
      input.timings,
      () => subGen.generate(input.job.id, storyboard, voices),
    );

    const musicSel = new MusicSelector(this.deps.music);
    const music = await this.timed(input.job.id, "music", input.timings, () =>
      musicSel.select(
        bindingsDoc.musicCategoryHint ?? storyboard.musicCategoryHint,
      ),
    );

    const composer = new SceneComposer(this.deps.storage);
    const { manifest } = await this.timed(
      input.job.id,
      "compose",
      input.timings,
      () =>
        composer.compose({
          jobId: input.job.id,
          storyboard,
          assets,
          voices,
          subtitles,
          music,
          cta: input.profile.cta,
        }),
    );

    const existing = await readPreviewState(this.deps.storage, input.job.id);
    const lockedByScene = new Map(
      (existing?.scenes ?? [])
        .filter((s) => s.locked && !s.dirty)
        .map((s) => [s.scene, s]),
    );

    const previewScenes: PreviewState["scenes"] = [];
    await this.timed(input.job.id, "preview", input.timings, async () => {
      for (let i = 0; i < manifest.scenes.length; i++) {
        await this.throwIfCancelled(input.job.id);
        const manifestScene = manifest.scenes[i];
        const sceneNum = Number(manifestScene.id.replace("scene-", ""));
        const uri = previewUriForScene(input.job.id, sceneNum);
        const locked = lockedByScene.get(sceneNum);
        if (locked) {
          previewScenes.push({ ...locked, dirty: false });
          continue;
        }
        await this.deps.renderer.renderSceneClip(
          manifestScene,
          uri,
          manifest.format.fps,
          input.signal,
        );
        previewScenes.push({
          scene: sceneNum,
          previewUri: uri,
          locked: false,
          dirty: false,
        });
      }
    });

    const state: PreviewState = { scenes: previewScenes };
    await writePreviewState(this.deps.storage, input.job.id, state);

    // Persistir manifest para el render final (reuso de audio/subs).
    await this.deps.storage.put(
      `jobs/${input.job.id}/manifest.json`,
      JSON.stringify(manifest, null, 2),
      "application/json",
    );

    if (input.interactive) {
      await this.deps.queue.markAwaiting(input.job.id, "awaiting_preview");
      console.info(
        JSON.stringify({ msg: "job awaiting_preview", id: input.job.id }),
      );
    }
    return state;
  }

  private async runFinalRenderPhase(input: {
    job: ClaimedJob;
    profile: VideoFormatProfile;
    llm: LlmProvider;
    voice: VoiceProvider;
    timings: Record<string, number>;
    started: number;
    signal: AbortSignal;
  }): Promise<void> {
    const storyboard = await readStoryboard(this.deps.storage, input.job.id);
    const bindingsDoc = await readBindings(this.deps.storage, input.job.id);
    const voicesDoc = await readVoices(this.deps.storage, input.job.id);
    if (!storyboard || !bindingsDoc || !voicesDoc) {
      throw new Error(`Artefactos incompletos para render job ${input.job.id}`);
    }
    const assets = bindingsToSceneAssets(bindingsDoc);
    const voices = voicesDoc.tracks;

    let manifest: VideoManifest;
    try {
      const raw = await readFile(
        this.deps.storage.resolvePath(`jobs/${input.job.id}/manifest.json`),
        "utf8",
      );
      manifest = JSON.parse(raw) as VideoManifest;
    } catch {
      const subGen = new SubtitleGenerator(this.deps.storage);
      const subtitles = await this.timed(
        input.job.id,
        "subtitles",
        input.timings,
        () => subGen.generate(input.job.id, storyboard, voices),
      );
      const musicSel = new MusicSelector(this.deps.music);
      const music = await this.timed(input.job.id, "music", input.timings, () =>
        musicSel.select(
          bindingsDoc.musicCategoryHint ?? storyboard.musicCategoryHint,
        ),
      );
      const composer = new SceneComposer(this.deps.storage);
      const composed = await this.timed(
        input.job.id,
        "compose",
        input.timings,
        () =>
          composer.compose({
            jobId: input.job.id,
            storyboard,
            assets,
            voices,
            subtitles,
            music,
            cta: input.profile.cta,
          }),
      );
      manifest = composed.manifest;
    }

    const previewState = await readPreviewState(this.deps.storage, input.job.id);
    const clipUris: string[] = [];

    await this.timed(input.job.id, "render", input.timings, async () => {
      for (let i = 0; i < manifest.scenes.length; i++) {
        await this.throwIfCancelled(input.job.id);
        const manifestScene = manifest.scenes[i];
        const sceneNum = Number(manifestScene.id.replace("scene-", ""));
        const uri = previewUriForScene(input.job.id, sceneNum);
        const prev = previewState?.scenes.find((s) => s.scene === sceneNum);
        const reusable =
          prev &&
          !prev.dirty &&
          (await fileExists(this.deps.storage.resolvePath(uri)));

        if (!reusable) {
          await this.deps.renderer.renderSceneClip(
            manifestScene,
            uri,
            manifest.format.fps,
            input.signal,
          );
        }
        clipUris.push(uri);
      }
    });

    const outputKey = `jobs/${input.job.id}/output.mp4`;
    const render: RenderResult = await this.deps.renderer.stitchFromSceneClips(
      clipUris,
      manifest,
      outputKey,
      input.signal,
    );

    await this.throwIfCancelled(input.job.id);

    const manifestUri = `jobs/${input.job.id}/manifest.json`;
    await this.deps.queue.complete(input.job.id, {
      outputMp4Uri: render.mp4Uri,
      outputBytes: render.bytes,
      outputDurationSec: render.durationSec,
      manifestUri,
      assetsUsed: assets.map((a) => a.assetId),
      llmProvider: input.llm.name,
      llmModel: input.llm.model,
      ttsProvider: input.voice.name,
      ttsVoice: voices[0]?.voice,
      stageTimingsMs: {
        ...input.timings,
        wall: Date.now() - input.started,
      },
    });

    await mergeMemory(this.deps.storage, input.job.exhibitionId, {
      lastJobId: input.job.id,
      preferredAssetIdsAppend: assets.map((a) => a.assetId),
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

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export function validateExhibition(input: unknown): Exhibition {
  return ExhibitionSchema.parse(input);
}
