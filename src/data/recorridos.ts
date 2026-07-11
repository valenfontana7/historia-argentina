import type { EntidadRef } from "@/lib/grafo/tipos";

export type AccesoRecorrido = "publico" | "mecenas";

export type PasoRecorrido = EntidadRef & {
  /** Texto breve que conecta este paso con el anterior. */
  puente?: string;
};

export type Recorrido = {
  slug: string;
  titulo: string;
  subtitulo: string;
  duracion: string;
  /** Por defecto `publico`. */
  acceso?: AccesoRecorrido;
  pasos: PasoRecorrido[];
};

export const recorridos: Recorrido[] = [
  {
    slug: "independencia-en-7-pasos",
    titulo: "La Independencia en 7 pasos",
    subtitulo:
      "De la Revolución de Mayo al cruce de los Andes: el arco que transformó un virreinato en nación.",
    duracion: "25 minutos",
    pasos: [
      { tipo: "evento", slug: "25-de-mayo", puente: "Empezá donde todo se abrió." },
      { tipo: "cronica", slug: "saavedra", puente: "Las milicias que hicieron posible Mayo." },
      { tipo: "persona", slug: "mariano-moreno" },
      { tipo: "cronica", slug: "mariquita", puente: "El salón donde se conspiró la revolución." },
      { tipo: "cronica", slug: "castelli", puente: "La revolución sale hacia el Alto Perú." },
      { tipo: "persona", slug: "manuel-belgrano" },
      { tipo: "evento", slug: "20-de-junio" },
      { tipo: "evento", slug: "9-de-julio" },
      {
        tipo: "cronica",
        slug: "el-9-de-julio",
        puente: "Viví el Congreso de Tucumán como crónica inmersiva.",
      },
      { tipo: "persona", slug: "jose-de-san-martin" },
      { tipo: "cronica", slug: "el-cruce-de-los-andes", puente: "El clímax: viví el cruce como crónica inmersiva." },
      { tipo: "cronica", slug: "rivadavia", puente: "Antes del federalismo: el unitarismo que el interior rechazó." },
    ],
  },
  {
    slug: "rosas-y-la-confederacion",
    titulo: "Rosas y la Confederación",
    subtitulo:
      "Unitarios y federales, sangre en la calle y un país que no lograba ponerse de acuerdo.",
    duracion: "20 minutos",
    pasos: [
      { tipo: "persona", slug: "juan-manuel-de-rosas" },
      {
        tipo: "cronica",
        slug: "dorrego",
        puente: "El mártir federal que abrió la era rosista.",
      },
      {
        tipo: "cronica",
        slug: "rosas",
        puente: "Veinte años de machete rojo: el poder absoluto en Buenos Aires.",
      },
      {
        tipo: "cronica",
        slug: "ituzaingo",
        puente: "El joven Rosas en la guerra con Brasil.",
      },
      {
        tipo: "cronica",
        slug: "barranca-yaco",
        puente: "Antes del rosismo: el crimen que mató a Facundo.",
      },
      {
        tipo: "cronica",
        slug: "el-facundo",
        puente: "Sarmiento convierte esa muerte en el libro que inventó la Argentina.",
      },
      { tipo: "persona", slug: "justo-jose-de-urquiza" },
      {
        tipo: "cronica",
        slug: "urquiza",
        puente: "El Ejército Grande que derribó a Rosas.",
      },
      {
        tipo: "cronica",
        slug: "la-vuelta-de-obligado",
        puente: "La soberanía en el Paraná, antes de la caída.",
      },
      {
        tipo: "cronica",
        slug: "caseros",
        puente: "El 3 de febrero que quebró el orden rosista.",
      },
      {
        tipo: "cronica",
        slug: "la-constitucion-de-1853",
        puente: "La carta magna que ordenó la Confederación.",
      },
      {
        tipo: "cronica",
        slug: "alberdi",
        puente: "El pensador que escribió la Constitución desde el exilio.",
      },
      { tipo: "persona", slug: "bartolome-mitre" },
      {
        tipo: "cronica",
        slug: "pavon",
        puente: "La batalla que unificó la Nación.",
      },
      {
        tipo: "cronica",
        slug: "mitre",
        puente: "Del campo de batalla a la guerra del Paraguay.",
      },
      {
        tipo: "cronica",
        slug: "paraguay",
        puente: "La Triple Alianza: la guerra más sangrienta del continente.",
      },
      { tipo: "evento", slug: "11-de-septiembre", puente: "Después de Caseros, el mapa político se rearmó." },
      { tipo: "periodo", slug: "organizacion" },
      { tipo: "lugar", slug: "caseros" },
      { tipo: "persona", slug: "domingo-faustino-sarmiento" },
      { tipo: "cronica", slug: "sarmiento", puente: "El maestro de América y el legado de las escuelas." },
    ],
  },
  {
    slug: "las-invasiones-inglesas",
    titulo: "Las Invasiones Inglesas",
    subtitulo:
      "Dos veces el imperio más poderoso del mundo desembarcó en Buenos Aires. Dos veces fue expulsado.",
    duracion: "30 minutos",
    pasos: [
      { tipo: "cronica", slug: "la-ciudad-que-vencio-a-un-imperio", puente: "La crónica completa, contada con scroll." },
      { tipo: "cronica", slug: "liniers", puente: "El héroe de la Reconquista y su paradoja con Mayo." },
      { tipo: "persona", slug: "santiago-de-liniers" },
      { tipo: "lugar", slug: "buenos-aires" },
      { tipo: "evento", slug: "2-de-abril" },
      { tipo: "persona", slug: "manuel-belgrano" },
    ],
  },
  {
    slug: "el-peronismo-en-5-voces",
    titulo: "El peronismo en 5 voces",
    subtitulo:
      "De la Plaza de Mayo al 17 de Octubre: cómo una fuerza de masas redefinió la Argentina del siglo XX.",
    duracion: "18 minutos",
    pasos: [
      { tipo: "persona", slug: "juan-domingo-peron" },
      {
        tipo: "cronica",
        slug: "peron",
        puente: "El coronel que leyó el país y fundó un movimiento.",
      },
      { tipo: "cronica", slug: "el-43", puente: "1943: el golpe que abrió la Argentina contemporánea." },
      { tipo: "persona", slug: "eva-peron" },
      { tipo: "evento", slug: "17-de-octubre" },
      {
        tipo: "cronica",
        slug: "el-17-de-octubre",
        puente: "La Plaza llena, contada como crónica.",
      },
      {
        tipo: "cronica",
        slug: "evita",
        puente: "Evita: del voto femenino al Cabildo Abierto.",
      },
      { tipo: "cronica", slug: "voto-femenino", puente: "1947: millones de mujeres entran a votar." },
      {
        tipo: "cronica",
        slug: "la-revolucion-libertadora",
        puente: "El golpe que proscribió al peronismo por 18 años.",
      },
      { tipo: "cronica", slug: "frondizi", puente: "1958: desarrollismo, petróleo y el voto peronista sin Perón." },
      { tipo: "cronica", slug: "illia", puente: "1963: la democracia radical que terminó en el golpe de 1966." },
      { tipo: "cronica", slug: "ongania", puente: "1966: otro golpe, otro uniforme en el poder." },
      { tipo: "cronica", slug: "levingston", puente: "1970: Levingston, el general interino hacia las urnas." },
      { tipo: "cronica", slug: "lanusse", puente: "1971: Lanusse convoca elecciones y abre el retorno." },
      { tipo: "cronica", slug: "campora", puente: "1973: Cámpora al gobierno, Perón a la presidencia." },
      { tipo: "cronica", slug: "el-retorno", puente: "1973: Perón vuelve después de 18 años de proscripción." },
      {
        tipo: "cronica",
        slug: "la-convertibilidad",
        puente: "Del 1 a 1 al corralito: la economía que precedió al 2001.",
      },
      { tipo: "cronica", slug: "menem", puente: "Los noventa: el peronismo que privatizó y consumió." },
      { tipo: "cronica", slug: "de-la-rua", puente: "1999: la Alianza y el puente hacia el 2001." },
      { tipo: "cronica", slug: "piqueteros", puente: "2002: la protesta que nació del colapso." },
      { tipo: "cronica", slug: "fabricas-recuperadas", puente: "Cooperativas: autogestión después del 2001." },
      { tipo: "cronica", slug: "kirchner", puente: "2003: el peronismo que salió del corralito." },
      { tipo: "cronica", slug: "cristina", puente: "2007: la continuidad del kirchnerismo en la presidencia." },
      { tipo: "cronica", slug: "macri", puente: "2015: el cambio que terminó doce años de K." },
      { tipo: "cronica", slug: "alberto-fernandez", puente: "2019: Frente de Todos y el retorno peronista." },
      { tipo: "cronica", slug: "la-pandemia", puente: "2020: la Argentina bajo cuarentena." },
      { tipo: "cronica", slug: "milei", puente: "2023: La Libertad Avanza gana el balotaje." },
      { tipo: "evento", slug: "26-de-julio" },
      { tipo: "periodo", slug: "contemporanea" },
    ],
  },
  {
    slug: "belgrano-guerra-del-norte",
    titulo: "Belgrano y la guerra del Norte",
    subtitulo:
      "Éxodo, Tucumán, Salta y la bandera: el general que no quería ser militar.",
    duracion: "22 minutos",
    pasos: [
      { tipo: "persona", slug: "manuel-belgrano" },
      { tipo: "cronica", slug: "belgrano", puente: "El general que no quiso ser militar." },
      { tipo: "cronica", slug: "huaqui", puente: "La derrota que cambió el rumbo de la revolución." },
      { tipo: "cronica", slug: "la-bandera", puente: "El celeste y blanco nace en Rosario." },
      { tipo: "cronica", slug: "el-exodo-jujeno", puente: "La decisión más dura antes de Tucumán." },
      {
        tipo: "cronica",
        slug: "la-batalla-de-tucuman",
        puente: "Belgrano desobedece y gana en Tucumán.",
      },
      {
        tipo: "cronica",
        slug: "la-batalla-de-salta",
        puente: "La primera capitulación total española.",
      },
      { tipo: "evento", slug: "17-de-agosto" },
      { tipo: "evento", slug: "23-de-agosto" },
      { tipo: "evento", slug: "20-de-febrero" },
      { tipo: "evento", slug: "20-de-junio" },
      { tipo: "lugar", slug: "tucuman" },
      { tipo: "persona", slug: "martin-miguel-de-guemes" },
      { tipo: "cronica", slug: "guemes", puente: "El caudillo que defendió Salta seis años." },
      { tipo: "cronica", slug: "la-guerra-gaucha", puente: "El escudo gaucho del norte." },
    ],
  },
  {
    slug: "democracia-y-memoria",
    titulo: "Democracia y memoria",
    subtitulo:
      "Del golpe de 1976 al siglo XXI: memoria, urnas, crisis y el retorno a la vida republicana.",
    duracion: "22 minutos",
    acceso: "mecenas",
    pasos: [
      { tipo: "cronica", slug: "ongania", puente: "1966: el golpe que precedió a la violencia de los setenta." },
      { tipo: "cronica", slug: "el-cordobazo", puente: "La calle industrial que sacudió el autoritarismo." },
      { tipo: "cronica", slug: "levingston", puente: "1970: Levingston, el puente entre Onganía y Lanusse." },
      { tipo: "cronica", slug: "lanusse", puente: "1971: Lanusse convoca elecciones y abre el retorno." },
      { tipo: "cronica", slug: "campora", puente: "Marzo de 1973: el peronismo vuelve a ganar elecciones." },
      { tipo: "cronica", slug: "el-retorno", puente: "1973: Perón vuelve y la fractura se profundiza." },
      { tipo: "cronica", slug: "triple-a", puente: "López Rega y el terror parapolicial del retorno." },
      { tipo: "cronica", slug: "montoneros", puente: "La guerrilla que eligió las armas en los setenta." },
      { tipo: "cronica", slug: "erp", puente: "El ERP: la guerrilla marxista de la misma década." },
      { tipo: "cronica", slug: "isabel", puente: "1974: Isabel asume y el caos se acelera." },
      { tipo: "cronica", slug: "rodrigazo", puente: "1975: el ajuste que disparó la inflación y los saqueos." },
      { tipo: "cronica", slug: "el-proceso", puente: "24 de marzo de 1976: el golpe que instaló el terror." },
      { tipo: "cronica", slug: "videla", puente: "Videla: el rostro del Proceso de Reorganización Nacional." },
      { tipo: "cronica", slug: "massera", puente: "Massera: la Armada, la ESMA y los vuelos de la muerte." },
      { tipo: "cronica", slug: "esma", puente: "La ESMA: el centro clandestino en plena ciudad." },
      { tipo: "cronica", slug: "las-madres", puente: "1977: el pañuelo blanco contra el olvido." },
      { tipo: "cronica", slug: "walsh", puente: "1977: Rodolfo Walsh y la Carta abierta a la Junta." },
      { tipo: "cronica", slug: "nunca-mas", puente: "Del golpe al retorno: la crónica de la última dictadura." },
      { tipo: "cronica", slug: "galtieri", puente: "1982: la apuesta de Malvinas que precipitó el fin del régimen." },
      {
        tipo: "cronica",
        slug: "setenta-y-cuatro-dias",
        puente: "74 días que aceleraron el fin del Proceso.",
      },
      {
        tipo: "cronica",
        slug: "malvinas-ciudad",
        puente: "La guerra vista desde la Plaza de Mayo y cada barrio.",
      },
      { tipo: "cronica", slug: "elecciones-83", puente: "30 de octubre de 1983: la urna que cerró la dictadura." },
      {
        tipo: "cronica",
        slug: "la-transicion",
        puente: "10 de diciembre de 1983: la democracia vuelve a la Plaza de Mayo.",
      },
      {
        tipo: "cronica",
        slug: "alfonsin",
        puente: "Alfonsín: memoria, justicia y el gobierno que sostuvo la República.",
      },
      { tipo: "cronica", slug: "juicio-a-las-juntas", puente: "1985: los dictadores en el banquillo civil." },
      { tipo: "cronica", slug: "conadep", puente: "1984: Nunca Más documenta el horror de la dictadura." },
      {
        tipo: "cronica",
        slug: "hiperinflacion",
        puente: "1989: la hiperinflación que abrió la década de Menem.",
      },
      { tipo: "cronica", slug: "embajada", puente: "1992: el atentado que anticipó la herida de la AMIA." },
      { tipo: "cronica", slug: "amia", puente: "1994: el atentado que la democracia no resolvió." },
      { tipo: "cronica", slug: "de-la-rua", puente: "1999: la Alianza y el camino al colapso del 2001." },
      {
        tipo: "cronica",
        slug: "el-2001",
        puente: "La democracia bajo su peor estrés: el colapso de diciembre de 2001.",
      },
      { tipo: "cronica", slug: "el-default", puente: "23 de diciembre: el default que selló el colapso." },
      { tipo: "cronica", slug: "piqueteros", puente: "2002: la calle que nació del corralito." },
      { tipo: "cronica", slug: "fabricas-recuperadas", puente: "Cooperativas: la economía que ocupó la producción." },
      { tipo: "cronica", slug: "kirchner", puente: "2003: el peronismo que salió del corralito." },
      { tipo: "cronica", slug: "cristina", puente: "2007: el kirchnerismo en su etapa más disputada." },
      { tipo: "cronica", slug: "macri", puente: "2015: Cambiemos y el fin del ciclo K." },
      { tipo: "cronica", slug: "alberto-fernandez", puente: "2019: el peronismo vuelve con Frente de Todos." },
      { tipo: "cronica", slug: "la-pandemia", puente: "2020: COVID-19 y la cuarentena más larga del mundo." },
      { tipo: "cronica", slug: "milei", puente: "2023: la ruptura libertaria llega a la Rosada." },
      { tipo: "evento", slug: "24-de-marzo" },
      { tipo: "persona", slug: "raul-alfonsin" },
      { tipo: "evento", slug: "10-de-diciembre", puente: "El día que la democracia volvió a la Plaza de Mayo." },
      { tipo: "periodo", slug: "contemporanea" },
    ],
  },
  {
    slug: "san-martin-continental",
    titulo: "San Martín, estratega continental",
    subtitulo:
      "Del Regimiento de Granaderos a la entrevista de Guayaquil: el plan que liberó medio continente.",
    duracion: "28 minutos",
    acceso: "mecenas",
    pasos: [
      { tipo: "persona", slug: "jose-de-san-martin" },
      { tipo: "evento", slug: "3-de-febrero" },
      {
        tipo: "cronica",
        slug: "san-lorenzo",
        puente: "Quince minutos que lanzaron al Libertador.",
      },
      { tipo: "cronica", slug: "el-cruce-de-los-andes" },
      {
        tipo: "cronica",
        slug: "chacabuco",
        puente: "La victoria que validó el cruce.",
      },
      {
        tipo: "cronica",
        slug: "maipu",
        puente: "Chile libre: seis horas en los llanos.",
      },
      { tipo: "evento", slug: "5-de-abril" },
      { tipo: "lugar", slug: "maipu" },
      { tipo: "evento", slug: "27-de-febrero" },
      { tipo: "lugar", slug: "yapeyu" },
      { tipo: "persona", slug: "martin-miguel-de-guemes" },
      { tipo: "persona", slug: "juana-azurduy" },
      { tipo: "cronica", slug: "juana-azurduy", puente: "La otra guerra del Alto Perú." },
      {
        tipo: "cronica",
        slug: "junin",
        puente: "La última batalla de San Martín: sables en la meseta de Junín.",
      },
      {
        tipo: "cronica",
        slug: "ayacucho",
        puente: "El fin del imperio español en América.",
      },
      {
        tipo: "cronica",
        slug: "guayaquil",
        puente: "El cierre: la entrevista que terminó con el mando de San Martín.",
      },
    ],
  },
  {
    slug: "patagonia-y-el-estado",
    titulo: "Patagonia y el Estado",
    subtitulo:
      "De Rivadavia a Roca: cómo el siglo XIX dibujó el mapa que conocemos.",
    duracion: "14 minutos",
    acceso: "mecenas",
    pasos: [
      { tipo: "persona", slug: "bernardino-rivadavia" },
      { tipo: "cronica", slug: "rivadavia", puente: "El unitarismo que fracturó el país." },
      { tipo: "persona", slug: "julio-argentino-roca" },
      { tipo: "cronica", slug: "roca", puente: "El Zorro: dos presidencias que cerraron el siglo XIX." },
      {
        tipo: "cronica",
        slug: "la-conquista-del-desierto",
        puente: "La campaña que incorporó la Patagonia al mapa.",
      },
      {
        tipo: "cronica",
        slug: "federalizacion",
        puente: "1880: Buenos Aires se separa y nace la Capital Federal.",
      },
      { tipo: "periodo", slug: "organizacion" },
      { tipo: "lugar", slug: "buenos-aires" },
    ],
  },
  {
    slug: "argentina-democratica",
    titulo: "Argentina democrática",
    subtitulo:
      "Del sufragio universal al primer golpe: la inestabilidad que marcó el siglo XX.",
    duracion: "12 minutos",
    pasos: [
      {
        tipo: "cronica",
        slug: "celman",
        puente: "1886: la Generación del Ochenta y el modelo oligárquico.",
      },
      {
        tipo: "cronica",
        slug: "revolucion-del-parque",
        puente: "1890: la ciudad se levanta contra el régimen oligárquico.",
      },
      {
        tipo: "cronica",
        slug: "ley-saenz-pena",
        puente: "Empezá donde el voto secreto abrió la democracia.",
      },
      { tipo: "cronica", slug: "yrigoyen", puente: "El primer presidente elegido por voto popular." },
      { tipo: "persona", slug: "hipolito-yrigoyen", puente: "El radicalismo llega al poder en 1916." },
      {
        tipo: "cronica",
        slug: "semana-tragica",
        puente: "La huelga que dejó la democracia herida en 1919.",
      },
      {
        tipo: "cronica",
        slug: "patagonia-rebelde",
        puente: "La represión obrera en el sur: la otra herida de Yrigoyen.",
      },
      {
        tipo: "cronica",
        slug: "el-primer-golpe",
        puente: "El día que la democracia fue derribada.",
      },
      { tipo: "evento", slug: "6-de-septiembre" },
      { tipo: "persona", slug: "juan-domingo-peron" },
      {
        tipo: "cronica",
        slug: "el-17-de-octubre",
        puente: "De la inestabilidad nació el peronismo.",
      },
    ],
  },
];

export function obtenerRecorrido(slug: string): Recorrido | undefined {
  return recorridos.find((r) => r.slug === slug);
}

export function accesoDeRecorrido(recorrido: Recorrido): AccesoRecorrido {
  return recorrido.acceso ?? "publico";
}

export function esRecorridoMecenas(recorrido: Recorrido): boolean {
  return accesoDeRecorrido(recorrido) === "mecenas";
}
