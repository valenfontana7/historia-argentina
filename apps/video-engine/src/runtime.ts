import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import {
  DEFAULT_FORMAT_PROFILES,
  EditorialMemoryPatchSchema,
  ExhibitionSchema,
  LlmRegenerateSchema,
  PIPELINE_VERSION,
  VoiceRegenerateSchema,
  type CreateJobRequest,
  type EditorialMemory,
  type Exhibition,
  type ImageCatalogEntry,
  type JobBindingsDocument,
  type JobDraft,
  type JobView,
  type ManifestScene,
  type PreRenderChecklist,
  type PreviewState,
  type ScriptDocument,
  type StoryboardDocument,
  type VideoManifest,
  type VersionsManifest,
  type VoicesDocument,
} from "@museoargent/video-contracts";
import { loadEngineConfig, type EngineConfig } from "./application/config";
import {
  mergeMemory,
  readMemory,
} from "./application/editorial-memory";
import {
  applyAssetsPatch,
  applyScriptPatch,
  applyStoryboardPatch,
  bindingsToSceneAssets,
  enrichBindingsCatalog,
  invalidatePreviewScene,
  listVersions,
  previewUriForScene,
  readBindings,
  readPreviewState,
  readScript,
  readStoryboard,
  readVoices,
  snapshotVersion,
  writeBindings,
  writePreviewState,
  writeScript,
  writeStoryboard,
  writeVoices,
} from "./application/job-artifacts";
import { evaluateJobPreRenderChecklist } from "./application/pre-render-checklist";
import {
  ScriptGenerator,
  StoryboardGenerator,
} from "./application/stages/script-storyboard";
import {
  catalogItemsFromRecord,
  readImageCatalog,
  readJobDraft,
  writeImageCatalog,
  writeJobDraft,
  applyDraftPatch,
} from "./application/job-draft";
import {
  mergeFormatProfile,
  PipelineOrchestrator,
} from "./application/pipeline-orchestrator";
import type { JobQueue } from "./application/ports/job-queue";
import {
  MusicSelector,
  SubtitleGenerator,
  VoiceGenerator,
} from "./application/stages/media-stages";
import { SceneComposer } from "./application/stages/scene-composer";
import { InMemoryAssetLibrary } from "./infrastructure/assets/in-memory-asset-library";
import { HeuristicAssetRanker } from "./infrastructure/assets/in-memory-asset-library";
import { seedFixtureLibrary } from "./infrastructure/assets/seed-fixtures";
import { cacheExhibitionAssets } from "./infrastructure/assets/cache-exhibition-assets";
import { FakeLlmProvider } from "./infrastructure/llm/fake-llm-provider";
import { OpenAiLlmProvider } from "./infrastructure/llm/openai-llm-provider";
import { ResilientLlmProvider } from "./infrastructure/llm/resilient-llm-provider";
import { InMemoryMusicLibrary } from "./infrastructure/music/music-library";
import { InMemoryJobQueue } from "./infrastructure/queue/in-memory-job-queue";
import { PersistingJobQueue } from "./infrastructure/queue/persisting-job-queue";
import { PostgresJobQueue } from "./infrastructure/queue/postgres-job-queue";
import { LocalObjectStorage, hashPayload } from "./infrastructure/storage/local-object-storage";
import { FakeVoiceProvider } from "./infrastructure/voice/fake-voice-provider";
import { OpenAiVoiceProvider } from "./infrastructure/voice/openai-voice-provider";
import { ResilientVoiceProvider } from "./infrastructure/voice/resilient-voice-provider";
import { FfmpegCliRenderer } from "./infrastructure/ffmpeg/ffmpeg-cli-renderer";
import { FallbackMp4Renderer } from "./infrastructure/ffmpeg/fallback-mp4-renderer";

