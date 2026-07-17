import type {
  ComponentKind,
  RenderedSlide,
  SlotNode,
} from "@museoargent/carousel-contracts";

export type ResolvedComponent = {
  id: string;
  component: ComponentKind;
  node: SlotNode;
  /** Relative weight for vertical stack when layout assigns free space. */
  weight: number;
};

function text(
  role: "display" | "title" | "subtitle" | "body" | "caption" | "kicker" | "stat" | "cta",
  content: string,
  maxLines?: number,
  balance?: boolean,
): SlotNode {
  return { kind: "text", role, content, maxLines, balance };
}

/** Map slide content → component nodes (no boxes yet). */
export function resolveComponents(slide: RenderedSlide): ResolvedComponent[] {
  switch (slide.type) {
    case "cover": {
      const nodes: ResolvedComponent[] = [];
      if (slide.kicker) {
        nodes.push({
          id: "kicker",
          component: "Kicker",
          node: text("kicker", slide.kicker.toUpperCase(), 1),
          weight: 0,
        });
      }
      nodes.push({
        id: "title",
        component: "Title",
        node: text("display", slide.title, 3, true),
        weight: 0,
      });
      if (slide.subtitle) {
        nodes.push({
          id: "subtitle",
          component: "Subtitle",
          node: text("subtitle", slide.subtitle, 2),
          weight: 0,
        });
      }
      if (slide.image?.src) {
        nodes.push({
          id: "image",
          component: "Image",
          node: {
            kind: "image",
            src: slide.image.src,
            alt: slide.image.alt,
            credit: slide.credit ?? slide.image.credit,
            fit: "cover",
            focusX: slide.image.focusX ?? 0.5,
            focusY: slide.image.focusY ?? 0.5,
          },
          weight: 2,
        });
      }
      return nodes;
    }
    case "content": {
      const nodes: ResolvedComponent[] = [];
      if (slide.title) {
        nodes.push({
          id: "title",
          component: "Title",
          node: text("title", slide.title, 3, true),
          weight: 0,
        });
      }
      nodes.push({
        id: "body",
        component: "Paragraph",
        node: text("body", slide.body, 8),
        weight: 1,
      });
      if (slide.image?.src) {
        nodes.push({
          id: "image",
          component: "Image",
          node: {
            kind: "image",
            src: slide.image.src,
            alt: slide.image.alt,
            credit: slide.image.credit,
            fit: "cover",
            focusX: slide.image.focusX ?? 0.5,
            focusY: slide.image.focusY ?? 0.5,
          },
          weight: 2,
        });
      }
      if (slide.caption) {
        nodes.push({
          id: "caption",
          component: "Caption",
          node: text("caption", slide.caption, 2),
          weight: 0,
        });
      }
      return nodes;
    }
    case "quote":
      return [
        {
          id: "divider",
          component: "Divider",
          node: { kind: "divider" },
          weight: 0,
        },
        {
          id: "quote",
          component: "Quote",
          node: text("title", `«${slide.quote}»`, 6, true),
          weight: 2,
        },
        ...(slide.attribution
          ? [
              {
                id: "attr",
                component: "Label" as const,
                node: text("caption", slide.attribution, 2),
                weight: 0,
              },
            ]
          : []),
      ];
    case "statistic":
      return [
        {
          id: "value",
          component: "Number",
          node: text("stat", slide.value, 1),
          weight: 1,
        },
        {
          id: "label",
          component: "Label",
          node: text("title", slide.label, 2, true),
          weight: 0,
        },
        ...(slide.context
          ? [
              {
                id: "context",
                component: "Paragraph" as const,
                node: text("body", slide.context, 4),
                weight: 0,
              },
            ]
          : []),
      ];
    case "gallery": {
      const nodes: ResolvedComponent[] = slide.images.map((img, i) => ({
        id: `image-${i}`,
        component: "Image" as const,
        node: {
          kind: "image" as const,
          src: img.src ?? "",
          alt: img.alt,
          credit: img.credit,
          fit: "cover" as const,
          focusX: img.focusX ?? 0.5,
          focusY: img.focusY ?? 0.5,
        },
        weight: 1,
      }));
      if (slide.caption) {
        nodes.push({
          id: "caption",
          component: "Caption",
          node: text("caption", slide.caption, 2),
          weight: 0,
        });
      }
      return nodes;
    }
    case "ending_cta":
      return [
        {
          id: "badge",
          component: "Badge",
          // Placeholder; SlideView renders brand.displayName from theme
          node: text("kicker", "BRAND", 1),
          weight: 0,
        },
        {
          id: "title",
          component: "Title",
          node: text("display", slide.title, 3, true),
          weight: 0,
        },
        ...(slide.body
          ? [
              {
                id: "body",
                component: "Paragraph" as const,
                node: text("body", slide.body, 4),
                weight: 1,
              },
            ]
          : []),
        {
          id: "cta",
          component: "CTA",
          node: text("cta", slide.cta.toUpperCase(), 1),
          weight: 0,
        },
      ];
    default: {
      const _exhaustive: never = slide;
      return _exhaustive;
    }
  }
}
