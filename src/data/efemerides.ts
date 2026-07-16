import { efemeridesAmpliacion } from "./efemerides-ampliacion";

export type CitaEfemeride = {
  texto: string;
  atribucion?: string;
};

export type Efemeride = {
  /** Slug de la URL permanente, ej: "9-de-julio" */
  dia: string;
  numero: number;
  mes: number;
  fecha: string;
  anio: number;
  titulo: string;
  categoria: string;
  historia: string[];
  relacionados: string[];
  /** Gancho de apertura (una línea de impacto). */
  hook?: string;
  /** Giro narrativo o consecuencia inesperada. */
  giro?: string;
  /** Cita histórica opcional para cerrar el arco. */
  cita?: CitaEfemeride;
};

export type ResultadoEfemerideFecha = {
  efemeride: Efemeride;
  /** true si hay entrada exacta para mes/día consultados. */
  esExacta: boolean;
};

const NOMBRES_MES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
] as const;

/** Etiqueta legible para una fecha de calendario (sin año histórico). */
export function formatearFechaCalendario(mes: number, numero: number): string {
  const nombre = NOMBRES_MES[mes - 1] ?? "mes";
  return `${numero} de ${nombre}`;
}

const efemeridesBase: Efemeride[] = [
  {
    dia: "31-de-enero",
    numero: 31,
    mes: 1,
    fecha: "31 de enero",
    anio: 1813,
    titulo: "Se inaugura la Asamblea del Año XIII",
    categoria: "Política",
    historia: [
      "En Buenos Aires abre sus sesiones la Asamblea General Constituyente, el primer congreso soberano de las Provincias Unidas. No llegará a declarar la independencia ni a dictar una constitución, pero cambiará el país para siempre.",
      "En pocos meses aprueba la libertad de vientres, elimina los títulos de nobleza, suprime la Inquisición y los instrumentos de tortura, encarga el Himno Nacional y acuña la primera moneda patria. La revolución, por primera vez, legisla como un Estado.",
    ],
    relacionados: ["mariano-moreno", "cornelio-saavedra", "manuel-belgrano"],
  },
  {
    dia: "2-de-febrero",
    numero: 2,
    mes: 2,
    fecha: "2 de febrero",
    anio: 1536,
    titulo: "Pedro de Mendoza funda la primera Buenos Aires",
    categoria: "Fundaciones",
    historia: [
      "El adelantado Pedro de Mendoza, enfermo y al frente de una expedición enorme para su época (unos 1.500 hombres), funda a orillas del Río de la Plata el puerto de Santa María del Buen Ayre.",
      "La ciudad durará poco: el hambre y el conflicto con los querandíes la convertirán en un infierno, y en 1541 será abandonada e incendiada por sus propios pobladores. Buenos Aires tendrá que nacer dos veces: la definitiva llegará con Juan de Garay en 1580.",
    ],
    relacionados: ["santiago-de-liniers"],
  },
  {
    dia: "3-de-febrero",
    numero: 3,
    mes: 2,
    fecha: "3 de febrero",
    anio: 1813,
    titulo: "San Martín debuta en San Lorenzo",
    categoria: "Batallas",
    historia: [
      "A orillas del Paraná, junto al convento de San Carlos, los Granaderos a Caballo cargan por primera vez. El combate dura apenas quince minutos: las tropas realistas que saqueaban las costas del río son destrozadas por una carga en pinzas perfectamente ensayada.",
      "Allí muere el sargento Juan Bautista Cabral, socorriendo a un San Martín atrapado bajo su caballo. Exactamente 39 años después, un 3 de febrero de 1852, Urquiza derrotará a Rosas en Caseros: la fecha es una bisagra doble de la historia argentina.",
    ],
    relacionados: ["jose-de-san-martin", "juan-manuel-de-rosas", "justo-jose-de-urquiza"],
  },
  {
    dia: "12-de-febrero",
    numero: 12,
    mes: 2,
    fecha: "12 de febrero",
    anio: 1817,
    titulo: "La victoria de Chacabuco corona el cruce de los Andes",
    categoria: "Batallas",
    historia: [
      "Apenas días después de cruzar la cordillera más alta de América, el Ejército de los Andes aplasta a las fuerzas realistas en la cuesta de Chacabuco. O'Higgins ataca de frente, Soler envuelve por el oeste y la caballería de Zapiola remata la jornada.",
      "Dos días después San Martín entra en Santiago de Chile, rechaza el gobierno que le ofrecen y se lo entrega a O'Higgins. La independencia de Chile está en marcha y el plan continental sigue su curso: el próximo objetivo es Lima.",
    ],
    relacionados: ["jose-de-san-martin"],
  },
  {
    dia: "15-de-febrero",
    numero: 15,
    mes: 2,
    fecha: "15 de febrero",
    anio: 1811,
    titulo: "Nace Domingo Faustino Sarmiento",
    categoria: "Personajes",
    historia: [
      "En una casa humilde de San Juan, con techo de caña y paredes de adobe, nace el hombre que hará de la escuela pública una obsesión nacional. Su madre, Paula Albarracín, teje en un telar bajo la higuera para sostener a la familia.",
      "Autodidacta feroz, exiliado, periodista, escritor del Facundo y presidente, Sarmiento multiplicará las escuelas, las bibliotecas y los observatorios. Murió en Asunción en 1888; en su honor, el 11 de septiembre es el Día del Maestro en toda América Latina.",
    ],
    relacionados: ["domingo-faustino-sarmiento"],
  },
  {
    dia: "20-de-febrero",
    numero: 20,
    mes: 2,
    fecha: "20 de febrero",
    anio: 1813,
    titulo: "Belgrano vence en la batalla de Salta",
    categoria: "Batallas",
    historia: [
      "Cinco meses después de Tucumán, Belgrano remata su obra: en las afueras de Salta, el Ejército del Norte obliga a la rendición completa de las fuerzas realistas de Pío Tristán. Es la primera capitulación total de un ejército español en la guerra.",
      "Belgrano deja ir a los vencidos bajo juramento de no volver a tomar las armas contra la Revolución. La decisión, criticada por Buenos Aires, revela al hombre: la guerra, para él, era un medio, nunca un fin.",
    ],
    relacionados: ["manuel-belgrano"],
  },
  {
    dia: "25-de-febrero",
    numero: 25,
    mes: 2,
    fecha: "25 de febrero",
    anio: 1778,
    titulo: "Nace José de San Martín",
    categoria: "Personajes",
    historia: [
      "En Yapeyú, un pueblo de las antiguas misiones jesuíticas a orillas del río Uruguay, nace el tercer hijo varón de un oficial español y una madre castellana: José Francisco de San Martín.",
      "Pasará su infancia en España, peleará contra Napoleón y volverá a los 34 años a un continente que casi no recuerda, para convertirse en el Libertador de tres naciones. Morirá en Francia en 1850, sin volver a pisar suelo argentino desde 1829.",
    ],
    relacionados: ["jose-de-san-martin"],
  },
  {
    dia: "27-de-febrero",
    numero: 27,
    mes: 2,
    fecha: "27 de febrero",
    anio: 1812,
    titulo: "Belgrano iza por primera vez la bandera argentina",
    categoria: "Independencia",
    historia: [
      "A orillas del Paraná, en Rosario, Manuel Belgrano inaugura las baterías Libertad e Independencia y hace jurar a sus soldados una bandera nueva, celeste y blanca, creada por él mismo a partir de los colores de la escarapela.",
      "El gobierno de Buenos Aires, temeroso de provocar a España, le ordena disimular el gesto. Belgrano, que ya marcha hacia el norte, seguirá enarbolándola. La bandera nació desobedecida.",
    ],
    relacionados: ["manuel-belgrano"],
  },
  {
    dia: "24-de-marzo",
    numero: 24,
    mes: 3,
    fecha: "24 de marzo",
    anio: 1976,
    titulo: "El último golpe de Estado",
    categoria: "Memoria",
    historia: [
      "En la madrugada, las Fuerzas Armadas derrocan al gobierno constitucional y toman el poder. Comienza la dictadura más sangrienta de la historia argentina: miles de personas serán desaparecidas, torturadas y asesinadas en centros clandestinos de detención.",
      "Desde 2002, la fecha es el Día Nacional de la Memoria por la Verdad y la Justicia. El Nunca Más, escrito tras el retorno democrático, y el Juicio a las Juntas de 1985 convirtieron a la Argentina en referencia mundial en materia de derechos humanos.",
    ],
    relacionados: ["raul-alfonsin"],
  },
  {
    dia: "2-de-abril",
    numero: 2,
    mes: 4,
    fecha: "2 de abril",
    anio: 1982,
    titulo: "Comienza la guerra de Malvinas",
    categoria: "Guerras",
    historia: [
      "Tropas argentinas desembarcan en las islas Malvinas y recuperan Puerto Argentino. La dictadura, acorralada por la crisis económica y las protestas, apuesta a una causa nacional profunda para sostenerse en el poder.",
      "La guerra durará 74 días y costará la vida de 649 soldados argentinos, muchos de ellos conscriptos de 18 y 19 años. La derrota precipitará el final del régimen militar; la memoria de los caídos y el reclamo de soberanía siguen siendo una causa que atraviesa a todo el país.",
    ],
    relacionados: ["raul-alfonsin"],
  },
  {
    dia: "5-de-abril",
    numero: 5,
    mes: 4,
    fecha: "5 de abril",
    anio: 1818,
    titulo: "Maipú sella la independencia de Chile",
    categoria: "Batallas",
    historia: [
      "En los llanos de Maipú, a las puertas de Santiago, San Martín destroza al ejército realista que un mes antes había estado a punto de aniquilar la Revolución en Cancha Rayada. En seis horas, el poder español en Chile deja de existir.",
      "En el campo de batalla, O'Higgins (herido en un brazo) abraza a San Martín: «¡Gloria al salvador de Chile!». El abrazo de Maipú queda como símbolo de la hermandad de las dos naciones. El camino a Lima, por fin, está abierto.",
    ],
    relacionados: ["jose-de-san-martin"],
  },
  {
    dia: "30-de-abril",
    numero: 30,
    mes: 4,
    fecha: "30 de abril",
    anio: 1977,
    titulo: "Primera ronda de las Madres de Plaza de Mayo",
    categoria: "Memoria",
    historia: [
      "Catorce mujeres se encuentran frente a la Casa Rosada para exigir saber dónde están sus hijos desaparecidos. La policía les ordena circular: ellas obedecen caminando en círculo alrededor de la pirámide de Mayo. Sin saberlo, inventan un símbolo mundial.",
      "Las rondas de los jueves, con sus pañuelos blancos, se convertirán en el gesto de resistencia civil más reconocido de América Latina y en la semilla del movimiento de derechos humanos argentino.",
    ],
    relacionados: ["raul-alfonsin"],
  },
  {
    dia: "1-de-mayo",
    numero: 1,
    mes: 5,
    fecha: "1 de mayo",
    anio: 1853,
    titulo: "Se sanciona la Constitución Nacional",
    categoria: "Política",
    historia: [
      "En Santa Fe, el Congreso General Constituyente sanciona la Constitución de la Confederación Argentina, inspirada en las Bases de Juan Bautista Alberdi. Tras cuatro décadas de anarquía, guerras civiles y caudillos, el país por fin tiene una ley suprema.",
      "Buenos Aires, separada de la Confederación, recién la jurará en 1860, tras negociar reformas. Con enmiendas, sigue siendo la misma Constitución que rige a la Argentina hoy.",
    ],
    relacionados: ["juan-bautista-alberdi", "justo-jose-de-urquiza"],
  },
  {
    dia: "2-de-mayo",
    numero: 2,
    mes: 5,
    fecha: "2 de mayo",
    anio: 1982,
    titulo: "El hundimiento del crucero General Belgrano",
    categoria: "Guerras",
    historia: [
      "Fuera de la zona de exclusión declarada por el Reino Unido, el submarino nuclear HMS Conqueror torpedea al crucero ARA General Belgrano. El buque se hunde en aguas heladas del Atlántico Sur: mueren 323 tripulantes, casi la mitad de todas las bajas argentinas de la guerra.",
      "Es la herida más profunda del conflicto de Malvinas. Cada 2 de mayo, los sobrevivientes y las familias de los caídos mantienen viva la memoria de los hombres del Belgrano.",
    ],
    relacionados: ["manuel-belgrano", "raul-alfonsin"],
  },
  {
    dia: "7-de-mayo",
    numero: 7,
    mes: 5,
    fecha: "7 de mayo",
    anio: 1919,
    titulo: "Nace Eva Perón",
    categoria: "Personajes",
    historia: [
      "En Los Toldos, un pueblo de la pampa bonaerense, nace María Eva Duarte, la menor de cinco hermanos de una familia pobre. A los 15 años se irá a Buenos Aires con un sueño de actriz.",
      "Una década más tarde será Evita: la mujer más poderosa y más amada (y más odiada) de la Argentina, motor del voto femenino y de una obra social sin precedentes. Moriría a los 33 años, convertida en el mito político más perdurable del país.",
    ],
    relacionados: ["eva-peron"],
  },
  {
    dia: "11-de-mayo",
    numero: 11,
    mes: 5,
    fecha: "11 de mayo",
    anio: 1813,
    titulo: "La Asamblea aprueba el Himno Nacional",
    categoria: "Cultura",
    historia: [
      "La Asamblea del Año XIII aprueba como Marcha Patriótica la canción con letra de Vicente López y Planes y música de Blas Parera. Sus estrofas originales, encendidas y antiespañolas, reflejan una revolución en guerra.",
      "La tradición cuenta que se cantó por primera vez en la tertulia de Mariquita Sánchez de Thompson. Cada 11 de mayo se celebra en Argentina el Día del Himno Nacional.",
    ],
    relacionados: ["mariquita-sanchez-de-thompson"],
  },
  {
    dia: "22-de-mayo",
    numero: 22,
    mes: 5,
    fecha: "22 de mayo",
    anio: 1810,
    titulo: "El Cabildo Abierto decide el destino del virreinato",
    categoria: "Independencia",
    historia: [
      "Con la noticia de la caída de la Junta de Sevilla confirmada, unos 250 vecinos debaten en el Cabildo si el virrey Cisneros debe seguir en el mando. Es, en los hechos, el primer debate político de la historia argentina.",
      "La posición decisiva la argumenta Juan José Castelli: caducado el gobierno legítimo en España, la soberanía vuelve al pueblo, y el pueblo puede darse su propio gobierno. La votación le da la razón. La revolución ya es cuestión de días.",
    ],
    relacionados: ["juan-jose-castelli", "cornelio-saavedra"],
  },
  {
    dia: "25-de-mayo",
    numero: 25,
    mes: 5,
    fecha: "25 de mayo",
    anio: 1810,
    titulo: "La Revolución de Mayo",
    categoria: "Independencia",
    historia: [
      "Tras una semana de presión criolla, cae el virrey Cisneros y asume la Primera Junta de gobierno patrio, presidida por Cornelio Saavedra, con Mariano Moreno y Juan José Paso como secretarios. En la plaza, según la tradición, llovizna y hay escarapelas.",
      "Nadie habla todavía de independencia (se gobierna en nombre de Fernando VII), pero el poder ya cambió de manos para siempre. Seis años después, en Tucumán, la máscara caerá del todo.",
    ],
    relacionados: ["cornelio-saavedra", "mariano-moreno", "manuel-belgrano", "juan-jose-castelli"],
  },
  {
    dia: "29-de-mayo",
    numero: 29,
    mes: 5,
    fecha: "29 de mayo",
    anio: 1969,
    titulo: "El Cordobazo",
    categoria: "Sociedad",
    historia: [
      "Obreros y estudiantes toman juntos las calles de Córdoba contra la dictadura de Onganía. La ciudad arde durante dos días: barricadas, asambleas y una represión que deja muertos y cientos de detenidos.",
      "El Cordobazo quiebra la ilusión de orden del régimen y marca el ingreso de la clase obrera industrial al centro de la política argentina. Nada volverá a ser igual: la dictadura de la «Revolución Argentina» empieza a morir ese día.",
    ],
    relacionados: ["domingo-faustino-sarmiento", "hipolito-yrigoyen"],
  },
  {
    dia: "3-de-junio",
    numero: 3,
    mes: 6,
    fecha: "3 de junio",
    anio: 1770,
    titulo: "Nace Manuel Belgrano",
    categoria: "Personajes",
    historia: [
      "En Buenos Aires nace Manuel José Joaquín del Corazón de Jesús Belgrano, hijo de un próspero comerciante italiano. Estudiará leyes en Salamanca y volverá convertido en el intelectual más moderno del virreinato.",
      "Economista de vocación y general por necesidad, creará la bandera, ganará Tucumán y Salta, y morirá en la pobreza el 20 de junio de 1820, tras donar sus premios para fundar escuelas. Argentina lo recuerda cada 20 de junio, el Día de la Bandera.",
    ],
    relacionados: ["manuel-belgrano"],
  },
  {
    dia: "10-de-junio",
    numero: 10,
    mes: 6,
    fecha: "10 de junio",
    anio: 1829,
    titulo: "Primera comandancia argentina en Malvinas",
    categoria: "Política",
    historia: [
      "El gobierno de Buenos Aires crea la Comandancia Política y Militar de las Islas Malvinas y designa al frente a Luis Vernet, que ya había establecido en Puerto Soledad una colonia con familias, ganado y comercio.",
      "Cuatro años después, en enero de 1833, una fragata británica expulsará a las autoridades argentinas de las islas. El reclamo de soberanía, sostenido desde entonces, cumple casi dos siglos.",
    ],
    relacionados: ["juan-manuel-de-rosas", "justo-jose-de-urquiza"],
  },
  {
    dia: "11-de-junio",
    numero: 11,
    mes: 6,
    fecha: "11 de junio",
    anio: 1580,
    titulo: "Juan de Garay funda Buenos Aires por segunda vez",
    categoria: "Fundaciones",
    historia: [
      "Cuarenta y cuatro años después del fracaso de Pedro de Mendoza, Juan de Garay baja desde Asunción con unas sesenta familias (la mayoría criollas) y funda la Ciudad de la Trinidad y Puerto de Santa María de los Buenos Aires.",
      "Esta vez la ciudad sobrevive. El trazado en damero de Garay, con su plaza mayor frente al río, sigue siendo el corazón de la Buenos Aires actual: la Plaza de Mayo.",
    ],
    relacionados: ["santiago-de-liniers", "cornelio-saavedra"],
  },
  {
    dia: "14-de-junio",
    numero: 14,
    mes: 6,
    fecha: "14 de junio",
    anio: 1982,
    titulo: "Termina la guerra de Malvinas",
    categoria: "Guerras",
    historia: [
      "Tras 74 días de guerra, las fuerzas argentinas en Puerto Argentino se rinden. El saldo: 649 argentinos, 255 británicos y 3 isleñas muertos. Miles de veteranos cargarán las heridas físicas y mentales del conflicto durante décadas.",
      "La derrota precipita el derrumbe de la dictadura: en pocos días cae el general Galtieri y se abre la transición que culminará con las elecciones de 1983. La democracia argentina renace, en parte, de esa tragedia.",
    ],
    relacionados: ["raul-alfonsin"],
  },
  {
    dia: "16-de-junio",
    numero: 16,
    mes: 6,
    fecha: "16 de junio",
    anio: 1955,
    titulo: "El bombardeo de Plaza de Mayo",
    categoria: "Tragedias",
    historia: [
      "Aviones de la Marina bombardean y ametrallan la Plaza de Mayo y la Casa Rosada en un intento de asesinar a Perón. Es un día hábil, a plena tarde: mueren más de 300 civiles, entre ellos un colectivo lleno de escolares.",
      "Es el único bombardeo aéreo de la historia sobre la capital argentina, y quedó grabado como una de las jornadas más oscuras de la violencia política del país. Tres meses después, un nuevo alzamiento derrocaría a Perón.",
    ],
    relacionados: ["juan-domingo-peron"],
  },
  {
    dia: "17-de-junio",
    numero: 17,
    mes: 6,
    fecha: "17 de junio",
    anio: 1821,
    titulo: "Muere Martín Miguel de Güemes",
    categoria: "Personajes",
    historia: [
      "Herido diez días antes en una incursión realista sobre la ciudad de Salta, el general Güemes muere en un catre, en medio del monte, rodeado de sus gauchos. Tiene 36 años y es el único general argentino caído en acción de guerra en la lucha por la Independencia.",
      "Su Guerra Gaucha había contenido durante años las invasiones realistas desde el norte, protegiendo el flanco del plan continental de San Martín. Salta lo llora cada 17 de junio, Día Nacional de la Libertad Latinoamericana.",
    ],
    relacionados: ["martin-miguel-de-guemes", "jose-de-san-martin"],
  },
  {
    dia: "20-de-junio",
    numero: 20,
    mes: 6,
    fecha: "20 de junio",
    anio: 1820,
    titulo: "Muere Manuel Belgrano, el creador de la bandera",
    categoria: "Personajes",
    historia: [
      "En una Buenos Aires sumida en la anarquía (ese año la provincia llegó a tener tres gobernadores en un solo día), muere Manuel Belgrano, pobre y casi olvidado. Paga a su médico con un reloj de oro, lo último que le queda.",
      "Un solo diario registra la noticia. El tiempo pondría las cosas en su lugar: la bandera que creó a orillas del Paraná es hoy el símbolo mayor del país, y cada 20 de junio la Argentina celebra el Día de la Bandera en su honor.",
    ],
    relacionados: ["manuel-belgrano"],
  },
  {
    dia: "1-de-julio",
    numero: 1,
    mes: 7,
    fecha: "1 de julio",
    anio: 1974,
    titulo: "Muere Juan Domingo Perón",
    categoria: "Personajes",
    historia: [
      "A los 78 años, en ejercicio de su tercera presidencia, muere Juan Domingo Perón. «Llevo en mis oídos la más maravillosa música que, para mí, es la palabra del pueblo argentino», había dicho en su último discurso, días antes, desde el balcón de la Casa Rosada.",
      "Más de un millón de personas despiden sus restos bajo la lluvia. Deja un país al borde de la violencia y un movimiento que, medio siglo después, sigue siendo el eje de la política argentina.",
    ],
    relacionados: ["juan-domingo-peron", "eva-peron"],
  },
  {
    dia: "5-de-julio",
    numero: 5,
    mes: 7,
    fecha: "5 de julio",
    anio: 1807,
    titulo: "La Defensa: Buenos Aires en armas",
    categoria: "Batallas",
    historia: [
      "Casi 10.000 soldados británicos (la mayor fuerza que Gran Bretaña haya enviado hasta entonces a América del Sur) asaltan Buenos Aires. Los espera una ciudad entera convertida en fortaleza: milicias criollas, vecinos, mujeres y esclavos combaten desde azoteas y balcones.",
      "El avance británico se desangra calle por calle bajo una lluvia de balas, piedras y aceite hirviendo. En dos días de combate, la ciudad indefendible se vuelve invencible. La capitulación llegará el 7 de julio.",
    ],
    relacionados: ["santiago-de-liniers", "cornelio-saavedra"],
  },
  {
    dia: "7-de-julio",
    numero: 7,
    mes: 7,
    fecha: "7 de julio",
    anio: 1807,
    titulo: "Los ingleses capitulan en Buenos Aires",
    categoria: "Batallas",
    historia: [
      "El general John Whitelocke firma la capitulación: sus tropas, deshechas en los combates callejeros de la Defensa, se retiran del Río de la Plata y devuelven también Montevideo. Buenos Aires, sin ayuda de España, ha derrotado dos veces al mayor imperio del mundo.",
      "La victoria cambia algo más profundo que el mapa militar: los criollos descubren que pueden defenderse (y por lo tanto gobernarse) solos. Las milicias nacidas en las Invasiones Inglesas serán, tres años después, el músculo de la Revolución de Mayo. De regreso en Londres, Whitelocke será juzgado y declarado «inepto para servir al rey».",
    ],
    relacionados: ["santiago-de-liniers", "cornelio-saavedra"],
  },
  {
    dia: "9-de-julio",
    numero: 9,
    mes: 7,
    fecha: "9 de julio",
    anio: 1816,
    titulo: "La Declaración de la Independencia",
    categoria: "Independencia",
    historia: [
      "En una casa prestada de San Miguel de Tucumán, los diputados del Congreso de las Provincias Unidas declaran «una nación libre e independiente del rey Fernando VII, sus sucesores y metrópoli». Días después agregarán: «y de toda otra dominación extranjera».",
      "La declaración llega en el peor momento posible: la Europa de la Restauración aplasta revoluciones, los realistas presionan desde el norte y solo San Martín, desde Cuyo, la exigía con desesperación para poder lanzar su campaña. Fue un acto de audacia, no de comodidad. Por eso importa.",
    ],
    relacionados: ["jose-de-san-martin", "manuel-belgrano"],
  },
  {
    dia: "26-de-julio",
    numero: 26,
    mes: 7,
    fecha: "26 de julio",
    anio: 1952,
    titulo: "Muere Eva Perón",
    categoria: "Personajes",
    historia: [
      "A las 20:25, la radio interrumpe su programación: «La señora Eva Perón, Jefa Espiritual de la Nación, ha entrado en la inmortalidad». Tiene 33 años; el cáncer la consumió en plena cima de su poder.",
      "El duelo popular no tiene precedentes: dos semanas de filas bajo la lluvia para despedirla, ocho personas muertas en las aglomeraciones, las florerías de Buenos Aires literalmente vacías. Su cuerpo embalsamado sería luego secuestrado por la dictadura de 1955 y escondido en el exterior durante 16 años.",
    ],
    relacionados: ["eva-peron", "juan-domingo-peron"],
  },
  {
    dia: "29-de-julio",
    numero: 29,
    mes: 7,
    fecha: "29 de julio",
    anio: 1966,
    titulo: "La Noche de los Bastones Largos",
    categoria: "Sociedad",
    historia: [
      "Un mes después del golpe de Onganía, la policía irrumpe en cinco facultades de la Universidad de Buenos Aires y desaloja a bastonazos a estudiantes, profesores y decanos que resistían la intervención de las universidades.",
      "En los meses siguientes renuncian más de 1.300 docentes e investigadores, muchos de los cuales emigran para no volver: una fuga de cerebros de la que la ciencia argentina tardó décadas en recuperarse.",
    ],
    relacionados: ["domingo-faustino-sarmiento"],
  },
  {
    dia: "17-de-agosto",
    numero: 17,
    mes: 8,
    fecha: "17 de agosto",
    anio: 1850,
    titulo: "Muere José de San Martín",
    categoria: "Personajes",
    historia: [
      "A las tres de la tarde, en su casa de Boulogne-sur-Mer, Francia, muere el Libertador. Lo acompañan su hija Mercedes y su yerno. En su testamento pide que su corazón sea depositado en Buenos Aires; sus restos recién llegarán al país en 1880.",
      "Se había negado a desenvainar la espada en las guerras civiles argentinas y legó esa espada a Rosas, «por la firmeza con que sostuvo el honor de la República contra las injustas pretensiones de los extranjeros». Cada 17 de agosto, la Argentina lo recuerda como al padre de la Patria.",
    ],
    relacionados: ["jose-de-san-martin", "juan-manuel-de-rosas"],
  },
  {
    dia: "22-de-agosto",
    numero: 22,
    mes: 8,
    fecha: "22 de agosto",
    anio: 1951,
    titulo: "El Cabildo Abierto del justicialismo",
    categoria: "Política",
    historia: [
      "Cerca de un millón de personas colman la avenida 9 de Julio para pedir que Evita acepte la candidatura a vicepresidenta. Desde el palco, la multitud le exige una respuesta inmediata; ella pide tiempo entre lágrimas: «Haré lo que diga el pueblo».",
      "Nueve días después renunciará por radio a la candidatura: el cáncer que la mataría al año siguiente ya estaba avanzado, y la presión militar contra una mujer en la línea de sucesión era feroz. La escena queda como una de las más dramáticas de la política argentina.",
    ],
    relacionados: ["eva-peron", "juan-domingo-peron"],
  },
  {
    dia: "23-de-agosto",
    numero: 23,
    mes: 8,
    fecha: "23 de agosto",
    anio: 1812,
    titulo: "El Éxodo Jujeño",
    categoria: "Independencia",
    historia: [
      "Ante el avance realista desde el norte, Belgrano ordena lo impensable: que todo el pueblo de Jujuy abandone la ciudad llevándose lo que pueda y quemando lo que quede. Nada debe servir al enemigo: ni alimentos, ni ganado, ni techo.",
      "Miles de personas marchan hacia el sur en carretas y a pie. Un mes después, esa retirada heroica se convertirá en victoria en la batalla de Tucumán. Pocas veces en la historia un pueblo entero fue el ejército.",
    ],
    relacionados: ["manuel-belgrano"],
  },
  {
    dia: "27-de-agosto",
    numero: 27,
    mes: 8,
    fecha: "27 de agosto",
    anio: 1920,
    titulo: "Los locos de la azotea inventan la radio",
    categoria: "Cultura",
    historia: [
      "Desde el techo del Teatro Coliseo de Buenos Aires, Enrique Susini y tres amigos transmiten la ópera Parsifal de Wagner. Es la primera transmisión de radiodifusión regular del mundo: la radio, como medio para el público, nace en Buenos Aires.",
      "Los escucharon, quizás, unas decenas de receptores en toda la ciudad. Los llamaron «los locos de la azotea». Un siglo después, aquel disparate fundó uno de los medios más queridos por los argentinos.",
    ],
    relacionados: ["domingo-faustino-sarmiento"],
  },
  {
    dia: "6-de-septiembre",
    numero: 6,
    mes: 9,
    fecha: "6 de septiembre",
    anio: 1930,
    titulo: "El primer golpe de Estado",
    categoria: "Política",
    historia: [
      "El general José Félix Uriburu derroca al presidente Hipólito Yrigoyen, elegido dos años antes con el 62 % de los votos. Es el primer golpe de Estado de la historia argentina, y funda una maldición: en los 53 años siguientes, ningún ciclo democrático logrará completarse.",
      "Habrá golpes en 1930, 1943, 1955, 1962, 1966 y 1976. Recién en 1983, con el retorno de la democracia, la Argentina empezará a romper esa cadena: desde entonces, ningún gobierno constitucional fue interrumpido.",
    ],
    relacionados: ["hipolito-yrigoyen"],
  },
  {
    dia: "11-de-septiembre",
    numero: 11,
    mes: 9,
    fecha: "11 de septiembre",
    anio: 1888,
    titulo: "Muere Sarmiento, el maestro de América",
    categoria: "Personajes",
    historia: [
      "En Asunción del Paraguay, adonde había ido buscando un clima más benigno para su corazón enfermo, muere Domingo Faustino Sarmiento a los 77 años. Hasta sus últimos días siguió escribiendo, polemizando y proyectando escuelas.",
      "En su honor, la Conferencia Interamericana de Educación fijó el 11 de septiembre como Día del Maestro en toda América Latina. Su ecuación sigue vigente: «Todos los problemas son problemas de educación».",
    ],
    relacionados: ["domingo-faustino-sarmiento"],
  },
  {
    dia: "16-de-septiembre",
    numero: 16,
    mes: 9,
    fecha: "16 de septiembre",
    anio: 1955,
    titulo: "La Revolución Libertadora derroca a Perón",
    categoria: "Política",
    historia: [
      "Un alzamiento cívico-militar iniciado en Córdoba termina, en pocos días, con la renuncia de Perón, que se asila en la cañonera paraguaya Paraguay. Comienza un exilio de 18 años que pasará por Asunción, Caracas, Ciudad Trujillo y Madrid.",
      "El nuevo régimen proscribe al peronismo: prohibido nombrar a Perón, a Evita, exhibir sus imágenes o cantar la marcha. La proscripción del movimiento mayoritario marcará a fuego (y a sangre) las dos décadas siguientes de la vida argentina.",
    ],
    relacionados: ["juan-domingo-peron", "eva-peron"],
  },
  {
    dia: "23-de-septiembre",
    numero: 23,
    mes: 9,
    fecha: "23 de septiembre",
    anio: 1947,
    titulo: "Las mujeres argentinas conquistan el voto",
    categoria: "Sociedad",
    historia: [
      "Ante una multitud reunida en Plaza de Mayo, Perón firma y entrega a Evita el decreto de promulgación de la ley 13.010: las mujeres argentinas ya tienen los mismos derechos políticos que los hombres, tras décadas de lucha de sufragistas como Alicia Moreau y Julieta Lanteri.",
      "En las elecciones de 1951, las mujeres votarán por primera vez: lo hará el 90 % del nuevo padrón, y 29 diputadas y senadoras entrarán al Congreso. Ningún otro país de la región tuvo un debut electoral femenino tan masivo.",
    ],
    relacionados: ["eva-peron", "juan-domingo-peron"],
  },
  {
    dia: "24-de-septiembre",
    numero: 24,
    mes: 9,
    fecha: "24 de septiembre",
    anio: 1812,
    titulo: "La batalla de Tucumán salva la Revolución",
    categoria: "Batallas",
    historia: [
      "Desobedeciendo la orden de Buenos Aires de retirarse a Córdoba, Belgrano decide dar batalla en Tucumán con un ejército de soldados bisoños y gauchos armados con lanzas y cuchillos atados a cañas. Enfrenta a las tropas realistas de Pío Tristán, superiores en número y experiencia.",
      "La batalla es caótica (una estampida de caballos y hasta una nube de langostas se cruzan en la jornada), pero al caer la tarde los realistas se retiran. La Revolución estaba a una derrota de morir en el norte; Belgrano la salvó desobedeciendo.",
    ],
    relacionados: ["manuel-belgrano"],
  },
  {
    dia: "8-de-octubre",
    numero: 8,
    mes: 10,
    fecha: "8 de octubre",
    anio: 1895,
    titulo: "Nace Juan Domingo Perón",
    categoria: "Personajes",
    historia: [
      "En Lobos, provincia de Buenos Aires, nace Juan Domingo Perón. Pasará parte de su infancia en la Patagonia, entrará al Colegio Militar a los 15 años y será profesor de historia militar, deportista y agregado militar en la Italia de Mussolini.",
      "Nada en esa carrera convencional anunciaba lo que vendría: el fundador del movimiento político más duradero de la Argentina, tres veces presidente, el hombre que partió la historia del país en un antes y un después de 1945.",
    ],
    relacionados: ["juan-domingo-peron"],
  },
  {
    dia: "12-de-octubre",
    numero: 12,
    mes: 10,
    fecha: "12 de octubre",
    anio: 1916,
    titulo: "Yrigoyen asume: por primera vez gobierna el voto popular",
    categoria: "Política",
    historia: [
      "Hipólito Yrigoyen asume la presidencia, la primera surgida del voto secreto y obligatorio de la ley Sáenz Peña. La multitud desata los caballos de su carruaje y lo arrastra a pulso desde el Congreso hasta la Casa Rosada.",
      "Después de décadas de elecciones fraudulentas manejadas por el régimen conservador, el sufragio popular decide por primera vez quién gobierna la Argentina. El radicalismo, nacido de la revolución de 1890, llega al poder por las urnas.",
    ],
    relacionados: ["hipolito-yrigoyen"],
  },
  {
    dia: "17-de-octubre",
    numero: 17,
    mes: 10,
    fecha: "17 de octubre",
    anio: 1945,
    titulo: "El día que nació el peronismo",
    categoria: "Política",
    historia: [
      "El coronel Perón, obligado a renunciar y detenido en la isla Martín García, parece terminado. Pero desde la mañana, columnas de trabajadores de los suburbios industriales marchan hacia Plaza de Mayo exigiendo su libertad. Muchos refrescan los pies en la fuente: la oligarquía los llamará «las patas en la fuente».",
      "A la medianoche, un Perón liberado sale al balcón de la Casa Rosada ante una plaza desbordada. Ese día nace el movimiento que definirá la política argentina hasta hoy, y el 17 de octubre queda consagrado como el Día de la Lealtad peronista.",
    ],
    relacionados: ["juan-domingo-peron", "eva-peron"],
  },
  {
    dia: "30-de-octubre",
    numero: 30,
    mes: 10,
    fecha: "30 de octubre",
    anio: 1983,
    titulo: "La democracia vuelve para quedarse",
    categoria: "Política",
    historia: [
      "Tras siete años de dictadura, los argentinos vuelven a votar. Contra todos los pronósticos, Raúl Alfonsín derrota al peronismo con el 52 % de los votos, con una campaña que tenía como bandera el preámbulo de la Constitución y una promesa: juzgar el terrorismo de Estado.",
      "Desde aquel 30 de octubre, la democracia argentina no volvió a interrumpirse: es el período constitucional más largo de toda la historia del país.",
    ],
    relacionados: ["raul-alfonsin"],
  },
  {
    dia: "10-de-noviembre",
    numero: 10,
    mes: 11,
    fecha: "10 de noviembre",
    anio: 1834,
    titulo: "Nace José Hernández: el Día de la Tradición",
    categoria: "Cultura",
    historia: [
      "En el caserío del Perdriel, en la actual San Martín, nace José Hernández: periodista, militar federal y autor del Martín Fierro, el poema que convirtió al gaucho perseguido en el símbolo de la identidad argentina.",
      "«Los hermanos sean unidos, porque esa es la ley primera», escribió. En su honor, cada 10 de noviembre se celebra en Argentina el Día de la Tradición, con jineteadas, guitarras y asado de por medio.",
    ],
    relacionados: ["juan-manuel-de-rosas", "domingo-faustino-sarmiento"],
  },
  {
    dia: "11-de-noviembre",
    numero: 11,
    mes: 11,
    fecha: "11 de noviembre",
    anio: 1951,
    titulo: "Las mujeres votan por primera vez",
    categoria: "Sociedad",
    historia: [
      "Cuatro años después de la ley 13.010, más de 3.500.000 mujeres votan por primera vez en elecciones nacionales. Evita, ya gravemente enferma, emite su voto desde la cama del Policlínico donde acaba de ser operada: una urna llega hasta su habitación.",
      "El resultado institucional es histórico también en las bancas: 23 diputadas y 6 senadoras, todas peronistas, se convierten en las primeras legisladoras nacionales de la historia argentina.",
    ],
    relacionados: ["eva-peron"],
  },
  {
    dia: "20-de-noviembre",
    numero: 20,
    mes: 11,
    fecha: "20 de noviembre",
    anio: 1845,
    titulo: "La Vuelta de Obligado",
    categoria: "Batallas",
    historia: [
      "En un recodo del Paraná, las baterías de Lucio Mansilla (tres cadenas atravesadas en el río y unos mil hombres) enfrentan durante siete horas a la flota anglo-francesa más poderosa que haya navegado aguas americanas.",
      "La batalla se pierde, pero la resistencia es tan feroz que la intervención europea termina en fracaso político: años después, Gran Bretaña y Francia firmarán la paz reconociendo la soberanía argentina sobre sus ríos interiores. San Martín, desde Europa, elogió la defensa. Hoy es el Día de la Soberanía Nacional.",
    ],
    relacionados: ["juan-manuel-de-rosas", "jose-de-san-martin"],
  },
  {
    dia: "10-de-diciembre",
    numero: 10,
    mes: 12,
    fecha: "10 de diciembre",
    anio: 1983,
    titulo: "Alfonsín asume y la democracia renace",
    categoria: "Política",
    historia: [
      "Raúl Alfonsín recibe los atributos presidenciales y cierra la dictadura más sangrienta de la historia argentina. Desde el Cabildo, ante una plaza repleta, no da un discurso político: recita el preámbulo de la Constitución, «un rezo laico para todos los argentinos».",
      "Cinco días después firmará el decreto que crea la CONADEP y ordena juzgar a las juntas militares. El 10 de diciembre (también Día Internacional de los Derechos Humanos) es hoy el Día de la Restauración de la Democracia.",
    ],
    relacionados: ["raul-alfonsin"],
  },
  {
    dia: "13-de-diciembre",
    numero: 13,
    mes: 12,
    fecha: "13 de diciembre",
    anio: 1907,
    titulo: "Brota petróleo en Comodoro Rivadavia",
    categoria: "Ciencia",
    historia: [
      "Una cuadrilla que perforaba en busca de agua para el pueblo sediento de Comodoro Rivadavia encuentra, a 540 metros de profundidad, otra cosa: petróleo. Es el primer gran yacimiento descubierto en el país.",
      "De ese pozo nacerá en 1922 YPF, la primera petrolera estatal integrada del mundo, dirigida por el general Enrique Mosconi. La Patagonia árida se convertirá en el corazón energético de la Argentina.",
    ],
    relacionados: ["hipolito-yrigoyen"],
  },
  {
    dia: "20-de-diciembre",
    numero: 20,
    mes: 12,
    fecha: "20 de diciembre",
    anio: 2001,
    titulo: "La crisis de 2001: se derrumba un gobierno",
    categoria: "Política",
    historia: [
      "Tras días de saqueos, cacerolazos y estado de sitio, el presidente Fernando de la Rúa renuncia y abandona la Casa Rosada en helicóptero. La represión de esas jornadas deja 39 muertos en todo el país.",
      "Es el punto más hondo de una crisis económica y social sin precedentes: default, corralito, más de la mitad de la población bajo la línea de pobreza y cinco presidentes en once días. La imagen del helicóptero queda grabada como el símbolo del colapso.",
    ],
    relacionados: ["raul-alfonsin", "juan-domingo-peron"],
  },
  {
    dia: "8-de-enero",
    numero: 8,
    mes: 1,
    fecha: "8 de enero",
    anio: 1865,
    titulo: "Se firma la Triple Alianza contra Paraguay",
    categoria: "Guerras",
    historia: [
      "Argentina, Brasil y Uruguay sellan en Buenos Aires un tratado secreto para derrocar al presidente paraguayo Francisco Solano López. La alianza transformará la política regional en la guerra más sangrienta de América del Sur.",
      "El conflicto durará cinco años y dejará a Paraguay devastada. Para la Argentina, significó la primera gran movilización nacional bajo un Estado ya organizado y la consolidación de fronteras en el Litoral.",
    ],
    relacionados: ["bartolome-mitre", "justo-jose-de-urquiza"],
  },
  {
    dia: "19-de-marzo",
    numero: 19,
    mes: 3,
    fecha: "19 de marzo",
    anio: 1812,
    titulo: "Se instala el Primer Triunvirato",
    categoria: "Política",
    historia: [
      "Tras la caída de la Junta Grande, tres hombres (Rivadavia, Galicchio y Chacabuco) asumen el gobierno de las Provincias Unidas. El Triunvirato intentará dar orden a una revolución aún sin rumbo claro.",
      "En sus dieciséis meses creará la Biblioteca Pública, la Escuela de Náutica y encargará a Belgrano la expedición al norte. También destituirá a Liniers y enfrentará la oposición de Artigas en el Litoral.",
    ],
    relacionados: ["bernardino-rivadavia", "manuel-belgrano", "santiago-de-liniers"],
  },
  {
    dia: "19-de-abril",
    numero: 19,
    mes: 4,
    fecha: "19 de abril",
    anio: 1810,
    titulo: "Se abren las sesiones del Cabildo Abierto",
    categoria: "Independencia",
    historia: [
      "En el Cabildo de Buenos Aires, vecinos y autoridades debaten qué hacer tras la caudal de noticias de España. Es la víspera de la semana que cambiará el destino del virreinato.",
      "Durante tres días se discute si Cisneros debe seguir al frente del gobierno. La tensión entre españoles peninsulares y criollos prepara el escenario del 25 de Mayo.",
    ],
    relacionados: ["cornelio-saavedra", "mariano-moreno", "juan-jose-castelli"],
  },
  {
    dia: "28-de-mayo",
    numero: 28,
    mes: 5,
    fecha: "28 de mayo",
    anio: 1905,
    titulo: "La Revolución del 28 en Córdoba",
    categoria: "Política",
    historia: [
      "Estudiantes universitarios y ciudadanos de Córdoba se levantan contra la intervención federal del gobierno nacional en la provincia. Es el primer gran brote del radicalismo antes de llegar al poder.",
      "La jornada, conocida como la Revolución del 28, consolida a la UCR como fuerza de oposición y deja una tradición de militancia estudiantil que perdurará en la política argentina.",
    ],
    relacionados: ["hipolito-yrigoyen", "domingo-faustino-sarmiento"],
  },
  {
    dia: "4-de-junio",
    numero: 4,
    mes: 6,
    fecha: "4 de junio",
    anio: 1943,
    titulo: "El golpe que abre la década del peronismo",
    categoria: "Política",
    historia: [
      "Un golpe militar derroca al presidente Ramón Castillo y pone fin al fraude patriótico. Entre los oficiales que participan está el coronel Juan Domingo Perón, aún sin protagonismo visible.",
      "El nuevo gobierno, autodenominado Revolución del 43, reformará la educación, creará el INPS y abrirá espacio a sindicatos. De ese laboratorio saldrá el movimiento que dominará la política argentina durante décadas.",
    ],
    relacionados: ["juan-domingo-peron", "eva-peron"],
  },
  {
    dia: "18-de-julio",
    numero: 18,
    mes: 7,
    fecha: "18 de julio",
    anio: 1852,
    titulo: "El Acuerdo de San Nicolás",
    categoria: "Política",
    historia: [
      "Tras la caída de Rosas en Caseros, las provincias firman en San Nicolás un pacto para convocar un Congreso Constituyente. Es el intento más serio de unificar a un país fragmentado por caudillos.",
      "Buenos Aires rechazará el acuerdo y se separará del resto. La Constitución de 1853 se dictará sin la provincia más rica, hasta que la vuelva a integrar en 1860.",
    ],
    relacionados: ["justo-jose-de-urquiza", "juan-manuel-de-rosas", "juan-bautista-alberdi"],
  },
  {
    dia: "15-de-agosto",
    numero: 15,
    mes: 8,
    fecha: "15 de agosto",
    anio: 1888,
    titulo: "Muere Domingo Faustino Sarmiento",
    categoria: "Personajes",
    historia: [
      "En Asunción del Paraguay, lejos de la Argentina que ayudó a construir, muere el hombre que hizo de la escuela pública una obsesión nacional. Tenía 77 años y seguía escribiendo hasta el final.",
      "Su cuerpo viajará en un tren negro escoltado por miles de personas. Educador, escritor y presidente, Sarmiento dejó la frase que resume su legado: «Educar es crecer».",
    ],
    relacionados: ["domingo-faustino-sarmiento", "bartolome-mitre"],
  },
  {
    dia: "21-de-septiembre",
    numero: 21,
    mes: 9,
    fecha: "21 de septiembre",
    anio: 1976,
    titulo: "Asesinan a Carlos Mugica en San Patricio",
    categoria: "Memoria",
    historia: [
      "A la salida de misa en la iglesia de San Patricio, en el barrio de Belgrano, un comando parapolicial acribilla al cura Carlos Mugica. El sacerdote trabajaba en las villas y denunciaba la represión.",
      "Su muerte conmociona a la Iglesia y al país. Mugica se convierte en símbolo de la opción preferencial por los pobres en los años más oscuros de la dictadura.",
    ],
    relacionados: ["raul-alfonsin"],
  },
  {
    dia: "6-de-octubre",
    numero: 6,
    mes: 10,
    fecha: "6 de octubre",
    anio: 1982,
    titulo: "Malvinas: el desembarco en Puerto Argentino",
    categoria: "Guerras",
    historia: [
      "Tropas argentinas recuperan las islas Malvinas, ocupadas por Gran Bretaña desde 1833. El gobierno de Galtieri apuesta a que la causa nacional unificará al país en plena dictadura.",
      "La guerra durará 74 días. El 14 de junio la rendición marcará el fin del conflicto y acelerará la caída del régimen militar. Malvinas queda como herida abierta y símbolo de soberanía.",
    ],
    relacionados: ["juan-domingo-peron", "raul-alfonsin"],
  },
  {
    dia: "14-de-julio",
    numero: 14,
    mes: 7,
    fecha: "14 de julio",
    anio: 1880,
    titulo: "Federalización de Buenos Aires",
    categoria: "Política",
    historia: [
      "El Congreso declara a la ciudad de Buenos Aires capital federal, separándola de la provincia homónima. La medida cierra décadas de conflicto entre porteños e interior por el control del puerto y las rentas aduaneras.",
      "La federalización permite al país tener una sede de gobierno común y deja La Plata como capital provincial. Es uno de los acuerdos fundacionales del Estado nacional moderno.",
    ],
    relacionados: ["bartolome-mitre", "julio-argentino-roca", "domingo-faustino-sarmiento"],
  },
  {
    dia: "1-de-enero",
    numero: 1,
    mes: 1,
    fecha: "1 de enero",
    anio: 1871,
    titulo: "Entra en vigor el Código Civil",
    categoria: "Política",
    historia: [
      "Comienza a regir el Código Civil redactado por Dalmacio Vélez Sarsfield, sancionado dos años antes. Familia, contratos y propiedad pasan a una ley común para todo el país.",
      "Junto a la Constitución, el Código es la otra columna del orden liberal: la Argentina moderna también se construye en los artículos de un libro de leyes.",
    ],
    relacionados: ["domingo-faustino-sarmiento", "bartolome-mitre", "juan-bautista-alberdi"],
  },
  {
    dia: "18-de-marzo",
    numero: 18,
    mes: 3,
    fecha: "18 de marzo",
    anio: 1812,
    titulo: "Belgrano crea la Escuadra Nacional",
    categoria: "Batallas",
    historia: [
      "Desde la Fortaleza de Buenos Aires, Manuel Belgrano impulsa la formación de la primera escuadra de guerra del país para enfrentar a los realistas en el Río de la Plata.",
      "La apuesta naval complementaba la Campaña del Norte y mostraba que la revolución pensaba en términos continentales, no solo terrestres.",
    ],
    relacionados: ["manuel-belgrano", "mariano-moreno"],
  },
  {
    dia: "4-de-agosto",
    numero: 4,
    mes: 8,
    fecha: "4 de agosto",
    anio: 1820,
    titulo: "Se reúne el Congreso de Tucumán postergado",
    categoria: "Política",
    historia: [
      "En plena anarquía del año del directorio caído, las provincias intentan recomponer un pacto federal. Tucumán vuelve a ser escenario de deliberaciones sobre el destino del país.",
      "El fracaso de esos intentos dejará el camino libre a las décadas de caudillismo que Rosas y sus rivales disputarán sin tregua.",
    ],
    relacionados: ["juan-manuel-de-rosas", "justo-jose-de-urquiza", "manuel-belgrano"],
  },
];

