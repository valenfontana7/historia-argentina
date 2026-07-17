import { z } from "zod";
import { LayoutRecipeIdSchema, TypographyStepSchema } from "./template";
import { RenderedSlideTypeSchema } from "./slide-types";

export const BoxSchema = z.object({
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
});

export type Box = z.infer<typeof BoxSchema>;

export const ComponentKindSchema = z.enum([
  "Header",
  "Footer",
  "Kicker",
  "Title",
  "Subtitle",
  "Paragraph",
  "Quote",
  "Number",
  "Label",
  "Caption",
  "Image",
  "Divider",
  "CTA",
  "Badge",
]);

export type ComponentKind = z.infer<typeof ComponentKindSchema>;

export const TypeRoleSchema = z.enum([
  "display",
  "title",
  "subtitle",
  "body",
  "caption",
  "kicker",
  "stat",
  "cta",
]);

export type TypeRole = z.infer<typeof TypeRoleSchema>;

export const TextNodeSchema = z.object({
  kind: z.literal("text"),
  role: TypeRoleSchema,
  content: z.string(),
  maxLines: z.number().int().positive().optional(),
  balance: z.boolean().optional(),
});

export const ImageFitSchema = z.enum(["cover", "contain"]);

export const ImageNodeSchema = z.object({
  kind: z.literal("image"),
  src: z.string().min(1),
  alt: z.string().optional(),
  credit: z.string().optional(),
  fit: ImageFitSchema,
  focusX: z.number().min(0).max(1).default(0.5),
  focusY: z.number().min(0).max(1).default(0.5),
});

export const SlotNodeSchema = z.discriminatedUnion("kind", [
  TextNodeSchema,
  ImageNodeSchema,
  z.object({
    kind: z.literal("divider"),
  }),
  z.object({
    kind: z.literal("spacer"),
  }),
]);

export type SlotNode = z.infer<typeof SlotNodeSchema>;

export const IrSlotSchema = z.object({
  id: z.string().min(1),
  component: ComponentKindSchema,
  box: BoxSchema,
  node: SlotNodeSchema,
});

export type IrSlot = z.infer<typeof IrSlotSchema>;

export const SlideIrSchema = z.object({
  slideId: z.string().min(1),
  type: RenderedSlideTypeSchema,
  recipeId: LayoutRecipeIdSchema,
  typographyStep: TypographyStepSchema,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  paddingPx: z.number().int().nonnegative(),
  safeBottomPx: z.number().int().nonnegative(),
  themeId: z.string().min(1),
  templateId: z.string().min(1),
  templateVersion: z.number().int().positive(),
  profileId: z.string().min(1),
  branding: z.boolean(),
  slideIndex: z.number().int().nonnegative(),
  slideCount: z.number().int().positive(),
  slots: z.array(IrSlotSchema),
});

export type SlideIr = z.infer<typeof SlideIrSchema>;

export const RenderPlanSchema = z.object({
  carouselId: z.string().min(1),
  templateId: z.string().min(1),
  templateVersion: z.number().int().positive(),
  themeId: z.string().min(1),
  profileId: z.string().min(1),
  slides: z.array(
    z.object({
      slideId: z.string().min(1),
      irHash: z.string().min(1),
      ir: SlideIrSchema,
    }),
  ),
});

export type RenderPlan = z.infer<typeof RenderPlanSchema>;
