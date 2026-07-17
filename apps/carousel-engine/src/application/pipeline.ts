import {
  DEFAULT_RENDERING_PROFILES,
  IMPLEMENTED_PROFILES,
  type Carousel,
  type ExportFormat,
  type RenderPlan,
  type RenderingProfileId,
  type TemplateId,
  type ThemeId,
} from "@museoargent/carousel-contracts";
import { CarouselEngineError } from "../domain/errors";
import { hashSlideIr } from "./ir-hash";
import { composeAssets } from "./stages/asset-composer";
import { resolveComponents } from "./stages/component-resolver";
import { layoutSlide } from "./stages/layout-engine";
import { planSlides } from "./stages/slide-planner";
import { resolveTemplate } from "./stages/template-resolver";
import { resolveTheme } from "./stages/theme-resolver";
import { resolveTypographyStep } from "./stages/typography-engine";

export type PipelineInput = {
  carousel: Carousel;
  templateId: TemplateId;
  templateVersion: number;
  themeId: ThemeId;
  profileId: RenderingProfileId;
  engineRoot: string;
  libraryRoot: string;
  cacheRoot?: string;
  exportFormat?: ExportFormat;
};

export async function buildRenderPlan(
  input: PipelineInput,
): Promise<RenderPlan> {
  if (!IMPLEMENTED_PROFILES.includes(input.profileId)) {
    throw new CarouselEngineError(
      `Profile not implemented in v1: ${input.profileId}`,
      "profile_not_implemented",
    );
  }
  const profile = DEFAULT_RENDERING_PROFILES[input.profileId];
  const planned = planSlides(input.carousel);
  const manifest = await resolveTemplate(
    input.engineRoot,
    input.templateId,
    input.templateVersion,
  );
  await resolveTheme(input.engineRoot, input.themeId);

  const slides = [];
  for (let index = 0; index < planned.slides.length; index++) {
    const slide = planned.slides[index]!;
    const components = resolveComponents(slide);
    const typographyStep = resolveTypographyStep(slide, manifest);
    let ir = layoutSlide({
      slide,
      components,
      manifest,
      profile,
      themeId: input.themeId,
      templateId: input.templateId,
      templateVersion: input.templateVersion,
      typographyStep,
      slideIndex: index,
      slideCount: planned.slides.length,
    });
    ir = await composeAssets(ir, input.libraryRoot, input.cacheRoot);
    slides.push({
      slideId: slide.id,
      irHash: hashSlideIr(ir),
      ir,
    });
  }

  return {
    carouselId: planned.carousel.id,
    templateId: input.templateId,
    templateVersion: input.templateVersion,
    themeId: input.themeId,
    profileId: input.profileId,
    slides,
  };
}
