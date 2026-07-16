import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { VideoEngineModule } from "./interface/http/video-engine.module";
import { createEngineRuntime } from "./runtime";

async function bootstrap() {
  const engine = await createEngineRuntime();
  await engine.seed();

  const app = await NestFactory.create(VideoEngineModule.forRoot(engine), {
    logger: ["error", "warn", "log"],
  });

  // Health is public: override guard per-controller — HealthController has no UseGuards
  // but APP_GUARD applies globally. Re-register without global guard for health.
  // Workaround: allow health without key via middleware check in guard — already
  // HealthController is under APP_GUARD. Fix: exclude health in guard.

  await app.listen(engine.config.port);
  console.info(
    JSON.stringify({
      msg: "video-engine listening",
      port: engine.config.port,
      fakeProviders: engine.config.useFakeProvidersDefault,
    }),
  );

  // Inline worker loop (same process for v1 simplicity)
  const poll = async () => {
    try {
      const did = await engine.processOne("http-worker");
      if (!did) {
        // idle
      }
    } catch (err) {
      console.error(
        JSON.stringify({
          msg: "worker error",
          error: err instanceof Error ? err.message : String(err),
        }),
      );
    } finally {
      setTimeout(poll, engine.config.workerPollMs);
    }
  };
  void poll();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
