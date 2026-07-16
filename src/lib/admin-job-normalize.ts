import type { JobStatus, JobView } from "@museoargent/video-contracts";

/** AdminJob = JobView + slug/hasMp4 para la UI. */
export type AdminJobDto = JobView & {
  slug: string;
  hasMp4: boolean;
};

export function slugFromExhibitionId(exhibitionId: string): string {
  return exhibitionId.replace(/^cronica:/, "");
}

/** Legacy awaiting_review → awaiting_assets para la UI. */
function normalizeStatus(status: JobStatus): JobStatus {
  if (status === "awaiting_review") return "awaiting_assets";
  return status;
}

/** Enriquece un JobView del engine (sin slug) para el panel admin. */
export function normalizeAdminJob(
  view: JobView & { slug?: string; hasMp4?: boolean },
): AdminJobDto {
  return {
    ...view,
    status: normalizeStatus(view.status),
    slug: view.slug ?? slugFromExhibitionId(view.exhibitionId),
    hasMp4: view.hasMp4 ?? Boolean(view.outputMp4Uri),
  };
}

export function normalizeAdminJobs(
  jobs: Array<JobView & { slug?: string; hasMp4?: boolean }>,
): AdminJobDto[] {
  return jobs.map(normalizeAdminJob);
}
