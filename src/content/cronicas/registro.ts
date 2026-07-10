import type { ComponentType } from "react";
import type { VarianteHero } from "@/data/cronicas-visuales";

export type AccesoCronica = "publico" | "mecenas" | "anticipo";

export type CronicaMeta = {
  slug: string;
  titulo: string;
  subtitulo: string;
  kicker: string;
  periodo: string;
  duracion: string;
  descripcion: string;
  publicada: string;
  acceso: AccesoCronica;
  /** Ficha del Panteón sugerida al final de la crónica */
  protagonista: { slug: string; etiqueta: string };
  visual: { varianteHero: VarianteHero; imagenHero?: string };
};

export const cronicas: CronicaMeta[] = [
  {
    slug: "el-cruce-de-los-andes",
    titulo: "El Cruce de los Andes",
    subtitulo:
      "Cinco mil hombres, una cordillera de más de cuatro mil metros y un plan que nadie creyó posible. La historia de la operación militar más audaz de América.",
    kicker: "Crónica N.º 1 · La Independencia",
    periodo: "Enero — Febrero de 1817",
    duracion: "8 minutos",
    descripcion:
      "La historia completa del cruce de los Andes: el plan continental de San Martín, la guerra de zapa, las seis rutas del Ejército de los Andes y la victoria de Chacabuco, contada como una experiencia visual interactiva.",
    publicada: "2026-07-07",
    acceso: "publico",
    protagonista: { slug: "jose-de-san-martin", etiqueta: "La ficha de San Martín" },
    visual: { varianteHero: "andes", imagenHero: "andes-cruce" },
  },
  {
    slug: "la-ciudad-que-vencio-a-un-imperio",
    titulo: "La Ciudad que Venció a un Imperio",
    subtitulo:
      "Dos veces desembarcó el ejército más poderoso del mundo en Buenos Aires. Dos veces lo expulsó una ciudad sin murallas, peleando desde las azoteas.",
    kicker: "Crónica N.º 2 · Las Invasiones Inglesas",
    periodo: "Junio de 1806 — Julio de 1807",
    duracion: "8 minutos",
    descripcion:
      "La historia completa de las Invasiones Inglesas: la caída de Buenos Aires en 48 horas, la Reconquista de Liniers, el nacimiento de las milicias criollas y la guerra de las azoteas que humilló a Whitelocke, contada como una experiencia visual interactiva.",
    publicada: "2026-07-07",
    acceso: "publico",
    protagonista: { slug: "santiago-de-liniers", etiqueta: "La ficha de Liniers" },
    visual: { varianteHero: "rio-plata", imagenHero: "invasiones-ataque" },
  },
  {
    slug: "las-48-horas-de-mayo",
    titulo: "Las 48 Horas de Mayo",
    subtitulo:
      "Del cabildo abierto a la Primera Junta: cómo una ciudad armada aprovechó la prisión de un rey para tomar el poder.",
    kicker: "Exclusiva Mecenas · Mayo de 1810",
    periodo: "22 — 25 de mayo de 1810",
    duracion: "8 minutos",
    descripcion:
      "Una crónica exclusiva para mecenas sobre las cuarenta y ocho horas que terminaron con el virreinato en Buenos Aires: milicias, cabildo abierto y la continuidad secreta con las Invasiones Inglesas.",
    publicada: "2026-07-07",
    acceso: "mecenas",
    protagonista: { slug: "mariano-moreno", etiqueta: "La ficha de Mariano Moreno" },
    visual: { varianteHero: "mayo", imagenHero: "mayo-cabildo" },
  },
  {
    slug: "el-exodo-jujeno",
    titulo: "El Éxodo Jujeño",
    subtitulo:
      "Belgrano quema la tierra, evacúa una ciudad entera y convierte la geografía en arma contra el ejército realista.",
    kicker: "Exclusiva Mecenas · Julio de 1812",
    periodo: "Julio — Agosto de 1812",
    duracion: "6 minutos",
    descripcion:
      "Crónica exclusiva sobre la evacuación de Jujuy: la decisión más dura de Belgrano antes de la batalla de Tucumán, contada como experiencia inmersiva.",
    publicada: "2026-07-08",
    acceso: "mecenas",
    protagonista: { slug: "manuel-belgrano", etiqueta: "La ficha de Belgrano" },
    visual: { varianteHero: "jujuy", imagenHero: "jujuy-quebrada" },
  },
  {
    slug: "la-guerra-gaucha",
    titulo: "La Guerra Gaucha",
    subtitulo:
      "Güemes convierte Salta en un escudo vivo: montoneras, caballos y una guerra que el ejército regular no sabía pelear.",
    kicker: "Exclusiva Mecenas · Crónica N.º 3",
    periodo: "1815 — 1821",
    duracion: "7 minutos",
    descripcion:
      "La guerra gaucha de Martín Miguel de Güemes: cómo una provincia entera sostuvo el norte con caballería irregular mientras los ejércitos formales se deshacían.",
    publicada: "2026-07-09",
    acceso: "mecenas",
    protagonista: { slug: "martin-miguel-de-guemes", etiqueta: "La ficha de Güemes" },
    visual: { varianteHero: "jujuy", imagenHero: "gaucha-guemes" },
  },
  {
    slug: "juana-azurduy",
    titulo: "Juana Azurduy",
    subtitulo:
      "En el Alto Perú, cuando los ejércitos patriotas se quebraban, una comandanta armó otra resistencia.",
    kicker: "Exclusiva Mecenas · Crónica N.º 4",
    periodo: "1810 — 1825",
    duracion: "7 minutos",
    descripcion:
      "La crónica de Juana Azurduy: guerrilla, mando y combate en el Alto Perú, lejos del bronce y cerca de la guerra real de la Independencia.",
    publicada: "2026-07-09",
    acceso: "mecenas",
    protagonista: { slug: "juana-azurduy", etiqueta: "La ficha de Juana Azurduy" },
    visual: { varianteHero: "jujuy", imagenHero: "azurduy-retrato" },
  },
  {
    slug: "el-9-de-julio",
    titulo: "El 9 de Julio",
    subtitulo:
      "En Tucumán, un Congreso frágil escribió en tinta lo que la Revolución venía peleando con fusiles.",
    kicker: "Crónica N.º 5 · La Independencia",
    periodo: "Marzo — Julio de 1816",
    duracion: "8 minutos",
    descripcion:
      "La historia del Congreso de Tucumán y el Acta de la Independencia: diputados en camino, debates y el 9 de julio que cambió el mapa político de América del Sur.",
    publicada: "2026-07-09",
    acceso: "publico",
    protagonista: { slug: "manuel-belgrano", etiqueta: "La ficha de Belgrano" },
    visual: { varianteHero: "tucuman", imagenHero: "julio-congreso" },
  },
  {
    slug: "caseros",
    titulo: "Caseros",
    subtitulo:
      "El 3 de febrero de 1852 el Ejército Grande quebró veinte años de orden rosista. Rosas se fue; quedó otra Argentina por armar.",
    kicker: "Crónica N.º 6 · Organización Nacional",
    periodo: "Enero — Febrero de 1852",
    duracion: "8 minutos",
    descripcion:
      "La batalla de Caseros contada como experiencia visual: el avance de Urquiza, el choque en las lomas y la caída de Juan Manuel de Rosas.",
    publicada: "2026-07-09",
    acceso: "publico",
    protagonista: { slug: "juan-manuel-de-rosas", etiqueta: "La ficha de Rosas" },
    visual: { varianteHero: "pampa", imagenHero: "caseros-batalla" },
  },
  {
    slug: "el-17-de-octubre",
    titulo: "El 17 de Octubre",
    subtitulo:
      "Perón preso, la Plaza llena, pies en el agua: el día en que una fuerza de masas nació en el centro de Buenos Aires.",
    kicker: "Exclusiva Mecenas · Crónica N.º 7",
    periodo: "17 de octubre de 1945",
    duracion: "7 minutos",
    descripcion:
      "Crónica del 17 de octubre de 1945: la movilización que liberó a Perón y marcó el debut del peronismo como identidad política de masas.",
    publicada: "2026-07-09",
    acceso: "mecenas",
    protagonista: { slug: "juan-domingo-peron", etiqueta: "La ficha de Perón" },
    visual: { varianteHero: "mayo", imagenHero: "octubre-plaza" },
  },
  {
    slug: "la-vuelta-de-obligado",
    titulo: "La Vuelta de Obligado",
    subtitulo:
      "Siete horas de resistencia en el Paraná: cuando Rosas defendió la soberanía contra el bloqueo anglofrancés.",
    kicker: "Crónica N.º 8 · Organización Nacional",
    periodo: "18 — 20 de noviembre de 1845",
    duracion: "8 minutos",
    descripcion:
      "La Vuelta de Obligado contada como experiencia visual: cadenas en el recodo del Paraná, baterías de ribera y el día que hoy es la Soberanía Nacional.",
    publicada: "2026-07-09",
    acceso: "publico",
    protagonista: { slug: "juan-manuel-de-rosas", etiqueta: "La ficha de Rosas" },
    visual: { varianteHero: "rio-plata", imagenHero: "obligado-batalla" },
  },
  {
    slug: "la-batalla-de-tucuman",
    titulo: "La Batalla de Tucumán",
    subtitulo:
      "Belgrano desobedece la orden de retirarse y convierte el Éxodo Jujeño en victoria.",
    kicker: "Crónica N.º 9 · La Independencia",
    periodo: "24 — 25 de septiembre de 1812",
    duracion: "7 minutos",
    descripcion:
      "La batalla de Tucumán: del Éxodo a la desobediencia de Belgrano, contada como crónica inmersiva con mapa y comparador visual.",
    publicada: "2026-07-09",
    acceso: "publico",
    protagonista: { slug: "manuel-belgrano", etiqueta: "La ficha de Belgrano" },
    visual: { varianteHero: "tucuman", imagenHero: "jujuy-tucuman" },
  },
  {
    slug: "evita",
    titulo: "Evita",
    subtitulo:
      "Del voto femenino al Cabildo Abierto: la mujer que convirtió el peronismo en movimiento de masas.",
    kicker: "Crónica N.º 10 · El peronismo",
    periodo: "1945 — 1952",
    duracion: "8 minutos",
    descripcion:
      "Crónica de Eva Perón: voto femenino, Fundación, multitudes y la renuncia del Cabildo Abierto de 1951.",
    publicada: "2026-07-09",
    acceso: "publico",
    protagonista: { slug: "eva-peron", etiqueta: "La ficha de Evita" },
    visual: { varianteHero: "mayo", imagenHero: "evita-cabildo" },
  },
  {
    slug: "setenta-y-cuatro-dias",
    titulo: "74 días",
    subtitulo:
      "Del desembarco del 2 de abril a la rendición del 14 de junio: la guerra de Malvinas como herida nacional.",
    kicker: "Crónica N.º 11 · La Argentina contemporánea",
    periodo: "2 de abril — 14 de junio de 1982",
    duracion: "8 minutos",
    descripcion:
      "La guerra de Malvinas en 74 días: Operación Rosario, el Atlántico Sur y la rendición que marcó una generación.",
    publicada: "2026-07-09",
    acceso: "publico",
    protagonista: { slug: "raul-alfonsin", etiqueta: "La ficha de Alfonsín" },
    visual: { varianteHero: "atlantico", imagenHero: "malvinas-desembarco" },
  },
  {
    slug: "nunca-mas",
    titulo: "Nunca Más",
    subtitulo:
      "Del golpe del 24 de marzo al 10 de diciembre de 1983: memoria, verdad y retorno de la democracia.",
    kicker: "Exclusiva Mecenas · Crónica N.º 12",
    periodo: "24 de marzo de 1976 — 10 de diciembre de 1983",
    duracion: "8 minutos",
    descripcion:
      "Crónica exclusiva sobre la última dictadura, el informe Nunca Más y el día en que la democracia volvió a la Plaza de Mayo.",
    publicada: "2026-07-09",
    acceso: "mecenas",
    protagonista: { slug: "raul-alfonsin", etiqueta: "La ficha de Alfonsín" },
    visual: { varianteHero: "mayo", imagenHero: "memoria-alfonsin" },
  },
  {
    slug: "la-batalla-de-salta",
    titulo: "La Batalla de Salta",
    subtitulo:
      "Cinco meses después de Tucumán, Belgrano obtiene la primera capitulación total de un ejército español.",
    kicker: "Crónica N.º 13 · La Independencia",
    periodo: "20 de febrero de 1813",
    duracion: "7 minutos",
    descripcion:
      "La batalla de Salta: el cierre del arco norte de Belgrano, contada con mapa de campaña y comparador visual.",
    publicada: "2026-07-09",
    acceso: "publico",
    protagonista: { slug: "manuel-belgrano", etiqueta: "La ficha de Belgrano" },
    visual: { varianteHero: "jujuy", imagenHero: "salta-batalla" },
  },
  {
    slug: "san-lorenzo",
    titulo: "San Lorenzo",
    subtitulo:
      "Quince minutos en el Paraná: el debut de San Martín y el nacimiento de los Granaderos a Caballo.",
    kicker: "Exclusiva Mecenas · Crónica N.º 14",
    periodo: "3 de febrero de 1813",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva de la batalla de San Lorenzo: el combate que lanzó a San Martín hacia el plan continental.",
    publicada: "2026-07-09",
    acceso: "mecenas",
    protagonista: { slug: "jose-de-san-martin", etiqueta: "La ficha de San Martín" },
    visual: { varianteHero: "rio-plata", imagenHero: "san-lorenzo-batalla" },
  },
  {
    slug: "barranca-yaco",
    titulo: "Barranca Yaco",
    subtitulo:
      "La emboscada que mató a Facundo Quiroga: crimen político en los llanos riojanos.",
    kicker: "Crónica N.º 15 · Organización Nacional",
    periodo: "4 de enero de 1835",
    duracion: "7 minutos",
    descripcion:
      "Barranca Yaco contada como thriller histórico: el fin del Tigre de los Llanos y el preludio del Facundo sarmientino.",
    publicada: "2026-07-09",
    acceso: "publico",
    protagonista: { slug: "juan-facundo-quiroga", etiqueta: "La ficha de Facundo" },
    visual: { varianteHero: "pampa", imagenHero: "facundo-retrato" },
  },
  {
    slug: "el-primer-golpe",
    titulo: "El Primer Golpe",
    subtitulo:
      "6 de septiembre de 1930: Uriburu derroca a Yrigoyen y abre la cadena de golpes del siglo XX.",
    kicker: "Crónica N.º 16 · La Argentina democrática",
    periodo: "6 de septiembre de 1930",
    duracion: "7 minutos",
    descripcion:
      "El golpe de 1930 contada como crónica visual: democracia radical vs tanques en la Plaza del Congreso.",
    publicada: "2026-07-09",
    acceso: "publico",
    protagonista: { slug: "hipolito-yrigoyen", etiqueta: "La ficha de Yrigoyen" },
    visual: { varianteHero: "mayo", imagenHero: "yrigoyen-nac" },
  },
  {
    slug: "la-constitucion-de-1853",
    titulo: "La Constitución de 1853",
    subtitulo:
      "Post-Caseros: Alberdi escribe las Bases, Urquiza convoca, Buenos Aires queda afuera.",
    kicker: "Exclusiva Mecenas · Crónica N.º 17",
    periodo: "1 de mayo de 1853",
    duracion: "8 minutos",
    descripcion:
      "Crónica exclusiva de la Constitución de 1853: del Acuerdo de San Nicolás a la promulgación en Santa Fe.",
    publicada: "2026-07-09",
    acceso: "mecenas",
    protagonista: { slug: "juan-bautista-alberdi", etiqueta: "La ficha de Alberdi" },
    visual: { varianteHero: "pampa", imagenHero: "constitucion-1853" },
  },
];

