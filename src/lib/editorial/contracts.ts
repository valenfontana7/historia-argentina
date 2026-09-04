import { z } from "zod";

export const EditorialBrandSchema = z.enum(["museoargent", "labrechahoy"]);
export type EditorialBrand = z.infer<typeof EditorialBrandSchema>;

export const DiscoverySourceSchema = z.enum(["macro", "rss", "web", "efemeride", "grafo", "manual"]);
export type DiscoverySource = z.infer<typeof DiscoverySourceSchema>;

export const AutopilotStatusSchema = z.enum(["none", "queued", "generating", "ready", "failed"]);
export type AutopilotStatus = z.infer<typeof AutopilotStatusSchema>;

export const StoryStatusSchema = z.enum(["discovered", "triaged", "researching", "angle_proposed", "rejected", "archived"]);
export type StoryStatus = z.infer<typeof StoryStatusSchema>;
export const ClaimClassificationSchema = z.enum(["fact", "context", "interpretation", "opinion"]);
export const ClaimVerificationSchema = z.enum(["pending", "verified", "disputed", "rejected"]);
export const EvidenceRelationSchema = z.enum(["supports", "contradicts", "contextualizes"]);
export const SourceTypeSchema = z.enum(["official", "primary", "secondary", "internal", "manual"]);
export const AngleStatusSchema = z.enum(["proposed", "approved", "needs_revision", "rejected"]);
export type AngleStatus = z.infer<typeof AngleStatusSchema>;
export const VariantFormatSchema = z.enum(["article", "reel", "carousel", "story", "x_post", "audiovisual_script", "description_cta"]);
export type VariantFormat = z.infer<typeof VariantFormatSchema>;
export const VariantStatusSchema = z.enum(["drafted", "fact_check_pending", "fact_checked", "production_ready", "rendered", "final_review", "approved", "published", "needs_revision", "rejected"]);
export type VariantStatus = z.infer<typeof VariantStatusSchema>;

export const ScoreBreakdownSchema = z.object({
  freshness: z.number().min(0).max(5), relevance: z.number().min(0).max(5),
  dailyImpact: z.number().min(0).max(5), sourceQuality: z.number().min(0).max(5),
  visualPotential: z.number().min(0).max(5), ownAngle: z.number().min(0).max(5),
  historicalDepth: z.number().min(0).max(5), saturation: z.number().min(0).max(5),
});
export type ScoreBreakdown = z.infer<typeof ScoreBreakdownSchema>;

const BaseBriefSchema = z.object({
  audience: z.string().trim().min(2), thesis: z.string().trim().min(10), tone: z.string().trim().min(2),
  exclusions: z.array(z.string().trim().min(1)).default([]),
});
export const LaBrechaBriefSchema = BaseBriefSchema.extend({
  brand: z.literal("labrechahoy"), whatHappened: z.string().trim().min(5), whatChanged: z.string().trim().min(5),
  affectedGroups: z.array(z.string().trim().min(1)).min(1), consequences: z.array(z.string().trim().min(1)).min(1),
  openQuestions: z.array(z.string().trim().min(1)).default([]), analysisBoundary: z.string().trim().min(5),
});
export const MuseoArgentBriefSchema = BaseBriefSchema.extend({
  brand: z.literal("museoargent"), historicalAntecedent: z.string().trim().min(5), periodContext: z.string().trim().min(5),
  similarities: z.array(z.string().trim().min(1)).min(1), differences: z.array(z.string().trim().min(1)).min(1),
  comparisonLimits: z.array(z.string().trim().min(1)).min(1), historicalSourceIds: z.array(z.string().min(1)).default([]),
  editorialReason: z.string().trim().min(5),
});
export const BrandBriefSchema = z.discriminatedUnion("brand", [LaBrechaBriefSchema, MuseoArgentBriefSchema]);
export type BrandBrief = z.infer<typeof BrandBriefSchema>;

