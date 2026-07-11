import type { ComponentType } from "react";
import type { Epoca } from "@/components/ui/Retrato";
import type { VarianteHero } from "@/content/cronicas/tipos";
import { taxonomiaPorSlug } from "@/content/cronicas/taxonomia";

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
  visual: { varianteHero: VarianteHero; imagenHero?: string; acento?: string };
  /** Época histórica para agrupación y hubs */
  epoca: Epoca;
  /** Slugs de categorías temáticas */
  categorias: string[];
  anioInicio: number;
  anioFin: number;
  /** Número editorial tipado (públicas / mecenas por separado) */
  numero?: number;
  /** Destacada en portada y cabecera del catálogo */
  destacada?: boolean;
  /** Orden manual dentro de la época */
  orden?: number;
};

type CronicaBase = Omit<
  CronicaMeta,
  "epoca" | "categorias" | "anioInicio" | "anioFin" | "numero" | "destacada" | "orden"
>;

const cronicasBase: CronicaBase[] = [
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
  {
    slug: "chacabuco",
    titulo: "Chacabuco",
    subtitulo:
      "La primera victoria tras el cruce: O'Higgins de frente, Soler envolviendo, Chile a la vista.",
    kicker: "Exclusiva Mecenas · Crónica N.º 18",
    periodo: "12 de febrero de 1817",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva de Chacabuco: la batalla que validó el plan continental de San Martín.",
    publicada: "2026-07-10",
    acceso: "mecenas",
    protagonista: { slug: "jose-de-san-martin", etiqueta: "La ficha de San Martín" },
    visual: { varianteHero: "andes", imagenHero: "andes-chacabuco" },
  },
  {
    slug: "maipu",
    titulo: "Maipú",
    subtitulo:
      "Seis horas en los llanos que sellaron la independencia de Chile.",
    kicker: "Exclusiva Mecenas · Crónica N.º 19",
    periodo: "5 de abril de 1818",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva de Maipú: del desastre de Cancha Rayada a la victoria definitiva.",
    publicada: "2026-07-10",
    acceso: "mecenas",
    protagonista: { slug: "jose-de-san-martin", etiqueta: "La ficha de San Martín" },
    visual: { varianteHero: "andes", imagenHero: "maipu-batalla" },
  },
  {
    slug: "pavon",
    titulo: "Pavón",
    subtitulo:
      "Mitre vence a Urquiza y abre la unificación nacional de 1862.",
    kicker: "Exclusiva Mecenas · Crónica N.º 20",
    periodo: "16 de abril de 1859",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva de Pavón: la batalla que definió la hegemonía porteña y la Nación unificada.",
    publicada: "2026-07-10",
    acceso: "mecenas",
    protagonista: { slug: "bartolome-mitre", etiqueta: "La ficha de Mitre" },
    visual: { varianteHero: "pampa", imagenHero: "pavon-batalla" },
  },
  {
    slug: "la-revolucion-libertadora",
    titulo: "La Revolución Libertadora",
    subtitulo:
      "16 de septiembre de 1955: bombardeo, golpe y 18 años de proscripción peronista.",
    kicker: "Exclusiva Mecenas · Crónica N.º 21",
    periodo: "16 de septiembre de 1955",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva del golpe de 1955: del peronismo en el poder al exilio de Perón.",
    publicada: "2026-07-10",
    acceso: "mecenas",
    protagonista: { slug: "juan-domingo-peron", etiqueta: "La ficha de Perón" },
    visual: { varianteHero: "mayo", imagenHero: "libertadora-golpe" },
  },
  {
    slug: "el-cordobazo",
    titulo: "El Cordobazo",
    subtitulo:
      "29 de mayo de 1969: obreros, estudiantes y vecinos derrotan en la calle a la dictadura.",
    kicker: "Exclusiva Mecenas · Crónica N.º 22",
    periodo: "29 de mayo de 1969",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva del Cordobazo: la calle industrial que sacudió el autoritarismo de los sesenta.",
    publicada: "2026-07-10",
    acceso: "mecenas",
    protagonista: { slug: "juan-domingo-peron", etiqueta: "La ficha de Perón" },
    visual: { varianteHero: "mayo", imagenHero: "cordobazo-calle" },
  },
  {
    slug: "guayaquil",
    titulo: "Guayaquil",
    subtitulo:
      "La entrevista en la que San Martín renunció al poder y eligió el exilio antes que la guerra civil.",
    kicker: "Exclusiva Mecenas · Crónica N.º 23",
    periodo: "26 — 27 de julio de 1822",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva de la entrevista de Guayaquil: San Martín, Bolívar y el misterio que cerró una era.",
    publicada: "2026-07-10",
    acceso: "mecenas",
    protagonista: { slug: "jose-de-san-martin", etiqueta: "La ficha de San Martín" },
    visual: { varianteHero: "andes", imagenHero: "guayaquil-entrevista" },
  },
  {
    slug: "el-facundo",
    titulo: "El Facundo",
    subtitulo:
      "Sarmiento escribe el libro que inventó la dicotomía civilización o barbarie.",
    kicker: "Crónica N.º 17 · Organización Nacional",
    periodo: "1845",
    duracion: "7 minutos",
    descripcion:
      "La crónica del Facundo sarmientino: caudillos, pampa y el proyecto de país que nació en el exilio.",
    publicada: "2026-07-10",
    acceso: "publico",
    protagonista: { slug: "domingo-faustino-sarmiento", etiqueta: "La ficha de Sarmiento" },
    visual: { varianteHero: "pampa", imagenHero: "sarmiento-retrato" },
  },
  {
    slug: "malvinas-ciudad",
    titulo: "Malvinas vista desde la ciudad",
    subtitulo:
      "La guerra que llegó a cada barrio argentino en abril de 1982.",
    kicker: "Crónica N.º 18 · La Argentina contemporánea",
    periodo: "Abril — Junio de 1982",
    duracion: "7 minutos",
    descripcion:
      "Malvinas desde la Plaza de Mayo y la movilización civil: complemento a la crónica del frente.",
    publicada: "2026-07-10",
    acceso: "publico",
    protagonista: { slug: "raul-alfonsin", etiqueta: "La ficha de Alfonsín" },
    visual: { varianteHero: "mayo", imagenHero: "malvinas-plaza" },
  },
  {
    slug: "la-conquista-del-desierto",
    titulo: "La Conquista del Desierto",
    subtitulo:
      "Roca, la Patagonia y la herida que la Argentina todavía discute.",
    kicker: "Exclusiva Mecenas · Crónica N.º 24",
    periodo: "1878 — 1885",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva de la Conquista del Desierto: frontera móvil, campaña militar y memoria disputada.",
    publicada: "2026-07-10",
    acceso: "mecenas",
    protagonista: { slug: "julio-argentino-roca", etiqueta: "La ficha de Roca" },
    visual: { varianteHero: "pampa", imagenHero: "desierto-ejercito" },
  },
  {
    slug: "rivadavia",
    titulo: "Rivadavia",
    subtitulo:
      "El primer presidente unitario y la Constitución de 1826 que fracturó el país.",
    kicker: "Crónica N.º 19 · Organización Nacional",
    periodo: "1826 — 1827",
    duracion: "7 minutos",
    descripcion:
      "Bernardino Rivadavia: modernización, centralismo y el proyecto que el interior rechazó.",
    publicada: "2026-07-10",
    acceso: "publico",
    protagonista: { slug: "bernardino-rivadavia", etiqueta: "La ficha de Rivadavia" },
    visual: { varianteHero: "rio-plata", imagenHero: "rivadavia-retrato" },
  },
  {
    slug: "junin",
    titulo: "Junín",
    subtitulo:
      "La batalla de caballería a 4.000 metros: la última victoria de San Martín en el Perú.",
    kicker: "Exclusiva Mecenas · Crónica N.º 25",
    periodo: "6 de agosto de 1824",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva de la batalla de Junín: sables en la meseta andina y el preludio de Ayacucho.",
    publicada: "2026-07-11",
    acceso: "mecenas",
    protagonista: { slug: "jose-de-san-martin", etiqueta: "La ficha de San Martín" },
    visual: { varianteHero: "andes", imagenHero: "junin-batalla" },
  },
  {
    slug: "moreno",
    titulo: "Moreno",
    subtitulo:
      "La Gazeta, la censura y la revolución de ideas que pensó la Argentina antes de existir.",
    kicker: "Exclusiva Mecenas · Crónica N.º 26",
    periodo: "1810 — 1811",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva de Mariano Moreno: el cerebro de Mayo, la prensa libre y el legado intelectual.",
    publicada: "2026-07-11",
    acceso: "mecenas",
    protagonista: { slug: "mariano-moreno", etiqueta: "La ficha de Mariano Moreno" },
    visual: { varianteHero: "mayo", imagenHero: "moreno-retrato" },
  },
  {
    slug: "semana-tragica",
    titulo: "La Semana Trágica",
    subtitulo:
      "Enero de 1919: la huelga metalúrgica que dejó cientos de muertos en Buenos Aires.",
    kicker: "Crónica N.º 20 · La Argentina democrática",
    periodo: "7 — 14 de enero de 1919",
    duracion: "7 minutos",
    descripcion:
      "La Semana Trágica contada como crónica inmersiva: huelga, represión y la democracia herida.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "hipolito-yrigoyen", etiqueta: "La ficha de Yrigoyen" },
    visual: { varianteHero: "mayo", imagenHero: "semana-tragica-huelga" },
  },
  {
    slug: "federalizacion",
    titulo: "La Federalización",
    subtitulo:
      "1880: Buenos Aires deja de ser provincia y nace la Capital Federal.",
    kicker: "Crónica N.º 21 · Organización Nacional",
    periodo: "Octubre de 1880",
    duracion: "7 minutos",
    descripcion:
      "La federalización de Buenos Aires: el acuerdo que cerró la organización nacional.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "julio-argentino-roca", etiqueta: "La ficha de Roca" },
    visual: { varianteHero: "rio-plata", imagenHero: "federal-plano" },
  },
  {
    slug: "el-2001",
    titulo: "El 2001",
    subtitulo:
      "Diciembre de 2001: corralito, cacerolazos y cinco presidentes en dos semanas.",
    kicker: "Crónica N.º 22 · La Argentina contemporánea",
    periodo: "Diciembre de 2001 — Enero de 2002",
    duracion: "7 minutos",
    descripcion:
      "La crisis del 2001: el colapso económico que sacudió la democracia argentina.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "raul-alfonsin", etiqueta: "La ficha de Alfonsín" },
    visual: { varianteHero: "mayo", imagenHero: "crisis-2001-manifestacion" },
  },
  {
    slug: "ayacucho",
    titulo: "Ayacucho",
    subtitulo:
      "9 de diciembre de 1824: la batalla que terminó con el imperio español en América.",
    kicker: "Exclusiva Mecenas · Crónica N.º 27",
    periodo: "9 de diciembre de 1824",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva de Ayacucho: Sucre, el Ejército Unido Libertador y el fin del virreinato del Perú.",
    publicada: "2026-07-11",
    acceso: "mecenas",
    protagonista: { slug: "jose-de-san-martin", etiqueta: "La ficha de San Martín" },
    visual: { varianteHero: "andes", imagenHero: "ayacucho-batalla" },
  },
  {
    slug: "dorrego",
    titulo: "Dorrego",
    subtitulo:
      "El caudillo federal fusilado en 1828: el mártir que abrió la era rosista.",
    kicker: "Exclusiva Mecenas · Crónica N.º 28",
    periodo: "1827 — 1828",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva de Manuel Dorrego: federalismo, guerra civil y el crimen que cambió la Argentina.",
    publicada: "2026-07-11",
    acceso: "mecenas",
    protagonista: { slug: "manuel-dorrego", etiqueta: "La ficha de Dorrego" },
    visual: { varianteHero: "pampa", imagenHero: "dorrego-retrato" },
  },
  {
    slug: "rosas",
    titulo: "Rosas",
    subtitulo:
      "Veinte años de machete rojo: el poder absoluto de Juan Manuel de Rosas.",
    kicker: "Crónica N.º 23 · Organización Nacional",
    periodo: "1835 — 1852",
    duracion: "7 minutos",
    descripcion:
      "El rosismo contado como crónica inmersiva: orden, terror y la caída en Caseros.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "juan-manuel-de-rosas", etiqueta: "La ficha de Rosas" },
    visual: { varianteHero: "pampa", imagenHero: "rosas-descalzi" },
  },
  {
    slug: "mitre",
    titulo: "Mitre",
    subtitulo:
      "Historiador, general y presidente: el hombre que escribió la nación.",
    kicker: "Crónica N.º 24 · Organización Nacional",
    periodo: "1852 — 1870",
    duracion: "7 minutos",
    descripcion:
      "Bartolomé Mitre: de Caseros a la guerra del Paraguay, la crónica del primer presidente unitario.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "bartolome-mitre", etiqueta: "La ficha de Mitre" },
    visual: { varianteHero: "rio-plata", imagenHero: "mitre-retrato" },
  },
  {
    slug: "ley-saenz-pena",
    titulo: "La Ley Sáenz Peña",
    subtitulo:
      "1912: voto secreto y obligatorio — la puerta que abrió la democracia moderna.",
    kicker: "Crónica N.º 25 · La Argentina democrática",
    periodo: "Febrero de 1912 — Octubre de 1916",
    duracion: "7 minutos",
    descripcion:
      "La ley Sáenz Peña y el camino a las primeras elecciones limpias: el nacimiento del voto popular.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "hipolito-yrigoyen", etiqueta: "La ficha de Yrigoyen" },
    visual: { varianteHero: "mayo", imagenHero: "saenz-pena-elecciones" },
  },
  {
    slug: "alberdi",
    titulo: "Alberdi",
    subtitulo:
      "Bases y puntos de partida: el pensador que escribió la Constitución desde el exilio.",
    kicker: "Exclusiva Mecenas · Crónica N.º 29",
    periodo: "1852 — 1853",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva de Juan Bautista Alberdi: las Bases, el federalismo liberal y el arquitecto invisible de 1853.",
    publicada: "2026-07-11",
    acceso: "mecenas",
    protagonista: { slug: "juan-bautista-alberdi", etiqueta: "La ficha de Alberdi" },
    visual: { varianteHero: "rio-plata", imagenHero: "alberdi-bases" },
  },
  {
    slug: "patagonia-rebelde",
    titulo: "Patagonia rebelde",
    subtitulo:
      "1920 — 1922: la huelga obrera del sur que Yrigoyen reprimió con fusilamientos.",
    kicker: "Exclusiva Mecenas · Crónica N.º 30",
    periodo: "1920 — 1922",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva de la Patagonia rebelde: huelga, ejército y la herida que el radicalismo no cerró.",
    publicada: "2026-07-11",
    acceso: "mecenas",
    protagonista: { slug: "hipolito-yrigoyen", etiqueta: "La ficha de Yrigoyen" },
    visual: { varianteHero: "pampa", imagenHero: "patagonia-huelga" },
  },
  {
    slug: "ituzaingo",
    titulo: "Ituzaingó",
    subtitulo:
      "20 de febrero de 1827: la batalla contra Brasil que forjó al joven Rosas.",
    kicker: "Crónica N.º 26 · Organización Nacional",
    periodo: "20 de febrero de 1827",
    duracion: "7 minutos",
    descripcion:
      "La batalla de Ituzaingó: la guerra con Brasil y el campo donde se templó Juan Manuel de Rosas.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "juan-manuel-de-rosas", etiqueta: "La ficha de Rosas" },
    visual: { varianteHero: "rio-plata", imagenHero: "ituzaingo-batalla" },
  },
  {
    slug: "la-transicion",
    titulo: "La Transición",
    subtitulo:
      "10 de diciembre de 1983: Alfonsín devuelve la democracia después de la dictadura.",
    kicker: "Crónica N.º 27 · La Argentina contemporánea",
    periodo: "1983 — 1985",
    duracion: "7 minutos",
    descripcion:
      "La transición democrática de 1983: del horror de la dictadura al juicio a las juntas militares.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "raul-alfonsin", etiqueta: "La ficha de Alfonsín" },
    visual: { varianteHero: "mayo", imagenHero: "transicion-alfonsin" },
  },
  {
    slug: "urquiza",
    titulo: "Urquiza",
    subtitulo:
      "El caudillo de Entre Ríos que armó el Ejército Grande y derribó a Rosas.",
    kicker: "Crónica N.º 28 · Organización Nacional",
    periodo: "1851 — 1852",
    duracion: "7 minutos",
    descripcion:
      "Justo José de Urquiza: el Pacto de Palermo, el Ejército Grande y la caída del rosismo.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "justo-jose-de-urquiza", etiqueta: "La ficha de Urquiza" },
    visual: { varianteHero: "rio-plata", imagenHero: "urquiza-retrato" },
  },
  {
    slug: "castelli",
    titulo: "Castelli",
    subtitulo:
      "El orador que llevó la revolución de Mayo al Alto Perú.",
    kicker: "Exclusiva Mecenas · Crónica N.º 31",
    periodo: "1810 — 1811",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva de Juan José Castelli: la revolución del norte, Cochabamba y la caída del tribuno.",
    publicada: "2026-07-11",
    acceso: "mecenas",
    protagonista: { slug: "juan-jose-castelli", etiqueta: "La ficha de Castelli" },
    visual: { varianteHero: "jujuy", imagenHero: "castelli-retrato" },
  },
  {
    slug: "guemes",
    titulo: "Güemes",
    subtitulo:
      "El caudillo gaucho que defendió Salta durante seis años de guerra irregular.",
    kicker: "Exclusiva Mecenas · Crónica N.º 32",
    periodo: "1815 — 1821",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva de Martín Miguel de Güemes: montoneras, frontera norte y el escudo de la revolución.",
    publicada: "2026-07-11",
    acceso: "mecenas",
    protagonista: { slug: "martin-miguel-de-guemes", etiqueta: "La ficha de Güemes" },
    visual: { varianteHero: "jujuy", imagenHero: "gaucha-guemes" },
  },
  {
    slug: "la-bandera",
    titulo: "La Bandera",
    subtitulo:
      "27 de febrero de 1812: Belgrano crea el celeste y blanco en Rosario.",
    kicker: "Crónica N.º 29 · La Independencia",
    periodo: "27 de febrero de 1812",
    duracion: "7 minutos",
    descripcion:
      "La crónica del nacimiento de la bandera argentina: Belgrano, Rosario y el gesto que desobedeció a Buenos Aires.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "manuel-belgrano", etiqueta: "La ficha de Belgrano" },
    visual: { varianteHero: "rio-plata", imagenHero: "bandera-belgrano" },
  },
  {
    slug: "saavedra",
    titulo: "Saavedra",
    subtitulo:
      "El coronel de granaderos que comandó las milicias del 25 de Mayo.",
    kicker: "Crónica N.º 30 · La Independencia",
    periodo: "Mayo — diciembre de 1810",
    duracion: "7 minutos",
    descripcion:
      "Cornelio Saavedra: milicias, Primera Junta y el militar sin el cual no hubo Revolución de Mayo.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "cornelio-saavedra", etiqueta: "La ficha de Saavedra" },
    visual: { varianteHero: "mayo", imagenHero: "saavedra-retrato" },
  },
  {
    slug: "la-convertibilidad",
    titulo: "La Convertibilidad",
    subtitulo:
      "1991 — 2001: un peso, un dólar, y el colapso que terminó en el corralito.",
    kicker: "Crónica N.º 31 · La Argentina contemporánea",
    periodo: "1991 — 2002",
    duracion: "7 minutos",
    descripcion:
      "La convertibilidad económica: estabilidad, consumo y la crisis que abrió camino al 2001.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "juan-domingo-peron", etiqueta: "La ficha de Perón" },
    visual: { varianteHero: "mayo", imagenHero: "crisis-2001-diagrama" },
  },
  {
    slug: "mariquita",
    titulo: "Mariquita",
    subtitulo:
      "La anfitriona de la patria: el salón donde se conspiró la revolución.",
    kicker: "Exclusiva Mecenas · Crónica N.º 33",
    periodo: "1786 — 1868",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva de Mariquita Sánchez: tertulias, himno y la voz femenina de la Independencia.",
    publicada: "2026-07-11",
    acceso: "mecenas",
    protagonista: { slug: "mariquita-sanchez-de-thompson", etiqueta: "La ficha de Mariquita" },
    visual: { varianteHero: "mayo", imagenHero: "mariquita-retrato" },
  },
  {
    slug: "liniers",
    titulo: "Liniers",
    subtitulo:
      "El héroe de la Reconquista que terminó fusilado por la Revolución.",
    kicker: "Exclusiva Mecenas · Crónica N.º 34",
    periodo: "1806 — 1810",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva de Santiago de Liniers: Reconquista, virreinato y la paradoja de Mayo.",
    publicada: "2026-07-11",
    acceso: "mecenas",
    protagonista: { slug: "santiago-de-liniers", etiqueta: "La ficha de Liniers" },
    visual: { varianteHero: "rio-plata", imagenHero: "liniers-retrato" },
  },
  {
    slug: "sarmiento",
    titulo: "Sarmiento",
    subtitulo:
      "El maestro de América: educación, Facundo y la nación que quiso construir.",
    kicker: "Crónica N.º 32 · Organización Nacional",
    periodo: "1811 — 1888",
    duracion: "7 minutos",
    descripcion:
      "Domingo Faustino Sarmiento: el escritor del Facundo, el presidente de las escuelas y el Día del Maestro.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "domingo-faustino-sarmiento", etiqueta: "La ficha de Sarmiento" },
    visual: { varianteHero: "pampa", imagenHero: "sarmiento-retrato" },
  },
  {
    slug: "yrigoyen",
    titulo: "Yrigoyen",
    subtitulo:
      "El primer presidente elegido por voto popular y el primer golpe de Estado.",
    kicker: "Crónica N.º 33 · La Argentina democrática",
    periodo: "1916 — 1930",
    duracion: "7 minutos",
    descripcion:
      "Hipólito Yrigoyen: radicalismo, YPF, el plebiscito de 1928 y la caída del 6 de septiembre.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "hipolito-yrigoyen", etiqueta: "La ficha de Yrigoyen" },
    visual: { varianteHero: "mayo", imagenHero: "yrigoyen-nac" },
  },
  {
    slug: "paraguay",
    titulo: "La Guerra del Paraguay",
    subtitulo:
      "1865 — 1870: la Triple Alianza y la campaña más sangrienta del continente.",
    kicker: "Crónica N.º 34 · Organización Nacional",
    periodo: "1865 — 1870",
    duracion: "7 minutos",
    descripcion:
      "La guerra del Paraguay: Mitre, la Triple Alianza y la herida que marcó la Argentina moderna.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "bartolome-mitre", etiqueta: "La ficha de Mitre" },
    visual: { varianteHero: "pampa", imagenHero: "paraguay-tuyuti" },
  },
  {
    slug: "roca",
    titulo: "Roca",
    subtitulo:
      "El Zorro: dos presidencias, paz y administración, y el Estado moderno.",
    kicker: "Crónica N.º 35 · Organización Nacional",
    periodo: "1843 — 1914",
    duracion: "7 minutos",
    descripcion:
      "Julio Argentino Roca: Conquista del Desierto, federalización y el granero del mundo.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "julio-argentino-roca", etiqueta: "La ficha de Roca" },
    visual: { varianteHero: "pampa", imagenHero: "roca-retrato" },
  },
  {
    slug: "belgrano",
    titulo: "Belgrano",
    subtitulo:
      "El general que no quiso ser militar: bandera, norte y desobediencia.",
    kicker: "Crónica N.º 36 · La Independencia",
    periodo: "1770 — 1820",
    duracion: "7 minutos",
    descripcion:
      "Manuel Belgrano: economista, creador de la bandera y comandante del Ejército del Norte.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "manuel-belgrano", etiqueta: "La ficha de Belgrano" },
    visual: { varianteHero: "jujuy", imagenHero: "belgrano-retrato" },
  },
  {
    slug: "huaqui",
    titulo: "Huaqui",
    subtitulo:
      "20 de agosto de 1811: la derrota que obligó a la revolución a cambiar de rumbo.",
    kicker: "Crónica N.º 37 · La Independencia",
    periodo: "20 de agosto de 1811",
    duracion: "7 minutos",
    descripcion:
      "La batalla de Huaqui: el cementerio del Alto Perú y el giro hacia el plan continental.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "manuel-belgrano", etiqueta: "La ficha de Belgrano" },
    visual: { varianteHero: "jujuy", imagenHero: "jujuy-quebrada" },
  },
  {
    slug: "peron",
    titulo: "Perón",
    subtitulo:
      "Del coronel de 1943 al movimiento que definió el siglo XX argentino.",
    kicker: "Exclusiva Mecenas · Crónica N.º 35",
    periodo: "1943 — 1974",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva de Juan Domingo Perón: el 17 de Octubre, tres presidencias y el movimiento que no terminó.",
    publicada: "2026-07-11",
    acceso: "mecenas",
    protagonista: { slug: "juan-domingo-peron", etiqueta: "La ficha de Perón" },
    visual: { varianteHero: "mayo", imagenHero: "octubre-peron" },
  },
  {
    slug: "alfonsin",
    titulo: "Alfonsín",
    subtitulo:
      "El presidente que devolvió la democracia y sentó a los militares en el banquillo.",
    kicker: "Exclusiva Mecenas · Crónica N.º 36",
    periodo: "1983 — 1989",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva de Raúl Alfonsín: transición, Nunca Más y el juicio a las juntas.",
    publicada: "2026-07-11",
    acceso: "mecenas",
    protagonista: { slug: "raul-alfonsin", etiqueta: "La ficha de Alfonsín" },
    visual: { varianteHero: "mayo", imagenHero: "transicion-alfonsin" },
  },
  {
    slug: "el-43",
    titulo: "El 43",
    subtitulo:
      "4 de junio de 1943: el golpe que abrió la Argentina contemporánea.",
    kicker: "Crónica N.º 38 · La Argentina contemporánea",
    periodo: "4 de junio de 1943",
    duracion: "7 minutos",
    descripcion:
      "La Revolución del 43: Perón, la Secretaría de Trabajo y el inicio del siglo XX argentino.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "juan-domingo-peron", etiqueta: "La ficha de Perón" },
    visual: { varianteHero: "mayo", imagenHero: "peron-farrell" },
  },
  {
    slug: "voto-femenino",
    titulo: "El Voto Femenino",
    subtitulo:
      "23 de septiembre de 1947: millones de mujeres entran a la política.",
    kicker: "Crónica N.º 39 · La Argentina contemporánea",
    periodo: "23 de septiembre de 1947",
    duracion: "7 minutos",
    descripcion:
      "La ley de voto femenino: Evita, el sufragio y la puerta que no se cerró.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "eva-peron", etiqueta: "La ficha de Evita" },
    visual: { varianteHero: "mayo", imagenHero: "evita-voto" },
  },
  {
    slug: "menem",
    titulo: "Menem",
    subtitulo:
      "1989 — 1999: el peronismo que privatizó y abrió camino al 2001.",
    kicker: "Crónica N.º 40 · La Argentina contemporánea",
    periodo: "1989 — 1999",
    duracion: "7 minutos",
    descripcion:
      "Carlos Menem: hiperinflación, convertibilidad, consumo y el puente hacia la crisis del 2001.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "juan-domingo-peron", etiqueta: "La ficha de Perón" },
    visual: { varianteHero: "mayo", imagenHero: "menem-1989" },
  },
  {
    slug: "ongania",
    titulo: "Onganía",
    subtitulo:
      "28 de junio de 1966: la Revolución Argentina y el autoritarismo moderno.",
    kicker: "Exclusiva Mecenas · Crónica N.º 37",
    periodo: "1966 — 1970",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva del golpe de 1966: Onganía, Illia derrocado y el camino al Proceso.",
    publicada: "2026-07-11",
    acceso: "mecenas",
    protagonista: { slug: "juan-domingo-peron", etiqueta: "La ficha de Perón" },
    visual: { varianteHero: "mayo", imagenHero: "ongania-retrato" },
  },
  {
    slug: "hiperinflacion",
    titulo: "La Hiperinflación",
    subtitulo:
      "1989: el Rodrigazo, la entrega anticipada de Alfonsín y el puente a Menem.",
    kicker: "Exclusiva Mecenas · Crónica N.º 38",
    periodo: "1989 — 1990",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva de la hiperinflación: el colapso económico que abrió la década de 1990.",
    publicada: "2026-07-11",
    acceso: "mecenas",
    protagonista: { slug: "raul-alfonsin", etiqueta: "La ficha de Alfonsín" },
    visual: { varianteHero: "mayo", imagenHero: "hiperinflacion-grafico" },
  },
  {
    slug: "el-retorno",
    titulo: "El Retorno",
    subtitulo:
      "1973: Perón vuelve al país después de 18 años de proscripción.",
    kicker: "Crónica N.º 41 · La Argentina contemporánea",
    periodo: "1972 — 1974",
    duracion: "7 minutos",
    descripcion:
      "El regreso de Perón en 1973: victoria electoral, fractura interna y la puerta al golpe de 1976.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "juan-domingo-peron", etiqueta: "La ficha de Perón" },
    visual: { varianteHero: "mayo", imagenHero: "peron-1973" },
  },
  {
    slug: "las-madres",
    titulo: "Las Madres",
    subtitulo:
      "30 de abril de 1977: el pañuelo blanco contra el terror de Estado.",
    kicker: "Crónica N.º 42 · La Argentina contemporánea",
    periodo: "1977 — 1983",
    duracion: "7 minutos",
    descripcion:
      "Las Madres de Plaza de Mayo: la resistencia civil que no dejó olvidar a los desaparecidos.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "raul-alfonsin", etiqueta: "La ficha de Alfonsín" },
    visual: { varianteHero: "mayo", imagenHero: "azucena-villaflor" },
  },
  {
    slug: "kirchner",
    titulo: "Kirchner",
    subtitulo:
      "2003 — 2010: el peronismo que salió del colapso del 2001.",
    kicker: "Crónica N.º 43 · La Argentina contemporánea",
    periodo: "2003 — 2010",
    duracion: "7 minutos",
    descripcion:
      "Néstor Kirchner: reactivación económica, memoria y el modelo que definió el siglo XXI.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "juan-domingo-peron", etiqueta: "La ficha de Perón" },
    visual: { varianteHero: "mayo", imagenHero: "kirchner-retrato" },
  },
  {
    slug: "el-proceso",
    titulo: "El Proceso",
    subtitulo:
      "24 de marzo de 1976: el golpe que instaló la última dictadura.",
    kicker: "Exclusiva Mecenas · Crónica N.º 39",
    periodo: "24 de marzo de 1976",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva del Proceso de Reorganización Nacional: el terror de Estado que marcó una generación.",
    publicada: "2026-07-11",
    acceso: "mecenas",
    protagonista: { slug: "raul-alfonsin", etiqueta: "La ficha de Alfonsín" },
    visual: { varianteHero: "mayo", imagenHero: "junta-1976" },
  },
  {
    slug: "montoneros",
    titulo: "Montoneros",
    subtitulo:
      "La guerrilla peronista que fracturó los setenta y alimentó el horror.",
    kicker: "Exclusiva Mecenas · Crónica N.º 40",
    periodo: "1970 — 1976",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva de Montoneros: violencia política, idealismo y el camino al Proceso.",
    publicada: "2026-07-11",
    acceso: "mecenas",
    protagonista: { slug: "juan-domingo-peron", etiqueta: "La ficha de Perón" },
    visual: { varianteHero: "mayo", imagenHero: "montoneros-captura" },
  },
  {
    slug: "frondizi",
    titulo: "Frondizi",
    subtitulo:
      "1958 — 1962: desarrollismo, petróleo y el peronismo que votó sin Perón.",
    kicker: "Crónica N.º 44 · La Argentina contemporánea",
    periodo: "1958 — 1962",
    duracion: "7 minutos",
    descripcion:
      "Arturo Frondizi y el desarrollismo: industria, contratos petroleros y el golpe que lo interrumpió.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "juan-domingo-peron", etiqueta: "La ficha de Perón" },
    visual: { varianteHero: "mayo", imagenHero: "frondizi-retrato" },
  },
  {
    slug: "illia",
    titulo: "Illia",
    subtitulo:
      "1963 — 1966: la democracia radical entre Frondizi y Onganía.",
    kicker: "Crónica N.º 45 · La Argentina contemporánea",
    periodo: "1963 — 1966",
    duracion: "7 minutos",
    descripcion:
      "Arturo Illia: austeridad, ley de petróleo y el gobierno civil que terminó en el golpe de 1966.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "hipolito-yrigoyen", etiqueta: "La ficha de Yrigoyen" },
    visual: { varianteHero: "mayo", imagenHero: "illia-retrato" },
  },
  {
    slug: "cristina",
    titulo: "Cristina",
    subtitulo:
      "2007 — 2015: la continuidad del kirchnerismo y la Argentina polarizada.",
    kicker: "Crónica N.º 46 · La Argentina contemporánea",
    periodo: "2007 — 2015",
    duracion: "7 minutos",
    descripcion:
      "Cristina Fernández de Kirchner: el ciclo K en su etapa más disputada y más electoralmente fuerte.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "juan-domingo-peron", etiqueta: "La ficha de Perón" },
    visual: { varianteHero: "mayo", imagenHero: "cristina-retrato" },
  },
  {
    slug: "triple-a",
    titulo: "La Triple A",
    subtitulo:
      "1973 — 1975: López Rega y el terror parapolicial del tercer peronismo.",
    kicker: "Exclusiva Mecenas · Crónica N.º 41",
    periodo: "1973 — 1975",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva de la Triple A: la Alianza Anticomunista Argentina y la violencia antes del Proceso.",
    publicada: "2026-07-11",
    acceso: "mecenas",
    protagonista: { slug: "juan-domingo-peron", etiqueta: "La ficha de Perón" },
    visual: { varianteHero: "mayo", imagenHero: "lopez-rega" },
  },
  {
    slug: "isabel",
    titulo: "Isabel",
    subtitulo:
      "1974 — 1976: la primera mujer presidenta y el camino al último golpe.",
    kicker: "Exclusiva Mecenas · Crónica N.º 42",
    periodo: "1974 — 1976",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva de María Estela Martínez de Perón: fragilidad, caos y la puerta al 24 de marzo.",
    publicada: "2026-07-11",
    acceso: "mecenas",
    protagonista: { slug: "juan-domingo-peron", etiqueta: "La ficha de Perón" },
    visual: { varianteHero: "mayo", imagenHero: "isabel-retrato" },
  },
  {
    slug: "macri",
    titulo: "Macri",
    subtitulo:
      "2015 — 2019: Cambiemos, apertura y el fin del ciclo kirchnerista.",
    kicker: "Crónica N.º 47 · La Argentina contemporánea",
    periodo: "2015 — 2019",
    duracion: "7 minutos",
    descripcion:
      "Mauricio Macri y Cambiemos: el cambio político que terminó doce años de kirchnerismo.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "juan-domingo-peron", etiqueta: "La ficha de Perón" },
    visual: { varianteHero: "mayo", imagenHero: "macri-retrato" },
  },
  {
    slug: "elecciones-83",
    titulo: "Las Elecciones de 1983",
    subtitulo:
      "30 de octubre de 1983: la urna que cerró la última dictadura.",
    kicker: "Crónica N.º 48 · La Argentina contemporánea",
    periodo: "30 de octubre de 1983",
    duracion: "7 minutos",
    descripcion:
      "Las elecciones que restauraron la democracia: Alfonsín, el voto masivo y el fin de siete años de terror.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "raul-alfonsin", etiqueta: "La ficha de Alfonsín" },
    visual: { varianteHero: "mayo", imagenHero: "elecciones-83-campana" },
  },
  {
    slug: "de-la-rua",
    titulo: "De la Rúa",
    subtitulo:
      "1999 — 2001: la Alianza, la convertibilidad heredada y la renuncia.",
    kicker: "Crónica N.º 49 · La Argentina contemporánea",
    periodo: "1999 — 2001",
    duracion: "7 minutos",
    descripcion:
      "Fernando de la Rúa: el radical que no pudo sostener el modelo y abrió la puerta al colapso del 2001.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "raul-alfonsin", etiqueta: "La ficha de Alfonsín" },
    visual: { varianteHero: "mayo", imagenHero: "delarua-retrato" },
  },
  {
    slug: "juicio-a-las-juntas",
    titulo: "El Juicio a las Juntas",
    subtitulo:
      "22 de abril de 1985: los dictadores en el banquillo civil.",
    kicker: "Exclusiva Mecenas · Crónica N.º 43",
    periodo: "1985",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva del Juicio a las Juntas: el precedente mundial de justicia contra el terror de Estado.",
    publicada: "2026-07-11",
    acceso: "mecenas",
    protagonista: { slug: "raul-alfonsin", etiqueta: "La ficha de Alfonsín" },
    visual: { varianteHero: "mayo", imagenHero: "juicio-juntas" },
  },
  {
    slug: "galtieri",
    titulo: "Galtieri",
    subtitulo:
      "1981 — 1982: el dictador que apostó a Malvinas y perdió todo.",
    kicker: "Exclusiva Mecenas · Crónica N.º 44",
    periodo: "1981 — 1982",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva de Leopoldo Galtieri: la apuesta de Malvinas y el fin acelerado del Proceso.",
    publicada: "2026-07-11",
    acceso: "mecenas",
    protagonista: { slug: "raul-alfonsin", etiqueta: "La ficha de Alfonsín" },
    visual: { varianteHero: "atlantico", imagenHero: "galtieri-retrato" },
  },
  {
    slug: "alberto-fernandez",
    titulo: "Alberto Fernández",
    subtitulo:
      "2019 — 2023: Frente de Todos, pandemia y el retorno del peronismo.",
    kicker: "Crónica N.º 50 · La Argentina contemporánea",
    periodo: "2019 — 2023",
    duracion: "7 minutos",
    descripcion:
      "Alberto Fernández: el peronismo que volvió en 2019 y dejó paso a una nueva ruptura política.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "juan-domingo-peron", etiqueta: "La ficha de Perón" },
    visual: { varianteHero: "mayo", imagenHero: "alberto-fernandez-retrato" },
  },
  {
    slug: "milei",
    titulo: "Milei",
    subtitulo:
      "2023 — hoy: La Libertad Avanza y la ruptura libertaria.",
    kicker: "Crónica N.º 51 · La Argentina contemporánea",
    periodo: "2023 — 2025",
    duracion: "7 minutos",
    descripcion:
      "Javier Milei: el balotaje de 2023 y el experimento político sin precedentes en la Argentina.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "juan-domingo-peron", etiqueta: "La ficha de Perón" },
    visual: { varianteHero: "mayo", imagenHero: "milei-retrato" },
  },
  {
    slug: "piqueteros",
    titulo: "Los Piqueteros",
    subtitulo:
      "2002 — 2015: la calle que nació del colapso del 2001.",
    kicker: "Crónica N.º 52 · La Argentina contemporánea",
    periodo: "2002 — 2015",
    duracion: "7 minutos",
    descripcion:
      "Los piqueteros: cortes de ruta, planes sociales y la protesta que transformó la política argentina.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "juan-domingo-peron", etiqueta: "La ficha de Perón" },
    visual: { varianteHero: "mayo", imagenHero: "piqueteros-marcha" },
  },
  {
    slug: "conadep",
    titulo: "La CONADEP",
    subtitulo:
      "1983 — 1984: Sábato, Nunca Más y la verdad sobre la dictadura.",
    kicker: "Exclusiva Mecenas · Crónica N.º 45",
    periodo: "1983 — 1984",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva de la CONADEP: el informe Nunca Más y la documentación del terror de Estado.",
    publicada: "2026-07-11",
    acceso: "mecenas",
    protagonista: { slug: "raul-alfonsin", etiqueta: "La ficha de Alfonsín" },
    visual: { varianteHero: "mayo", imagenHero: "conadep-sabato" },
  },
  {
    slug: "amia",
    titulo: "La AMIA",
    subtitulo:
      "18 de julio de 1994: el atentado que la democracia no resolvió.",
    kicker: "Exclusiva Mecenas · Crónica N.º 46",
    periodo: "18 de julio de 1994",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva del atentado a la AMIA: terror, impunidad y una herida que sigue abierta.",
    publicada: "2026-07-11",
    acceso: "mecenas",
    protagonista: { slug: "raul-alfonsin", etiqueta: "La ficha de Alfonsín" },
    visual: { varianteHero: "mayo", imagenHero: "amia-marcha" },
  },
  {
    slug: "fabricas-recuperadas",
    titulo: "Fábricas Recuperadas",
    subtitulo:
      "2002 — 2015: cooperativas, autogestión y la economía del post-2001.",
    kicker: "Crónica N.º 53 · La Argentina contemporánea",
    periodo: "2002 — 2015",
    duracion: "7 minutos",
    descripcion:
      "Las fábricas recuperadas: cuando los trabajadores ocuparon la producción después del colapso.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "juan-domingo-peron", etiqueta: "La ficha de Perón" },
    visual: { varianteHero: "mayo", imagenHero: "fabricas-recuperadas" },
  },
  {
    slug: "la-pandemia",
    titulo: "La Pandemia",
    subtitulo:
      "2020 — 2021: COVID-19, cuarentena y la Argentina aislada.",
    kicker: "Crónica N.º 54 · La Argentina contemporánea",
    periodo: "2020 — 2021",
    duracion: "7 minutos",
    descripcion:
      "La pandemia de COVID-19 en Argentina: cuarentena, vacunas y la prueba de un gobierno en crisis.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "juan-domingo-peron", etiqueta: "La ficha de Perón" },
    visual: { varianteHero: "mayo", imagenHero: "pandemia-cuarentena" },
  },
  {
    slug: "rodrigazo",
    titulo: "El Rodrigazo",
    subtitulo:
      "6 de junio de 1975: el ajuste que aceleró el caos de Isabel.",
    kicker: "Crónica N.º 55 · La Argentina contemporánea",
    periodo: "6 de junio de 1975",
    duracion: "7 minutos",
    descripcion:
      "El Rodrigazo de 1975: inflación, saqueos y el colapso económico que precedió al golpe de 1976.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "juan-domingo-peron", etiqueta: "La ficha de Perón" },
    visual: { varianteHero: "mayo", imagenHero: "rodrigazo-rodrigo" },
  },
  {
    slug: "walsh",
    titulo: "Walsh",
    subtitulo:
      "25 de marzo de 1977: la Carta abierta y el periodismo bajo dictadura.",
    kicker: "Exclusiva Mecenas · Crónica N.º 47",
    periodo: "25 de marzo de 1977",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva de Rodolfo Walsh: la Carta abierta a la Junta Militar y su secuestro en Tigre.",
    publicada: "2026-07-11",
    acceso: "mecenas",
    protagonista: { slug: "raul-alfonsin", etiqueta: "La ficha de Alfonsín" },
    visual: { varianteHero: "mayo", imagenHero: "walsh-retrato" },
  },
  {
    slug: "embajada",
    titulo: "La Embajada",
    subtitulo:
      "17 de marzo de 1992: el atentado que anticipó la AMIA.",
    kicker: "Exclusiva Mecenas · Crónica N.º 48",
    periodo: "17 de marzo de 1992",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva del atentado a la Embajada de Israel: terror e impunidad en democracia.",
    publicada: "2026-07-11",
    acceso: "mecenas",
    protagonista: { slug: "raul-alfonsin", etiqueta: "La ficha de Alfonsín" },
    visual: { varianteHero: "mayo", imagenHero: "embajada-memoria" },
  },
  {
    slug: "lanusse",
    titulo: "Lanusse",
    subtitulo:
      "1971 — 1973: el general que convocó elecciones y abrió el retorno de Perón.",
    kicker: "Crónica N.º 56 · La Argentina contemporánea",
    periodo: "1971 — 1973",
    duracion: "7 minutos",
    descripcion:
      "Alejandro Lanusse: de la Revolución Argentina a las urnas que devolvieron el peronismo.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "juan-domingo-peron", etiqueta: "La ficha de Perón" },
    visual: { varianteHero: "mayo", imagenHero: "lanusse-retrato" },
  },
  {
    slug: "el-default",
    titulo: "El Default",
    subtitulo:
      "23 de diciembre de 2001: la cesación de pagos más grande de la historia.",
    kicker: "Crónica N.º 57 · La Argentina contemporánea",
    periodo: "23 de diciembre de 2001",
    duracion: "7 minutos",
    descripcion:
      "El default soberano de 2001: corralito, cinco presidentes y el colapso del modelo convertibilidad.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "raul-alfonsin", etiqueta: "La ficha de Alfonsín" },
    visual: { varianteHero: "mayo", imagenHero: "crisis-2001-diagrama" },
  },
  {
    slug: "revolucion-del-parque",
    titulo: "La Revolución del Parque",
    subtitulo:
      "26 de julio de 1890: la ciudad se levanta contra el régimen de Celman.",
    kicker: "Crónica N.º 58 · La Argentina democrática",
    periodo: "26 de julio de 1890",
    duracion: "7 minutos",
    descripcion:
      "La Revolución del Parque: la primera gran protesta cívica y el origen del radicalismo argentino.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "hipolito-yrigoyen", etiqueta: "La ficha de Yrigoyen" },
    visual: { varianteHero: "mayo", imagenHero: "revolucion-parque" },
  },
  {
    slug: "erp",
    titulo: "El ERP",
    subtitulo:
      "La guerrilla marxista que eligió las armas en los setenta.",
    kicker: "Exclusiva Mecenas · Crónica N.º 49",
    periodo: "1970 — 1976",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva del ERP: Santucho, Operación Independencia y la escalada al Proceso.",
    publicada: "2026-07-11",
    acceso: "mecenas",
    protagonista: { slug: "juan-domingo-peron", etiqueta: "La ficha de Perón" },
    visual: { varianteHero: "mayo", imagenHero: "erp-bandera" },
  },
  {
    slug: "esma",
    titulo: "La ESMA",
    subtitulo:
      "Centro clandestino de detención: el horror en plena Ciudad de Buenos Aires.",
    kicker: "Exclusiva Mecenas · Crónica N.º 50",
    periodo: "1976 — 1983",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva de la ESMA: tortura, vuelos de la muerte y memoria que no cierra.",
    publicada: "2026-07-11",
    acceso: "mecenas",
    protagonista: { slug: "raul-alfonsin", etiqueta: "La ficha de Alfonsín" },
    visual: { varianteHero: "mayo", imagenHero: "esma-memoria" },
  },
  {
    slug: "levingston",
    titulo: "Levingston",
    subtitulo:
      "1970 — 1971: el general interino de la Revolución Argentina.",
    kicker: "Crónica N.º 59 · La Argentina contemporánea",
    periodo: "1970 — 1971",
    duracion: "7 minutos",
    descripcion:
      "Roberto Levingston: entre Onganía y Lanusse, el puente militar hacia las elecciones de 1973.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "juan-domingo-peron", etiqueta: "La ficha de Perón" },
    visual: { varianteHero: "mayo", imagenHero: "levingston-retrato" },
  },
  {
    slug: "campora",
    titulo: "Cámpora",
    subtitulo:
      "11 de marzo de 1973: Cámpora al gobierno, Perón a la presidencia.",
    kicker: "Crónica N.º 60 · La Argentina contemporánea",
    periodo: "Marzo — Julio de 1973",
    duracion: "7 minutos",
    descripcion:
      "Héctor Cámpora: el presidente que devolvió el peronismo a las urnas y abrió la puerta al retorno.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "juan-domingo-peron", etiqueta: "La ficha de Perón" },
    visual: { varianteHero: "mayo", imagenHero: "campora-1973" },
  },
  {
    slug: "celman",
    titulo: "Celman",
    subtitulo:
      "1886 — 1890: la Generación del Ochenta y el estallido del Parque.",
    kicker: "Crónica N.º 61 · La Argentina democrática",
    periodo: "1886 — 1890",
    duracion: "7 minutos",
    descripcion:
      "Miguel Juárez Celman: opulencia oligárquica, fraude y la revuelta que abrió el camino al radicalismo.",
    publicada: "2026-07-11",
    acceso: "publico",
    protagonista: { slug: "hipolito-yrigoyen", etiqueta: "La ficha de Yrigoyen" },
    visual: { varianteHero: "mayo", imagenHero: "celman-retrato" },
  },
  {
    slug: "videla",
    titulo: "Videla",
    subtitulo:
      "1976 — 1981: el general que encabezó el Proceso de Reorganización Nacional.",
    kicker: "Exclusiva Mecenas · Crónica N.º 51",
    periodo: "1976 — 1981",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva de Jorge Rafael Videla: el rostro del golpe y el terror de Estado.",
    publicada: "2026-07-11",
    acceso: "mecenas",
    protagonista: { slug: "raul-alfonsin", etiqueta: "La ficha de Alfonsín" },
    visual: { varianteHero: "mayo", imagenHero: "videla-retrato" },
  },
  {
    slug: "massera",
    titulo: "Massera",
    subtitulo:
      "1976 — 1978: el almirante de la ESMA y los vuelos de la muerte.",
    kicker: "Exclusiva Mecenas · Crónica N.º 52",
    periodo: "1976 — 1978",
    duracion: "7 minutos",
    descripcion:
      "Crónica exclusiva de Emilio Massera: la Armada, la Junta Militar y el horror de la ESMA.",
    publicada: "2026-07-11",
    acceso: "mecenas",
    protagonista: { slug: "raul-alfonsin", etiqueta: "La ficha de Alfonsín" },
    visual: { varianteHero: "mayo", imagenHero: "massera-retrato" },
  },
];

