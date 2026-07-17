import { chromium, type Browser } from "playwright";
import type {
  SlideRenderer,
  RenderSlideInput,
} from "../application/ports/slide-renderer";
import { renderSlideHtml } from "../projection/render-html";

export class PlaywrightSlideRenderer implements SlideRenderer {
  private browser: Browser | null = null;

  private async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
      });
    }
    return this.browser;
  }

  async renderSlide(input: RenderSlideInput): Promise<Buffer> {
    const html = renderSlideHtml(input.ir, input.theme, input.manifest);
    const browser = await this.getBrowser();
    const page = await browser.newPage({
      viewport: {
        width: input.ir.width,
        height: input.ir.height,
      },
      deviceScaleFactor: 1,
    });
    try {
      await page.setContent(html, { waitUntil: "load" });
      // Wait for webfonts (font-display: block) before screenshot
      await page.evaluate(async () => {
        try {
          await Promise.race([
            document.fonts.ready,
            new Promise<void>((r) => setTimeout(r, 4000)),
          ]);
        } catch {
          /* ignore */
        }
        const imgs = Array.from(document.images);
        await Promise.all(
          imgs.map(
            (img) =>
              new Promise<void>((resolve) => {
                if (img.complete && img.naturalWidth > 0) {
                  resolve();
                  return;
                }
                img.onload = () => resolve();
                img.onerror = () => resolve();
                setTimeout(() => resolve(), 2000);
              }),
          ),
        );
      });
      const slide = page.locator(".slide");
      const buffer = await slide.screenshot({
        type: "png",
        omitBackground: false,
      });
      return Buffer.from(buffer);
    } finally {
      await page.close();
    }
  }

  async dispose(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
