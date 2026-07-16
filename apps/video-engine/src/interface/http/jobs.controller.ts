import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  CreateJobRequestSchema,
  type CreateJobRequest,
} from "@museoargent/video-contracts";
import type { EngineRuntime } from "../../runtime";
import { ApiKeyGuard } from "../guards/api-key.guard";

export const ENGINE_RUNTIME = Symbol("ENGINE_RUNTIME");

@Controller()
export class HealthController {
  @Get("health")
  health() {
    return { ok: true, service: "video-engine" };
  }
}

@Controller("jobs")
@UseGuards(ApiKeyGuard)
export class JobsController {
  constructor(
    @Inject(ENGINE_RUNTIME) private readonly engine: EngineRuntime,
  ) {}

  @Post()
  async create(@Body() body: unknown) {
    const request = CreateJobRequestSchema.parse(body) as CreateJobRequest;
    const job = await this.engine.enqueue(request);
    return job;
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    const job = await this.engine.getJob(id);
    if (!job) throw new NotFoundException("Job not found");
    return job;
  }
}
