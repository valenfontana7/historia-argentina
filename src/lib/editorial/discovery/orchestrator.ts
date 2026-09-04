import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { calculateEditorialScore } from "../scoring";
import type { ScoreBreakdown } from "../contracts";
import { efemerideIngestor } from "./efemeride-ingestor";
import { grafoIngestor } from "./grafo-ingestor";
import { macroIngestor } from "./macro-ingestor";
import { rssIngestor } from "./rss-ingestor";
import { webSearchIngestor } from "./web-search-ingestor";
import { dedupeCandidates, rankCandidates } from "./dedupe";
import type { EditorialIngestor, TopicCandidate } from "./types";

const SYSTEM_EMAIL = "editorial-autopilot@museoargent.local";

export function discoveryIngestors(): EditorialIngestor[] {
  return [macroIngestor, efemerideIngestor, grafoIngestor, rssIngestor, webSearchIngestor];
}

function discoverMaxPerRun(): number {
  const raw = Number(process.env.EDITORIAL_DISCOVER_MAX_PER_RUN ?? 15);
  return Number.isFinite(raw) && raw > 0 ? Math.min(raw, 50) : 15;
}

function fullScoreHints(hints: TopicCandidate["scoreHints"]): ScoreBreakdown {
  return {
    freshness: hints.freshness ?? 3,
    relevance: hints.relevance ?? 3,
    dailyImpact: hints.dailyImpact ?? 3,
    sourceQuality: hints.sourceQuality ?? 3,
    visualPotential: hints.visualPotential ?? 3,
    ownAngle: hints.ownAngle ?? 3,
    historicalDepth: hints.historicalDepth ?? 3,
    saturation: hints.saturation ?? 2,
  };
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let suffix = 1;
  while (await prisma.editorialStory.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
  return slug;
}

export async function runDiscovery(input?: { actorEmail?: string; dryRun?: boolean }) {
  const actorEmail = input?.actorEmail ?? SYSTEM_EMAIL;
  const ingestors = discoveryIngestors();
  const batches = await Promise.all(ingestors.map((ingestor) => ingestor.discover()));
  const ranked = rankCandidates(dedupeCandidates(batches.flat())).slice(0, discoverMaxPerRun());

  if (input?.dryRun) {
    return { created: 0, skipped: 0, candidates: ranked };
  }

  let created = 0;
  let skipped = 0;
  const storyIds: string[] = [];

  for (const candidate of ranked) {
    const existing = await prisma.editorialStory.findUnique({ where: { dedupeKey: candidate.dedupeKey } });
    if (existing) {
      skipped += 1;
      continue;
    }

    const breakdown = fullScoreHints(candidate.scoreHints);
    const slug = await uniqueSlug(candidate.slug);
    const story = await prisma.editorialStory.create({
      data: {
        title: candidate.title,
        summary: candidate.summary,
        slug,
        status: "discovered",
        tags: candidate.tags,
        eventDate: candidate.eventDate,
        score: calculateEditorialScore(breakdown),
        scoreBreakdown: breakdown,
        discoverySource: candidate.discoverySource,
        discoveryMeta: candidate.discoveryMeta as Prisma.InputJsonValue,
        dedupeKey: candidate.dedupeKey,
        suggestedBrands: candidate.suggestedBrands,
        autopilotStatus: "none",
        createdByEmail: actorEmail,
      },
    });
    created += 1;
    storyIds.push(story.id);
  }

  return { created, skipped, storyIds, candidates: ranked };
}

export async function listSuggestionStories() {
  return prisma.editorialStory.findMany({
    where: {
      status: "discovered",
      autopilotStatus: { in: ["none", "failed"] },
    },
    orderBy: [{ score: "desc" }, { detectedAt: "desc" }],
    take: 30,
  });
}
