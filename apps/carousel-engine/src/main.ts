import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { CarouselEngineModule } from "./interface/http/carousel-engine.module";
import { createCarouselEngineRuntime } from "./runtime";

async function bootstrap() {
  const engine = await createCarouselEngineRuntime();
  const app = await NestFactory.create(CarouselEngineModule.forRoot(engine), {
    logger: ["error", "warn", "log"],
  });

  await app.listen(engine.config.port, "127.0.0.1");
  console.info(
    JSON.stringify({
      msg: "carousel-engine listening",
      host: "127.0.0.1",
      port: engine.config.port,
      fakeRenderer: engine.config.useFakeRenderer,
    }),
  );
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
