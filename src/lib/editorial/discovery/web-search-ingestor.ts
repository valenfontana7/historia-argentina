import type { EditorialIngestor, TopicCandidate } from "./types";
import { dedupeKeyFromParts, slugifyTitle } from "./dedupe";

type WebSearchResult = {
  title?: string;
  url?: string;
  snippet?: string;
};

const DEFAULT_QUERIES = [
  "Argentina economía hoy",
  "medida BCRA Argentina",
  "inflación Argentina INDEC",
];

function contextDevApiKey(): string | undefined {
  return process.env.CONTEXT_DEV_API_KEY?.trim() || undefined;
}

function searchQueries(): string[] {
  const raw = process.env.EDITORIAL_WEB_SEARCH_QUERIES?.trim();
  if (!raw) return DEFAULT_QUERIES;
  try {
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_QUERIES;
  } catch {
    return raw.split(",").map((item) => item.trim()).filter(Boolean);
  }
}

async function searchWeb(query: string): Promise<WebSearchResult[]> {
  const apiKey = contextDevApiKey();
  if (!apiKey) return [];

  const response = await fetch("https://api.context.dev/v1/web-search", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, limit: 5 }),
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) return [];
  const data = (await response.json()) as { results?: WebSearchResult[] };
  return Array.isArray(data.results) ? data.results : [];
}

export const webSearchIngestor: EditorialIngestor = {
  name: "web",
  async discover(): Promise<TopicCandidate[]> {
    if (!contextDevApiKey()) return [];

    const queries = searchQueries();
    const candidates: TopicCandidate[] = [];

    for (const query of queries) {
      const results = await searchWeb(query);
      for (const result of results.slice(0, 3)) {
        if (!result.title || !result.url) continue;
        candidates.push({
          dedupeKey: dedupeKeyFromParts("web", result.url),
          title: result.title,
          summary: result.snippet?.trim() || `Tema detectado vía búsqueda: ${query}`,
          slug: slugifyTitle(`web-${result.title}`),
          tags: ["web", "coyuntura", "búsqueda"],
          discoverySource: "web",
          discoveryMeta: {
            ingestor: "web",
            query,
            url: result.url,
            snippet: result.snippet ?? null,
          },
          suggestedBrands: ["labrechahoy"],
          scoreHints: {
            freshness: 5,
            relevance: 4,
            dailyImpact: 4,
            sourceQuality: 3,
            visualPotential: 2,
            ownAngle: 3,
            historicalDepth: 1,
            saturation: 4,
          },
        });
      }
    }

    return candidates;
  },
};
