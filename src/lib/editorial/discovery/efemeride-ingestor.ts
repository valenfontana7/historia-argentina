import { efemeridesOrdenadas, resolverEfemerideParaFecha } from "@/data/efemerides";
import type { EditorialIngestor, TopicCandidate } from "./types";
import { dedupeKeyFromParts, slugifyTitle } from "./dedupe";

const ECONOMIC_CATEGORIES = new Set(["economía", "economia", "política", "politica", "sociedad"]);

export const efemerideIngestor: EditorialIngestor = {
  name: "efemeride",
  async discover(): Promise<TopicCandidate[]> {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const resolved = resolverEfemerideParaFecha(month, day);
    const upcoming = efemeridesOrdenadas()
      .filter((item) => {
        const delta = (item.mes - month) * 31 + (item.numero - day);
        return delta >= 0 && delta <= 7;
      })
      .slice(0, 5);

    const pool = resolved.efemeride ? [resolved.efemeride, ...upcoming.filter((item) => item.dia !== resolved.efemeride?.dia)] : upcoming;

    return pool.map((item) => {
      const summary = item.hook ?? item.historia[0] ?? item.titulo;
      const economic = ECONOMIC_CATEGORIES.has(item.categoria.toLowerCase());
      return {
        dedupeKey: dedupeKeyFromParts("efemeride", item.dia, String(item.anio)),
        title: `${item.titulo} (${item.fecha})`,
        summary,
        slug: slugifyTitle(`efemeride-${item.dia}`),
        tags: ["efeméride", item.categoria, ...(economic ? ["economía"] : [])],
        eventDate: new Date(item.anio, item.mes - 1, item.numero, 12),
        discoverySource: "efemeride",
        discoveryMeta: {
          ingestor: "efemeride",
          dia: item.dia,
          categoria: item.categoria,
          relacionados: item.relacionados,
          esExacta: resolved.esExacta && resolved.efemeride?.dia === item.dia,
        },
        suggestedBrands: economic ? ["museoargent", "labrechahoy"] : ["museoargent"],
        scoreHints: {
          freshness: resolved.esExacta && resolved.efemeride?.dia === item.dia ? 5 : 3,
          relevance: 4,
          dailyImpact: economic ? 4 : 3,
          sourceQuality: 4,
          visualPotential: 4,
          ownAngle: 4,
          historicalDepth: 5,
          saturation: 1,
        },
      };
    });
  },
};
