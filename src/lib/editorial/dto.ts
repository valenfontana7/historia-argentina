/* eslint-disable @typescript-eslint/no-explicit-any -- Prisma relation payloads are mapped at this boundary. */
import { z } from "zod";
import { EditorialBrandSchema, VariantStatusSchema } from "./contracts";

const DateSchema = z.date().transform((date) => date.toISOString());
const SourceDtoSchema = z.object({ id: z.string(), type: z.string(), title: z.string(), url: z.string().nullable(), publisher: z.string().nullable(), publishedAt: DateSchema.nullable(), accessedAt: DateSchema, isPrimary: z.boolean() });
const ClaimDtoSchema = z.object({ id: z.string(), text: z.string(), classification: z.string(), verification: z.string(), importance: z.number(), evidence: z.array(z.object({ relation: z.string(), quote: z.string().nullable(), source: SourceDtoSchema.pick({ id: true, title: true, type: true }) })) });
const MediaDtoSchema = z.object({ id: z.string(), engine: z.string(), jobId: z.string().nullable(), status: z.string(), uri: z.string().nullable(), manifestUri: z.string().nullable(), error: z.string().nullable(), createdAt: DateSchema, updatedAt: DateSchema });
const PublicationDtoSchema = z.object({ id: z.string(), channel: z.string(), url: z.string(), publishedAt: DateSchema.nullable(), status: z.string() });

export const EditorialStoryDtoSchema = z.object({
  id: z.string(), title: z.string(), summary: z.string(), slug: z.string(), status: z.string(), tags: z.array(z.string()), detectedAt: DateSchema, eventDate: DateSchema.nullable(),
  score: z.number().nullable(), scoreBreakdown: z.unknown().nullable(), sources: z.array(SourceDtoSchema), claims: z.array(ClaimDtoSchema),
  angles: z.array(z.object({ id: z.string(), brand: EditorialBrandSchema, status: z.string(), thesis: z.string(), audience: z.string(), tone: z.string(), version: z.number(), variants: z.array(z.object({ id: z.string(), format: z.string(), status: z.string(), version: z.number(), title: z.string(), body: z.string(), cta: z.string().nullable(), claims: z.array(z.object({ claim: ClaimDtoSchema.pick({ id: true, text: true, classification: true, verification: true }) })), mediaOutputs: z.array(MediaDtoSchema), publications: z.array(PublicationDtoSchema) })) })),
  reviews: z.array(z.object({ id: z.string(), targetType: z.string(), targetId: z.string(), decision: z.string(), previousStatus: z.string().nullable(), newStatus: z.string(), targetVersion: z.number(), note: z.string().nullable(), createdAt: DateSchema })),
});

export const EditorialVariantDtoSchema = z.object({ id: z.string(), format: z.string(), status: VariantStatusSchema, version: z.number(), title: z.string(), body: z.string(), cta: z.string().nullable(), story: z.object({ id: z.string(), slug: z.string(), title: z.string(), status: z.string() }), brand: EditorialBrandSchema, mediaOutputs: z.array(MediaDtoSchema) });

export function editorialStoryDto(story: any) {
  return EditorialStoryDtoSchema.parse({
    id: story.id, title: story.title, summary: story.summary, slug: story.slug, status: story.status, tags: story.tags, detectedAt: story.detectedAt, eventDate: story.eventDate,
    score: story.score, scoreBreakdown: story.scoreBreakdown, sources: story.sources, claims: story.claims, angles: story.angles.map((angle: any) => ({
      id: angle.id, brand: angle.brand, status: angle.status, thesis: angle.thesis, audience: angle.audience, tone: angle.tone, version: angle.version,
      variants: angle.variants.map((variant: any) => ({ id: variant.id, format: variant.format, status: variant.status, version: variant.version, title: variant.title, body: variant.body, cta: variant.cta, claims: variant.claims, mediaOutputs: variant.mediaOutputs, publications: variant.publications })),
    })),
    reviews: (story.reviews ?? []).map((review: any) => ({ id: review.id, targetType: review.targetType, targetId: review.targetId, decision: review.decision, previousStatus: review.previousStatus, newStatus: review.newStatus, targetVersion: review.targetVersion, note: review.note, createdAt: review.createdAt })),
  });
}

export function editorialVariantDto(variant: any) {
  return EditorialVariantDtoSchema.parse({ id: variant.id, format: variant.format, status: variant.status, version: variant.version, title: variant.title, body: variant.body, cta: variant.cta, story: { id: variant.angle.story.id, slug: variant.angle.story.slug, title: variant.angle.story.title, status: variant.angle.story.status }, brand: variant.angle.brand, mediaOutputs: variant.mediaOutputs });
}
