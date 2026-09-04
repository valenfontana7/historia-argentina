import { PUENTES_EDITORIALES } from "@/lib/grafo/puentes-editoriales";
import type { EditorialIngestor, TopicCandidate } from "./types";
import { dedupeKeyFromParts, slugifyTitle } from "./dedupe";

export const grafoIngestor: EditorialIngestor = {
  name: "grafo",
  async discover(): Promise<TopicCandidate[]> {
    const entries = Object.entries(PUENTES_EDITORIALES).slice(0, 8);
    return entries.map(([origin, bridges]) => {
      const destinations = Object.keys(bridges);
      const bridgeText = Object.values(bridges)[0] ?? "Conexión narrativa en el grafo editorial.";
      return {
        dedupeKey: dedupeKeyFromParts("grafo", origin),
        title: `Paralelos desde «${origin.replace(/-/g, " ")}»`,
        summary: `Tema no coyuntural con puente editorial hacia ${destinations.slice(0, 2).join(" y ")}. ${bridgeText}`,
        slug: slugifyTitle(`grafo-${origin}`),
        tags: ["grafo", "historia", "paralelos"],
        discoverySource: "grafo",
        discoveryMeta: {
          ingestor: "grafo",
          origin,
          bridges,
          destinations,
        },
        suggestedBrands: ["museoargent"],
        scoreHints: {
          freshness: 2,
          relevance: 3,
          dailyImpact: 2,
          sourceQuality: 4,
          visualPotential: 4,
          ownAngle: 5,
          historicalDepth: 5,
          saturation: 1,
        },
      };
    });
  },
};
