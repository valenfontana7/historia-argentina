import type {
  IrSlot,
  RenderingProfile,
  RenderedSlide,
  SlotNode,
  SlideIr,
  TypeRole,
  TypographyStep,
} from "@museoargent/carousel-contracts";
import type { ResolvedComponent } from "./component-resolver";
import type { TemplateManifest, TypeScaleEntry } from "./template-resolver";
import { bindingFor } from "./template-resolver";

function snap(n: number, baseline: number): number {
  return Math.max(baseline, Math.round(n / baseline) * baseline);
}

function mergedTypeScale(
  manifest: TemplateManifest,
  step: TypographyStep,
): Record<string, TypeScaleEntry> {
  return {
    ...(manifest.typeScale.default ?? {}),
    ...(manifest.typeScale[step] ?? {}),
  };
}

/** Estimate wrapped lines from content length (chars per line heuristic). */
export function estimateLines(
  content: string,
  maxLines: number,
  charsPerLine = 18,
): number {
  const trimmed = content.trim();
  if (!trimmed) return 1;
  const estimated = Math.ceil(trimmed.length / charsPerLine);
  return Math.max(1, Math.min(maxLines, estimated));
}

function textHeight(
  node: SlotNode,
  scale: Record<string, TypeScaleEntry>,
  baseline: number,
  charsPerLine = 18,
): number {
  if (node.kind === "divider") return snap(24, baseline);
  if (node.kind === "spacer") return snap(24, baseline);
  if (node.kind === "image") return snap(120, baseline);
  const role: TypeRole = node.role;
  const entry =
    scale[role] ?? scale.body ?? { sizePx: 24, lineHeight: 1.4, letterSpacing: "0" };
  const maxLines = Math.max(
    1,
    node.maxLines ?? (role === "display" || role === "title" ? 3 : 2),
  );
  const cpl =
    role === "body" ? 26 : role === "display" || role === "title" ? 16 : charsPerLine;
  const lines = estimateLines(node.content, maxLines, cpl);
  const pad = role === "cta" ? entry.sizePx * 1.1 : baseline;
  // Extra baseline so line-clamp no corta la última línea (descenders / 0.92 rem).
  const clampPad = node.maxLines && node.maxLines > 1 ? baseline : 0;
  return snap(entry.sizePx * entry.lineHeight * lines + pad + clampPad, baseline);
}

function intrinsicHeight(
  comp: ResolvedComponent,
  scale: Record<string, TypeScaleEntry>,
  baseline: number,
): number {
  const text = textHeight(comp.node, scale, baseline);
  // Ending badge includes brand logo above the label
  if (comp.component === "Badge") {
    return snap(text + 56 + 10 + baseline, baseline);
  }
  return text;
}

/**
 * Deterministic layout from recipe + profile + type scale.
 */
export function layoutSlide(input: {
  slide: RenderedSlide;
  components: ResolvedComponent[];
  manifest: TemplateManifest;
  profile: RenderingProfile;
  themeId: string;
  templateId: string;
  templateVersion: number;
  typographyStep: TypographyStep;
  slideIndex: number;
  slideCount: number;
}): SlideIr {
  const { slide, components, manifest, profile } = input;
  const binding = bindingFor(manifest, slide.type);
  const pad = profile.paddingPx;
  const safeBottom = profile.safeBottomPx;
  const baseline = manifest.grid.baselinePx;
  const gap = manifest.spacing.stackGapPx;
  const W = profile.width;
  const H = profile.height;
  const contentW = W - pad * 2;
  const contentH = H - pad - safeBottom;
  const slots: IrSlot[] = [];
  const scale = mergedTypeScale(manifest, input.typographyStep);
  const recipe = binding.recipeId;

  if (recipe === "cover-hero") {
    layoutCoverHero({
      components,
      pad,
      width: W,
      height: H,
      safeBottom,
      contentW,
      gap,
      baseline,
      scale,
      imageRatio: binding.imageRatio || 0.76,
      slots,
    });
  } else if (recipe === "content-split") {
    layoutContentSplit({
      components,
      pad,
      contentW,
      contentH,
      gap,
      baseline,
      scale,
      slots,
    });
  } else if (recipe === "gallery-grid") {
    layoutGallery({
      components,
      pad,
      contentW,
      contentH,
      gap,
      baseline,
      scale,
      slots,
    });
  } else if (recipe === "quote-centered") {
    layoutCenteredBlock({
      components,
      pad,
      contentW,
      contentH,
      gap,
      baseline,
      scale,
      slots,
      maxBlockRatio: 0.72,
    });
  } else if (recipe === "statistic-focus") {
    layoutCenteredBlock({
      components,
      pad,
      contentW,
      contentH,
      gap,
      baseline,
      scale,
      slots,
      maxBlockRatio: 0.55,
    });
  } else if (recipe === "ending-cta") {
    layoutCenteredBlock({
      components,
      pad,
      contentW,
      contentH,
      gap,
      baseline,
      scale,
      slots,
      maxBlockRatio: 0.65,
    });
  } else {
    placeStack(
      components,
      pad,
      pad,
      contentW,
      contentH,
      gap,
      baseline,
      scale,
      slots,
      true,
    );
  }

  if (profile.branding) {
    slots.push({
      id: "footer",
      component: "Footer",
      box: {
        x: pad,
        y: H - safeBottom + baseline,
        w: contentW,
        h: Math.max(baseline * 4, safeBottom - baseline * 2),
      },
      node: { kind: "text", role: "caption", content: "brand", maxLines: 1 },
    });
  }

  return {
    slideId: slide.id,
    type: slide.type,
    recipeId: binding.recipeId,
    typographyStep: input.typographyStep,
    width: W,
    height: H,
    paddingPx: pad,
    safeBottomPx: safeBottom,
    themeId: input.themeId,
    templateId: input.templateId,
    templateVersion: input.templateVersion,
    profileId: profile.id,
    branding: profile.branding,
    slideIndex: input.slideIndex,
    slideCount: input.slideCount,
    slots,
  };
}

