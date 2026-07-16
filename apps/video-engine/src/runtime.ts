import path from "node:path";
import {
  DEFAULT_FORMAT_PROFILES,
  PIPELINE_VERSION,
  type CreateJobRequest,
  type JobView,
} from "@museoargent/video-contracts";
import { loadEngineConfig, type EngineConfig } from "./application/config";
import { PipelineOrchestrator } from "./application/pipeline-orchestrator";
import type { JobQueue } from "./application/ports/job-queue";
import { InMemoryAssetLibrary } from "./infrastructure/assets/in-memory-asset-library";
import { HeuristicAssetRanker } from "./infrastructure/assets/in-memory-asset-library";
import { seedFixtureLibrary } from "./infrastructure/assets/seed-fixtures";
import { cacheExhibitionAssets } from "./infrastructure/assets/cache-exhibition-assets";
import type { Exhibition } from "@museoargent/video-contracts";
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
  processOne: (workerId?: string) => Promise<boolean>;
  seed: () => Promise<void>;
  prepareExhibitionAssets: (
    exhibition: Exhibition,
    catalog?: Record<
      string,
      {
        id: string;
        url: string;
        credito: string;
        alt: string;
        tipo: "grabado" | "pintura" | "mapa" | "foto";
      }
    >,
  ) => Promise<string[]>;
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
      // Prisma client is generated into src/generated/prisma (gitignored).
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mod = require("../generated/prisma") as {
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
  const queue: JobQueue = new PersistingJobQueue(innerQueue, storage);

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
    catalog?: Record<
      string,
      {
        id: string;
        url: string;
        credito: string;
        alt: string;
        tipo: "grabado" | "pintura" | "mapa" | "foto";
      }
    >,
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
    const job = await queue.enqueue({
      ...request,
      formatId,
      useFakeProviders:
        request.useFakeProviders ?? config.useFakeProvidersDefault,
      inputHash: hashPayload(request.exhibition),
      promptVersion: profile.promptVersion,
      pipelineVersion: PIPELINE_VERSION,
    });
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
    processOne,
    seed,
    prepareExhibitionAssets,
  };
}