export const cargadores: Record<string, () => Promise<{ default: ComponentType }>> = {
  "el-cruce-de-los-andes": () => import("@/content/cronicas/el-cruce-de-los-andes.mdx"),
  "la-ciudad-que-vencio-a-un-imperio": () =>
    import("@/content/cronicas/la-ciudad-que-vencio-a-un-imperio.mdx"),
  "las-48-horas-de-mayo": () => import("@/content/cronicas/las-48-horas-de-mayo.mdx"),
  "el-exodo-jujeno": () => import("@/content/cronicas/el-exodo-jujeno.mdx"),
  "la-guerra-gaucha": () => import("@/content/cronicas/la-guerra-gaucha.mdx"),
  "juana-azurduy": () => import("@/content/cronicas/juana-azurduy.mdx"),
  "el-9-de-julio": () => import("@/content/cronicas/el-9-de-julio.mdx"),
  caseros: () => import("@/content/cronicas/caseros.mdx"),
  "el-17-de-octubre": () => import("@/content/cronicas/el-17-de-octubre.mdx"),
  "la-vuelta-de-obligado": () => import("@/content/cronicas/la-vuelta-de-obligado.mdx"),
  "la-batalla-de-tucuman": () => import("@/content/cronicas/la-batalla-de-tucuman.mdx"),
  evita: () => import("@/content/cronicas/evita.mdx"),
  "setenta-y-cuatro-dias": () => import("@/content/cronicas/setenta-y-cuatro-dias.mdx"),
  "nunca-mas": () => import("@/content/cronicas/nunca-mas.mdx"),
  "la-batalla-de-salta": () => import("@/content/cronicas/la-batalla-de-salta.mdx"),
  "san-lorenzo": () => import("@/content/cronicas/san-lorenzo.mdx"),
  "barranca-yaco": () => import("@/content/cronicas/barranca-yaco.mdx"),
  "el-primer-golpe": () => import("@/content/cronicas/el-primer-golpe.mdx"),
  "la-constitucion-de-1853": () => import("@/content/cronicas/la-constitucion-de-1853.mdx"),
};

export function obtenerCronica(slug: string): CronicaMeta | undefined {
  return cronicas.find((c) => c.slug === slug);
}

export function cronicasPublicas(): CronicaMeta[] {
  return cronicas.filter((c) => c.acceso === "publico");
}

export function requiereMecenas(cronica: CronicaMeta): boolean {
  if (process.env.NEXT_PUBLIC_SALTAR_MECENAS === "true") {
    return false;
  }
  return cronica.acceso === "mecenas" || cronica.acceso === "anticipo";
}
