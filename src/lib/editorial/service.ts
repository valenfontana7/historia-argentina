import {
  BrandAngleStatus,
  ClaimVerificationStatus,
  ContentVariantStatus,
  EditorialStoryStatus,
  Prisma,
  ReviewDecisionKind,
  ReviewTargetType,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  AddClaimInputSchema,
  AddSourceInputSchema,
  BrandBriefSchema,
  CreateStoryInputSchema,
  CreateVariantInputSchema,
  ScoreBreakdownSchema,
  StoryStatusSchema,
  VariantStatusSchema,
  AngleStatusSchema,
  assertTransition,
  canTransitionAngle,
  canTransitionStory,
  canTransitionVariant,
  type BrandBrief,
  type ScoreBreakdown,
} from "./contracts";
import { calculateEditorialScore } from "./scoring";

type Tx = Prisma.TransactionClient;

async function nextRevisionVersion(tx: Tx, targetType: ReviewTargetType, targetId: string) {
  const latest = await tx.editorialRevision.aggregate({
    where: { targetType, targetId },
    _max: { version: true },
  });
  return (latest._max.version ?? 0) + 1;
}

async function recordRevision(tx: Tx, input: {
  targetType: ReviewTargetType;
  targetId: string;
  actorEmail: string;
  snapshot: Prisma.InputJsonValue;
  storyId?: string;
  variantId?: string;
}) {
  const version = await nextRevisionVersion(tx, input.targetType, input.targetId);
  await tx.editorialRevision.create({
    data: {
      targetType: input.targetType,
      targetId: input.targetId,
      version,
      actorEmail: input.actorEmail,
      snapshotJson: input.snapshot,
      storyId: input.storyId,
      variantId: input.variantId,
    },
  });
  return version;
}

async function recordDecision(tx: Tx, input: {
  targetType: ReviewTargetType;
  targetId: string;
  actorEmail: string;
  decision: ReviewDecisionKind;
  previousStatus?: string;
  newStatus: string;
  targetVersion: number;
  note?: string;
  variantId?: string;
}) {
  await tx.reviewDecision.create({ data: input });
}

function decisionForStatus(status: string): ReviewDecisionKind {
  if (status === "approved") return "approve";
  if (status === "rejected") return "reject";
  if (status === "needs_revision") return "request_changes";
  if (status === "published") return "publish";
  if (status === "fact_checked") return "verify";
  return "submit";
}

export async function createStory(raw: unknown) {
  const input = CreateStoryInputSchema.parse(raw);
  return prisma.$transaction(async (tx) => {
    const story = await tx.editorialStory.create({
      data: {
        title: input.title,
        summary: input.summary,
        slug: input.slug,
        tags: input.tags,
        eventDate: input.eventDate,
        createdByEmail: input.createdByEmail,
        discoverySource: input.discoverySource ?? "manual",
        discoveryMeta: input.discoveryMeta as Prisma.InputJsonValue | undefined,
        dedupeKey: input.dedupeKey,
        suggestedBrands: input.suggestedBrands,
      },
    });
    await recordRevision(tx, {
      targetType: "story",
      targetId: story.id,
      storyId: story.id,
      actorEmail: input.createdByEmail,
      snapshot: { status: story.status, title: story.title, summary: story.summary },
    });
    return { id: story.id };
  });
}

export async function addSource(raw: unknown, actorEmail: string) {
  const input = AddSourceInputSchema.parse(raw);
  return prisma.$transaction(async (tx) => {
    const source = await tx.editorialSource.create({ data: input });
    await recordRevision(tx, {
      targetType: "story",
      targetId: input.storyId,
      storyId: input.storyId,
      actorEmail,
      snapshot: { action: "source_added", sourceId: source.id, title: source.title },
    });
    return source;
  });
}

export async function addClaim(raw: unknown, actorEmail: string) {
  const input = AddClaimInputSchema.parse(raw);
  if (input.classification === "fact" && !input.sourceId) {
    throw new Error("Un claim factual debe crearse con al menos una fuente.");
  }
  return prisma.$transaction(async (tx) => {
    if (input.sourceId) {
      const source = await tx.editorialSource.findFirst({ where: { id: input.sourceId, storyId: input.storyId } });
      if (!source) throw new Error("La fuente no pertenece a esta historia.");
    }
    const claim = await tx.editorialClaim.create({
      data: {
        storyId: input.storyId,
        text: input.text,
        classification: input.classification,
        importance: input.importance,
        notes: input.notes,
        evidence: input.sourceId ? { create: { sourceId: input.sourceId, relation: input.relation, quote: input.quote } } : undefined,
      },
    });
    await recordRevision(tx, {
      targetType: "claim",
      targetId: claim.id,
      storyId: input.storyId,
      actorEmail,
      snapshot: { action: "claim_created", text: claim.text, classification: claim.classification },
    });
    return claim;
  });
}

