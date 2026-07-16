import type { Epoca } from "@/components/ui/Retrato";
import { nombresEpocas } from "@/data/personajes";

export type Periodo = {
  slug: Epoca;
  nombre: string;
  anioInicio: number;
  anioFin: number | null;
  descripcion: string;
  narrativa: string[];
  eventosDestacados: string[];
};

export const periodos: Periodo[] = [
  {
    slug: "colonia",
    nombre: nombresEpocas.colonia,
    anioInicio: 1516,
    anioFin: 1810,
    descripcion:
      "Tres siglos bajo la corona española: fundaciones, misiones jesuíticas y la formación de una sociedad criolla.",
    narrativa: [
      "Argentina no nació en 1810: nació de siglos de frontera, comercio clandestino y mestizaje. El Virreinato del Río de la Plata fue, durante mucho tiempo, el rincón más pobre y más rebelde del imperio.",
      "Las ciudades del interior, los estancias del litoral y los pueblos de misiones construyeron una identidad propia mucho antes de que alguien pronunciara la palabra independencia.",
    ],
    eventosDestacados: [
      "1536: Primera fundación de Buenos Aires",
      "1776: Creación del Virreinato del Río de la Plata",
      "1806-1807: Invasiones Inglesas",
    ],
  },
  {
    slug: "independencia",
    nombre: nombresEpocas.independencia,
    anioInicio: 1810,
    anioFin: 1829,
    descripcion:
      "De la Revolución de Mayo a las guerras por liberar el continente: nace un país y se define su destino.",
    narrativa: [
      "Mayo de 1810 abrió una grieta irreversible con la metrópoli. Lo que siguió no fue un simple cambio de bandera sino una década de guerras civiles, constituciones fallidas y campañas libertadoras.",
      "San Martín cruzó los Andes, Belgrano izó la bandera y Moreno escribió con fuego. La independencia se conquistó en batalla y se discutió en salones.",
    ],
    eventosDestacados: [
      "1810: Revolución de Mayo",
      "1816: Declaración de la Independencia",
      "1817: Cruce de los Andes",
    ],
  },
  {
    slug: "organizacion",
    nombre: nombresEpocas.organizacion,
    anioInicio: 1829,
    anioFin: 1880,
    descripcion:
      "Unitarios y federales, caudillos y constituciones: la lucha por unir un territorio inmenso bajo una sola ley.",
    narrativa: [
      "Con la independencia ganada, la pregunta era otra: ¿cómo se gobierna semejante extensión? Rosas, Urquiza, Mitre y Sarmiento encarnaron respuestas opuestas.",
      "La Constitución de 1853, la batalla de Caseros y la federalización de Buenos Aires cerraron, a golpes, la etapa de anarquía.",
    ],
    eventosDestacados: [
      "1853: Constitución Nacional",
      "1852: Batalla de Caseros",
      "1880: Federalización de Buenos Aires",
    ],
  },
  {
    slug: "moderna",
    nombre: nombresEpocas.moderna,
    anioInicio: 1880,
    anioFin: 1943,
    descripcion:
      "La oligarquía exportadora, la inmigración masiva y la entrada de Argentina al siglo XX como potencia agrícola.",
    narrativa: [
      "El modelo agroexportador transformó el país en taller del mundo. Millones de inmigrantes llegaron a puertos que no paraban de crecer.",
      "La Generación del '80 construyó instituciones, ferrocarriles y una identidad nacional que mezclaba europeísmo y campaña.",
    ],
    eventosDestacados: [
      "1916: Primera presidencia de Yrigoyen",
      "1930: Primer golpe de Estado",
      "1943: Revolución del '43",
    ],
  },
  {
    slug: "contemporanea",
    nombre: nombresEpocas.contemporanea,
    anioInicio: 1943,
    anioFin: null,
    descripcion:
      "Peronismo, dictaduras, democracia recuperada y el Argentina del siglo XXI: un país en permanente reinvención.",
    narrativa: [
      "Desde el peronismo hasta la última dictadura, Argentina vivió el siglo XX con intensidad extrema: populismo, represión, retorno democrático y crisis económicas cíclicas.",
      "El 18 de julio de 1994, el 24 de marzo de 1976 y el 10 de diciembre de 1983 son fechas que marcan la memoria colectiva de millones.",
    ],
    eventosDestacados: [
      "1946: Primer gobierno de Perón",
      "1983: Retorno a la democracia",
      "2001: Crisis y estallido social",
    ],
  },
];

export function obtenerPeriodo(slug: string): Periodo | undefined {
  return periodos.find((p) => p.slug === slug);
}

export function periodoPorAnio(anio: number): Periodo | undefined {
  return periodos.find((p) => {
    const fin = p.anioFin ?? new Date().getFullYear();
    return anio >= p.anioInicio && anio <= fin;
  });
}
