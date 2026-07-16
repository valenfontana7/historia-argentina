import { resolveFfmpegBinaries } from "../infrastructure/ffmpeg/resolve-binaries";
import { loadRepoEnv } from "./load-env";
import {
  DEFAULT_TTS_INSTRUCTIONS,
  DEFAULT_TTS_VOICE,
} from "../branding/tts-defaults";

export type EngineConfig = {
  apiKey: string;
  port: number;
  storageRoot: string;
  databaseUrl?: string;
  openaiApiKey?: string;
  openaiLlmModel: string;
  openaiTtsModel: string;
  openaiTtsVoice: string;
  openaiTtsInstructions: string;
  useFakeProvidersDefault: boolean;
  assetScoreThreshold: number;
  maxConcurrentJobs: number;
  ffmpegPath: string;
  ffprobePath: string;
  workerPollMs: number;
};

export function loadEngineConfig(env: NodeJS.ProcessEnv = process.env): EngineConfig {
  loadRepoEnv();
  const root = env.VIDEO_STORAGE_ROOT ?? "data/video-engine";
  const bins = resolveFfmpegBinaries(env);
  const explicitFake =
    env.VIDEO_USE_FAKE_PROVIDERS === "1" ||
    env.VIDEO_USE_FAKE_PROVIDERS === "true";
  const hasOpenAi = Boolean(env.OPENAI_API_KEY?.trim());
  return {
    apiKey: env.VIDEO_ENGINE_API_KEY ?? "dev-video-engine-key",
    port: Number(env.VIDEO_ENGINE_PORT ?? 4100),
    storageRoot: root,
    // Solo VIDEO_DATABASE_URL: no heredar DATABASE_URL del sitio Next
    // (Neon sin schema VideoJob → spam de errores en el worker).
    databaseUrl: env.VIDEO_DATABASE_URL?.trim() || undefined,
    openaiApiKey: env.OPENAI_API_KEY?.trim() || undefined,
    openaiLlmModel: env.OPENAI_LLM_MODEL ?? "gpt-5.6-terra",
    openaiTtsModel: env.OPENAI_TTS_MODEL ?? "gpt-4o-mini-tts",
    openaiTtsVoice: env.OPENAI_TTS_VOICE ?? DEFAULT_TTS_VOICE,
    openaiTtsInstructions:
      env.OPENAI_TTS_INSTRUCTIONS?.trim() || DEFAULT_TTS_INSTRUCTIONS,
    useFakeProvidersDefault: explicitFake || !hasOpenAi,
    assetScoreThreshold: Number(env.VIDEO_ASSET_SCORE_THRESHOLD ?? 0.1),
    maxConcurrentJobs: Number(env.VIDEO_MAX_CONCURRENT_JOBS ?? 1),
    ffmpegPath: bins.ffmpegPath,
    ffprobePath: bins.ffprobePath,
    workerPollMs: Number(env.VIDEO_WORKER_POLL_MS ?? 1500),
  };
}