export const ContentPayloadSchema = z.object({ title: z.string().min(1), body: z.string().min(1), cta: z.string().optional(), bullets: z.array(z.string()).default([]), sourceNotes: z.array(z.string()).default([]), claimIds: z.array(z.string()).default([]) });
export const CreateStoryInputSchema = z.object({
  title: z.string().trim().min(3),
  summary: z.string().trim().min(10),
  slug: z.string().trim().min(3).regex(/^[a-z0-9-]+$/),
  tags: z.array(z.string().trim().min(1)).default([]),
  eventDate: z.date().optional(),
  createdByEmail: z.string().email(),
  discoverySource: DiscoverySourceSchema.optional(),
  discoveryMeta: z.record(z.string(), z.unknown()).optional(),
  dedupeKey: z.string().trim().min(3).optional(),
  suggestedBrands: z.array(EditorialBrandSchema).default([]),
});
export const AddSourceInputSchema = z.object({ storyId: z.string().min(1), type: SourceTypeSchema, title: z.string().trim().min(3), url: z.string().url().optional(), publisher: z.string().trim().optional(), publishedAt: z.date().optional(), accessedAt: z.date(), isPrimary: z.boolean(), notes: z.string().trim().optional() });
export const AddClaimInputSchema = z.object({ storyId: z.string().min(1), text: z.string().trim().min(5), classification: ClaimClassificationSchema, importance: z.number().int().min(1).max(5), notes: z.string().trim().optional(), sourceId: z.string().min(1).optional(), relation: EvidenceRelationSchema.default("supports"), quote: z.string().trim().optional() });
export const CreateVariantInputSchema = z.object({ angleId: z.string().min(1), format: VariantFormatSchema, title: z.string().trim().min(3), body: z.string().trim().min(10), cta: z.string().trim().optional(), claimIds: z.array(z.string().min(1)).min(1), createdByEmail: z.string().email() });
export type ContentPayload = z.infer<typeof ContentPayloadSchema>;

const storyTransitions: Record<StoryStatus, readonly StoryStatus[]> = {
  discovered: ["triaged", "rejected"], triaged: ["researching", "rejected"], researching: ["angle_proposed", "rejected"],
  angle_proposed: ["archived", "rejected"], rejected: ["discovered"], archived: ["discovered"],
};
const angleTransitions: Record<AngleStatus, readonly AngleStatus[]> = {
  proposed: ["approved", "needs_revision", "rejected"], approved: ["needs_revision", "rejected"],
  needs_revision: ["proposed", "rejected"], rejected: ["proposed"],
};
const variantTransitions: Record<VariantStatus, readonly VariantStatus[]> = {
  drafted: ["fact_check_pending", "needs_revision", "rejected"], fact_check_pending: ["fact_checked", "needs_revision", "rejected"],
  fact_checked: ["production_ready", "needs_revision", "rejected"], production_ready: ["rendered", "final_review", "needs_revision", "rejected"],
  rendered: ["final_review", "needs_revision", "rejected"], final_review: ["approved", "needs_revision", "rejected"],
  approved: ["published", "needs_revision"], published: [], needs_revision: ["drafted", "rejected"], rejected: ["drafted"],
};
export function storyNextStatuses(status: StoryStatus) { return storyTransitions[status]; }
export function angleNextStatuses(status: AngleStatus) { return angleTransitions[status]; }
export function variantNextStatuses(status: VariantStatus) { return variantTransitions[status]; }
export function canTransitionStory(from: StoryStatus, to: StoryStatus) { return storyTransitions[from].includes(to); }
export function canTransitionAngle(from: AngleStatus, to: AngleStatus) { return angleTransitions[from].includes(to); }
export function canTransitionVariant(from: VariantStatus, to: VariantStatus) { return variantTransitions[from].includes(to); }
export function assertTransition(allowed: boolean, from: string, to: string) { if (!allowed) throw new Error(`Transición editorial inválida: ${from} → ${to}`); }
