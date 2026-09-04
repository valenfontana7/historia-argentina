import { z } from "zod";
import {
  ClaimClassificationSchema,
  EvidenceRelationSchema,
  LaBrechaBriefSchema,
  MuseoArgentBriefSchema,
  ScoreBreakdownSchema,
  SourceTypeSchema,
  type EditorialBrand,
} from "../contracts";

const ResearchSourceSchema = z.object({
  type: SourceTypeSchema,
  title: z.string().min(3),
  url: z.string().url().optional(),
  publisher: z.string().optional(),
  isPrimary: z.boolean().default(false),
  notes: z.string().optional(),
});

const ResearchClaimSchema = z.object({
  text: z.string().min(5),
  classification: ClaimClassificationSchema,
  importance: z.number().int().min(1).max(5).default(3),
  sourceIndex: z.number().int().min(0).optional(),
  relation: EvidenceRelationSchema.default("supports"),
  quote: z.string().optional(),
});

export const AutopilotResearchSchema = z.object({
  sources: z.array(ResearchSourceSchema).min(1),
  claims: z.array(ResearchClaimSchema).min(2),
  scoreBreakdown: ScoreBreakdownSchema,
  scoreRationale: z.string().min(10),
});

export const AutopilotAngleSchema = z.discriminatedUnion("brand", [LaBrechaBriefSchema, MuseoArgentBriefSchema]);

export const AutopilotVariantSchema = z.object({
  brand: z.enum(["museoargent", "labrechahoy"]),
  format: z.enum(["article", "reel", "carousel"]),
  title: z.string().min(3),
  body: z.string().min(20),
  cta: z.string().optional(),
  claimIndexes: z.array(z.number().int().min(0)).min(1),
});

export const AutopilotPackageSchema = z.object({
  research: AutopilotResearchSchema,
  angles: z.array(AutopilotAngleSchema).min(1),
  variants: z.array(AutopilotVariantSchema).min(1),
});

export type AutopilotPackage = z.infer<typeof AutopilotPackageSchema>;

export const VARIANTS_BY_BRAND: Record<EditorialBrand, Array<"article" | "reel" | "carousel">> = {
  labrechahoy: ["article", "carousel"],
  museoargent: ["article", "reel"],
};
