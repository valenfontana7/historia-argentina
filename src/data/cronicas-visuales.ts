/**
 * Configuración visual por crónica: hero y acento.
 * Lee de registro.ts como única fuente de verdad.
 */

import type { VarianteHero } from "@/content/cronicas/tipos";
import { cronicas } from "@/content/cronicas/registro";

export type { VarianteHero };

export type ConfigVisualCronica = {
  varianteHero: VarianteHero;
  imagenHero?: string;
  acento: string;
};

const ACENTO_POR_VARIANTE: Record<VarianteHero, string> = {
  andes: "#8fb8d8",
  "rio-plata": "#6a9aaa",
  mayo: "#c6a15b",
  jujuy: "#b8864a",
  tucuman: "#c6a15b",
  pampa: "#b04a38",
  atlantico: "#5a8aaa",
};

export const visualesCronicas: Record<string, ConfigVisualCronica> = Object.fromEntries(
  cronicas.map((c) => [
    c.slug,
    {
      varianteHero: c.visual.varianteHero,
      imagenHero: c.visual.imagenHero,
      acento: c.visual.acento ?? ACENTO_POR_VARIANTE[c.visual.varianteHero],
    },
  ]),
);

export function obtenerVisualCronica(slug: string): ConfigVisualCronica {
  return (
    visualesCronicas[slug] ?? {
      varianteHero: "andes",
      acento: "#c6a15b",
    }
  );
}