export async function verifyClaim(input: { claimId: string; status: ClaimVerificationStatus; note?: string; actorEmail: string }) {
  return prisma.$transaction(async (tx) => {
    const claim = await tx.editorialClaim.findUnique({ where: { id: input.claimId }, include: { evidence: true } });
    if (!claim) throw new Error("Claim no encontrado.");
    if (input.status === "verified" && claim.classification === "fact") {
      if (!claim.evidence.some((item) => item.relation === "supports")) {
        throw new Error("Un claim factual necesita evidencia que lo respalde.");
      }
      if (claim.evidence.some((item) => item.relation === "contradicts") && (input.note?.trim().length ?? 0) < 10) {
        throw new Error("La evidencia contradictoria requiere una nota de resolución.");
      }
    }
    const version = await recordRevision(tx, {
      targetType: "claim",
      targetId: claim.id,
      storyId: claim.storyId,
      actorEmail: input.actorEmail,
      snapshot: { verification: input.status, note: input.note ?? null },
    });
    await tx.editorialClaim.update({ where: { id: claim.id }, data: { verification: input.status, notes: input.note ?? claim.notes } });
    await recordDecision(tx, {
      targetType: "claim", targetId: claim.id, actorEmail: input.actorEmail,
      decision: input.status === "verified" ? "verify" : input.status === "rejected" ? "reject" : "request_changes",
      previousStatus: claim.verification, newStatus: input.status, targetVersion: version, note: input.note,
    });
  });
}

export async function transitionStory(input: { id: string; to: unknown; actorEmail: string; note?: string }) {
  const to = StoryStatusSchema.parse(input.to);
  return prisma.$transaction(async (tx) => {
    const story = await tx.editorialStory.findUnique({ where: { id: input.id } });
    if (!story) throw new Error("Historia no encontrada.");
    assertTransition(canTransitionStory(story.status, to), story.status, to);
    const version = await recordRevision(tx, { targetType: "story", targetId: story.id, storyId: story.id, actorEmail: input.actorEmail, snapshot: { status: to, note: input.note ?? null } });
    await tx.editorialStory.update({ where: { id: story.id }, data: { status: to as EditorialStoryStatus, updatedByEmail: input.actorEmail } });
    await recordDecision(tx, { targetType: "story", targetId: story.id, actorEmail: input.actorEmail, decision: decisionForStatus(to), previousStatus: story.status, newStatus: to, targetVersion: version, note: input.note });
  });
}

export async function scoreStory(input: { id: string; breakdown: ScoreBreakdown; actorEmail: string; overrideScore?: number; overrideReason?: string }) {
  const breakdown = ScoreBreakdownSchema.parse(input.breakdown);
  const calculated = calculateEditorialScore(breakdown);
  const hasOverride = input.overrideScore !== undefined;
  if (hasOverride && (!Number.isInteger(input.overrideScore) || input.overrideScore! < 0 || input.overrideScore! > 100 || (input.overrideReason?.trim().length ?? 0) < 5)) {
    throw new Error("El override requiere un valor de 0 a 100 y un motivo.");
  }
  await prisma.editorialStory.update({
    where: { id: input.id },
    data: { score: hasOverride ? input.overrideScore : calculated, scoreBreakdown: breakdown, scoreOverride: hasOverride ? input.overrideScore : null, scoreOverrideReason: hasOverride ? input.overrideReason : null, updatedByEmail: input.actorEmail },
  });
}

