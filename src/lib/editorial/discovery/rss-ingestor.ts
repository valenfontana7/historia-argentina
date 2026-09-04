import type { EditorialIngestor, TopicCandidate } from "./types";
import { dedupeKeyFromParts, slugifyTitle } from "./dedupe";

type RssFeed = { name: string; url: string };

const DEFAULT_FEEDS: RssFeed[] = [
  { name: "BCRA", url: "https://www.bcra.gob.ar/Noticias/NoticiasRSS.aspx" },
  { name: "INDEC", url: "https://www.indec.gob.ar/rss/noticias.xml" },
];

function parseRssFeeds(): RssFeed[] {
  const raw = process.env.EDITORIAL_RSS_FEEDS?.trim();
  if (!raw) return DEFAULT_FEEDS;
  try {
    const parsed = JSON.parse(raw) as RssFeed[];
    return Array.isArray(parsed) ? parsed.filter((item) => item?.url) : DEFAULT_FEEDS;
  } catch {
    return DEFAULT_FEEDS;
  }
}

function extractTag(block: string, tag: string): string | null {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  if (!match?.[1]) return null;
  return match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]+>/g, "").trim();
}

function extractItems(xml: string): Array<{ title: string; link: string; pubDate?: string }> {
  const items: Array<{ title: string; link: string; pubDate?: string }> = [];
  const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  for (const block of blocks.slice(0, 8)) {
    const title = extractTag(block, "title");
    const link = extractTag(block, "link");
    if (!title || !link) continue;
    items.push({ title, link, pubDate: extractTag(block, "pubDate") ?? undefined });
  }
  return items;
}

export const rssIngestor: EditorialIngestor = {
  name: "rss",
  async discover(): Promise<TopicCandidate[]> {
    const feeds = parseRssFeeds();
    const candidates: TopicCandidate[] = [];

    await Promise.all(
      feeds.map(async (feed) => {
        try {
          const response = await fetch(feed.url, {
            headers: { "User-Agent": "MuseoArgent-EditorialBot/1.0" },
            signal: AbortSignal.timeout(12_000),
          });
          if (!response.ok) return;
          const xml = await response.text();
          for (const item of extractItems(xml).slice(0, 4)) {
            candidates.push({
              dedupeKey: dedupeKeyFromParts("rss", item.link),
              title: item.title,
              summary: `Titular detectado en ${feed.name}. Requiere verificación editorial antes de publicar.`,
              slug: slugifyTitle(`rss-${item.title}`),
              tags: ["rss", feed.name.toLowerCase(), "coyuntura"],
              eventDate: item.pubDate ? new Date(item.pubDate) : undefined,
              discoverySource: "rss",
              discoveryMeta: {
                ingestor: "rss",
                feed: feed.name,
                url: item.link,
                pubDate: item.pubDate ?? null,
              },
              suggestedBrands: ["labrechahoy", "museoargent"],
              scoreHints: {
                freshness: 5,
                relevance: 4,
                dailyImpact: 4,
                sourceQuality: feed.name === "BCRA" || feed.name === "INDEC" ? 5 : 3,
                visualPotential: 2,
                ownAngle: 3,
                historicalDepth: 1,
                saturation: 3,
              },
            });
          }
        } catch {
          // Feed opcional: omitir en silencio.
        }
      }),
    );

    return candidates;
  },
};
