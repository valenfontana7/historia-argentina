import path from "node:path";
import { loadRepoEnv } from "./load-env";

export type CarouselEngineConfig = {
  apiKey: string;
  port: number;
  storageRoot: string;
  engineRoot: string;
  useFakeRenderer: boolean;
  workerPollMs: number;
};

export function loadCarouselEngineConfig(
  env: NodeJS.ProcessEnv = process.env,
): CarouselEngineConfig {
  loadRepoEnv();
  const engineRoot = path.resolve(__dirname, "../..");
  const repoRoot = path.resolve(engineRoot, "../..");
  const explicitFake =
    env.CAROUSEL_USE_FAKE_RENDERER === "1" ||
    env.CAROUSEL_USE_FAKE_RENDERER === "true";
  return {
    apiKey:
      env.CAROUSEL_ENGINE_API_KEY ??
      env.VIDEO_ENGINE_API_KEY ??
      "dev-video-engine-key",
    port: Number(env.CAROUSEL_ENGINE_PORT ?? 4120),
    storageRoot:
      env.CAROUSEL_STORAGE_ROOT ??
      path.join(repoRoot, "data/carousel-engine"),
    engineRoot,
    useFakeRenderer: explicitFake,
    workerPollMs: Number(env.CAROUSEL_WORKER_POLL_MS ?? 1000),
  };
}
