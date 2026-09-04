import { resolveFfmpegBinaries } from "../infrastructure/ffmpeg/resolve-binaries";
import path from "node:path";
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

function pinEnvKey(env: NodeJS.ProcessEnv, key: string): string | undefined | false {
  if (!Object.prototype.hasOwnProperty.call(env, key)) return false;
  return env[key];
}

function restorePinned(
  env: NodeJS.ProcessEnv,
  key: string,
  pinned: string | undefined | false,
): void {
  if (pinned === false) return;
  if (pinned === undefined) delete env[key];
  else env[key] = pinned;
}

export function loadEngineConfig(env: NodeJS.ProcessEnv = process.env): EngineConfig {
  // Claves ya presentes en `env` (p.ej. tests) ganan sobre dotenv, incluso si están vacías/borradas.
  const pinnedStorage = pinEnvKey(env, "VIDEO_STORAGE_ROOT");
  const pinnedFake = pinEnvKey(env, "VIDEO_USE_FAKE_PROVIDERS");
  const pinnedOpenAi = pinEnvKey(env, "OPENAI_API_KEY");
  const pinnedDb = pinEnvKey(env, "VIDEO_DATABASE_URL");
  loadRepoEnv();
  restorePinned(env, "VIDEO_STORAGE_ROOT", pinnedStorage);
  restorePinned(env, "VIDEO_USE_FAKE_PROVIDERS", pinnedFake);
  restorePinned(env, "OPENAI_API_KEY", pinnedOpenAi);
  restorePinned(env, "VIDEO_DATABASE_URL", pinnedDb);

  // Tests must never inherit a developer's OneDrive/project storage path.
  // Keep each process isolated and writable, while production continues to use
  // the explicitly configured VIDEO_STORAGE_ROOT.
  if (env.NODE_ENV === "test" || process.argv.some((arg) => arg.includes("--test"))) {
    env.VIDEO_STORAGE_ROOT = path.join(process.cwd(), ".tmp", `video-engine-test-${process.pid}`);
  }

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
