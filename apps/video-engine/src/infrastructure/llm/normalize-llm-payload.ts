/**
 * Normaliza respuestas LLM con claves alternativas hacia el shape canónico.
 * OpenAI a menudo usa number/text/dialogue en lugar de scene/narration.
 */
export function normalizeLlmPayload(
  schemaName: string,
  raw: unknown,
): unknown {
  if (!raw || typeof raw !== "object") return raw;
  const obj = raw as Record<string, unknown>;

  // Unwrap common wrappers
  const unwrapped =
    obj.ScriptDocument ??
    obj.scriptDocument ??
    obj.script ??
    obj.StoryboardDocument ??
    obj.storyboardDocument ??
    obj.storyboard ??
    obj.data ??
    obj.result ??
    obj;

  if (!unwrapped || typeof unwrapped !== "object") return raw;
  const doc = unwrapped as Record<string, unknown>;

  if (schemaName === "ScriptDocument") {
    const scenesRaw = doc.scenes ?? doc.Scenes ?? doc.escenas;
    if (!Array.isArray(scenesRaw)) return doc;
    return {
      musicCategoryHint:
        doc.musicCategoryHint ?? doc.music_category ?? doc.musicCategory,
      scenes: scenesRaw.map((s, i) => normalizeScriptScene(s, i + 1)),
    };
  }

  if (schemaName === "StoryboardDocument") {
    const scenesRaw = doc.scenes ?? doc.Scenes ?? doc.escenas;
    if (!Array.isArray(scenesRaw)) return doc;
    return {
      musicCategoryHint:
        doc.musicCategoryHint ?? doc.music_category ?? doc.musicCategory,
      scenes: scenesRaw.map((s, i) => normalizeStoryboardScene(s, i + 1)),
    };
  }

  return doc;
}

function normalizeScriptScene(raw: unknown, fallbackIndex: number): unknown {
  if (!raw || typeof raw !== "object") {
    return {
      scene: fallbackIndex,
      durationSec: 5,
      narration: String(raw ?? ""),
    };
  }
  const s = raw as Record<string, unknown>;
  const narration =
    pickString(s, [
      "narration",
      "text",
      "dialogue",
      "voiceover",
      "voiceOver",
      "content",
      "script",
      "line",
    ]) ?? "";
  const scene =
    pickNumber(s, ["scene", "number", "index", "id", "sceneNumber", "n"]) ??
    fallbackIndex;
  const durationSec =
    pickNumber(s, [
      "durationSec",
      "duration",
      "seconds",
      "duration_seconds",
      "length",
    ]) ?? Math.max(4, Math.min(10, Math.ceil(narration.length / 18)));

  return { scene, durationSec, narration };
}

function normalizeStoryboardScene(
  raw: unknown,
  fallbackIndex: number,
): unknown {
  const base = normalizeScriptScene(raw, fallbackIndex) as Record<
    string,
    unknown
  >;
  if (!raw || typeof raw !== "object") {
    return {
      ...base,
      shotType: "plano-general",
      assetHint: { preferredTypes: ["pintura"], tags: [], characters: [], places: [] },
      motion: "kenBurns",
      transition: "crossfade",
    };
  }
  const s = raw as Record<string, unknown>;
  const hintRaw =
    s.assetHint && typeof s.assetHint === "object"
      ? (s.assetHint as Record<string, unknown>)
      : {};

  const preferredRaw = Array.isArray(hintRaw.preferredTypes)
    ? hintRaw.preferredTypes
    : Array.isArray(hintRaw.types)
      ? hintRaw.types
      : ["pintura", "fotografia"];

  return {
    ...base,
    shotType: normalizeShotType(
      pickString(s, ["shotType", "shot", "plano", "type"]),
    ),
    assetHint: {
      preferredTypes: preferredRaw
        .map((t) =>
          typeof t === "string" ? normalizePreferredType(t) : null,
        )
        .filter((t): t is string => Boolean(t)),
      tags: Array.isArray(hintRaw.tags) ? hintRaw.tags : [],
      characters: Array.isArray(hintRaw.characters) ? hintRaw.characters : [],
      places: Array.isArray(hintRaw.places) ? hintRaw.places : [],
      epoch: typeof hintRaw.epoch === "string" ? hintRaw.epoch : undefined,
    },
    motion: normalizeMotion(
      pickString(s, ["motion", "camera", "animation"]),
    ),
    transition: normalizeTransition(
      pickString(s, ["transition", "transicion"]),
    ),
    onScreenText:
      pickString(s, ["onScreenText", "title", "overlay", "caption"]) ||
      undefined,
  };
}

const SHOT_ALIASES: Record<string, string> = {
  retrato: "retrato",
  portrait: "retrato",
  "plano-general": "plano-general",
  "plano general": "plano-general",
  wide: "plano-general",
  establishing: "plano-general",
  detalle: "detalle",
  "plano-detalle": "detalle",
  "plano detalle": "detalle",
  detail: "detalle",
  closeup: "detalle",
  "close-up": "detalle",
  mapa: "mapa",
  map: "mapa",
  documento: "documento",
  document: "documento",
  simbolo: "simbolo",
  symbol: "simbolo",
  símbolo: "simbolo",
};

const MOTION_ALIASES: Record<string, string> = {
  kenburns: "kenBurns",
  "ken-burns": "kenBurns",
  zoomin: "zoomIn",
  "zoom-in": "zoomIn",
  zoomout: "zoomOut",
  "zoom-out": "zoomOut",
  panleft: "panLeft",
  "pan-left": "panLeft",
  panright: "panRight",
  "pan-right": "panRight",
  static: "static",
};

const TRANSITION_ALIASES: Record<string, string> = {
  cut: "cut",
  fade: "fade",
  crossfade: "crossfade",
  "cross-fade": "crossfade",
  dissolve: "crossfade",
};

const PREFERRED_TYPE_ALIASES: Record<string, string> = {
  retrato: "retrato",
  pintura: "pintura",
  painting: "pintura",
  mapa: "mapa",
  map: "mapa",
  documento: "documento",
  document: "documento",
  monumento: "monumento",
  fotografia: "fotografia",
  fotografía: "fotografia",
  photo: "fotografia",
  bandera: "bandera",
  ilustracion: "ilustracion",
  ilustración: "ilustracion",
};

function normalizeShotType(raw: string | undefined): string {
  if (!raw) return "plano-general";
  const key = raw.trim().toLowerCase();
  return SHOT_ALIASES[key] ?? "plano-general";
}

function normalizeMotion(raw: string | undefined): string {
  if (!raw) return "kenBurns";
  const compact = raw.trim().replace(/[\s_]+/g, "");
  const lower = compact.toLowerCase();
  if (MOTION_ALIASES[lower]) return MOTION_ALIASES[lower];
  const allowed = [
    "kenBurns",
    "zoomIn",
    "zoomOut",
    "panLeft",
    "panRight",
    "static",
  ];
  return allowed.includes(raw.trim()) ? raw.trim() : "kenBurns";
}

function normalizeTransition(raw: string | undefined): string {
  if (!raw) return "crossfade";
  const key = raw.trim().toLowerCase();
  return TRANSITION_ALIASES[key] ?? "crossfade";
}

function normalizePreferredType(raw: string): string | null {
  const key = raw.trim().toLowerCase();
  return PREFERRED_TYPE_ALIASES[key] ?? null;
}

function pickString(
  obj: Record<string, unknown>,
  keys: string[],
): string | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

function pickNumber(
  obj: Record<string, unknown>,
  keys: string[],
): number | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() && !Number.isNaN(Number(v))) {
      return Number(v);
    }
  }
  return undefined;
}
