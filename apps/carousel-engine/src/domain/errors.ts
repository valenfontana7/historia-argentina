export class CarouselEngineError extends Error {
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
    this.name = "CarouselEngineError";
  }
}

export class TypographyOverflowError extends CarouselEngineError {
  constructor(slideId: string, detail: string) {
    super(
      `Typography overflow on slide ${slideId}: ${detail}`,
      "typography_overflow",
    );
    this.name = "TypographyOverflowError";
  }
}

export class UnsupportedSlideTypeError extends CarouselEngineError {
  constructor(type: string) {
    super(`Slide type not renderable in v1: ${type}`, "unsupported_slide_type");
    this.name = "UnsupportedSlideTypeError";
  }
}
