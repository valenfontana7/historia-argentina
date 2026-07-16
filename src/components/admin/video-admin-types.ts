import type { JobView, PipelineStage } from "@museoargent/video-contracts";

export type AdminJob = JobView & {
  slug: string;
  hasMp4?: boolean;
};

export type { PipelineStage };

export const PIPELINE_STAGE_ORDER: PipelineStage[] = [
  "ingest",
  "script",
  "storyboard",
  "voice",
  "assets",
  "subtitles",
  "music",
  "compose",
  "render",
];
