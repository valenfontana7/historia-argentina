/**
 * Configuración visual por crónica: hero y acento.
 */

export type VarianteHero =
  | "andes"
  | "rio-plata"
  | "mayo"
  | "jujuy"
  | "tucuman"
  | "pampa"
  | "atlantico";

export type ConfigVisualCronica = {
  varianteHero: VarianteHero;
  imagenHero?: string;
  acento: string;
};

export const visualesCronicas: Record<string, ConfigVisualCronica> = {
  "el-cruce-de-los-andes": {
    varianteHero: "andes",
    imagenHero: "andes-cruce",
    acento: "#8fb8d8",
  },
  "la-ciudad-que-vencio-a-un-imperio": {
    varianteHero: "rio-plata",
    imagenHero: "invasiones-ataque",
    acento: "#6a9aaa",
  },
  "las-48-horas-de-mayo": {
    varianteHero: "mayo",
    imagenHero: "mayo-cabildo",
    acento: "#c6a15b",
  },
  "el-exodo-jujeno": {
    varianteHero: "jujuy",
    imagenHero: "jujuy-quebrada",
    acento: "#b8864a",
  },
  "la-guerra-gaucha": {
    varianteHero: "jujuy",
    imagenHero: "gaucha-guemes",
    acento: "#b8864a",
  },
  "juana-azurduy": {
    varianteHero: "jujuy",
    imagenHero: "azurduy-retrato",
    acento: "#c6a15b",
  },
  "el-9-de-julio": {
    varianteHero: "tucuman",
    imagenHero: "julio-congreso",
    acento: "#c6a15b",
  },
  caseros: {
    varianteHero: "pampa",
    imagenHero: "caseros-batalla",
    acento: "#b04a38",
  },
  "el-17-de-octubre": {
    varianteHero: "mayo",
    imagenHero: "octubre-plaza",
    acento: "#8fb8d8",
  },
  "la-vuelta-de-obligado": {
    varianteHero: "rio-plata",
    imagenHero: "obligado-batalla",
    acento: "#6a9aaa",
  },
  "la-batalla-de-tucuman": {
    varianteHero: "tucuman",
    imagenHero: "jujuy-tucuman",
    acento: "#c6a15b",
  },
  evita: {
    varianteHero: "mayo",
    imagenHero: "evita-cabildo",
    acento: "#c6a15b",
  },
  "setenta-y-cuatro-dias": {
    varianteHero: "atlantico",
    imagenHero: "malvinas-desembarco",
    acento: "#5a8aaa",
  },
  "nunca-mas": {
    varianteHero: "mayo",
    imagenHero: "memoria-alfonsin",
    acento: "#8fb8d8",
  },
  "la-batalla-de-salta": {
    varianteHero: "jujuy",
    imagenHero: "salta-batalla",
    acento: "#b8864a",
  },
  "san-lorenzo": {
    varianteHero: "rio-plata",
    imagenHero: "san-lorenzo-batalla",
    acento: "#6a9aaa",
  },
  "barranca-yaco": {
    varianteHero: "pampa",
    imagenHero: "facundo-retrato",
    acento: "#b04a38",
  },
  "el-primer-golpe": {
    varianteHero: "mayo",
    imagenHero: "yrigoyen-nac",
    acento: "#c6a15b",
  },
  "la-constitucion-de-1853": {
    varianteHero: "pampa",
    imagenHero: "constitucion-1853",
    acento: "#c6a15b",
  },
};

export function obtenerVisualCronica(slug: string): ConfigVisualCronica {
  return (
    visualesCronicas[slug] ?? {
      varianteHero: "andes",
      acento: "#c6a15b",
    }
  );
}
