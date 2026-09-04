import { createHash } from "node:crypto";
import type { TopicCandidate } from "./types";

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "tema-editorial";
}

export function dedupeKeyFromParts(...parts: string[]): string {
  const normalized = parts.map((part) => part.trim().toLowerCase()).filter(Boolean).join("|");
  return createHash("sha256").update(normalized).digest("hex").slice(0, 40);
}

export function dedupeCandidates(candidates: TopicCandidate[]): TopicCandidate[] {
  const seen = new Set<string>();
  const unique: TopicCandidate[] = [];
  for (const candidate of candidates) {
    if (seen.has(candidate.dedupeKey)) continue;
    seen.add(candidate.dedupeKey);
    unique.push(candidate);
  }
  return unique;
}

export function rankCandidates(candidates: TopicCandidate[]): TopicCandidate[] {
  return [...candidates].sort((a, b) => scoreFromHints(b.scoreHints) - scoreFromHints(a.scoreHints));
}

function scoreFromHints(hints: TopicCandidate["scoreHints"]): number {
  const values = [
    hints.freshness ?? 0,
    hints.relevance ?? 0,
    hints.dailyImpact ?? 0,
    hints.sourceQuality ?? 0,
    hints.visualPotential ?? 0,
    hints.ownAngle ?? 0,
    hints.historicalDepth ?? 0,
    5 - (hints.saturation ?? 2),
  ];
  return values.reduce((sum, value) => sum + value, 0);
}
