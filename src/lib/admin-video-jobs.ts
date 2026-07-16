import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import type { JobView } from "@museoargent/video-contracts";
import { JobViewSchema } from "@museoargent/video-contracts";

const JOBS_LIMIT = 50;

export function videoStorageRoot(): string {
  const envRoot = process.env.VIDEO_STORAGE_ROOT?.trim();
  if (envRoot && path.isAbsolute(envRoot)) return envRoot;
  return path.join(process.cwd(), envRoot || "data/video-engine");
}

export function jobsDir(): string {
  return path.join(videoStorageRoot(), "jobs");
}

/** Resuelve un path bajo jobs/<id>/; lanza si el id es inválido o sale del root. */
export function safeJobPath(jobId: string, ...parts: string[]): string {
  if (!jobId || jobId.includes("..") || jobId.includes("/") || jobId.includes("\\")) {
    throw new Error("jobId inválido");
  }
  const root = path.resolve(jobsDir());
  const full = path.resolve(path.join(root, jobId, ...parts));
  const rel = path.relative(root, full);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error("path fuera del storage");
  }
  return full;
}

export function exhibitionSlug(exhibitionId: string): string {
  return exhibitionId.replace(/^cronica:/, "");
}

export type AdminJobSummary = JobView & {
  slug: string;
  hasMp4: boolean;
};

async function readJobJson(jobId: string): Promise<JobView | null> {
  try {
    const file = safeJobPath(jobId, "job.json");
    const raw = await readFile(file, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    const result = JobViewSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

async function inferJobFromArtifacts(jobId: string): Promise<JobView | null> {
  try {
    const mp4Path = safeJobPath(jobId, "output.mp4");
    const manifestPath = safeJobPath(jobId, "manifest.json");
    const mp4Stat = await stat(mp4Path).catch(() => null);
    if (!mp4Stat) return null;

    let exhibitionId = `unknown:${jobId}`;
    let formatId: JobView["formatId"] = "reel";
    let createdAt = mp4Stat.mtime.toISOString();

    try {
      const manifestRaw = await readFile(manifestPath, "utf8");
      const manifest = JSON.parse(manifestRaw) as {
        exhibitionId?: string;
        formatId?: string;
        createdAt?: string;
      };
      if (typeof manifest.exhibitionId === "string") {
        exhibitionId = manifest.exhibitionId;
      }
      if (manifest.formatId === "reel") formatId = "reel";
      if (typeof manifest.createdAt === "string") createdAt = manifest.createdAt;
    } catch {
      // manifest opcional
    }

    return {
      id: jobId,
      exhibitionId,
      formatId,
      status: "succeeded",
      stage: "render",
      outputMp4Uri: `file://${mp4Path}`,
      manifestUri: `file://${manifestPath}`,
      metrics: {
        outputBytes: mp4Stat.size,
      },
      createdAt,
      updatedAt: mp4Stat.mtime.toISOString(),
    };
  } catch {
    return null;
  }
}

export async function getJobFromDisk(jobId: string): Promise<AdminJobSummary | null> {
  const view =
    (await readJobJson(jobId)) ?? (await inferJobFromArtifacts(jobId));
  if (!view) return null;
  let hasMp4 = false;
  try {
    await stat(safeJobPath(jobId, "output.mp4"));
    hasMp4 = true;
  } catch {
    hasMp4 = Boolean(view.outputMp4Uri);
  }
  return {
    ...view,
    slug: exhibitionSlug(view.exhibitionId),
    hasMp4,
  };
}

export async function listJobsFromDisk(
  limit = JOBS_LIMIT,
): Promise<AdminJobSummary[]> {
  const root = jobsDir();
  let entries: string[] = [];
  try {
    entries = await readdir(root);
  } catch {
    return [];
  }

  const jobs: AdminJobSummary[] = [];
  for (const id of entries) {
    const job = await getJobFromDisk(id);
    if (job) jobs.push(job);
  }

  jobs.sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
  return jobs.slice(0, limit);
}

export async function mp4PathForJob(jobId: string): Promise<string | null> {
  try {
    const p = safeJobPath(jobId, "output.mp4");
    await stat(p);
    return p;
  } catch {
    return null;
  }
}
