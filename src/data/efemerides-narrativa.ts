import type { CitaEfemeride } from "@/data/efemerides";

/** Capa narrativa editorial para efemérides prioritarias (hook / giro / cita). */
export type NarrativaEfemeride = {
  hook: string;
  giro: string;
  cita?: CitaEfemeride;
};

export const narrativaEfemerides: Record<string, NarrativaEfemeride> = {
  "31-de-enero": {
    hook: "El primer congreso soberano de las Provincias Unidas abrió sesiones sin declarar la independencia — y cambió el país para siempre.",
    giro: "En pocos meses legislaron como un Estado: libertad de vientres, fin de la Inquisición, Himno Nacional y moneda propia.",
  },
  "3-de-febrero": {
    hook: "San Martín tenía 35 años y nunca había comandado una batalla campal en su tierra.",
    giro: "En las orillas del Paraná, con granaderos a caballo, venció al ejército realista y demostró que la Revolución podía ganar en el campo.",
    cita: {
      texto: "Serás lo que debas ser, y si no, no serás nada.",
      atribucion: "Máxima de José de San Martín",
    },
  },
  "25-de-mayo": {
    hook: "Un rey preso en Francia y una ciudad que decidió gobernarse sola.",
    giro: "No fue un grito ni una bandera: fue un cabildo abierto que eligió continuar en nombre de Fernando VII — y abrió la grieta irreversible.",
    cita: {
      texto: "¿Qué hacemos sin rey ni virrey?",
      atribucion: "La pregunta que abrió el cabildo del 22 de mayo de 1810",
    },
  },
  "9-de-julio": {
    hook: "Nueve años después de Mayo, el Congreso de Tucumán pronunció la palabra que nadie se atrevía a decir en voz alta.",
    giro: "La independencia no se declaró en un instante de euforia: se votó entre guerras civiles y la certeza de que el imperio español aún mandaba desde Lima.",
    cita: {
      texto: "Declaramos solemnemente la independencia de estas provincias.",
      atribucion: "Acta del Congreso de Tucumán, 9 de julio de 1816",
    },
  },
  "12-de-octubre": {
    hook: "Un día que el calendario marcó como descubrimiento — y que en Argentina se debate desde hace décadas.",
    giro: "La pregunta ya no es solo qué pasó en 1492: es qué historia elegimos contar y a quién le debemos la memoria.",
  },
  "17-de-agosto": {
    hook: "Belgrano condujo el Éxodo Jujeño: abandonar la ciudad para salvar al ejército y al pueblo.",
    giro: "Pocos meses después, en Tucumán, esa misma tropa hambrienta venció al ejército realista y cambió el curso de la guerra del Norte.",
  },
  "23-de-agosto": {
    hook: "En la batalla de Tucumán, el Ejército del Norte detuvo la contraofensiva realista.",
    giro: "Fue el giro que impidió que la revolución fuera aplastada desde el Alto Perú — y abrió el camino a Salta y a la bandera.",
  },
  "20-de-junio": {
    hook: "Belgrano izó por primera vez la bandera celeste y blanca a orillas del Paraná.",
    giro: "No era un símbolo oficial todavía: era un estandarte de guerra que un general improvisado necesitaba para distinguir a sus hombres en la batalla.",
  },
  "1-de-mayo": {
    hook: "Cuatro décadas de anarquía, guerras civiles y caudillos terminaron con una ley suprema sancionada en Santa Fe.",
    giro: "La Constitución de 1853, inspirada en las Bases de Alberdi, intentó por fin convertir provincias en nación.",
  },
  "24-de-marzo": {
    hook: "Una mañana de 1976, los tanques salieron a la calle y el país despertó bajo un nuevo régimen.",
    giro: "Lo que siguió fue una de las violencias de Estado más brutales del siglo XX en América Latina — y una herida que la democracia argentina sigue procesando.",
  },
  "10-de-diciembre": {
    hook: "En 1983, Raúl Alfonsín asumió la presidencia y cerró la transición democrática.",
    giro: "Fue el fin de la dictadura y el inicio de un juicio a las juntas militares sin precedentes en el mundo.",
    cita: {
      texto: "Con la democracia se come, se cura y se educa.",
      atribucion: "Raúl Alfonsín, 10 de diciembre de 1983",
    },
  },
  "17-de-octubre": {
    hook: "Una multitud inesperada llenó la Plaza de Mayo pidiendo la libertad de Juan Domingo Perón.",
    giro: "Ese día nació el peronismo como fuerza de masas — y redefinió la política argentina para siempre.",
  },
  "26-de-julio": {
    hook: "Evita murió a los 33 años, con el país entero de luto.",
    giro: "Su funeral reunió a millones en las calles: la figura más poderosa del peronismo se había ido en el pico de su influencia.",
  },
  "2-de-febrero": {
    hook: "Pedro de Mendoza fundó la primera Buenos Aires — una ciudad condenada al hambre y al fuego.",
    giro: "Duró poco: en 1541 sus propios pobladores la abandonaron e incendiaron. La capital definitiva llegaría con Garay, cuarenta años después.",
  },
  "20-de-febrero": {
    hook: "La batalla de Salta cerró la campaña del Norte con una victoria decisiva de Belgrano.",
    giro: "El general donó sus premios para fundar escuelas — y demostró que la revolución también podía construir, no solo destruir.",
  },
  "6-de-septiembre": {
    hook: "En 1930, el primer golpe de Estado de la historia argentina derrocó a Hipólito Yrigoyen.",
    giro: "Abrió una serie de interrupciones democráticas que marcarían el siglo XX: la política argentina nunca volvería a ser la misma.",
  },
  "16-de-junio": {
    hook: "Aviones de la Marina bombardearon y ametrallaron la Plaza de Mayo en plena tarde de un día hábil.",
    giro: "El intento de asesinar a Perón dejó más de 300 civiles muertos — entre ellos escolares en un colectivo.",
  },
  "11-de-septiembre": {
    hook: "En 1852, en Caseros, Urquiza derrotó a Rosas y cambió el equilibrio del poder.",
    giro: "La batalla más grande de la historia argentina hasta entonces puso fin a dos décadas de rosismo y abrió la Constitución de 1853.",
  },
  "12-de-febrero": {
    hook: "Apenas días después de cruzar los Andes, el Ejército de los Andes chocó con el realismo en la cuesta de Chacabuco.",
    giro: "O'Higgins atacó de frente, Soler envolvió por el oeste y la caballería remató: Chile quedó en camino a la independencia.",
  },
  "15-de-febrero": {
    hook: "En una casa de adobe de San Juan, bajo una higuera, nació quien haría de la escuela pública una obsesión nacional.",
    giro: "Domingo Faustino Sarmiento pasaría del Facundo al aula: su vida entera fue una guerra contra la barbarie escrita con libros.",
  },
  "25-de-febrero": {
    hook: "En Yapeyú, en las misiones jesuíticas del litoral, nació el hijo de un oficial español que liberaría medio continente.",
    giro: "José de San Martín crecería en España, volvería a los 34 años y concebiría el plan más audaz de la independencia sudamericana.",
  },
  "27-de-febrero": {
    hook: "A orillas del Paraná, Belgrano hizo jurar a sus soldados una bandera nueva, celeste y blanca.",
    giro: "No era símbolo oficial todavía: era un estandarte de guerra para distinguir a sus hombres en plena Campaña del Norte.",
  },
  "2-de-abril": {
    hook: "Tropas argentinas desembarcaron en las Malvinas y recuperaron Puerto Argentino en nombre de la patria.",
    giro: "La dictadura apostó a una causa nacional profunda — y abrió una guerra de 74 días que el país aún no terminó de procesar.",
  },
  "5-de-abril": {
    hook: "En 1818, en Maipú, San Martín selló la independencia de Chile.",
    giro: "Fue el paso intermedio indispensable de su plan continental: sin Chile libre, Perú seguía siendo fortaleza realista.",
  },
  "22-de-mayo": {
    hook: "En 1810, el cabildo abierto de Buenos Aires eligió continuar en nombre de Fernando VII.",
    giro: "No declaró la independencia: abrió la grieta irreversible entre quienes querían autonomía y quienes temían al rey.",
  },
  "29-de-mayo": {
    hook: "En 1813, el Congreso de Tucumán declaró la libertad de vientres.",
    giro: "Fue una de las leyes más radicales del mundo en su momento — y un símbolo de la revolución que el país aún procesa.",
  },
  "3-de-junio": {
    hook: "En 1813, el Congreso de Tucumán sancionó el Himno Nacional argentino.",
    giro: "La letra de Vicente López y la música de Blas Parera buscaban unir provincias en guerra contra el mismo enemigo.",
  },
  "10-de-junio": {
    hook: "Buenos Aires creó la primera comandancia política y militar argentina en las Islas Malvinas.",
    giro: "Luis Vernet ya tenía colonia en Puerto Soledad: el Estado rioplatense intentó afirmar soberanía con familias, ganado y comercio.",
  },
  "14-de-junio": {
    hook: "Tras 74 días de guerra, las fuerzas argentinas en Puerto Argentino se rindieron.",
    giro: "649 argentinos, 255 británicos y 3 isleñas muertos: miles de veteranos cargarían las heridas del conflicto durante décadas.",
  },
  "17-de-junio": {
    hook: "Herido diez días antes en una incursión realista, Güemes murió en un catre rodeado de sus gauchos.",
    giro: "A los 36 años, el único general argentino caído en acción en la Independencia cerró la Guerra Gaucha que sostuvo el norte.",
  },
  "1-de-julio": {
    hook: "A los 78 años, en ejercicio de su tercera presidencia, murió Juan Domingo Perón.",
    giro: "Días antes había dicho desde el balcón de la Casa Rosada que llevaba en los oídos la palabra del pueblo argentino.",
  },
  "7-de-julio": {
    hook: "El general Whitelocke firmó la capitulación: sus tropas deshechas se retiraban del Río de la Plata.",
    giro: "Buenos Aires, sin ayuda de España, había derrotado por segunda vez al mayor imperio del mundo en sus propias calles.",
  },
  "22-de-agosto": {
    hook: "Cerca de un millón de personas colmaron la avenida 9 de Julio pidiendo que Evita aceptara la vicepresidencia.",
    giro: "Desde el palco, entre lágrimas, pidió tiempo: «Haré lo que diga el pueblo» — y el justicialismo mostró su fuerza de masas.",
  },
  "27-de-agosto": {
    hook: "Desde el techo del Teatro Coliseo, cuatro jóvenes transmitieron la ópera Parsifal por primera vez al público.",
    giro: "Los «locos de la azotea» inventaron la radiodifusión regular: la radio como medio masivo nació en Buenos Aires.",
  },
  "16-de-septiembre": {
    hook: "Un alzamiento cívico-militar iniciado en Córdoba terminó con la renuncia de Perón en pocos días.",
    giro: "La Revolución Libertadora lo envió al exilio por 18 años — y abrió la proscripción peronista que marcaría el siglo.",
  },
  "8-de-octubre": {
    hook: "En Lobos, provincia de Buenos Aires, nació quien redefiniría la política argentina del siglo XX.",
    giro: "Juan Domingo Perón pasaría del Colegio Militar a la Secretaría de Trabajo — y a tres presidencias que aún dividen al país.",
  },
  "30-de-octubre": {
    hook: "Tras siete años de dictadura, los argentinos volvieron a las urnas con el país quebrado y herido.",
    giro: "Raúl Alfonsín ganó con el 52 % prometiendo juzgar el terrorismo de Estado — y la democracia volvió para quedarse.",
  },
  "10-de-noviembre": {
    hook: "En el Perdriel nació José Hernández, el autor que convirtió al gaucho perseguido en símbolo de la patria.",
    giro: "El Martín Fierro no es solo un poema: es el día en que la tradición argentina se volvió literatura universal.",
  },
  "20-de-noviembre": {
    hook: "En un recodo del Paraná, unos mil hombres y tres cadenas enfrentaron la flota anglo-francesa más poderosa del continente.",
    giro: "La Vuelta de Obligado duró siete horas: Argentina perdió la batalla, pero ganó el símbolo de soberanía que Rosas supo explotar.",
  },
  "8-de-enero": {
    hook: "Argentina, Brasil y Uruguay sellaron en Buenos Aires un tratado secreto contra Paraguay.",
    giro: "La Triple Alianza abrió la guerra más sangrienta de América del Sur — y una herida que el continente aún procesa.",
  },
};

export function narrativaDeEfemeride(dia: string): NarrativaEfemeride | undefined {
  return narrativaEfemerides[dia];
}
