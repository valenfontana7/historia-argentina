/**
 * Clasificación editorial de exhibiciones por profundidad inmersiva.
 * Tier A: mapa scrolly + escenas custom
 * Tier B: comparadores + piezas
 * Tier C: prosa + piezas
 */

export type TierExhibicion = "A" | "B" | "C";

/** Slugs con mapas scrolly GSAP (tier A). */
const TIER_A = new Set([
  "chacabuco",
  "maipu",
  "pavon",
  "guayaquil",
  "la-conquista-del-desierto",
  "junin",
  "ayacucho",
  "ituzaingo",
  "castelli",
  "las-48-horas-de-mayo",
  "la-ciudad-que-vencio-a-un-imperio",
  "el-9-de-julio",
  "caseros",
  "la-batalla-de-salta",
  "san-lorenzo",
  "barranca-yaco",
  "la-vuelta-de-obligado",
  "setenta-y-cuatro-dias",
  "el-cruce-de-los-andes",
  "la-constitucion-de-1853",
]);

/** Slugs con comparadores de imagen (tier B). Resto = tier C. */
const TIER_B = new Set([
  "el-2001",
  "el-default",
  "el-cordobazo",
  "el-proceso",
  "peron",
  "cristina",
  "macri",
  "milei",
  "menem",
  "alfonsin",
  "kirchner",
  "de-la-rua",
  "alberto-fernandez",
  "el-acuerdo-con-el-fmi",
  "ley-bases",
  "legislativas-2025",
  "carapintadas",
  "reforma-94",
  "duhalde",
  "resolucion-125",
  "stand-by-2018",
  "argentina-inglaterra-2026",
  "mundial-1978",
  "mundial-1986",
  "la-pandemia",
  "la-convertibilidad",
  "hiperinflacion",
  "rodrigazo",
  "el-43",
  "el-retorno",
  "la-transicion",
  "la-revolucion-libertadora",
  "revolucion-del-parque",
  "el-facundo",
  "rosas",
  "urquiza",
  "mitre",
  "sarmiento",
  "roca",
  "belgrano",
  "alberdi",
  "rivadavia",
  "moreno",
  "saavedra",
  "liniers",
  "dorrego",
  "guemes",
  "mariquita",
  "campora",
  "ongania",
  "levingston",
  "lanusse",
  "isabel",
  "videla",
  "galtieri",
  "massera",
  "illia",
  "frondizi",
  "yrigoyen",
  "elecciones-83",
  "juicio-a-las-juntas",
  "conadep",
  "esma",
  "las-madres",
  "montoneros",
  "erp",
  "triple-a",
  "embajada",
  "amia",
  "walsh",
  "piqueteros",
  "fabricas-recuperadas",
  "patagonia-rebelde",
  "federalizacion",
  "la-bandera",
  "ley-saenz-pena",
  "voto-femenino",
  "semana-tragica",
  "paraguay",
  "malvinas-ciudad",
  "huaqui",
]);

export function tierDeCronica(slug: string): TierExhibicion {
  if (TIER_A.has(slug)) return "A";
  if (TIER_B.has(slug)) return "B";
  return "C";
}

export function etiquetaTier(tier: TierExhibicion): string {
  switch (tier) {
    case "A":
      return "Exhibición inmersiva";
    case "B":
      return "Exhibición visual";
    case "C":
      return "Exhibición narrativa";
    default: {
      const _exhaustive: never = tier;
      return _exhaustive;
    }
  }
}
