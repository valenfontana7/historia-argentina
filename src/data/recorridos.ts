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
      { tipo: "persona", slug: "mariano-moreno" },
      { tipo: "persona", slug: "manuel-belgrano" },
      { tipo: "evento", slug: "20-de-junio" },
      { tipo: "evento", slug: "9-de-julio" },
      { tipo: "persona", slug: "jose-de-san-martin" },
      { tipo: "cronica", slug: "el-cruce-de-los-andes", puente: "El clímax: viví el cruce como crónica inmersiva." },
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
      { tipo: "persona", slug: "justo-jose-de-urquiza" },
      { tipo: "evento", slug: "11-de-septiembre", puente: "Caseros cambió el equilibrio de poder." },
      { tipo: "periodo", slug: "organizacion" },
      { tipo: "lugar", slug: "caseros" },
      { tipo: "persona", slug: "domingo-faustino-sarmiento" },
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
      { tipo: "persona", slug: "eva-peron" },
      { tipo: "evento", slug: "17-de-octubre" },
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
      { tipo: "evento", slug: "17-de-agosto" },
      { tipo: "evento", slug: "23-de-agosto" },
      { tipo: "evento", slug: "20-de-febrero" },
      { tipo: "evento", slug: "20-de-junio" },
      { tipo: "lugar", slug: "tucuman" },
    ],
  },
  {
    slug: "democracia-y-memoria",
    titulo: "Democracia y memoria",
    subtitulo:
      "Del golpe de 1976 a la transición de 1983: la herida y el retorno a la vida republicana.",
    duracion: "15 minutos",
    acceso: "mecenas",
    pasos: [
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
      { tipo: "cronica", slug: "el-cruce-de-los-andes" },
      { tipo: "evento", slug: "27-de-febrero" },
      { tipo: "lugar", slug: "yapeyu" },
      { tipo: "persona", slug: "martin-miguel-de-guemes" },
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
