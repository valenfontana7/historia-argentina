import { MediaOutputStatus } from "@prisma/client";
import { JobViewSchema } from "@museoargent/video-contracts";
import { CarouselJobSchema } from "@museoargent/carousel-contracts";
import { prisma } from "@/lib/db";
import { engineFetch } from "@/lib/video/engine-client";
import { carouselEngineFetch } from "@/lib/carousel/engine-client";
import { carouselFromEditorial, editorialCarouselPresentation } from "./carousel-from-editorial";
import { editorialVariantToExhibition } from "./media";
import { transitionVariant } from "./service";

function outputStatus(status: string): MediaOutputStatus {
  if (status === "succeeded") return "succeeded";
  if (status === "failed" || status === "cancelled") return "failed";
  if (status === "queued" || status === "draft" || status.startsWith("awaiting_")) return "queued";
  return "rendering";
}

async function loadProductionVariant(variantId: string) {
  const variant = await prisma.contentVariant.findUnique({
    where: { id: variantId },
    include: {
      angle: { include: { story: true } },
      claims: { include: { claim: { include: { evidence: { include: { source: true } } } } } },
    },
  });
  if (!variant) throw new Error("Variante no encontrada.");
  if (variant.status !== "production_ready") throw new Error("La variante debe estar production_ready antes de generar media.");
  if (variant.format !== "reel" && variant.format !== "carousel") throw new Error("Este formato textual no requiere render del Media Engine.");
  return variant;
}

export async function requestEditorialMedia(input: { variantId: string; actorEmail: string }) {
  const variant = await loadProductionVariant(input.variantId);
  const engine = variant.format === "carousel" ? "carousel" : "video";
  const output = await prisma.mediaOutput.create({ data: { variantId: variant.id, engine, status: "requested" } });
  const claimRows = variant.claims.map(({ claim }) => ({ text: claim.text, sourceTitles: [...new Set(claim.evidence.map((item) => item.source.title))] }));
  try {
    if (engine === "video") {
      const exhibition = editorialVariantToExhibition({ storyId: variant.angle.story.id, variantId: variant.id, brand: variant.angle.brand, title: variant.title, body: variant.body, claims: claimRows.map((claim) => claim.text), sourceNotes: claimRows.flatMap((claim) => claim.sourceTitles) });
      const useFakeProviders = process.env.EDITORIAL_MEDIA_USE_FAKE_PROVIDERS === "true" && variant.angle.story.slug.startsWith("fixture-");
      const brandCta = variant.angle.brand === "labrechahoy" ? "Seguí el dato · @labrechahoy" : "Seguí explorando · @museoargent";
      const response = await engineFetch("/jobs", { method: "POST", body: JSON.stringify({ exhibition, formatId: "reel", interactive: true, useFakeProviders, profileOverrides: { tone: variant.angle.tone, cta: variant.cta || brandCta } }) });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(`Video engine ${response.status}: ${JSON.stringify(body)}`);
      const job = JobViewSchema.parse(body);
      await prisma.mediaOutput.update({ where: { id: output.id }, data: { jobId: job.id, status: outputStatus(job.status) } });
      return { outputId: output.id, jobId: job.id, status: job.status };
    }

    const carousel = carouselFromEditorial({ id: variant.id, brand: variant.angle.brand, title: variant.title, body: variant.body, cta: variant.cta, claims: claimRows });
    const response = await carouselEngineFetch("/jobs", { method: "POST", body: JSON.stringify({ carousel, ...editorialCarouselPresentation(variant.angle.brand) }) });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(`Carousel engine ${response.status}: ${JSON.stringify(body)}`);
    const created = CarouselJobSchema.parse(body);
    const renderResponse = await carouselEngineFetch(`/jobs/${created.id}/render`, { method: "POST", body: JSON.stringify({}) });
    const renderBody = await renderResponse.json().catch(() => ({}));
    if (!renderResponse.ok) throw new Error(`Carousel render ${renderResponse.status}: ${JSON.stringify(renderBody)}`);
    const job = CarouselJobSchema.parse(renderBody);
    await prisma.mediaOutput.update({ where: { id: output.id }, data: { jobId: job.id, status: outputStatus(job.status), uri: job.status === "succeeded" ? `carousel://jobs/${job.id}/export-zip` : undefined } });
    if (job.status === "succeeded") await transitionVariant({ id: variant.id, to: "rendered", actorEmail: input.actorEmail, note: `Carousel job ${job.id} completado.` });
    return { outputId: output.id, jobId: job.id, status: job.status };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await prisma.mediaOutput.update({ where: { id: output.id }, data: { status: "failed", error: message } });
    throw new Error(`No se pudo iniciar el render: ${message}`);
  }
}

export async function syncEditorialMedia(input: { outputId: string; actorEmail: string }) {
  const output = await prisma.mediaOutput.findUnique({ where: { id: input.outputId }, include: { variant: true } });
  if (!output?.jobId) throw new Error("El output no tiene job asociado.");
  try {
    if (output.engine === "video") {
      const response = await engineFetch(`/jobs/${output.jobId}`);
      const job = JobViewSchema.parse(await response.json());
      const status = outputStatus(job.status);
      await prisma.mediaOutput.update({ where: { id: output.id }, data: { status, uri: job.outputMp4Uri, manifestUri: job.manifestUri, error: job.error } });
      if (status === "succeeded" && output.variant.status === "production_ready") await transitionVariant({ id: output.variantId, to: "rendered", actorEmail: input.actorEmail, note: `Video job ${job.id} completado.` });
      return { status, engineStatus: job.status };
    }
    const response = await carouselEngineFetch(`/jobs/${output.jobId}`);
    const job = CarouselJobSchema.parse(await response.json());
    const status = outputStatus(job.status);
    await prisma.mediaOutput.update({ where: { id: output.id }, data: { status, uri: status === "succeeded" ? `carousel://jobs/${job.id}/export-zip` : undefined, error: job.error } });
    if (status === "succeeded" && output.variant.status === "production_ready") await transitionVariant({ id: output.variantId, to: "rendered", actorEmail: input.actorEmail, note: `Carousel job ${job.id} completado.` });
    return { status, engineStatus: job.status };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await prisma.mediaOutput.update({ where: { id: output.id }, data: { status: "failed", error: message } });
    throw new Error(`No se pudo sincronizar el render: ${message}`);
  }
}
