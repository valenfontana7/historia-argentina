import type {
  RenderedSlide,
  TypographyStep,
} from "@museoargent/carousel-contracts";
import { TypographyOverflowError } from "../../domain/errors";
import type { TemplateManifest } from "./template-resolver";

/**
 * Choose typography recomposition step from declarative char budgets + maxLines.
 * Never truncates — escalates steps, then fails.
 */
export function resolveTypographyStep(
  slide: RenderedSlide,
  manifest: TemplateManifest,
): TypographyStep {
  const steps = manifest.typographyRecomposition as TypographyStep[];
  for (const step of steps) {
    if (fitsBudgets(slide, manifest, step)) return step;
  }
  throw new TypographyOverflowError(
    slide.id,
    "exhausted recomposition steps without fitting char budgets",
  );
}

function fitsBudgets(
  slide: RenderedSlide,
  manifest: TemplateManifest,
  step: TypographyStep,
): boolean {
  // Later steps are more compact — accept longer text as steps progress
  const loosen =
    step === "default"
      ? 1
      : step === "titleScale-1"
        ? 1.15
        : step === "titleScale-2"
          ? 1.3
          : step === "bodyCompact"
            ? 1.45
            : 1.6;

  const checkChars = (key: string, value: string | undefined) => {
    if (!value) return true;
    const budget = manifest.charBudgets[key];
    if (!budget) return true;
    return value.length <= Math.floor(budget * loosen);
  };

  /** Soft line estimate: chars / cpl must fit maxLines * loosen. */
  const checkLines = (
    key: string,
    value: string | undefined,
    charsPerLine: number,
  ) => {
    if (!value) return true;
    const max = manifest.maxLines[key];
    if (!max) return true;
    const lines = Math.ceil(value.trim().length / charsPerLine);
    return lines <= Math.ceil(max * loosen);
  };

  switch (slide.type) {
    case "cover":
      return (
        checkChars("cover.title", slide.title) &&
        checkLines("cover.title", slide.title, 16) &&
        checkChars("cover.subtitle", slide.subtitle) &&
        checkLines("cover.subtitle", slide.subtitle, 28)
      );
    case "content":
      return (
        checkChars("content.body", slide.body) &&
        checkLines("content.body", slide.body, 32) &&
        checkLines("content.title", slide.title, 18)
      );
    case "quote":
      return (
        checkChars("quote.quote", slide.quote) &&
        checkLines("quote.quote", slide.quote, 22)
      );
    case "statistic":
      return (
        checkLines("statistic.label", slide.label, 18) &&
        checkLines("statistic.context", slide.context, 28)
      );
    case "gallery":
      // Caption is optional and short; always allow (no hard budget key required)
      return !slide.caption || slide.caption.length <= Math.floor(120 * loosen);
    case "ending_cta":
      return (
        checkLines("ending_cta.title", slide.title, 16) &&
        checkLines("ending_cta.body", slide.body, 28)
      );
    default: {
      const _exhaustive: never = slide;
      return _exhaustive;
    }
  }
}