/** Full-bleed image + text overlay on lower third. */
function layoutCoverHero(opts: {
  components: ResolvedComponent[];
  pad: number;
  width: number;
  height: number;
  safeBottom: number;
  contentW: number;
  gap: number;
  baseline: number;
  scale: Record<string, TypeScaleEntry>;
  imageRatio: number;
  slots: IrSlot[];
}): void {
  const {
    components,
    pad,
    width,
    height,
    safeBottom,
    contentW,
    gap,
    baseline,
    scale,
    slots,
  } = opts;
  const imageComp = components.find((c) => c.node.kind === "image");
  const textComps = components.filter((c) => c.node.kind !== "image");

  const imageH = snap(
    height * Math.min(0.82, Math.max(0.7, opts.imageRatio)),
    baseline,
  );

  if (imageComp) {
    slots.push({
      id: imageComp.id,
      component: imageComp.component,
      box: { x: 0, y: 0, w: width, h: imageH },
      node: imageComp.node,
    });
  }

  const textHeights = textComps.map((c) => intrinsicHeight(c, scale, baseline));
  const textBand =
    textHeights.reduce((a, b) => a + b, 0) +
    gap * Math.max(0, textComps.length - 1);
  const overlayBottom = height - safeBottom - baseline * 2;
  const textStart = Math.max(
    pad,
    overlayBottom - textBand - gap,
  );

  placeStack(
    textComps,
    pad,
    textStart,
    contentW,
    textBand + gap,
    gap,
    baseline,
    scale,
    slots,
    false,
  );
}

function layoutContentSplit(opts: {
  components: ResolvedComponent[];
  pad: number;
  contentW: number;
  contentH: number;
  gap: number;
  baseline: number;
  scale: Record<string, TypeScaleEntry>;
  slots: IrSlot[];
}): void {
  const { components, pad, contentW, contentH, gap, baseline, scale, slots } =
    opts;
  const imageComp = components.find((c) => c.node.kind === "image");
  const textComps = components.filter((c) => c.node.kind !== "image");

  if (!imageComp) {
    placeStack(
      textComps,
      pad,
      pad,
      contentW,
      contentH,
      gap,
      baseline,
      scale,
      slots,
      false,
    );
    return;
  }

  const colGap = gap;
  const imgW = snap(contentW * 0.52, baseline);
  const textW = contentW - imgW - colGap;
  placeStack(
    textComps,
    pad,
    pad,
    textW,
    contentH,
    gap,
    baseline,
    scale,
    slots,
    false,
  );
  slots.push({
    id: imageComp.id,
    component: imageComp.component,
    box: { x: pad + textW + colGap, y: pad, w: imgW, h: contentH },
    node: imageComp.node,
  });
}

