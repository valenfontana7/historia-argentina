import "reflect-metadata";
import { createEngineRuntime } from "./runtime";

async function main() {
  const engine = await createEngineRuntime();
  await engine.seed();
  console.info(JSON.stringify({ msg: "worker started", pollMs: engine.config.workerPollMs }));

  const loop = async () => {
    try {
      await engine.processOne(`worker-${process.pid}`);
    } catch (err) {
      console.error(
        JSON.stringify({
          msg: "worker error",
          error: err instanceof Error ? err.message : String(err),
        }),
      );
    } finally {
      setTimeout(loop, engine.config.workerPollMs);
    }
  };
  void loop();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