export const efemerides: Efemeride[] = [
  ...efemeridesBase,
  ...(efemeridesAmpliacion as Efemeride[]),
];

const ordenadas = [...efemerides].sort((a, b) =>
  a.mes === b.mes ? a.numero - b.numero : a.mes - b.mes,
);

export function obtenerEfemeride(dia: string): Efemeride | undefined {
  return efemerides.find((e) => e.dia === dia);
}

export function efemeridesOrdenadas(): Efemeride[] {
  return ordenadas;
}

/** Anterior y siguiente en el calendario (con vuelta circular). */
export function vecinas(dia: string): { anterior: Efemeride; siguiente: Efemeride } | null {
  const i = ordenadas.findIndex((e) => e.dia === dia);
  if (i === -1) return null;
  const anterior = ordenadas[(i - 1 + ordenadas.length) % ordenadas.length];
  const siguiente = ordenadas[(i + 1) % ordenadas.length];
  return { anterior, siguiente };
}

/**
 * Resuelve la efeméride para una fecha de calendario.
 * Si no hay entrada exacta, devuelve una rotación editorial determinística del archivo.
 */
function indiceRotacionArchivo(mes: number, numero: number): number {
  const semilla = mes * 31 + numero;
  return semilla % ordenadas.length;
}

export function resolverEfemerideParaFecha(
  mes: number,
  numero: number,
): ResultadoEfemerideFecha {
  const exacta = ordenadas.find((e) => e.mes === mes && e.numero === numero);
  if (exacta) return { efemeride: exacta, esExacta: true };
  const rotada = ordenadas[indiceRotacionArchivo(mes, numero)];
  return { efemeride: rotada, esExacta: false };
}

/** Atajo: solo la efeméride (con fallback al archivo). */
export function efemerideParaFecha(mes: number, numero: number): Efemeride {
  return resolverEfemerideParaFecha(mes, numero).efemeride;
}

/** Cantidad de días del año con efeméride propia en el archivo. */
export function diasConEfemerideEnArchivo(): number {
  return ordenadas.length;
}
