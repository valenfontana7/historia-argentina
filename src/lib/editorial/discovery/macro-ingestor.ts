import type { EditorialIngestor, TopicCandidate } from "./types";
import { dedupeKeyFromParts, slugifyTitle } from "./dedupe";

type MacroInsight = {
  id: string;
  title: string;
  body: string;
  level: "info" | "warning" | "alert";
  category: string;
};

const FALLBACK_INSIGHTS: MacroInsight[] = [
  {
    id: "brecha-alta",
    title: "Brecha cambiaria en zona de alerta",
    body: "La brecha entre dólar paralelo y oficial sigue amplia. Conviene explicar qué implica para ahorro, importaciones y expectativas.",
    level: "alert",
    category: "cambio",
  },
  {
    id: "inflacion-alta",
    title: "Inflación interanual sigue siendo el termómetro del bolsillo",
    body: "Los datos de precios condicionan salarios, alquileres y expectativas. Un repaso claro del dato y sus límites ayuda a leer la coyuntura.",
    level: "warning",
    category: "precios",
  },
];

function labrechaApiUrl(): string {
  const base = process.env.LABRECHA_API_URL?.trim() || process.env.NEXT_PUBLIC_LABRECHA_API_URL?.trim() || "http://127.0.0.1:3002";
  return base.replace(/\/$/, "");
}

async function fetchMacroInsights(): Promise<MacroInsight[]> {
  try {
    const response = await fetch(`${labrechaApiUrl()}/api/contexto`, { next: { revalidate: 0 } });
    if (!response.ok) return FALLBACK_INSIGHTS;
    const data = (await response.json()) as { insights?: MacroInsight[] };
    if (!Array.isArray(data.insights) || data.insights.length === 0) return FALLBACK_INSIGHTS;
    return data.insights;
  } catch {
    return FALLBACK_INSIGHTS;
  }
}

export const macroIngestor: EditorialIngestor = {
  name: "macro",
  async discover(): Promise<TopicCandidate[]> {
    const insights = await fetchMacroInsights();
    return insights.slice(0, 6).map((insight) => ({
      dedupeKey: dedupeKeyFromParts("macro", insight.id),
      title: insight.title,
      summary: insight.body,
      slug: slugifyTitle(`macro-${insight.id}`),
      tags: ["macro", insight.category, "coyuntura"],
      discoverySource: "macro",
      discoveryMeta: {
        ingestor: "macro",
        insightId: insight.id,
        level: insight.level,
        category: insight.category,
        source: "labrecha-api",
      },
      suggestedBrands: ["labrechahoy"],
      scoreHints: {
        freshness: 5,
        relevance: insight.level === "alert" ? 5 : 4,
        dailyImpact: insight.level === "alert" ? 5 : 4,
        sourceQuality: 4,
        visualPotential: 3,
        ownAngle: 4,
        historicalDepth: 2,
        saturation: insight.level === "info" ? 3 : 2,
      },
    }));
  },
};
