"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSesion } from "@/lib/admin-auth";
import {
  addClaim, addSource, createAngle, createStory, createVariant, markPublication,
  rejectHistoricalConnection, scoreStory, transitionAngle, transitionStory,
  transitionVariant, verifyClaim,
} from "@/lib/editorial/service";
import { requestEditorialMedia, syncEditorialMedia } from "@/lib/editorial/media-service";
import { runDiscovery } from "@/lib/editorial/discovery/orchestrator";
import { approveEditorialPackage, queueAutopilot, runAutopilot, updateVariantContent } from "@/lib/editorial/autopilot/pipeline";
import type { EditorialActionState } from "./form-state";

const text = (data: FormData, key: string) => String(data.get(key) ?? "").trim();
const optional = (data: FormData, key: string) => text(data, key) || undefined;
const lines = (value: string) => value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
const date = (value: string) => value ? new Date(`${value}T12:00:00`) : undefined;

async function run(message: string, storyId: string | undefined, operation: (email: string) => Promise<unknown>): Promise<EditorialActionState> {
  try {
    const session = await requireAdminSesion();
    await operation(session.email);
    revalidatePath("/admin/editorial");
    if (storyId) revalidatePath(`/admin/editorial/${storyId}`);
    return { ok: true, message };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function createEditorialStoryAction(_: EditorialActionState, formData: FormData) {
  return run("Historia creada.", undefined, async (email) => {
    await createStory({ title: text(formData, "title"), summary: text(formData, "summary"), slug: text(formData, "slug"), tags: lines(text(formData, "tags")), eventDate: date(text(formData, "eventDate")), createdByEmail: email });
  });
}

export async function transitionStoryAction(_: EditorialActionState, formData: FormData) {
  const storyId = text(formData, "storyId");
  return run("Estado de la historia actualizado.", storyId, (email) => transitionStory({ id: storyId, to: text(formData, "to"), actorEmail: email, note: optional(formData, "note") }));
}

export async function addSourceAction(_: EditorialActionState, formData: FormData) {
  const storyId = text(formData, "storyId");
  return run("Fuente incorporada.", storyId, (email) => addSource({ storyId, type: text(formData, "type"), title: text(formData, "title"), url: optional(formData, "url"), publisher: optional(formData, "publisher"), publishedAt: date(text(formData, "publishedAt")), accessedAt: date(text(formData, "accessedAt")) ?? new Date(), isPrimary: formData.get("isPrimary") === "on", notes: optional(formData, "notes") }, email));
}

export async function addClaimAction(_: EditorialActionState, formData: FormData) {
  const storyId = text(formData, "storyId");
  return run("Claim incorporado.", storyId, (email) => addClaim({ storyId, text: text(formData, "text"), classification: text(formData, "classification"), importance: Number(text(formData, "importance") || 3), notes: optional(formData, "notes"), sourceId: optional(formData, "sourceId"), relation: text(formData, "relation") || "supports", quote: optional(formData, "quote") }, email));
}

export async function verifyClaimAction(_: EditorialActionState, formData: FormData) {
  const storyId = text(formData, "storyId");
  return run("Verificación registrada.", storyId, (email) => verifyClaim({ claimId: text(formData, "claimId"), status: text(formData, "status") as "verified" | "disputed" | "rejected", note: optional(formData, "note"), actorEmail: email }));
}

export async function scoreStoryAction(_: EditorialActionState, formData: FormData) {
  const storyId = text(formData, "storyId");
  const n = (key: string) => Number(text(formData, key));
  const overrideRaw = optional(formData, "overrideScore");
  return run("Score actualizado.", storyId, (email) => scoreStory({ id: storyId, breakdown: { freshness: n("freshness"), relevance: n("relevance"), dailyImpact: n("dailyImpact"), sourceQuality: n("sourceQuality"), visualPotential: n("visualPotential"), ownAngle: n("ownAngle"), historicalDepth: n("historicalDepth"), saturation: n("saturation") }, actorEmail: email, overrideScore: overrideRaw ? Number(overrideRaw) : undefined, overrideReason: optional(formData, "overrideReason") }));
}

export async function createAngleAction(_: EditorialActionState, formData: FormData) {
  const storyId = text(formData, "storyId");
  const brand = text(formData, "brand");
  return run("Ángulo propuesto.", storyId, (email) => createAngle({ storyId, actorEmail: email, brief: brand === "labrechahoy" ? {
    brand, audience: text(formData, "audience"), thesis: text(formData, "thesis"), tone: text(formData, "tone"), exclusions: lines(text(formData, "exclusions")), whatHappened: text(formData, "whatHappened"), whatChanged: text(formData, "whatChanged"), affectedGroups: lines(text(formData, "affectedGroups")), consequences: lines(text(formData, "consequences")), openQuestions: lines(text(formData, "openQuestions")), analysisBoundary: text(formData, "analysisBoundary"),
  } : {
    brand: "museoargent", audience: text(formData, "audience"), thesis: text(formData, "thesis"), tone: text(formData, "tone"), exclusions: lines(text(formData, "exclusions")), historicalAntecedent: text(formData, "historicalAntecedent"), periodContext: text(formData, "periodContext"), similarities: lines(text(formData, "similarities")), differences: lines(text(formData, "differences")), comparisonLimits: lines(text(formData, "comparisonLimits")), historicalSourceIds: formData.getAll("historicalSourceIds").map(String), editorialReason: text(formData, "editorialReason"),
  } }));
}

export async function rejectHistoricalConnectionAction(_: EditorialActionState, formData: FormData) {
  const storyId = text(formData, "storyId");
  return run("Conexión histórica descartada sin bloquear LaBrechaHoy.", storyId, (email) => rejectHistoricalConnection({ storyId, reason: text(formData, "reason"), actorEmail: email }));
}

export async function angleDecisionAction(_: EditorialActionState, formData: FormData) {
  const storyId = text(formData, "storyId");
  return run("Decisión sobre el ángulo registrada.", storyId, (email) => transitionAngle({ id: text(formData, "angleId"), to: text(formData, "to"), actorEmail: email, note: optional(formData, "note") }));
}

export async function createVariantAction(_: EditorialActionState, formData: FormData) {
  const storyId = text(formData, "storyId");
  return run("Variante creada.", storyId, (email) => createVariant({ angleId: text(formData, "angleId"), format: text(formData, "format"), title: text(formData, "title"), body: text(formData, "body"), cta: optional(formData, "cta"), claimIds: formData.getAll("claimIds").map(String), createdByEmail: email }));
}

export async function variantDecisionAction(_: EditorialActionState, formData: FormData) {
  const storyId = text(formData, "storyId");
  return run("Estado de la variante actualizado.", storyId, (email) => transitionVariant({ id: text(formData, "variantId"), to: text(formData, "to"), actorEmail: email, note: optional(formData, "note") }));
}

export async function requestMediaAction(_: EditorialActionState, formData: FormData) {
  const storyId = text(formData, "storyId");
  return run("Render solicitado al Media Engine.", storyId, (email) => requestEditorialMedia({ variantId: text(formData, "variantId"), actorEmail: email }));
}

export async function syncMediaAction(_: EditorialActionState, formData: FormData) {
  const storyId = text(formData, "storyId");
  return run("Estado del render sincronizado.", storyId, (email) => syncEditorialMedia({ outputId: text(formData, "outputId"), actorEmail: email }));
}

export async function markPublicationAction(_: EditorialActionState, formData: FormData) {
  const storyId = text(formData, "storyId");
  return run("Publicación manual registrada.", storyId, (email) => markPublication({ variantId: text(formData, "variantId"), channel: text(formData, "channel"), url: text(formData, "url"), publishedAt: date(text(formData, "publishedAt")) ?? new Date(), actorEmail: email }));
}

export async function discoverTopicsAction(_: EditorialActionState) {
  return run("Sugerencias actualizadas.", undefined, async (email) => {
    await runDiscovery({ actorEmail: email });
  });
}

export async function triageSuggestionAction(_: EditorialActionState, formData: FormData) {
  const storyId = text(formData, "storyId");
  return run("Tema enviado a triage.", storyId, (email) => transitionStory({ id: storyId, to: "triaged", actorEmail: email, note: "Aceptado desde sugerencias." }));
}

export async function discardSuggestionAction(_: EditorialActionState, formData: FormData) {
  const storyId = text(formData, "storyId");
  return run("Sugerencia descartada.", storyId, (email) => transitionStory({ id: storyId, to: "rejected", actorEmail: email, note: optional(formData, "note") ?? "Descartado desde sugerencias." }));
}

export async function generatePackageAction(_: EditorialActionState, formData: FormData) {
  const storyId = text(formData, "storyId");
  return run("Paquete editorial generado.", storyId, async (email) => {
    await queueAutopilot(storyId);
    await runAutopilot(storyId, email);
  });
}

export async function approvePackageAction(_: EditorialActionState, formData: FormData) {
  const storyId = text(formData, "storyId");
  return run("Paquete aprobado.", storyId, (email) => approveEditorialPackage(storyId, email));
}

export async function updateVariantContentAction(_: EditorialActionState, formData: FormData) {
  const storyId = text(formData, "storyId");
  return run("Variante actualizada.", storyId, (email) => updateVariantContent({
    variantId: text(formData, "variantId"),
    title: text(formData, "title"),
    body: text(formData, "body"),
    cta: optional(formData, "cta"),
    actorEmail: email,
  }));
}

export async function rerunAutopilotAction(_: EditorialActionState, formData: FormData) {
  const storyId = text(formData, "storyId");
  return run("Autopilot re-ejecutado.", storyId, async (email) => {
    await queueAutopilot(storyId);
    await runAutopilot(storyId, email);
  });
}
