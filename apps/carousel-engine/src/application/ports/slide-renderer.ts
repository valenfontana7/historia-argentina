import type { ExportFormat, SlideIr } from "@museoargent/carousel-contracts";
import type { TemplateManifest } from "../stages/template-resolver";
import type { ThemeTokens } from "../stages/theme-resolver";

export type RenderSlideInput = {
  ir: SlideIr;
  theme: ThemeTokens;
  manifest: TemplateManifest;
  format: ExportFormat;
};

export type SlideRenderer = {
  renderSlide(input: RenderSlideInput): Promise<Buffer>;
  dispose?(): Promise<void>;
};
