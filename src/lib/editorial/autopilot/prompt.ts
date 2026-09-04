import type { EditorialBrand } from "../contracts";
import { VARIANTS_BY_BRAND } from "./schemas";

export const AUTOPILOT_JSON_EXAMPLE = `{
  "research": {
    "sources": [
      { "type": "official", "title": "Comunicado del BCRA", "url": "https://www.bcra.gob.ar/ejemplo", "publisher": "BCRA", "isPrimary": true }
    ],
    "claims": [
      { "text": "Afirmación verificable uno.", "classification": "fact", "importance": 5, "sourceIndex": 0, "relation": "supports", "quote": "Dato citado" },
      { "text": "Contexto interpretativo dos.", "classification": "context", "importance": 3, "relation": "contextualizes" }
    ],
    "scoreBreakdown": {
      "freshness": 4, "relevance": 5, "dailyImpact": 4, "sourceQuality": 4,
      "visualPotential": 3, "ownAngle": 4, "historicalDepth": 3, "saturation": 2
    },
    "scoreRationale": "Explicación breve del puntaje."
  },
  "angles": [
    {
      "brand": "labrechahoy",
      "audience": "lectores",
      "thesis": "Tesis con al menos diez caracteres",
      "tone": "claro",
      "exclusions": [],
      "whatHappened": "Qué pasó",
      "whatChanged": "Qué cambió",
      "affectedGroups": ["hogares"],
      "consequences": ["impacto"],
      "openQuestions": [],
      "analysisBoundary": "Límite del análisis"
    },
    {
      "brand": "museoargent",
      "audience": "curiosos",
      "thesis": "Tesis histórica con límites",
      "tone": "histórico",
      "exclusions": [],
      "historicalAntecedent": "Antecedente",
      "periodContext": "Contexto",
      "similarities": ["similitud"],
      "differences": ["diferencia"],
      "comparisonLimits": ["límite"],
      "historicalSourceIds": [],
      "editorialReason": "Por qué aporta"
    }
  ],
  "variants": [
    { "brand": "labrechahoy", "format": "article", "title": "Título", "body": "Texto largo en un solo string.", "cta": "Seguí el dato", "claimIndexes": [0, 1] },
    { "brand": "labrechahoy", "format": "carousel", "title": "Título carousel", "body": "Texto carousel.", "claimIndexes": [0] },
    { "brand": "museoargent", "format": "article", "title": "Título museo", "body": "Texto artículo museo.", "claimIndexes": [0, 1] },
    { "brand": "museoargent", "format": "reel", "title": "Título reel", "body": "Guion reel en string.", "claimIndexes": [0] }
  ]
}`;

export function buildAutopilotPrompt(story: {
  title: string;
  summary: string;
  tags: string[];
  suggestedBrands: EditorialBrand[];
  discoverySource: string;
  discoveryMeta: unknown;
}) {
  const brands = story.suggestedBrands.length > 0 ? story.suggestedBrands : (["labrechahoy", "museoargent"] as EditorialBrand[]);
  const formats = brands.flatMap((brand) => VARIANTS_BY_BRAND[brand].map((format) => `${brand}:${format}`));

  return `Generá un paquete editorial completo para revisión humana.

Tema:
- Título: ${story.title}
- Resumen: ${story.summary}
- Tags: ${story.tags.join(", ")}
- Fuente de descubrimiento: ${story.discoverySource}
- Meta: ${JSON.stringify(story.discoveryMeta ?? {})}

Reglas estrictas:
- research.sources: mínimo 1 objeto (no array vacío).
- research.claims: mínimo 2 objetos.
- research.scoreBreakdown: los 8 campos numéricos enteros 0-5 (freshness, relevance, dailyImpact, sourceQuality, visualPotential, ownAngle, historicalDepth, saturation).
- angles: array de OBJETOS completos por marca (nunca strings). Marcas: ${brands.join(", ")}.
- variants: body SIEMPRE string (nunca objeto). claimIndexes: array de enteros con al menos un índice (ej. [0,1]).
- Formatos requeridos: ${formats.join(", ")}.
- No verifiques claims: todos quedan pendientes de revisión humana.
- Si no hay URL confiable, usá classification "interpretation" o "context".

Respondé con JSON que siga EXACTAMENTE esta forma:
${AUTOPILOT_JSON_EXAMPLE}`;
}
