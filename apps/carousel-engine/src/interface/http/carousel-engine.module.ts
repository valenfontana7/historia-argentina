import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import type { CarouselEngineRuntime } from "../../runtime";
import { ApiKeyGuard } from "../guards/api-key.guard";
import {
  ENGINE_RUNTIME,
  HealthController,
  JobsController,
} from "./jobs.controller";

@Module({})
export class CarouselEngineModule {
  static forRoot(engine: CarouselEngineRuntime) {
    return {
      module: CarouselEngineModule,
      controllers: [HealthController, JobsController],
      providers: [
        { provide: ENGINE_RUNTIME, useValue: engine },
        {
          provide: ApiKeyGuard,
          useFactory: () => new ApiKeyGuard(engine.config.apiKey),
        },
        {
          provide: APP_GUARD,
          useExisting: ApiKeyGuard,
        },
      ],
    };
  }
}