function enriquecerCronica(base: CronicaBase): CronicaMeta {
  const tax = taxonomiaPorSlug[base.slug];
  if (!tax) {
    throw new Error(`Falta taxonomía para crónica: ${base.slug}`);
  }
  return { ...base, ...tax };
}

export const cronicas: CronicaMeta[] = cronicasBase.map(enriquecerCronica);

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
  chacabuco: () => import("@/content/cronicas/chacabuco.mdx"),
  maipu: () => import("@/content/cronicas/maipu.mdx"),
  pavon: () => import("@/content/cronicas/pavon.mdx"),
  "la-revolucion-libertadora": () => import("@/content/cronicas/la-revolucion-libertadora.mdx"),
  "el-cordobazo": () => import("@/content/cronicas/el-cordobazo.mdx"),
  guayaquil: () => import("@/content/cronicas/guayaquil.mdx"),
  "el-facundo": () => import("@/content/cronicas/el-facundo.mdx"),
  "malvinas-ciudad": () => import("@/content/cronicas/malvinas-ciudad.mdx"),
  "la-conquista-del-desierto": () => import("@/content/cronicas/la-conquista-del-desierto.mdx"),
  rivadavia: () => import("@/content/cronicas/rivadavia.mdx"),
  junin: () => import("@/content/cronicas/junin.mdx"),
  moreno: () => import("@/content/cronicas/moreno.mdx"),
  "semana-tragica": () => import("@/content/cronicas/semana-tragica.mdx"),
  federalizacion: () => import("@/content/cronicas/federalizacion.mdx"),
  "el-2001": () => import("@/content/cronicas/el-2001.mdx"),
  ayacucho: () => import("@/content/cronicas/ayacucho.mdx"),
  dorrego: () => import("@/content/cronicas/dorrego.mdx"),
  rosas: () => import("@/content/cronicas/rosas.mdx"),
  mitre: () => import("@/content/cronicas/mitre.mdx"),
  "ley-saenz-pena": () => import("@/content/cronicas/ley-saenz-pena.mdx"),
  alberdi: () => import("@/content/cronicas/alberdi.mdx"),
  "patagonia-rebelde": () => import("@/content/cronicas/patagonia-rebelde.mdx"),
  ituzaingo: () => import("@/content/cronicas/ituzaingo.mdx"),
  "la-transicion": () => import("@/content/cronicas/la-transicion.mdx"),
  urquiza: () => import("@/content/cronicas/urquiza.mdx"),
  castelli: () => import("@/content/cronicas/castelli.mdx"),
  guemes: () => import("@/content/cronicas/guemes.mdx"),
  "la-bandera": () => import("@/content/cronicas/la-bandera.mdx"),
  saavedra: () => import("@/content/cronicas/saavedra.mdx"),
  "la-convertibilidad": () => import("@/content/cronicas/la-convertibilidad.mdx"),
  mariquita: () => import("@/content/cronicas/mariquita.mdx"),
  liniers: () => import("@/content/cronicas/liniers.mdx"),
  sarmiento: () => import("@/content/cronicas/sarmiento.mdx"),
  yrigoyen: () => import("@/content/cronicas/yrigoyen.mdx"),
  paraguay: () => import("@/content/cronicas/paraguay.mdx"),
  roca: () => import("@/content/cronicas/roca.mdx"),
  belgrano: () => import("@/content/cronicas/belgrano.mdx"),
  huaqui: () => import("@/content/cronicas/huaqui.mdx"),
  peron: () => import("@/content/cronicas/peron.mdx"),
  alfonsin: () => import("@/content/cronicas/alfonsin.mdx"),
  "el-43": () => import("@/content/cronicas/el-43.mdx"),
  "voto-femenino": () => import("@/content/cronicas/voto-femenino.mdx"),
  menem: () => import("@/content/cronicas/menem.mdx"),
  ongania: () => import("@/content/cronicas/ongania.mdx"),
  hiperinflacion: () => import("@/content/cronicas/hiperinflacion.mdx"),
  "el-retorno": () => import("@/content/cronicas/el-retorno.mdx"),
  "las-madres": () => import("@/content/cronicas/las-madres.mdx"),
  kirchner: () => import("@/content/cronicas/kirchner.mdx"),
  "el-proceso": () => import("@/content/cronicas/el-proceso.mdx"),
  montoneros: () => import("@/content/cronicas/montoneros.mdx"),
  frondizi: () => import("@/content/cronicas/frondizi.mdx"),
  illia: () => import("@/content/cronicas/illia.mdx"),
  cristina: () => import("@/content/cronicas/cristina.mdx"),
  "triple-a": () => import("@/content/cronicas/triple-a.mdx"),
  isabel: () => import("@/content/cronicas/isabel.mdx"),
  macri: () => import("@/content/cronicas/macri.mdx"),
  "elecciones-83": () => import("@/content/cronicas/elecciones-83.mdx"),
  "de-la-rua": () => import("@/content/cronicas/de-la-rua.mdx"),
  "juicio-a-las-juntas": () => import("@/content/cronicas/juicio-a-las-juntas.mdx"),
  galtieri: () => import("@/content/cronicas/galtieri.mdx"),
  "alberto-fernandez": () => import("@/content/cronicas/alberto-fernandez.mdx"),
  milei: () => import("@/content/cronicas/milei.mdx"),
  piqueteros: () => import("@/content/cronicas/piqueteros.mdx"),
  conadep: () => import("@/content/cronicas/conadep.mdx"),
  amia: () => import("@/content/cronicas/amia.mdx"),
  "fabricas-recuperadas": () => import("@/content/cronicas/fabricas-recuperadas.mdx"),
  "la-pandemia": () => import("@/content/cronicas/la-pandemia.mdx"),
  rodrigazo: () => import("@/content/cronicas/rodrigazo.mdx"),
  walsh: () => import("@/content/cronicas/walsh.mdx"),
  embajada: () => import("@/content/cronicas/embajada.mdx"),
  lanusse: () => import("@/content/cronicas/lanusse.mdx"),
  "el-default": () => import("@/content/cronicas/el-default.mdx"),
  "revolucion-del-parque": () => import("@/content/cronicas/revolucion-del-parque.mdx"),
  erp: () => import("@/content/cronicas/erp.mdx"),
  esma: () => import("@/content/cronicas/esma.mdx"),
  levingston: () => import("@/content/cronicas/levingston.mdx"),
  campora: () => import("@/content/cronicas/campora.mdx"),
  celman: () => import("@/content/cronicas/celman.mdx"),
  videla: () => import("@/content/cronicas/videla.mdx"),
  massera: () => import("@/content/cronicas/massera.mdx"),
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
