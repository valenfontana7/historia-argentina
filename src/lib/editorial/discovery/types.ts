import type { DiscoverySource, EditorialBrand, ScoreBreakdown } from "../contracts";

export type TopicCandidate = {
  dedupeKey: string;
  title: string;
  summary: string;
  slug: string;
  tags: string[];
  eventDate?: Date;
  discoverySource: DiscoverySource;
  discoveryMeta: Record<string, unknown>;
  suggestedBrands: EditorialBrand[];
  scoreHints: Partial<ScoreBreakdown>;
};

export type EditorialIngestor = {
  name: string;
  discover(): Promise<TopicCandidate[]>;
};
