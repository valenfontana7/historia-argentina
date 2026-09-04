import type { Exhibition } from "@museoargent/video-contracts";
import type { EditorialBrand } from "./contracts";

export function editorialVariantToExhibition(input: {
  storyId: string;
  variantId: string;
  brand: EditorialBrand;
  title: string;
  body: string;
  claims: string[];
  sourceNotes: string[];
}): Exhibition {
  return {
    id: `editorial:${input.variantId}`,
    slug: `editorial-${input.variantId}`,
    title: input.title,
    summary: input.body,
    chronology: [],
    characters: [],
    places: [],
    quotes: [],
    curiosities: [],
    documents: [],
    images: [],
    brandId: input.brand,
    editorialContext: { storyId: input.storyId, variantId: input.variantId, claims: input.claims, sourceNotes: input.sourceNotes },
    source: { type: "editorial_story", externalId: input.storyId },
  };
}
