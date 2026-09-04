import { prisma } from "@/lib/db";
import {
  addClaim,
  addSource,
  createAngle,
  createVariant,
  scoreStory,
  transitionAngle,
  transitionStory,
  transitionVariant,
} from "../service";
import { completeStructuredJson } from "./llm-client";
import { buildAutopilotPrompt } from "./prompt";
import { normalizeAutopilotPackage } from "./normalize";
import { AutopilotPackageSchema } from "./schemas";
import type { EditorialBrand } from "../contracts";

const SYSTEM_EMAIL = "editorial-autopilot@museoargent.local";

function autopilotMaxPerDay(): number {
  const raw = Number(process.env.EDITORIAL_AUTOPILOT_MAX_STORIES_PER_DAY ?? 10);
  return Number.isFinite(raw) && raw > 0 ? Math.min(raw, 50) : 10;
}

async function countAutopilotRunsToday(): Promise<number> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return prisma.editorialStory.count({
    where: {
      autopilotStatus: { in: ["generating", "ready", "failed"] },
      updatedAt: { gte: start },
    },
  });
}

function buildPrompt(story: {
  title: string;
  summary: string;
  tags: string[];
  suggestedBrands: EditorialBrand[];
  discoverySource: string;
  discoveryMeta: unknown;
}) {
  return buildAutopilotPrompt(story);
}