export async function createAngle(input: { storyId: string; brief: BrandBrief; actorEmail: string }) {
  const brief = BrandBriefSchema.parse(input.brief);
  return prisma.$transaction(async (tx) => {
    const story = await tx.editorialStory.findUnique({ where: { id: input.storyId } });
    if (!story) throw new Error("Historia no encontrada.");
    if (story.status !== "researching" && story.status !== "angle_proposed") throw new Error("La historia debe estar en investigación antes de proponer ángulos.");
    const angle = await tx.brandAngle.upsert({
      where: { storyId_brand: { storyId: story.id, brand: brief.brand } },
      create: { storyId: story.id, brand: brief.brand, thesis: brief.thesis, audience: brief.audience, tone: brief.tone, exclusions: brief.exclusions, briefJson: brief as Prisma.InputJsonValue },
      update: { status: "proposed", thesis: brief.thesis, audience: brief.audience, tone: brief.tone, exclusions: brief.exclusions, briefJson: brief as Prisma.InputJsonValue, decisionReason: null, version: { increment: 1 } },
    });
    if (story.status === "researching") await tx.editorialStory.update({ where: { id: story.id }, data: { status: "angle_proposed", updatedByEmail: input.actorEmail } });
    await recordRevision(tx, { targetType: "angle", targetId: angle.id, storyId: story.id, actorEmail: input.actorEmail, snapshot: { status: angle.status, brand: angle.brand, brief } as Prisma.InputJsonValue });
    return angle;
  });
}

export async function rejectHistoricalConnection(input: { storyId: string; reason: string; actorEmail: string }) {
  if (input.reason.trim().length < 10) throw new Error("Explicá por qué el paralelismo histórico sería débil o forzado.");
  return prisma.$transaction(async (tx) => {
    const story = await tx.editorialStory.findUnique({ where: { id: input.storyId } });
    if (!story) throw new Error("Historia no encontrada.");
    const angle = await tx.brandAngle.upsert({
      where: { storyId_brand: { storyId: story.id, brand: "museoargent" } },
      create: { storyId: story.id, brand: "museoargent", status: "rejected", thesis: "Sin conexión histórica sólida", audience: "MuseoArgent", tone: "riguroso", briefJson: { brand: "museoargent", rejectedWithoutDraft: true }, decisionReason: input.reason },
      update: { status: "rejected", decisionReason: input.reason, version: { increment: 1 } },
    });
    const version = await recordRevision(tx, { targetType: "angle", targetId: angle.id, storyId: story.id, actorEmail: input.actorEmail, snapshot: { status: "rejected", reason: input.reason } });
    await recordDecision(tx, { targetType: "angle", targetId: angle.id, actorEmail: input.actorEmail, decision: "reject", previousStatus: angle.status, newStatus: "rejected", targetVersion: version, note: input.reason });
    return angle;
  });
}

export async function transitionAngle(input: { id: string; to: unknown; actorEmail: string; note?: string }) {
  const to = AngleStatusSchema.parse(input.to);
  return prisma.$transaction(async (tx) => {
    const angle = await tx.brandAngle.findUnique({ where: { id: input.id } });
    if (!angle) throw new Error("Ángulo no encontrado.");
    assertTransition(canTransitionAngle(angle.status, to), angle.status, to);
    if ((to === "needs_revision" || to === "rejected") && (input.note?.trim().length ?? 0) < 5) throw new Error("La decisión requiere un comentario.");
    const nextVersion = to === "proposed" ? angle.version + 1 : angle.version;
    const version = await recordRevision(tx, { targetType: "angle", targetId: angle.id, storyId: angle.storyId, actorEmail: input.actorEmail, snapshot: { status: to, note: input.note ?? null, angleVersion: nextVersion } });
    await tx.brandAngle.update({ where: { id: angle.id }, data: { status: to as BrandAngleStatus, decisionReason: input.note, version: nextVersion } });
    await recordDecision(tx, { targetType: "angle", targetId: angle.id, actorEmail: input.actorEmail, decision: decisionForStatus(to), previousStatus: angle.status, newStatus: to, targetVersion: version, note: input.note });
  });
}

