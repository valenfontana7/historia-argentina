import {
  CarouselSchema,
  isRenderedSlideType,
  type Carousel,
  type RenderedSlide,
} from "@museoargent/carousel-contracts";
import { UnsupportedSlideTypeError } from "../../domain/errors";

export type PlannedCarousel = {
  carousel: Carousel;
  slides: RenderedSlide[];
};

/** v1: validate + normalize order; no AI. */
export function planSlides(input: unknown): PlannedCarousel {
  const carousel = CarouselSchema.parse(input);
  const slides: RenderedSlide[] = [];
  for (const slide of carousel.slides) {
    if (!isRenderedSlideType(slide.type)) {
      throw new UnsupportedSlideTypeError(slide.type);
    }
    slides.push(slide as RenderedSlide);
  }
  return {
    carousel: { ...carousel, slides },
    slides,
  };
}
