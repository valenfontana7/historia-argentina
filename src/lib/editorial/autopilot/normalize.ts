import type { EditorialBrand, ScoreBreakdown } from "../contracts";
import { VARIANTS_BY_BRAND } from "./schemas";

function asString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (value === null || value === undefined) return "";
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (Array.isArray(record.paragraphs)) {
      return record.paragraphs.map((item) => String(item)).join("\n\n").trim();
    }
    if (typeof record.text === "string") return record.text.trim();
    return JSON.stringify(value);
  }
  return String(value).trim();
}

function asNumber(value: unknown, fallback: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(5, Math.max(0, Math.round(n)));
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string") {
    return value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function defaultScoreBreakdown(): ScoreBreakdown {
  return {
    freshness: 3,
    relevance: 4,
    dailyImpact: 3,
    sourceQuality: 3,
    visualPotential: 3,
    ownAngle: 4,
    historicalDepth: 3,
    saturation: 2,
  };
}

function fallbackLabrechaAngle(story: { title: string; summary: string }): Record<string, unknown> {
  return {
    brand: "labrechahoy",
    audience: "lectores de Argentina interesados en economía y coyuntura",
    thesis: `Cómo leer ${story.title} con datos y límites claros`,
    tone: "claro, directo y basado en datos",
    exclusions: ["predicciones sin respaldo"],
    whatHappened: story.summary.slice(0, 280),
    whatChanged: "El tema modifica expectativas o decisiones cotidianas.",
    affectedGroups: ["hogares", "trabajadores"],
    consequences: ["impacto en el bolsillo", "revisión de expectativas"],
    openQuestions: [],
    analysisBoundary: "Sin extrapolar más allá de lo verificable.",
  };
}

function fallbackMuseoAngle(story: { title: string; summary: string }): Record<string, unknown> {
  return {
    brand: "museoargent",
    audience: "curiosos de historia argentina",
    thesis: `Qué contexto histórico ayuda a entender ${story.title}`,
    tone: "histórico y contextual",
    exclusions: ["comparaciones partidarias"],
    historicalAntecedent: "Antecedentes históricos comparables en la Argentina.",
    periodContext: "Contexto de época relevante para el tema.",
    similarities: ["presiones económicas o sociales similares"],
    differences: ["contexto institucional distinto"],
    comparisonLimits: ["No equiparar causas ni actores"],
    historicalSourceIds: [],
    editorialReason: "El paralelo aporta perspectiva sin forzar la analogía.",
  };
}

function normalizeAngle(raw: unknown, story: { title: string; summary: string }, brand: EditorialBrand): Record<string, unknown> | null {
  if (typeof raw === "string") {
    return brand === "labrechahoy" ? fallbackLabrechaAngle(story) : fallbackMuseoAngle(story);
  }
  if (!raw || typeof raw !== "object") return null;
  const angle = raw as Record<string, unknown>;
  const detectedBrand = angle.brand === "museoargent" ? "museoargent" : angle.brand === "labrechahoy" ? "labrechahoy" : brand;
  const base = detectedBrand === "labrechahoy" ? fallbackLabrechaAngle(story) : fallbackMuseoAngle(story);
  return { ...base, ...angle, brand: detectedBrand };
}

export function normalizeAutopilotPackage(
  raw: unknown,
  story: {
    title: string;
    summary: string;
    suggestedBrands: EditorialBrand[];
  },
): unknown {
  if (!raw || typeof raw !== "object") return raw;
  const input = raw as Record<string, unknown>;
  const researchRaw = (input.research && typeof input.research === "object" ? input.research : {}) as Record<string, unknown>;

  let sources = Array.isArray(researchRaw.sources) ? researchRaw.sources : [];
  if (sources.length === 0) {
    sources = [{
      type: "manual",
      title: `Investigación inicial: ${story.title}`,
      isPrimary: true,
      notes: story.summary,
    }];
  }

  let claims = Array.isArray(researchRaw.claims) ? researchRaw.claims : [];
  if (claims.length < 2) {
    claims = [
      {
        text: story.summary.slice(0, 240),
        classification: "context",
        importance: 4,
        relation: "contextualizes",
      },
      {
        text: `El tema "${story.title}" requiere verificación editorial antes de publicarse.`,
        classification: "interpretation",
        importance: 3,
        sourceIndex: 0,
        relation: "supports",
      },
    ];
  }

  const scoreRaw = (researchRaw.scoreBreakdown && typeof researchRaw.scoreBreakdown === "object"
    ? researchRaw.scoreBreakdown
    : {}) as Record<string, unknown>;
  const defaults = defaultScoreBreakdown();
  const scoreBreakdown = {
    freshness: asNumber(scoreRaw.freshness, defaults.freshness),
    relevance: asNumber(scoreRaw.relevance, defaults.relevance),
    dailyImpact: asNumber(scoreRaw.dailyImpact, defaults.dailyImpact),
    sourceQuality: asNumber(scoreRaw.sourceQuality, defaults.sourceQuality),
    visualPotential: asNumber(scoreRaw.visualPotential, defaults.visualPotential),
    ownAngle: asNumber(scoreRaw.ownAngle, defaults.ownAngle),
    historicalDepth: asNumber(scoreRaw.historicalDepth, defaults.historicalDepth),
    saturation: asNumber(scoreRaw.saturation, defaults.saturation),
  };

  const brands = story.suggestedBrands.length > 0 ? story.suggestedBrands : (["labrechahoy", "museoargent"] as EditorialBrand[]);
  const anglesRaw = Array.isArray(input.angles) ? input.angles : [];
  const angles = brands.map((brand, index) => normalizeAngle(anglesRaw[index] ?? anglesRaw.find((item) => {
    if (typeof item === "object" && item && (item as Record<string, unknown>).brand === brand) return true;
    return false;
  }), story, brand)).filter((item): item is Record<string, unknown> => Boolean(item));

  const claimIndexesDefault = claims.map((_, index) => index).slice(0, Math.min(claims.length, 3));
  const variantsRaw = Array.isArray(input.variants) ? input.variants : [];
  const expectedVariants = brands.flatMap((brand) =>
    VARIANTS_BY_BRAND[brand].map((format) => ({ brand, format })),
  );

  const variants = expectedVariants.map((expected, index) => {
    const candidate = (variantsRaw[index] ?? variantsRaw.find((item) => {
      if (!item || typeof item !== "object") return false;
      const record = item as Record<string, unknown>;
      return record.brand === expected.brand && record.format === expected.format;
    }) ?? {}) as Record<string, unknown>;

    const claimIndexes = Array.isArray(candidate.claimIndexes)
      ? candidate.claimIndexes.map((item) => Number(item)).filter((item) => Number.isInteger(item) && item >= 0)
      : [];
    const body = asString(candidate.body) || `${story.summary}\n\nLectura editorial para ${expected.brand} en formato ${expected.format}.`;

    return {
      brand: expected.brand,
      format: expected.format,
      title: asString(candidate.title) || `${story.title} (${expected.format})`,
      body: body.length >= 20 ? body : `${body}\n\nRequiere revisión humana antes de publicar.`,
      cta: asString(candidate.cta) || undefined,
      claimIndexes: claimIndexes.length > 0 ? claimIndexes : claimIndexesDefault,
    };
  });

  return {
    research: {
      sources: sources.map((source) => {
        const record = (source && typeof source === "object" ? source : {}) as Record<string, unknown>;
        return {
          type: record.type ?? "secondary",
          title: asString(record.title) || "Fuente editorial",
          url: typeof record.url === "string" ? record.url : undefined,
          publisher: asString(record.publisher) || undefined,
          isPrimary: Boolean(record.isPrimary),
          notes: asString(record.notes) || undefined,
        };
      }),
      claims: claims.map((claim) => {
        const record = (claim && typeof claim === "object" ? claim : { text: String(claim) }) as Record<string, unknown>;
        return {
          text: asString(record.text) || story.summary.slice(0, 200),
          classification: record.classification ?? "context",
          importance: asNumber(record.importance, 3),
          sourceIndex: record.sourceIndex === undefined ? undefined : asNumber(record.sourceIndex, 0),
          relation: record.relation ?? "supports",
          quote: asString(record.quote) || undefined,
        };
      }),
      scoreBreakdown,
      scoreRationale: asString(researchRaw.scoreRationale) || `Tema con relevancia editorial para ${brands.join(" y ")}.`,
    },
    angles: angles.map((angle) => ({
      ...angle,
      exclusions: asStringArray(angle.exclusions),
      ...(angle.brand === "labrechahoy"
        ? {
            affectedGroups: asStringArray(angle.affectedGroups).length ? asStringArray(angle.affectedGroups) : ["hogares"],
            consequences: asStringArray(angle.consequences).length ? asStringArray(angle.consequences) : ["impacto cotidiano"],
            openQuestions: asStringArray(angle.openQuestions),
          }
        : {
            similarities: asStringArray(angle.similarities).length ? asStringArray(angle.similarities) : ["similitud contextual"],
            differences: asStringArray(angle.differences).length ? asStringArray(angle.differences) : ["contexto distinto"],
            comparisonLimits: asStringArray(angle.comparisonLimits).length ? asStringArray(angle.comparisonLimits) : ["límite de la comparación"],
            historicalSourceIds: asStringArray(angle.historicalSourceIds),
          }),
    })),
    variants,
  };
}
