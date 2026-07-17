import type { SlideRenderer } from "../application/ports/slide-renderer";

/** Deterministic tiny PNG for CI without Chromium. */
export class FakeSlideRenderer implements SlideRenderer {
  async renderSlide(): Promise<Buffer> {
    // 1x1 PNG
    return Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      "base64",
    );
  }
}
