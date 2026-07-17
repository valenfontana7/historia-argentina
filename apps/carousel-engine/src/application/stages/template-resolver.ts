import { readFile } from "node:fs/promises";
import path from "node:path";
import type { LayoutRecipeId, RenderedSlideType } from "@museoargent/carousel-contracts";
import { CarouselEngineError } from "../../domain/errors";

export type TypeScaleEntry = {
  sizePx: number;
  lineHeight: number;
  letterSpacing: string;
};

export type TemplateManifest = {
  id: string;
  version: number;
  displayName: string;
  grid: { columns: number; baselinePx: number };
  spacing: { gapPx: number; stackGapPx: number; sectionGapPx: number };
  typeScale: Record<string, Record<string, TypeScaleEntry>>;
  typographyRecomposition: string[];
  maxLines: Record<string, number>;
  charBudgets: Record<string, number>;
  slideBindings: Record<
    string,
    {
      recipeId: LayoutRecipeId;
      imageRatio: number;
      allowedComponents: string[];
    }
  >;
};

const CACHE = new Map<string, TemplateManifest>();

export async function resolveTemplate(
  engineRoot: string,
  templateId: string,
  version: number,
): Promise<TemplateManifest> {
  const key = `${templateId}@${version}`;
  const cached = CACHE.get(key);
  if (cached) return cached;

  const folder = templateId.replace(/_/g, "-");
  const file = path.join(
    engineRoot,
    "templates",
    folder,
    `v${version}`,
    "manifest.json",
  );
  let raw: string;
  try {
    raw = await readFile(file, "utf8");
  } catch {
    throw new CarouselEngineError(
      `Template not found: ${key}`,
      "template_not_found",
    );
  }
  const manifest = JSON.parse(raw) as TemplateManifest;
  if (manifest.id !== templateId || manifest.version !== version) {
    throw new CarouselEngineError(
      `Template manifest mismatch for ${key}`,
      "template_mismatch",
    );
  }
  CACHE.set(key, manifest);
  return manifest;
}

export function bindingFor(
  manifest: TemplateManifest,
  type: RenderedSlideType,
) {
  const binding = manifest.slideBindings[type];
  if (!binding) {
    throw new CarouselEngineError(
      `No binding for slide type ${type} in ${manifest.id}@${manifest.version}`,
      "template_binding_missing",
    );
  }
  return binding;
}
