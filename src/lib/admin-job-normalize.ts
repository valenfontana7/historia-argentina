import type { JobView } from "@museoargent/video-contracts";

/** AdminJob = JobView + slug/hasMp4 para la UI. */
export type AdminJobDto = JobView & {
  slug: string;
  hasMp4: boolean;
};

export function slugFromExhibitionId(exhibitionId: string): string {
  return exhibitionId.replace(/^cronica:/, "");
}

/** Enriquece un JobView del engine (sin slug) para el panel admin. */
export function normalizeAdminJob(
  view: JobView & { slug?: string; hasMp4?: boolean },
): AdminJobDto {
  return {
    ...view,
    slug: view.slug ?? slugFromExhibitionId(view.exhibitionId),
    hasMp4: view.hasMp4 ?? Boolean(view.outputMp4Uri),
  };
}

export function normalizeAdminJobs(
  jobs: Array<JobView & { slug?: string; hasMp4?: boolean }>,
): AdminJobDto[] {
  return jobs.map(normalizeAdminJob);
}
