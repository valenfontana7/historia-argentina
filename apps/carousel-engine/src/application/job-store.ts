import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  CarouselJobSchema,
  CarouselSchema,
  ExportManifestSchema,
  RenderPlanSchema,
  type Carousel,
  type CarouselJob,
  type ExportManifest,
  type RenderPlan,
} from "@museoargent/carousel-contracts";

export class CarouselJobStore {
  constructor(private readonly storageRoot: string) {}

  jobDir(id: string): string {
    return path.join(this.storageRoot, "jobs", id);
  }

  async ensureJobDir(id: string): Promise<string> {
    const dir = this.jobDir(id);
    await mkdir(path.join(dir, "slides"), { recursive: true });
    return dir;
  }

  async deleteJob(id: string): Promise<boolean> {
    const dir = this.jobDir(id);
    try {
      await rm(dir, { recursive: true, force: true });
      return true;
    } catch {
      return false;
    }
  }

  async writeJob(job: CarouselJob): Promise<void> {
    const dir = await this.ensureJobDir(job.id);
    await writeFile(
      path.join(dir, "job.json"),
      JSON.stringify(job, null, 2),
      "utf8",
    );
  }

  async readJob(id: string): Promise<CarouselJob | null> {
    try {
      const raw = await readFile(path.join(this.jobDir(id), "job.json"), "utf8");
      return CarouselJobSchema.parse(JSON.parse(raw));
    } catch {
      return null;
    }
  }

  async writeCarousel(id: string, carousel: Carousel): Promise<void> {
    const dir = await this.ensureJobDir(id);
    await writeFile(
      path.join(dir, "carousel.json"),
      JSON.stringify(carousel, null, 2),
      "utf8",
    );
  }

  async readCarousel(id: string): Promise<Carousel | null> {
    try {
      const raw = await readFile(
        path.join(this.jobDir(id), "carousel.json"),
        "utf8",
      );
      return CarouselSchema.parse(JSON.parse(raw));
    } catch {
      return null;
    }
  }

  async writeRenderPlan(id: string, plan: RenderPlan): Promise<void> {
    const dir = await this.ensureJobDir(id);
    await writeFile(
      path.join(dir, "render-plan.json"),
      JSON.stringify(plan, null, 2),
      "utf8",
    );
  }

  async readRenderPlan(id: string): Promise<RenderPlan | null> {
    try {
      const raw = await readFile(
        path.join(this.jobDir(id), "render-plan.json"),
        "utf8",
      );
      return RenderPlanSchema.parse(JSON.parse(raw));
    } catch {
      return null;
    }
  }

  async writeMeta(id: string, meta: unknown): Promise<void> {
    const dir = await this.ensureJobDir(id);
    await writeFile(
      path.join(dir, "meta.json"),
      JSON.stringify(meta, null, 2),
      "utf8",
    );
  }

  slidePath(id: string, slideId: string, format: "png" | "webp"): string {
    return path.join(this.jobDir(id), "slides", `${slideId}.${format}`);
  }

  async writeSlideImage(
    id: string,
    slideId: string,
    format: "png" | "webp",
    buffer: Buffer,
  ): Promise<string> {
    await this.ensureJobDir(id);
    const file = this.slidePath(id, slideId, format);
    await writeFile(file, buffer);
    return file;
  }

  async writeExportManifest(
    id: string,
    manifest: ExportManifest,
  ): Promise<void> {
    const dir = await this.ensureJobDir(id);
    await writeFile(
      path.join(dir, "export-manifest.json"),
      JSON.stringify(manifest, null, 2),
      "utf8",
    );
  }

  async readExportManifest(id: string): Promise<ExportManifest | null> {
    try {
      const raw = await readFile(
        path.join(this.jobDir(id), "export-manifest.json"),
        "utf8",
      );
      return ExportManifestSchema.parse(JSON.parse(raw));
    } catch {
      return null;
    }
  }

  async listJobs(limit: number): Promise<CarouselJob[]> {
    const root = path.join(this.storageRoot, "jobs");
    let entries: string[];
    try {
      entries = await readdir(root);
    } catch {
      return [];
    }
    const jobs: CarouselJob[] = [];
    for (const entry of entries) {
      const job = await this.readJob(entry);
      if (job) jobs.push(job);
    }
    jobs.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return jobs.slice(0, limit);
  }
}
