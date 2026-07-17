import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  CreateCarouselJobRequestSchema,
  type CreateCarouselJobRequest,
} from "@museoargent/carousel-contracts";
import { createCarouselEngineRuntime } from "../../runtime";

async function main() {
  const [cmd, ...args] = process.argv.slice(2);
  if (!cmd || cmd === "help") {
    console.log(`carousel-engine cli
  render <fixture.json> [--profile instagram_feed] [--fake]
  health
`);
    return;
  }

  if (cmd === "health") {
    console.log(JSON.stringify({ ok: true, service: "carousel-engine-cli" }));
    return;
  }

  if (cmd === "render") {
    const file = args[0];
    if (!file) throw new Error("Usage: render <fixture.json>");
    if (args.includes("--fake")) {
      process.env.CAROUSEL_USE_FAKE_RENDERER = "1";
    }
    const profileIdx = args.indexOf("--profile");
    const profileId =
      profileIdx >= 0 ? args[profileIdx + 1] : "instagram_feed";

    const engine = await createCarouselEngineRuntime();
    const candidates = [
      path.resolve(file),
      path.resolve(process.cwd(), file),
      path.resolve(engine.config.engineRoot, file),
      path.resolve(engine.config.engineRoot, "fixtures/sample-carousel.json"),
    ];
    let rawText: string | null = null;
    for (const candidate of candidates) {
      try {
        rawText = await readFile(candidate, "utf8");
        break;
      } catch {
        // try next
      }
    }
    if (!rawText) {
      throw new Error(`Fixture not found: ${file}`);
    }
    const raw = JSON.parse(rawText);
    const request = CreateCarouselJobRequestSchema.parse({
      carousel: raw,
      profileId,
    }) as CreateCarouselJobRequest;

    const job = await engine.createJob(request);
    const rendered = await engine.renderJob(job.id, {});
    console.log(
      JSON.stringify(
        {
          jobId: rendered.id,
          status: rendered.status,
          slides: rendered.renderedSlideIds,
          dir: engine.store.jobDir(rendered.id),
          meta: rendered.meta,
        },
        null,
        2,
      ),
    );
    await engine.dispose();
    return;
  }

  throw new Error(`Unknown command: ${cmd}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