export async function createVariant(raw: unknown) {
  const input = CreateVariantInputSchema.parse(raw);
  return prisma.$transaction(async (tx) => {
    const angle = await tx.brandAngle.findUnique({ where: { id: input.angleId } });
    if (!angle || angle.status !== "approved") throw new Error("El ángulo debe estar aprobado antes de crear variantes.");
    const claimCount = await tx.editorialClaim.count({ where: { id: { in: input.claimIds }, storyId: angle.storyId } });
    if (claimCount !== new Set(input.claimIds).size) throw new Error("Todos los claims deben pertenecer a la historia del ángulo.");
    const latest = await tx.contentVariant.aggregate({ where: { angleId: angle.id, format: input.format }, _max: { version: true } });
    const variant = await tx.contentVariant.create({
      data: { angleId: angle.id, format: input.format, version: (latest._max.version ?? 0) + 1, title: input.title, body: input.body, cta: input.cta, createdByEmail: input.createdByEmail, claims: { create: [...new Set(input.claimIds)].map((claimId) => ({ claimId })) } },
    });
    await recordRevision(tx, { targetType: "variant", targetId: variant.id, variantId: variant.id, actorEmail: input.createdByEmail, snapshot: { status: variant.status, version: variant.version, title: variant.title, body: variant.body, cta: variant.cta } });
    return variant;
  });
}

export async function transitionVariant(input: { id: string; to: unknown; actorEmail: string; note?: string }) {
  const to = VariantStatusSchema.parse(input.to);
  return prisma.$transaction(async (tx) => {
    const variant = await tx.contentVariant.findUnique({ where: { id: input.id }, include: { angle: true, claims: { include: { claim: { include: { evidence: true } } } }, mediaOutputs: true, publications: true } });
    if (!variant) throw new Error("Variante no encontrada.");
    assertTransition(canTransitionVariant(variant.status, to), variant.status, to);
    if ((to === "needs_revision" || to === "rejected") && (input.note?.trim().length ?? 0) < 5) throw new Error("La decisión requiere un comentario.");
    if (to === "fact_checked") {
      if (variant.claims.length === 0) throw new Error("La variante necesita claims vinculados.");
      const invalid = variant.claims.find(({ claim }) => claim.classification === "fact" && (claim.verification !== "verified" || !claim.evidence.some((item) => item.relation === "supports")));
      if (invalid) throw new Error("Todos los claims factuales deben estar verificados con evidencia que los respalde.");
    }
    if (to === "production_ready" && variant.angle.status !== "approved") throw new Error("El ángulo dejó de estar aprobado.");
    if (to === "rendered" && !variant.mediaOutputs.some((output) => output.status === "succeeded")) throw new Error("No se puede marcar rendered sin un output exitoso.");
    if (to === "published" && variant.publications.length === 0) throw new Error("Publicar requiere una publicación manual registrada.");
    const nextContentVersion = to === "drafted" && variant.status === "needs_revision" ? variant.version + 1 : variant.version;
    const revision = await recordRevision(tx, { targetType: "variant", targetId: variant.id, variantId: variant.id, actorEmail: input.actorEmail, snapshot: { status: to, note: input.note ?? null, contentVersion: nextContentVersion } });
    await tx.contentVariant.update({ where: { id: variant.id }, data: { status: to as ContentVariantStatus, version: nextContentVersion, updatedByEmail: input.actorEmail } });
    await recordDecision(tx, { targetType: "variant", targetId: variant.id, variantId: variant.id, actorEmail: input.actorEmail, decision: decisionForStatus(to), previousStatus: variant.status, newStatus: to, targetVersion: revision, note: input.note });
  });
}

export async function markPublication(input: { variantId: string; channel: string; url: string; publishedAt: Date; actorEmail: string }) {
  if (!URL.canParse(input.url)) throw new Error("La publicación requiere una URL válida.");
  return prisma.$transaction(async (tx) => {
    const variant = await tx.contentVariant.findUnique({ where: { id: input.variantId } });
    if (!variant || variant.status !== "approved") throw new Error("Sólo una variante aprobada puede marcarse como publicada.");
    const publication = await tx.publication.create({ data: { variantId: variant.id, channel: input.channel.trim(), url: input.url, publishedAt: input.publishedAt, status: "published" } });
    const revision = await recordRevision(tx, { targetType: "variant", targetId: variant.id, variantId: variant.id, actorEmail: input.actorEmail, snapshot: { status: "published", publicationId: publication.id, url: publication.url } });
    await tx.contentVariant.update({ where: { id: variant.id }, data: { status: "published", updatedByEmail: input.actorEmail } });
    await recordDecision(tx, { targetType: "variant", targetId: variant.id, variantId: variant.id, actorEmail: input.actorEmail, decision: "publish", previousStatus: variant.status, newStatus: "published", targetVersion: revision, note: `${publication.channel}: ${publication.url}` });
    return publication;
  });
}