export async function runAutopilot(storyId: string, actorEmail = SYSTEM_EMAIL) {
  if (process.env.EDITORIAL_AUTOPILOT_ENABLED === "false") {
    throw new Error("El autopilot editorial está deshabilitado.");
  }

  const runsToday = await countAutopilotRunsToday();
  if (runsToday >= autopilotMaxPerDay()) {
    throw new Error("Se alcanzó el límite diario de ejecuciones del autopilot.");
  }

  const story = await prisma.editorialStory.findUnique({ where: { id: storyId } });
  if (!story) throw new Error("Historia no encontrada.");
  if (story.autopilotStatus === "generating") {
    throw new Error("El autopilot ya está en ejecución para esta historia.");
  }

  await prisma.editorialStory.update({
    where: { id: storyId },
    data: { autopilotStatus: "generating", autopilotError: null },
  });

  try {
    const pkg = await completeStructuredJson({
      system: "Sos un editor de investigación para MuseoArgent y LaBrechaHoy. Sé riguroso, no inventes datos y separá hechos de interpretación. Devolvé JSON con la estructura exacta pedida.",
      user: buildPrompt(story),
      schema: AutopilotPackageSchema,
      schemaName: "AutopilotPackage",
      normalize: (raw) => normalizeAutopilotPackage(raw, {
        title: story.title,
        summary: story.summary,
        suggestedBrands: story.suggestedBrands,
      }),
    });

    if (story.status === "discovered") {
      await transitionStory({ id: storyId, to: "triaged", actorEmail, note: "Autopilot: triage automático." });
    }
    const refreshed = await prisma.editorialStory.findUnique({ where: { id: storyId } });
    if (refreshed?.status === "discovered" || refreshed?.status === "triaged") {
      await transitionStory({ id: storyId, to: "researching", actorEmail, note: "Autopilot: investigación generada." });
    }

    const sourceIds: string[] = [];
    for (const source of pkg.research.sources) {
      const created = await addSource(
        {
          storyId,
          type: source.type,
          title: source.title,
          url: source.url,
          publisher: source.publisher,
          accessedAt: new Date(),
          isPrimary: source.isPrimary,
          notes: source.notes,
        },
        actorEmail,
      );
      sourceIds.push(created.id);
    }

    const claimIds: string[] = [];
    for (const claim of pkg.research.claims) {
      const sourceId = claim.sourceIndex !== undefined ? sourceIds[claim.sourceIndex] : undefined;
      const classification = claim.classification === "fact" && !sourceId ? "interpretation" : claim.classification;
      const created = await addClaim(
        {
          storyId,
          text: claim.text,
          classification,
          importance: claim.importance,
          sourceId,
          relation: claim.relation,
          quote: claim.quote,
        },
        actorEmail,
      );
      claimIds.push(created.id);
    }

    await scoreStory({
      id: storyId,
      breakdown: pkg.research.scoreBreakdown,
      actorEmail,
    });

    await prisma.editorialStory.update({
      where: { id: storyId },
      data: {
        discoveryMeta: {
          ...(typeof story.discoveryMeta === "object" && story.discoveryMeta ? story.discoveryMeta : {}),
          autopilot: {
            scoreRationale: pkg.research.scoreRationale,
            generatedAt: new Date().toISOString(),
            model: process.env.EDITORIAL_LLM_MODEL ?? process.env.OPENAI_LLM_MODEL ?? "gpt-4o-mini",
          },
        },
      },
    });

    const angleIds = new Map<EditorialBrand, string>();
    for (const angle of pkg.angles) {
      const brief = angle.brand === "labrechahoy"
        ? { ...angle, exclusions: angle.exclusions ?? [], openQuestions: angle.openQuestions ?? [] }
        : { ...angle, exclusions: angle.exclusions ?? [], historicalSourceIds: angle.historicalSourceIds ?? [] };
      const created = await createAngle({ storyId, brief, actorEmail });
      await transitionAngle({
        id: created.id,
        to: "approved",
        actorEmail,
        note: "Autopilot: ángulo pre-aprobado para revisión humana.",
      });
      angleIds.set(angle.brand, created.id);
    }

    for (const variant of pkg.variants) {
      const angleId = angleIds.get(variant.brand);
      if (!angleId) continue;
      const selectedClaimIds = variant.claimIndexes
        .map((index) => claimIds[index])
        .filter((id): id is string => Boolean(id));
      if (selectedClaimIds.length === 0) continue;

      const created = await createVariant({
        angleId,
        format: variant.format,
        title: variant.title,
        body: variant.body,
        cta: variant.cta,
        claimIds: selectedClaimIds,
        createdByEmail: actorEmail,
      });

      await transitionVariant({
        id: created.id,
        to: "fact_check_pending",
        actorEmail,
        note: "Autopilot: borrador listo para verificación humana de claims.",
      });
    }

    await prisma.editorialStory.update({
      where: { id: storyId },
      data: { autopilotStatus: "ready", autopilotError: null, updatedByEmail: actorEmail },
    });

    return { storyId, status: "ready" as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await prisma.editorialStory.update({
      where: { id: storyId },
      data: { autopilotStatus: "failed", autopilotError: message },
    });
    throw error;
  }
}

export async function queueAutopilot(storyId: string) {
  await prisma.editorialStory.update({
    where: { id: storyId },
    data: { autopilotStatus: "queued", autopilotError: null },
  });
}

export async function approveEditorialPackage(storyId: string, actorEmail: string) {
  const story = await prisma.editorialStory.findUnique({
    where: { id: storyId },
    include: {
      claims: true,
      angles: { include: { variants: true } },
    },
  });
  if (!story) throw new Error("Historia no encontrada.");

  const pendingFacts = story.claims.filter((claim) => claim.classification === "fact" && claim.verification !== "verified");
  if (pendingFacts.length > 0) {
    throw new Error("Verificá todos los claims factuales antes de aprobar el paquete.");
  }

  for (const angle of story.angles) {
    if (angle.status === "proposed" || angle.status === "needs_revision") {
      await transitionAngle({ id: angle.id, to: "approved", actorEmail, note: "Paquete aprobado en revisión." });
    }
  }

  const variantIds = story.angles.flatMap((angle) => angle.variants.map((variant) => variant.id));
  for (const variantId of variantIds) {
    const variant = await prisma.contentVariant.findUnique({ where: { id: variantId } });
    if (!variant) continue;
    if (variant.status === "fact_check_pending") {
      await transitionVariant({ id: variant.id, to: "fact_checked", actorEmail, note: "Claims verificados: fact-check en aprobación de paquete." });
      await transitionVariant({ id: variant.id, to: "production_ready", actorEmail, note: "Lista para producción." });
      await transitionVariant({ id: variant.id, to: "final_review", actorEmail, note: "Enviada a revisión final." });
      await transitionVariant({ id: variant.id, to: "approved", actorEmail, note: "Paquete aprobado en revisión." });
      continue;
    }
    if (variant.status === "final_review") {
      await transitionVariant({ id: variant.id, to: "approved", actorEmail, note: "Paquete aprobado en revisión." });
    }
  }

  await prisma.editorialStory.update({
    where: { id: storyId },
    data: { autopilotStatus: "ready", updatedByEmail: actorEmail },
  });
}

export async function updateVariantContent(input: {
  variantId: string;
  title: string;
  body: string;
  cta?: string;
  actorEmail: string;
}) {
  await prisma.contentVariant.update({
    where: { id: input.variantId },
    data: {
      title: input.title,
      body: input.body,
      cta: input.cta,
      updatedByEmail: input.actorEmail,
    },
  });
}
