import { z } from "zod";

export const VideoFormatIdSchema = z.enum([
  "reel",
  "short",
  "historia",
  "documental",
  "curiosidad",
  "efemeride",
]);

export const AspectRatioSchema = z.enum(["9:16", "1:1", "16:9"]);

export const NarrativePaceSchema = z.enum(["rapido", "medio", "pausado"]);

export const VideoFormatProfileSchema = z.object({
  id: VideoFormatIdSchema,
  targetDurationSec: z.number().positive(),
  tone: z.string().min(1),
  cta: z.string().min(1),
  narrativePace: NarrativePaceSchema,
  aspectRatio: AspectRatioSchema,
  promptVersion: z.string().min(1),
});

export type VideoFormatId = z.infer<typeof VideoFormatIdSchema>;
export type AspectRatio = z.infer<typeof AspectRatioSchema>;
export type NarrativePace = z.infer<typeof NarrativePaceSchema>;
export type VideoFormatProfile = z.infer<typeof VideoFormatProfileSchema>;

export const DEFAULT_FORMAT_PROFILES: Record<VideoFormatId, VideoFormatProfile> =
  {
    reel: {
      id: "reel",
      targetDurationSec: 40,
      tone: "narrativo, claro, museístico, sin sensacionalismo",
      cta: "Seguí explorando · @museoargent",
      narrativePace: "rapido",
      aspectRatio: "9:16",
      promptVersion: "reel-v3",
    },
    short: {
      id: "short",
      targetDurationSec: 45,
      tone: "didáctico y cercano",
      cta: "Más historias · @museoargent",
      narrativePace: "rapido",
      aspectRatio: "9:16",
      promptVersion: "short-v1",
    },
    historia: {
      id: "historia",
      targetDurationSec: 60,
      tone: "épico contenido, preciso",
      cta: "Leé la crónica · @museoargent",
      narrativePace: "medio",
      aspectRatio: "9:16",
      promptVersion: "historia-v1",
    },
    documental: {
      id: "documental",
      targetDurationSec: 90,
      tone: "documental, pausado, con contexto",
      cta: "Visitá la exhibición · @museoargent",
      narrativePace: "pausado",
      aspectRatio: "9:16",
      promptVersion: "documental-v1",
    },
    curiosidad: {
      id: "curiosidad",
      targetDurationSec: 25,
      tone: "curioso, sorprendente, breve",
      cta: "Más curiosidades · @museoargent",
      narrativePace: "rapido",
      aspectRatio: "9:16",
      promptVersion: "curiosidad-v1",
    },
    efemeride: {
      id: "efemeride",
      targetDurationSec: 30,
      tone: "conmemorativo e informativo",
      cta: "Más efemérides · @museoargent",
      narrativePace: "medio",
      aspectRatio: "9:16",
      promptVersion: "efemeride-v1",
    },
  };