function layoutGallery(opts: {
  components: ResolvedComponent[];
  pad: number;
  contentW: number;
  contentH: number;
  gap: number;
  baseline: number;
  scale: Record<string, TypeScaleEntry>;
  slots: IrSlot[];
}): void {
  const { components, pad, contentW, contentH, gap, baseline, scale, slots } =
    opts;
  const images = components.filter((c) => c.node.kind === "image");
  const caption = components.find((c) => c.id === "caption");
  const captionH = caption ? intrinsicHeight(caption, scale, baseline) : 0;
  const gridH = contentH - captionH - (caption ? gap : 0);
  const n = Math.max(1, images.length);
  const cols = n <= 2 ? n : n === 3 ? 3 : 2;
  const rows = Math.ceil(n / cols);
  const cellW = snap((contentW - gap * (cols - 1)) / cols, baseline);
  const cellH = snap((gridH - gap * (rows - 1)) / rows, baseline);
  images.forEach((img, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    slots.push({
      id: img.id,
      component: img.component,
      box: {
        x: pad + col * (cellW + gap),
        y: pad + row * (cellH + gap),
        w: cellW,
        h: cellH,
      },
      node: img.node,
    });
  });
  if (caption) {
    slots.push({
      id: caption.id,
      component: caption.component,
      box: {
        x: pad,
        y: pad + gridH + gap,
        w: contentW,
        h: captionH,
      },
      node: caption.node,
    });
  }
}

/** Quote / statistic / ending — compact centered block. */
function layoutCenteredBlock(opts: {
  components: ResolvedComponent[];
  pad: number;
  contentW: number;
  contentH: number;
  gap: number;
  baseline: number;
  scale: Record<string, TypeScaleEntry>;
  slots: IrSlot[];
  maxBlockRatio: number;
}): void {
  const {
    components,
    pad,
    contentW,
    contentH,
    gap,
    baseline,
    scale,
    slots,
    maxBlockRatio,
  } = opts;
  const heights = components.map((c) => intrinsicHeight(c, scale, baseline));
  let totalH =
    heights.reduce((a, b) => a + b, 0) + gap * Math.max(0, components.length - 1);
  const maxH = snap(contentH * maxBlockRatio, baseline);
  if (totalH > maxH) {
    // shrink body-like slots proportionally by clamping — keep intrinsic mins
    totalH = Math.min(totalH, maxH);
  }
  const y0 = pad + Math.max(0, (contentH - totalH) / 2);
  placeStack(
    components,
    pad,
    y0,
    contentW,
    totalH,
    gap,
    baseline,
    scale,
    slots,
    false,
  );
}

function placeStack(
  comps: ResolvedComponent[],
  x: number,
  y0: number,
  w: number,
  h: number,
  gap: number,
  baseline: number,
  scale: Record<string, TypeScaleEntry>,
  out: IrSlot[],
  center = false,
): void {
  if (comps.length === 0) return;

  const heights = comps.map((c) => {
    if (c.node.kind === "image") return 0;
    return intrinsicHeight(c, scale, baseline);
  });

  const fixedSum = heights.reduce((a, b) => a + b, 0);
  const gaps = gap * Math.max(0, comps.length - 1);
  const flexComps = comps.filter(
    (c) => c.weight > 0 || c.node.kind === "image",
  );
  const remainder = Math.max(0, h - fixedSum - gaps);
  const flexWeight =
    flexComps.reduce((s, c) => s + Math.max(c.weight, 1), 0) || 1;

  const finalHeights = comps.map((c, i) => {
    if (c.node.kind === "image") {
      return snap((remainder * Math.max(c.weight, 1)) / flexWeight, baseline);
    }
    if (c.weight > 0 && c.node.kind === "text" && c.node.role === "body") {
      const base = heights[i]!;
      const extra = snap(
        (remainder * 0.25 * Math.max(c.weight, 1)) / flexWeight,
        baseline,
      );
      return base + Math.min(extra, remainder);
    }
    return heights[i]!;
  });

  for (let i = 0; i < comps.length; i++) {
    if (comps[i]!.node.kind === "image" && finalHeights[i]! < baseline * 8) {
      finalHeights[i] = snap(Math.max(h * 0.35, baseline * 20), baseline);
    }
  }

  let totalH =
    finalHeights.reduce((a, b) => a + b, 0) +
    gap * Math.max(0, comps.length - 1);
  let y = center ? y0 + Math.max(0, (h - totalH) / 2) : y0;

  comps.forEach((c, i) => {
    const hh = finalHeights[i]!;
    out.push({
      id: c.id,
      component: c.component,
      box: { x, y: snap(y, baseline), w, h: hh },
      node: c.node,
    });
    y += hh + gap;
  });
}