export type EngineRuntime = {
  config: EngineConfig;
  queue: JobQueue;
  storage: LocalObjectStorage;
  assets: InMemoryAssetLibrary;
  orchestrator: PipelineOrchestrator;
  promptsRoot: string;
  enqueue: (request: CreateJobRequest) => Promise<JobView>;
  getJob: (id: string) => Promise<JobView | null>;
  listJobs: (limit?: number) => Promise<JobView[]>;
  hasActiveJob: () => Promise<boolean>;
  cancelJob: (id: string) => Promise<JobView | null>;
  getScript: (id: string) => Promise<ScriptDocument | null>;
  patchScript: (id: string, patch: unknown) => Promise<ScriptDocument>;
  approveScript: (id: string) => Promise<JobView | null>;
  regenerateScript: (id: string, body?: unknown) => Promise<ScriptDocument>;
  getStoryboard: (id: string) => Promise<StoryboardDocument | null>;
  patchStoryboard: (id: string, patch: unknown) => Promise<StoryboardDocument>;
  approveStoryboard: (id: string) => Promise<JobView | null>;
  regenerateStoryboard: (
    id: string,
    body?: unknown,
  ) => Promise<StoryboardDocument>;
  regenerateStoryboardScene: (
    id: string,
    scene: number,
    body?: unknown,
  ) => Promise<StoryboardDocument>;
  getAssetsDoc: (id: string) => Promise<JobBindingsDocument | null>;
  patchAssetsDoc: (id: string, patch: unknown) => Promise<JobBindingsDocument>;
  approveAssets: (id: string) => Promise<JobView | null>;
  getMemory: (id: string) => Promise<EditorialMemory>;
  patchMemory: (id: string, patch: unknown) => Promise<EditorialMemory>;
  getVoiceDoc: (id: string) => Promise<{
    voices: VoicesDocument;
    scenes: { scene: number; narration: string; durationSec: number; fileUri: string }[];
  } | null>;
  regenerateVoiceScene: (
    id: string,
    scene: number,
    body?: unknown,
  ) => Promise<VoicesDocument>;
  approveVoice: (id: string) => Promise<JobView | null>;
  getPreviewState: (id: string) => Promise<PreviewState | null>;
  setPreviewLock: (
    id: string,
    scene: number,
    locked: boolean,
  ) => Promise<PreviewState>;
  regeneratePreviewScene: (id: string, scene: number) => Promise<PreviewState>;
  approvePreview: (id: string) => Promise<JobView | null>;
  getChecklist: (id: string) => Promise<PreRenderChecklist>;
  getVersions: (id: string) => Promise<VersionsManifest>;
  /** Legacy combined draft (assets gate). */
  getDraft: (id: string) => Promise<JobDraft | null>;
  patchDraft: (id: string, patch: unknown) => Promise<JobDraft>;
  approveJob: (id: string) => Promise<JobView | null>;
  resolveMp4Path: (jobId: string) => Promise<string | null>;
  resolveVoicePath: (jobId: string, scene: number) => Promise<string | null>;
  resolvePreviewPath: (jobId: string, scene: number) => Promise<string | null>;
  processOne: (workerId?: string) => Promise<boolean>;
  seed: () => Promise<void>;
  prepareExhibitionAssets: (
    exhibition: Exhibition,
    catalog?: Record<string, ImageCatalogEntry>,
  ) => Promise<string[]>;
  /** Instancia fake (tests: `lastUserPrompt`; pipeline la usa si useFake). */
  fakeLlm: FakeLlmProvider;
};

