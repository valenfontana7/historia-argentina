import type {
  CreateJobRequest,
  JobView,
  PipelineStage,
} from "@museoargent/video-contracts";
import type { ClaimedJob, JobQueue } from "../../application/ports/job-queue";
import type { ObjectStorage } from "../../application/ports/object-storage";

/**
 * Decorador: persiste JobView en jobs/<id>/job.json tras cada mutación
 * para que el admin Next pueda listar/pollear sin Nest/Postgres.
 */
export class PersistingJobQueue implements JobQueue {
  constructor(
    private readonly inner: JobQueue,
    private readonly storage: ObjectStorage,
  ) {}

  async enqueue(
    request: CreateJobRequest & {
      inputHash: string;
      promptVersion: string;
      pipelineVersion: string;
    },
  ): Promise<JobView> {
    const view = await this.inner.enqueue(request);
    await this.persist(view);
    return view;
  }

  async get(jobId: string): Promise<JobView | null> {
    return this.inner.get(jobId);
  }

  async claimNext(workerId: string): Promise<ClaimedJob | null> {
    const claimed = await this.inner.claimNext(workerId);
    if (claimed) {
      await this.persist(await this.inner.get(claimed.id));
    }
    return claimed;
  }

  async markStage(
    jobId: string,
    stage: PipelineStage,
    timingMs?: number,
  ): Promise<void> {
    await this.inner.markStage(jobId, stage, timingMs);
    await this.persist(await this.inner.get(jobId));
  }

  async appendEvent(
    jobId: string,
    level: string,
    message: string,
    data?: unknown,
  ): Promise<void> {
    return this.inner.appendEvent(jobId, level, message, data);
  }

  async complete(
    jobId: string,
    result: Parameters<JobQueue["complete"]>[1],
  ): Promise<void> {
    await this.inner.complete(jobId, result);
    await this.persist(await this.inner.get(jobId));
  }

  async fail(jobId: string, error: string): Promise<void> {
    await this.inner.fail(jobId, error);
    await this.persist(await this.inner.get(jobId));
  }

  private async persist(view: JobView | null): Promise<void> {
    if (!view) return;
    await this.storage.put(
      `jobs/${view.id}/job.json`,
      JSON.stringify(view, null, 2),
      "application/json",
    );
  }
}
