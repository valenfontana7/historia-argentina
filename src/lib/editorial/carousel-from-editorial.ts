import { CarouselSchema, type Carousel, type Slide } from "@museoargent/carousel-contracts";
import type { EditorialBrand } from "./contracts";

type EditorialCarouselInput = {
  id: string;
  brand: EditorialBrand;
  title: string;
  body: string;
  cta?: string | null;
  claims: Array<{ text: string; sourceTitles: string[] }>;
};

function truncate(text: string, max: number) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`;
}

export function carouselFromEditorial(input: EditorialCarouselInput): Carousel {
  const isBrecha = input.brand === "labrechahoy";
  const slides: Slide[] = [
    { id: "cover", type: "cover", kicker: isBrecha ? "QUÉ CAMBIÓ" : "PRESENTE E HISTORIA", title: truncate(input.title, 56), subtitle: isBrecha ? "Datos, impacto y lo que conviene observar" : "Antecedentes, similitudes y límites de la comparación" },
  ];

  for (const [index, claim] of input.claims.slice(0, 4).entries()) {
    slides.push({
      id: `claim-${index + 1}`,
      type: index === 0 && /\d/.test(claim.text) ? "statistic" : "content",
      ...(index === 0 && /\d/.test(claim.text)
        ? { value: claim.text.match(/[\d.,%]+/)?.[0] ?? "Dato", label: truncate(claim.text, 48), context: claim.sourceTitles.length ? `Fuente: ${claim.sourceTitles.join(", ")}` : undefined }
        : { title: isBrecha ? (index === 0 ? "El dato central" : "Qué implica") : (index === 0 ? "El antecedente" : "La comparación"), body: truncate(claim.text, 280), caption: claim.sourceTitles.length ? `Fuente: ${claim.sourceTitles.join(", ")}` : undefined }),
    } as Slide);
  }

  if (slides.length < 4) {
    slides.push({ id: "context", type: "content", title: isBrecha ? "El contexto" : "Los límites", body: truncate(input.body, 280) });
  }

  const sources = [...new Set(input.claims.flatMap((claim) => claim.sourceTitles))];
  slides.push({
    id: "sources",
    type: "content",
    title: "Fuentes",
    body: sources.length ? truncate(sources.map((source, index) => `${index + 1}. ${source}`).join(" · "), 280) : "La pieza no puede aprobarse hasta que sus fuentes estén asociadas.",
    caption: "Archivo real, ilustración y material generado deben identificarse en cada asset.",
  });
  slides.push({
    id: "ending",
    type: "ending_cta",
    title: isBrecha ? "Entender qué pasa" : "Entender de dónde viene",
    body: truncate(input.body, 140),
    cta: input.cta?.trim() || (isBrecha ? "@labrechahoy" : "@museoargent"),
  });

  return CarouselSchema.parse({ id: `editorial:${input.id}`, title: input.title, locale: "es-AR", slides });
}

export function editorialCarouselPresentation(brand: EditorialBrand) {
  return brand === "labrechahoy"
    ? { templateId: "labrecha_data" as const, templateVersion: 1, themeId: "labrechahoy_editorial" as const, profileId: "instagram_feed" as const, exportFormat: "png" as const }
    : { templateId: "museum_classic" as const, templateVersion: 1, themeId: "museoargent_classic" as const, profileId: "instagram_feed" as const, exportFormat: "png" as const };
}
