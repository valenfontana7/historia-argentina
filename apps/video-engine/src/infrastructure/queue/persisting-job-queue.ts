import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import {
  JobViewSchema,
  type CreateJobRequest,
  type JobView,
  type PipelineStage,
} from "@museoargent/video-contracts";
import type { ClaimedJob, JobQueue } from "../../application/ports/job-queue";
import type { ObjectStorage } from "../../application/ports/object-storage";

/**
 * Decorador: persiste JobView en jobs/<id>/job.json tras cada mutación
 * y rehidrata la cola en memoria al arrancar (VPS 1 GB / reinicios).
 */
export class PersistingJobQueue implements JobQueue {
  constructor(
    private readonly inner: JobQueue,
    private readonly storage: ObjectStorage,
    private readonly jobsDir: string,
  ) {}

  async hydrateFromDisk(): Promise<{ loaded: number; recovered: number }> {
    let loaded = 0;
    let recovered = 0;
    let entries: string[] = [];
    try {
      entries = await readdir(this.jobsDir);
    } catch {
      return { loaded, recovered };
    }

    for (const id of entries) {
      if (id.includes("..") || id.includes("/") || id.includes("\\")) continue;
      const view = await this.readDiskJob(id);
      if (!view) continue;
      if (!this.inner.restore) continue;
      const before = view.status;
      const restored = await this.inner.restore(view);
      loaded += 1;
      if (restored.status !== before) {
        recovered += 1;
        await this.persist(restored);
      }
    }

    return { loaded, recovered };
  }

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
    const mem = await this.inner.get(jobId);
    if (mem) return mem;
    return this.readDiskJob(jobId);
  }

  async list(limit = 50): Promise<JobView[]> {
    const mem = await this.inner.list(limit);
    if (mem.length > 0) return mem;

    // Fallback si todavía no hubo hydrate (o cola vacía tras wipe).
    const fromDisk: JobView[] = [];
    let entries: string[] = [];
    try {
      entries = await readdir(this.jobsDir);
    } catch {
      return [];
    }
    for (const id of entries) {
      const view = await this.readDiskJob(id);
      if (view) fromDisk.push(view);
    }
    fromDisk.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
    return fromDisk.slice(0, limit);
  }

  async hasActiveJob(): Promise<boolean> {
    return this.inner.hasActiveJob();
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

  async markAwaitingReview(jobId: string): Promise<JobView | null> {
    const view = await this.inner.markAwaitingReview(jobId);
    await this.persist(view);
    return view;
  }

  async approveForRender(jobId: string): Promise<JobView | null> {
    const view = await this.inner.approveForRender(jobId);
    await this.persist(view);
    return view;
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

  async cancel(jobId: string): Promise<JobView | null> {
    // Si solo está en disco (post-crash sin hydrate), fallar vía restore+cancel.
    let view = await this.inner.get(jobId);
    if (!view) {
      const disk = await this.readDiskJob(jobId);
      if (disk && this.inner.restore) {
        view = await this.inner.restore(disk);
      }
    }
    if (!view) return null;
    if (
      view.status !== "queued" &&
      view.status !== "running" &&
      view.status !== "awaiting_review"
    ) {
      return view;
    }
    const cancelled = await this.inner.cancel(jobId);
    await this.persist(cancelled);
    return cancelled;
  }

  async restore(view: JobView): Promise<JobView> {
    if (!this.inner.restore) return view;
    const restored = await this.inner.restore(view);
    await this.persist(restored);
    return restored;
  }

  private async readDiskJob(jobId: string): Promise<JobView | null> {
    try {
      const file = path.join(this.jobsDir, jobId, "job.json");
      const raw = await readFile(file, "utf8");
      const parsed = JSON.parse(raw) as unknown;
      const result = JobViewSchema.safeParse(parsed);
      return result.success ? result.data : null;
    } catch {
      return null;
    }
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