export async function createEngineRuntime(
  env: NodeJS.ProcessEnv = process.env,
): Promise<EngineRuntime> {
  const config = loadEngineConfig(env);
  const repoRoot = path.resolve(__dirname, "../../..");
  const storageRoot = path.isAbsolute(config.storageRoot)
    ? config.storageRoot
    : path.join(repoRoot, config.storageRoot);
  const promptsRoot = path.join(__dirname, "../prompts");

  const storage = new LocalObjectStorage(storageRoot);
  const assets = new InMemoryAssetLibrary();
  const ranker = new HeuristicAssetRanker();
  const fakeLlm = new FakeLlmProvider();
  const fakeVoice = new FakeVoiceProvider(storage, config.ffmpegPath);

  const llm: import("./application/ports/llm-provider").LlmProvider =
    config.openaiApiKey && !config.useFakeProvidersDefault
      ? new ResilientLlmProvider(
          new OpenAiLlmProvider(config.openaiApiKey, config.openaiLlmModel),
          fakeLlm,
        )
      : fakeLlm;

  const voice: import("./application/ports/voice-provider").VoiceProvider =
    config.openaiApiKey && !config.useFakeProvidersDefault
      ? new ResilientVoiceProvider(
          new OpenAiVoiceProvider(
            config.openaiApiKey,
            storage,
            config.openaiTtsModel,
            config.openaiTtsVoice,
            config.ffprobePath,
            config.openaiTtsInstructions,
          ),
          fakeVoice,
        )
      : fakeVoice;

  const ffmpegRenderer = new FfmpegCliRenderer(
    storage,
    config.ffmpegPath,
    config.ffprobePath,
  );
  const ffmpegOk = await ffmpegRenderer.healthcheck();
  const renderer = ffmpegOk
    ? ffmpegRenderer
    : new FallbackMp4Renderer(storage);
  if (!ffmpegOk) {
    console.warn(
      JSON.stringify({
        msg: "ffmpeg/ffprobe unavailable — using FallbackMp4Renderer",
      }),
    );
  }

  // Seed fixtures still need ffmpeg for generating placeholder images/audio.
  // If missing, seed will create solid-color PNGs via a no-ffmpeg path below.

  let innerQueue: JobQueue = new InMemoryJobQueue();
  if (config.databaseUrl) {
    try {
      // Prisma client: src/generated (tsx) o dist/generated (node tras build).
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mod = require(path.join(__dirname, "generated/prisma")) as {
        PrismaClient: new (args?: {
          datasources?: { db?: { url?: string } };
        }) => ConstructorParameters<typeof PostgresJobQueue>[0];
      };
      const prisma = new mod.PrismaClient({
        datasources: { db: { url: config.databaseUrl } },
      });
      await (prisma as { $connect: () => Promise<void> }).$connect();
      innerQueue = new PostgresJobQueue(prisma);
      console.info(JSON.stringify({ msg: "Using PostgresJobQueue" }));
    } catch (err) {
      console.warn(
        JSON.stringify({
          msg: "Postgres unavailable, falling back to InMemoryJobQueue",
          error: err instanceof Error ? err.message : String(err),
        }),
      );
      innerQueue = new InMemoryJobQueue();
    }
  }
  const queue = new PersistingJobQueue(
    innerQueue,
    storage,
    path.join(storageRoot, "jobs"),
  );
  const hydrated = await queue.hydrateFromDisk();
  console.info(
    JSON.stringify({
      msg: "jobs hydrated from disk",
      loaded: hydrated.loaded,
      recovered: hydrated.recovered,
    }),
  );

  const musicTracks = async () => {
    const anyLib = assets as InMemoryAssetLibrary & {
      listMusic: () => Promise<import("@museoargent/video-contracts").AssetRecord[]>;
    };
    return anyLib.listMusic();
  };

  const orchestrator = new PipelineOrchestrator({
    queue,
    storage,
    llm,
    voice,
    assets,
    ranker,
    music: {
      findByCategory: async (category: import("@museoargent/video-contracts").MusicCategory) => {
        const tracks = await musicTracks();
        return new InMemoryMusicLibrary(tracks).findByCategory(category);
      },
    },
    renderer,
    config,
    promptsRoot,
    fakeLlm,
    fakeVoice,
  });

  const seed = async () => {
    await seedFixtureLibrary({
      library: assets,
      storage,
      ffmpegPath: config.ffmpegPath,
      root: storageRoot,
    });
  };

  const prepareExhibitionAssets = async (
    exhibition: Exhibition,
    catalog?: Record<string, ImageCatalogEntry>,
  ) => {
    if (!catalog) return [];
    return cacheExhibitionAssets({
      exhibition,
      catalog,
      library: assets,
      cacheRoot: path.join(storageRoot, "library", "cache"),
    });
  };

  const enqueue = async (request: CreateJobRequest): Promise<JobView> => {
    const formatId = request.formatId ?? "reel";
    const profile = DEFAULT_FORMAT_PROFILES[formatId];
    const { imageCatalog, ...queueRequest } = request;
    const job = await queue.enqueue({
      ...queueRequest,
      formatId,
      interactive: request.interactive !== false,
      useFakeProviders:
        request.useFakeProviders ?? config.useFakeProvidersDefault,
      inputHash: hashPayload(request.exhibition),
      promptVersion: profile.promptVersion,
      pipelineVersion: PIPELINE_VERSION,
    });
    await storage.put(
      `jobs/${job.id}/exhibition.json`,
      JSON.stringify(request.exhibition, null, 2),
      "application/json",
    );
    if (imageCatalog && Object.keys(imageCatalog).length > 0) {
      await writeImageCatalog(storage, job.id, imageCatalog);
    }
    if (request.profileOverrides) {
      await storage.put(
        `jobs/${job.id}/profile-overrides.json`,
        JSON.stringify(request.profileOverrides, null, 2),
        "application/json",
      );
    }
    return job;
  };

  const getJob = (id: string) => queue.get(id);
  const listJobs = (limit?: number) => queue.list(limit);
  const hasActiveJob = () => queue.hasActiveJob();
  const cancelJob = (id: string) => queue.cancel(id);

  const requireStatus = async (
    id: string,
    allowed: string[],
  ): Promise<JobView> => {
    const job = await queue.get(id);
    if (!job) throw new Error("Job not found");
    if (!allowed.includes(job.status)) {
      throw new Error(
        `Estado inválido ${job.status}; se esperaba ${allowed.join("|")}`,
      );
    }
    return job;
  };

  const getScript = async (id: string) => readScript(storage, id);

  const patchScript = async (id: string, patch: unknown) => {
    await requireStatus(id, ["awaiting_script"]);
    const current = await readScript(storage, id);
    if (!current) throw new Error("Script not found");
    const next = applyScriptPatch(current, patch);
    await writeScript(storage, id, next);
    return next;
  };

  const approveScript = async (id: string) => {
    await requireStatus(id, ["awaiting_script"]);
    if (!(await readScript(storage, id))) throw new Error("Script not found");
    await snapshotVersion(storage, id, "script");
    return queue.approvePhase(id, "storyboard");
  };

  const loadJobExhibition = async (id: string): Promise<Exhibition> => {
    const job = await queue.get(id);
    if (!job) throw new Error("Job not found");
    try {
      const raw = await readFile(
        storage.resolvePath(`jobs/${id}/exhibition.json`),
        "utf8",
      );
      return ExhibitionSchema.parse(JSON.parse(raw) as unknown);
    } catch {
      throw new Error(`Exhibition not found for job ${id}`);
    }
  };

  const resolveLlmForJob = (job: { useFakeProviders?: boolean }) => {
    const useFake =
      Boolean(job.useFakeProviders) ||
      config.useFakeProvidersDefault ||
      !config.openaiApiKey;
    return useFake ? fakeLlm : llm;
  };

  const regenerateScript = async (id: string, body?: unknown) => {
    await requireStatus(id, ["awaiting_script"]);
    const { hint } = LlmRegenerateSchema.parse(body ?? {});
    const exhibition = await loadJobExhibition(id);
    const job = await queue.get(id);
    if (!job) throw new Error("Job not found");
    let overrides: import("@museoargent/video-contracts").ProfileOverrides | undefined;
    try {
      const raw = await readFile(
        storage.resolvePath(`jobs/${id}/profile-overrides.json`),
        "utf8",
      );
      overrides = JSON.parse(raw) as typeof overrides;
    } catch {
      /* sin overrides */
    }
    const profile = mergeFormatProfile(job.formatId, overrides);
    const memory = await readMemory(storage, exhibition.id);
    const gen = new ScriptGenerator(resolveLlmForJob(job), promptsRoot);
    const next = await gen.generate(exhibition, profile, { memory, hint });
    await writeScript(storage, id, next);
    return next;
  };

  const getStoryboardDoc = async (id: string) => readStoryboard(storage, id);

  const patchStoryboardDoc = async (id: string, patch: unknown) => {
    await requireStatus(id, ["awaiting_storyboard"]);
    const current = await readStoryboard(storage, id);
    if (!current) throw new Error("Storyboard not found");
    const next = applyStoryboardPatch(current, patch);
    await writeStoryboard(storage, id, next);
    return next;
  };

  const approveStoryboard = async (id: string) => {
    await requireStatus(id, ["awaiting_storyboard"]);
    if (!(await readStoryboard(storage, id))) {
      throw new Error("Storyboard not found");
    }
    await snapshotVersion(storage, id, "storyboard");
    return queue.approvePhase(id, "assets");
  };

  const regenerateStoryboard = async (id: string, body?: unknown) => {
    await requireStatus(id, ["awaiting_storyboard"]);
    const { hint } = LlmRegenerateSchema.parse(body ?? {});
    const exhibition = await loadJobExhibition(id);
    const script = await readScript(storage, id);
    if (!script) throw new Error("Script not found");
    const job = await queue.get(id);
    if (!job) throw new Error("Job not found");
    const profile = mergeFormatProfile(job.formatId);
    const memory = await readMemory(storage, exhibition.id);
    const gen = new StoryboardGenerator(resolveLlmForJob(job), promptsRoot);
    const next = await gen.generate(exhibition, profile, script, {
      memory,
      hint,
    });
    await writeStoryboard(storage, id, next);
    return next;
  };

  const regenerateStoryboardScene = async (
    id: string,
    scene: number,
    body?: unknown,
  ) => {
    await requireStatus(id, ["awaiting_storyboard"]);
    const { hint } = LlmRegenerateSchema.parse(body ?? {});
    const exhibition = await loadJobExhibition(id);
    const storyboard = await readStoryboard(storage, id);
    if (!storyboard) throw new Error("Storyboard not found");
    const job = await queue.get(id);
    if (!job) throw new Error("Job not found");
    const profile = mergeFormatProfile(job.formatId);
    const memory = await readMemory(storage, exhibition.id);
    const gen = new StoryboardGenerator(resolveLlmForJob(job), promptsRoot);
    const next = await gen.regenerateScene(
      exhibition,
      profile,
      storyboard,
      scene,
      { memory, hint },
    );
    await writeStoryboard(storage, id, next);
    return next;
  };

  const getAssetsDoc = async (id: string) => {
    const doc = await readBindings(storage, id);
    if (!doc) return null;
    return enrichBindingsCatalog(storage, id, doc);
  };

  const patchAssetsDoc = async (id: string, patch: unknown) => {
    await requireStatus(id, ["awaiting_assets", "awaiting_review"]);
    const current = await getAssetsDoc(id);
    if (!current) throw new Error("Assets not found");
    const next = await applyAssetsPatch({
      doc: current,
      patch,
      library: assets,
    });
    await writeBindings(storage, id, next);
    return next;
  };

  const approveAssets = async (id: string) => {
    await requireStatus(id, ["awaiting_assets", "awaiting_review"]);
    const bindings = await readBindings(storage, id);
    if (!bindings) throw new Error("Assets not found");
    await snapshotVersion(storage, id, "assets");
    const job = await queue.get(id);
    if (job) {
      await mergeMemory(storage, job.exhibitionId, {
        lastJobId: id,
        preferredAssetIdsAppend: bindings.bindings.map((b) => b.assetId),
      });
    }
    return queue.approvePhase(id, "voice");
  };

  const getMemory = async (id: string) => {
    const job = await queue.get(id);
    if (!job) throw new Error("Job not found");
    return readMemory(storage, job.exhibitionId);
  };

  const patchMemoryDoc = async (id: string, patch: unknown) => {
    const job = await queue.get(id);
    if (!job) throw new Error("Job not found");
    const parsed = EditorialMemoryPatchSchema.parse(patch);
    return mergeMemory(storage, job.exhibitionId, parsed);
  };

  const getVoiceDoc = async (id: string) => {
    const voices = await readVoices(storage, id);
    const storyboard = await readStoryboard(storage, id);
    if (!voices || !storyboard) return null;
    return {
      voices,
      scenes: storyboard.scenes.map((s) => {
        const track = voices.tracks.find((t) => t.scene === s.scene);
        return {
          scene: s.scene,
          narration: s.narration,
          durationSec: track?.durationSec ?? s.durationSec,
          fileUri: track?.fileUri ?? `jobs/${id}/voice/scene-${s.scene}.mp3`,
        };
      }),
    };
  };

  const regenerateVoiceScene = async (
    id: string,
    scene: number,
    body?: unknown,
  ) => {
    await requireStatus(id, ["awaiting_voice"]);
    const storyboard = await readStoryboard(storage, id);
    if (!storyboard) throw new Error("Storyboard not found");
    const voices = await readVoices(storage, id);
    if (!voices) throw new Error("Voices not found");

    const patch = VoiceRegenerateSchema.parse(body ?? {});
    let sceneDoc = storyboard.scenes.find((s) => s.scene === scene);
    if (!sceneDoc) throw new Error(`Escena ${scene} no existe`);

    if (patch.narration != null) {
      const narration = patch.narration.trim();
      if (!narration) throw new Error(`Narración vacía en escena ${scene}`);
      const nextSb = {
        ...storyboard,
        scenes: storyboard.scenes.map((s) =>
          s.scene === scene ? { ...s, narration } : s,
        ),
      };
      await writeStoryboard(storage, id, nextSb);
      sceneDoc = nextSb.scenes.find((s) => s.scene === scene)!;
    }

    const activeVoice =
      config.useFakeProvidersDefault || !config.openaiApiKey
        ? fakeVoice
        : voice;

    const voiceGen = new VoiceGenerator(activeVoice, storage);
    const track = await voiceGen.generateOne(id, sceneDoc);
    const nextTracks = voices.tracks.map((t) =>
      t.scene === scene ? track : t,
    );
    if (!nextTracks.some((t) => t.scene === scene)) nextTracks.push(track);
    nextTracks.sort((a, b) => (a.scene ?? 0) - (b.scene ?? 0));
    const next = { tracks: nextTracks };
    await writeVoices(storage, id, next);
    await invalidatePreviewScene(storage, id, scene);
    return next;
  };

  const approveVoice = async (id: string) => {
    await requireStatus(id, ["awaiting_voice"]);
    if (!(await readVoices(storage, id))) throw new Error("Voices not found");
    await snapshotVersion(storage, id, "voice");
    return queue.approvePhase(id, "preview");
  };

  const getPreviewStateDoc = async (id: string) =>
    readPreviewState(storage, id);

  const setPreviewLock = async (
    id: string,
    scene: number,
    locked: boolean,
  ) => {
    await requireStatus(id, ["awaiting_preview"]);
    const state = await readPreviewState(storage, id);
    if (!state) throw new Error("Preview not found");
    const sceneState = state.scenes.find((s) => s.scene === scene);
    if (!sceneState) throw new Error(`Escena ${scene} no tiene preview`);
    if (locked && sceneState.dirty) {
      throw new Error(`Escena ${scene} está dirty; regenerá el preview primero`);
    }
    const next: PreviewState = {
      scenes: state.scenes.map((s) =>
        s.scene === scene ? { ...s, locked } : s,
      ),
    };
    await writePreviewState(storage, id, next);
    return next;
  };

  const regeneratePreviewScene = async (id: string, scene: number) => {
    await requireStatus(id, ["awaiting_preview"]);
    const state = await readPreviewState(storage, id);
    if (!state) throw new Error("Preview not found");
    const sceneState = state.scenes.find((s) => s.scene === scene);
    if (!sceneState) throw new Error(`Escena ${scene} no tiene preview`);
    if (sceneState.locked) {
      throw new Error(`Escena ${scene} está locked; desbloqueala para regenerar`);
    }

    const storyboard = await readStoryboard(storage, id);
    const bindingsDoc = await readBindings(storage, id);
    const voicesDoc = await readVoices(storage, id);
    if (!storyboard || !bindingsDoc || !voicesDoc) {
      throw new Error("Artefactos incompletos para regenerar preview");
    }

    let manifest: VideoManifest;
    try {
      const raw = await readFile(
        storage.resolvePath(`jobs/${id}/manifest.json`),
        "utf8",
      );
      manifest = JSON.parse(raw) as VideoManifest;
    } catch {
      const job = await queue.get(id);
      if (!job) throw new Error("Job not found");
      const assets = bindingsToSceneAssets(bindingsDoc);
      const subGen = new SubtitleGenerator(storage);
      const subtitles = await subGen.generate(id, storyboard, voicesDoc.tracks);
      const musicLib = {
        findByCategory: async (
          category: import("@museoargent/video-contracts").MusicCategory,
        ) => {
          const tracks = await musicTracks();
          return new InMemoryMusicLibrary(tracks).findByCategory(category);
        },
      };
      const musicSel = new MusicSelector(musicLib);
      const musicCue = await musicSel.select(
        bindingsDoc.musicCategoryHint ?? storyboard.musicCategoryHint,
      );
      const composer = new SceneComposer(storage);
      const profile = mergeFormatProfile(job.formatId);
      const composed = await composer.compose({
        jobId: id,
        storyboard,
        assets,
        voices: voicesDoc.tracks,
        subtitles,
        music: musicCue,
        cta: profile.cta,
      });
      manifest = composed.manifest;
      await storage.put(
        `jobs/${id}/manifest.json`,
        JSON.stringify(manifest, null, 2),
        "application/json",
      );
    }

    const manifestScene = manifest.scenes.find(
      (s) => Number(s.id.replace("scene-", "")) === scene,
    ) as ManifestScene | undefined;
    if (!manifestScene) throw new Error(`Escena ${scene} no está en el manifest`);

    const uri = previewUriForScene(id, scene);
    await renderer.renderSceneClip(manifestScene, uri, manifest.format.fps);

    const next: PreviewState = {
      scenes: state.scenes.map((s) =>
        s.scene === scene
          ? { ...s, previewUri: uri, dirty: false, locked: false }
          : s,
      ),
    };
    await writePreviewState(storage, id, next);
    return next;
  };

  const resolveTargetDuration = async (id: string): Promise<number | undefined> => {
    const job = await queue.get(id);
    if (!job) return undefined;
    try {
      const raw = await readFile(
        storage.resolvePath(`jobs/${id}/profile-overrides.json`),
        "utf8",
      );
      const overrides = JSON.parse(raw) as { targetDurationSec?: number };
      if (overrides.targetDurationSec) return overrides.targetDurationSec;
    } catch {
      /* sin overrides */
    }
    return (
      DEFAULT_FORMAT_PROFILES[job.formatId as keyof typeof DEFAULT_FORMAT_PROFILES]
        ?.targetDurationSec ?? DEFAULT_FORMAT_PROFILES.reel.targetDurationSec
    );
  };

  const getChecklist = async (id: string): Promise<PreRenderChecklist> => {
    if (!(await queue.get(id))) throw new Error("Job not found");
    const targetDurationSec = await resolveTargetDuration(id);
    return evaluateJobPreRenderChecklist(storage, id, { targetDurationSec });
  };

  const getVersions = async (id: string): Promise<VersionsManifest> => {
    if (!(await queue.get(id))) throw new Error("Job not found");
    return listVersions(storage, id);
  };

  const approvePreview = async (id: string) => {
    await requireStatus(id, ["awaiting_preview"]);
    if (!(await readPreviewState(storage, id))) {
      throw new Error("Preview not found");
    }
    const checklist = await getChecklist(id);
    if (!checklist.canApprove) {
      const failed = checklist.items
        .filter((i) => !i.ok && i.severity === "error")
        .map((i) => i.id)
        .join(", ");
      throw new Error(`Checklist incompleto: ${failed}`);
    }
    await snapshotVersion(storage, id, "preview");
    return queue.approvePhase(id, "render");
  };

  const getDraft = async (id: string): Promise<JobDraft | null> => {
    const draft = await readJobDraft(storage, id);
    if (draft) {
      if (draft.catalog.length) return draft;
      const catalog = catalogItemsFromRecord(
        await readImageCatalog(storage, id),
      );
      return { ...draft, catalog };
    }
    const storyboard = await readStoryboard(storage, id);
    const bindings = await getAssetsDoc(id);
    if (!storyboard || !bindings) return null;
    return {
      storyboard,
      bindings: bindings.bindings,
      catalog: bindings.catalog,
      musicCategoryHint: bindings.musicCategoryHint,
    };
  };

  const patchDraft = async (id: string, patch: unknown): Promise<JobDraft> => {
    await requireStatus(id, ["awaiting_assets", "awaiting_review"]);
    const current = await getDraft(id);
    if (!current) throw new Error("Draft not found");
    const next = await applyDraftPatch({
      draft: current,
      patch,
      library: assets,
    });
    await writeJobDraft(storage, id, next);
    await writeBindings(storage, id, {
      bindings: next.bindings,
      catalog: next.catalog,
      musicCategoryHint: next.musicCategoryHint,
    });
    await writeStoryboard(storage, id, next.storyboard);
    return next;
  };

  const approveJob = async (id: string): Promise<JobView | null> =>
    approveAssets(id);

  const resolveExisting = async (filePath: string): Promise<string | null> => {
    try {
      await stat(filePath);
      return filePath;
    } catch {
      return null;
    }
  };

  const resolveMp4Path = async (jobId: string): Promise<string | null> => {
    const job = await queue.get(jobId);
    if (!job?.outputMp4Uri) {
      return resolveExisting(path.join(storageRoot, "jobs", jobId, "output.mp4"));
    }
    return resolveExisting(storage.resolvePath(job.outputMp4Uri));
  };

  const resolveVoicePath = async (
    jobId: string,
    scene: number,
  ): Promise<string | null> => {
    const voices = await readVoices(storage, jobId);
    const track = voices?.tracks.find((t) => t.scene === scene);
    const key = track?.fileUri ?? `jobs/${jobId}/voice/scene-${scene}.mp3`;
    return resolveExisting(storage.resolvePath(key));
  };

  const resolvePreviewPath = async (
    jobId: string,
    scene: number,
  ): Promise<string | null> => {
    const state = await readPreviewState(storage, jobId);
    const entry = state?.scenes.find((s) => s.scene === scene);
    const key = entry?.previewUri ?? previewUriForScene(jobId, scene);
    return resolveExisting(storage.resolvePath(key));
  };

  const processOne = async (workerId = "worker-1"): Promise<boolean> => {
    const job = await queue.claimNext(workerId);
    if (!job) return false;
    await orchestrator.run(job);
    return true;
  };

  return {
    config,
    queue,
    storage,
    assets,
    orchestrator,
    promptsRoot,
    enqueue,
    getJob,
    listJobs,
    hasActiveJob,
    cancelJob,
    getScript,
    patchScript,
    approveScript,
    regenerateScript,
    getStoryboard: getStoryboardDoc,
    patchStoryboard: patchStoryboardDoc,
    approveStoryboard,
    regenerateStoryboard,
    regenerateStoryboardScene,
    getAssetsDoc,
    patchAssetsDoc,
    approveAssets,
    getMemory,
    patchMemory: patchMemoryDoc,
    getVoiceDoc,
    regenerateVoiceScene,
    approveVoice,
    getPreviewState: getPreviewStateDoc,
    setPreviewLock,
    regeneratePreviewScene,
    approvePreview,
    getChecklist,
    getVersions,
    getDraft,
    patchDraft,
    approveJob,
    resolveMp4Path,
    resolveVoicePath,
    resolvePreviewPath,
    processOne,
    seed,
    prepareExhibitionAssets,
    fakeLlm,
  };
}
