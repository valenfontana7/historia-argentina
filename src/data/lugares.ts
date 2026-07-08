import type { Epoca } from "@/components/ui/Retrato";

export type Lugar = {
  slug: string;
  nombre: string;
  region: string;
  descripcion: string;
  narrativa: string[];
  periodo?: Epoca;
  lat?: number;
  lon?: number;
  /** Textos para matchear en campos de personajes (nacimiento/muerte) */
  aliases: string[];
  /** Slugs de personajes vinculados manualmente */
  personajes: string[];
  /** Días de efemérides (slug /hoy/[dia]) vinculados */
  eventos: string[];
};

export const lugares: Lugar[] = [
  {
    slug: "buenos-aires",
    nombre: "Buenos Aires",
    region: "Región Pampeana",
    descripcion:
      "Capital del país y escenario de casi todos los giros políticos de la historia argentina.",
    narrativa: [
      "Fundada dos veces, saqueada por ingleses y teatro de la Revolución de Mayo, Buenos Aires condensa la historia argentina en sus calles.",
      "Desde el Cabildo hasta la Casa Rosada, cada manzana del centro guarda un capítulo del relato nacional.",
    ],
    periodo: "independencia",
    lat: -34.604,
    lon: -58.382,
    aliases: ["Buenos Aires", "Buen Ayre", "Buenos Ayres"],
    personajes: [
      "manuel-belgrano",
      "mariano-moreno",
      "cornelio-saavedra",
      "juan-manuel-de-rosas",
      "domingo-faustino-sarmiento",
      "juan-domingo-peron",
      "eva-peron",
      "raul-alfonsin",
    ],
    eventos: ["25-de-mayo", "9-de-julio", "24-de-marzo", "10-de-diciembre"],
  },
  {
    slug: "yapeyu",
    nombre: "Yapeyú",
    region: "Corrientes",
    descripcion:
      "Pueblo misionero donde nació José de San Martín, en la frontera guaraní del Virreinato.",
    narrativa: [
      "En la lejanía del litoral norte, lejos de los centros de poder, nació el hombre que liberaría medio continente.",
      "Yapeyú hoy es un lugar de peregrinaje: la cuna del Libertador sigue siendo símbolo de que los héroes pueden nacer en cualquier rincón.",
    ],
    periodo: "independencia",
    lat: -27.485,
    lon: -56.818,
    aliases: ["Yapeyú", "Yapeyu"],
    personajes: ["jose-de-san-martin", "martin-miguel-de-guemes"],
    eventos: ["3-de-junio"],
  },
  {
    slug: "caseros",
    nombre: "Caseros",
    region: "Gran Buenos Aires",
    descripcion:
      "Campo de batalla donde Urquiza derrotó a Rosas en 1852, cerrando la era del rosismo.",
    narrativa: [
      "El 3 de febrero de 1852, el ejército del Entre Ríos y sus aliados aplastaron al dictador que había gobernado casi veinte años.",
      "Caseros abrió paso a la Constitución y a una nueva forma de entender la Nación.",
    ],
    periodo: "organizacion",
    lat: -34.603,
    lon: -58.563,
    aliases: ["Caseros"],
    personajes: ["juan-manuel-de-rosas", "justo-jose-de-urquiza"],
    eventos: ["3-de-febrero"],
  },
  {
    slug: "cabildo",
    nombre: "Cabildo de Buenos Aires",
    region: "Ciudad Autónoma de Buenos Aires",
    descripcion:
      "Edificio colonial donde se reunió el cabildo abierto del 22 de mayo de 1810.",
    narrativa: [
      "El Cabildo fue el escenario del primer acto público de la Revolución: ciudadanos y vecinos exigiendo saber qué pasaba con la corona española.",
      "Hoy es museo y símbolo del origen republicano del país.",
    ],
    periodo: "independencia",
    lat: -34.608,
    lon: -58.373,
    aliases: ["Cabildo"],
    personajes: ["cornelio-saavedra", "mariano-moreno", "juan-jose-castelli"],
    eventos: ["25-de-mayo"],
  },
  {
    slug: "cordillera-de-los-andes",
    nombre: "Cordillera de los Andes",
    region: "Frontera con Chile",
    descripcion:
      "Muralla natural que San Martín cruzó con más de cinco mil hombres en la operación militar más audaz de América.",
    narrativa: [
      "Más de cuatro mil metros de altura, frío extremo y rutas imposibles: los Andes eran la barrera entre la libertad y el poder realista en Lima.",
      "El cruce de enero de 1817 demostró que la geografía no era invencible para quien tenía un plan continental.",
    ],
    periodo: "independencia",
    aliases: ["Andes", "cordillera", "Uspallata"],
    personajes: ["jose-de-san-martin", "martin-miguel-de-guemes"],
    eventos: [],
  },
  {
    slug: "san-lorenzo",
    nombre: "San Lorenzo",
    region: "Santa Fe",
    descripcion:
      "Convento a orillas del Paraná donde San Martín debutó con los Granaderos a Caballo en 1813.",
    narrativa: [
      "Quince minutos de combate bastaron para demostrar que el Regimiento de Granaderos era una fuerza distinta.",
      "Allí murió el sargento Cabral, convertido en símbolo de lealtad y sacrificio.",
    ],
    periodo: "independencia",
    lat: -32.749,
    lon: -60.735,
    aliases: ["San Lorenzo", "San Carlos"],
    personajes: ["jose-de-san-martin"],
    eventos: ["3-de-febrero"],
  },
  {
    slug: "tucuman",
    nombre: "San Miguel de Tucumán",
    region: "Noroeste argentino",
    descripcion:
      "Ciudad donde el Congreso declaró la independencia el 9 de julio de 1816.",
    narrativa: [
      "Lejos de Buenos Aires, entre montañas y calor, los diputados de las provincias sellaron la ruptura definitiva con España.",
      "La Casa Histórica de Tucumán es uno de los templos de la memoria patria.",
    ],
    periodo: "independencia",
    lat: -26.808,
    lon: -65.217,
    aliases: ["Tucumán", "Tucuman"],
    personajes: ["manuel-belgrano"],
    eventos: ["9-de-julio"],
  },
  {
    slug: "rosario",
    nombre: "Rosario",
    region: "Santa Fe",
    descripcion:
      "Puerto del Paraná donde Belgrano izó por primera vez la bandera celeste y blanca en 1812.",
    narrativa: [
      "Rosario creció como contrapunto portuario a Buenos Aires. Allí, a orillas del río, nació el símbolo que hoy flamea en todo el país.",
      "La ciudad conecta la historia independentista con el Argentina industrial del siglo XX.",
    ],
    periodo: "independencia",
    lat: -32.947,
    lon: -60.639,
    aliases: ["Rosario"],
    personajes: ["manuel-belgrano", "mariano-moreno"],
    eventos: ["20-de-junio"],
  },
  {
    slug: "cordoba",
    nombre: "Córdoba",
    region: "Centro del país",
    descripcion:
      "Ciudad universitaria y bastión del interior durante las guerras de independencia y la organización nacional.",
    narrativa: [
      "La Universidad Nacional de Córdoba, la más antigua del país, convirtió a la ciudad en faro intelectual desde el siglo XVII.",
      "Durante las guerras civiles, Córdoba fue premio y campo de batalla de facciones opuestas.",
    ],
    periodo: "colonia",
    lat: -31.42,
    lon: -64.188,
    aliases: ["Córdoba", "Cordoba"],
    personajes: ["domingo-faustino-sarmiento"],
    eventos: [],
  },
  {
    slug: "rio-de-la-plata",
    nombre: "Río de la Plata",
    region: "Litoral",
    descripcion:
      "Estuario que dio nombre al virreinato y fue escenario de invasiones, bloqueos y comercio que forjó la identidad rioplatense.",
    narrativa: [
      "El Río de la Plata fue la puerta de entrada al continente: ingleses, españoles y criollos compitieron por controlar sus aguas.",
      "Sus orillas vieron caer un imperio y nacer una nación.",
    ],
    periodo: "independencia",
    aliases: ["Paraná", "Río de la Plata", "Riachuelo"],
    personajes: ["santiago-de-liniers", "jose-de-san-martin"],
    eventos: ["3-de-febrero"],
  },
  {
    slug: "mendoza",
    nombre: "Mendoza",
    region: "Cuyo",
    descripcion:
      "Ciudad cuyana desde donde San Martín preparó el cruce de los Andes y la liberación de Chile.",
    narrativa: [
      "Mendoza fue cuartel general del Ejército de los Andes: aquí se forjó la logística imposible de cruzar la cordillera en pleno verano austral.",
      "Hoy el Paso de Uspallata y la ciudad siguen siendo símbolos del plan continental.",
    ],
    periodo: "independencia",
    lat: -32.89,
    lon: -68.844,
    aliases: ["Mendoza", "Cuyo", "Uspallata"],
    personajes: ["jose-de-san-martin", "martin-miguel-de-guemes"],
    eventos: ["12-de-febrero"],
  },
  {
    slug: "salta",
    nombre: "Salta",
    region: "Noroeste argentino",
    descripcion:
      "Ciudad colonial y bastión del norte durante las guerras de independencia.",
    narrativa: [
      "Salta fue escenario de la Campaña del Norte de Belgrano y corazón del federalismo en el siglo XIX.",
      "Su arquitectura colonial conserva la memoria de un norte que sostuvo la revolución lejos del puerto.",
    ],
    periodo: "independencia",
    lat: -24.783,
    lon: -65.411,
    aliases: ["Salta"],
    personajes: ["manuel-belgrano", "martin-miguel-de-guemes", "juana-azurduy"],
    eventos: ["20-de-febrero"],
  },
  {
    slug: "san-salvador-de-jujuy",
    nombre: "San Salvador de Jujuy",
    region: "Jujuy",
    descripcion:
      "Ciudad del norte que Belgrano ordenó evacuar y quemar para no entregarla al enemigo en 1812.",
    narrativa: [
      "El Éxodo Jujeño es uno de los episodios más dramáticos de la independencia: miles de civiles cruzaron la montaña siguiendo al ejército.",
      "Jujuy recuerda cada 23 de agosto la hazaña que salvó la revolución en el norte.",
    ],
    periodo: "independencia",
    lat: -24.185,
    lon: -65.299,
    aliases: ["Jujuy", "San Salvador de Jujuy"],
    personajes: ["manuel-belgrano", "martin-miguel-de-guemes"],
    eventos: ["23-de-agosto"],
  },
  {
    slug: "maipu",
    nombre: "Maipú",
    region: "Chile (campo de batalla argentino)",
    descripcion:
      "Campo de batalla donde San Martín y O'Higgins sellaron la independencia de Chile en 1818.",
    narrativa: [
      "El 5 de abril de 1818, el Ejército de los Andes venció a las fuerzas realistas en Maipú, cerca de Santiago.",
      "Fue la confirmación de que el cruce de la cordillera no había sido una hazaña aislada sino el inicio de una campaña victoriosa.",
    ],
    periodo: "independencia",
    lat: -33.511,
    lon: -70.758,
    aliases: ["Maipú", "Maipu"],
    personajes: ["jose-de-san-martin"],
    eventos: ["5-de-abril"],
  },
  {
    slug: "puerto-argentino",
    nombre: "Puerto Argentino",
    region: "Islas Malvinas",
    descripcion:
      "Capital de las Malvinas, epicentro del conflicto de 1982 por la soberanía sobre el archipiélago.",
    narrativa: [
      "Las islas fueron ocupadas por Gran Bretaña desde 1833. En 1982, tropas argentinas recuperaron el territorio antes de la guerra que duró 74 días.",
      "Malvinas sigue siendo símbolo de soberanía y memoria colectiva en la Argentina contemporánea.",
    ],
    periodo: "contemporanea",
    lat: -51.693,
    lon: -57.879,
    aliases: ["Malvinas", "Puerto Argentino", "Stanley"],
    personajes: ["juan-domingo-peron", "raul-alfonsin"],
    eventos: ["2-de-abril", "6-de-octubre"],
  },
];

export function obtenerLugar(slug: string): Lugar | undefined {
  return lugares.find((l) => l.slug === slug);
}

export function lugaresPorTexto(texto: string): Lugar[] {
  const normalizado = texto.toLowerCase();
  return lugares.filter((l) =>
    l.aliases.some((alias) => normalizado.includes(alias.toLowerCase())),
  );
}

export function slugDeLugarPorTexto(texto: string): string | undefined {
  return lugaresPorTexto(texto)[0]?.slug;
}
