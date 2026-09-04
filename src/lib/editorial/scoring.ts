import { ScoreBreakdown, ScoreBreakdownSchema } from "./contracts";

export function calculateEditorialScore(input: ScoreBreakdown): number {
  const score = ScoreBreakdownSchema.parse(input);
  const positive = score.freshness + score.relevance + score.dailyImpact + score.sourceQuality + score.visualPotential + score.ownAngle + score.historicalDepth;
  const saturationAdjusted = 5 - score.saturation;
  return Math.round(((positive + saturationAdjusted) / 40) * 100);
}

export function scoreLabel(score: number): "weak" | "promising" | "strong" {
  if (score < 45) return "weak";
  if (score < 70) return "promising";
  return "strong";
}
