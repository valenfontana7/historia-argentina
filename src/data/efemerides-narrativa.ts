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
    hook: "En Chicago, en 1886, una huelga por la jornada de ocho horas terminó en sangre.",
    giro: "Ese 1 de mayo se convirtió en símbolo mundial del trabajo — y en Argentina, en feriado y memoria de quienes pelearon por derechos que hoy damos por sentados.",
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
  "27-de-febrero": {
    hook: "La batalla de Chacabuco selló la independencia de Chile — y validó el plan más audaz de San Martín.",
    giro: "Menos de un mes después del cruce de los Andes, el Ejército de los Andes venció en campo abierto al realismo.",
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
    hook: "La Revolución del Parque de 1890 fue la primera gran rebelión civil contra la oligarquía.",
    giro: "Fracasó en las armas, pero obligó a reformas que abrieron el camino al voto secreto y al sufragio universal masculino.",
  },
  "11-de-septiembre": {
    hook: "En 1852, en Caseros, Urquiza derrotó a Rosas y cambió el equilibrio del poder.",
    giro: "La batalla más grande de la historia argentina hasta entonces puso fin a dos décadas de rosismo y abrió la Constitución de 1853.",
  },
  "12-de-febrero": {
    hook: "En 1812, el general Manuel Belgrano juró lealtad a la Primera Junta en el Cabildo de Buenos Aires.",
    giro: "Ese acto selló su compromiso con la revolución y lo empujó hacia la guerra del Norte — y hacia la bandera.",
  },
  "15-de-febrero": {
    hook: "En 1881, Roca y Alsina firmaron el pacto que federalizó Buenos Aires.",
    giro: "Cerró décadas de conflicto porteño-interior por el control del puerto y las rentas aduaneras.",
  },
  "25-de-febrero": {
    hook: "En 1812, el general Manuel Belgrano creó la Escuadra Nacional en la Fortaleza de Buenos Aires.",
    giro: "La apuesta naval complementaba la Campaña del Norte: la revolución pensaba en términos continentales.",
  },
  "2-de-abril": {
    hook: "En 1807, los porteños rechazaron por segunda vez a las tropas británicas en las calles de Buenos Aires.",
    giro: "La Reconquista demostró que el virreinato podía defenderse sin el rey — y encendió la idea de autogobierno.",
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
    hook: "En 1940, murió el general Manuel Belgrano — el intelectual que la revolución convirtió en general.",
    giro: "Su legado mezcla bandera, escuelas y batallas: el héroe que soñaba con educar antes que con conquistar.",
  },
  "14-de-junio": {
    hook: "En 1956, el general Juan José Valle fue fusilado tras el fallido levantamiento de la Frontera.",
    giro: "Su muerte marcó el fin de la resistencia peronista armada en los primeros años de la proscripción.",
  },
  "17-de-junio": {
    hook: "En 1953, Evita recibió el título de Jefa Espiritual de la Nación.",
    giro: "Fue el reconocimiento institucional de una figura que ya movía masas desde la Secretaría de Trabajo y la Fundación.",
  },
  "1-de-julio": {
    hook: "En 1816, el Congreso de Tucumán abrió sesiones en la casa de Francisca Bazán de Laguna.",
    giro: "Nueve días después pronunciarían la independencia — pero primero debían decidir si el país podía existir sin España.",
  },
  "7-de-julio": {
    hook: "En 1816, el Congreso de Tucumán declaró la independencia de las Provincias Unidas del Sur.",
    giro: "La palabra se pronunció entre guerras civiles y con el ejército realista aún dominando Lima.",
  },
  "22-de-agosto": {
    hook: "En 1806, Santiago de Liniers rechazó la primera invasión inglesa en las calles de Buenos Aires.",
    giro: "Un oficial francés al servicio de España se convirtió en héroe popular — y en símbolo de que el virreinato podía autogobernarse.",
  },
  "27-de-agosto": {
    hook: "En 1828, el tratado con el Brasil reconoció la independencia de la Banda Oriental.",
    giro: "Uruguay nació como estado separado del proyecto rioplatense — y la herida territorial sigue en la memoria argentina.",
  },
  "16-de-septiembre": {
    hook: "En 1810, el general Manuel Belgrano juró defender la Primera Junta con su vida.",
    giro: "Ese juramento lo empujó hacia la Campaña del Norte, donde ganaría las batallas que salvaron la revolución.",
  },
  "8-de-octubre": {
    hook: "En 1895, murió Domingo Faustino Sarmiento — el presidente que más apostó por la educación pública.",
    giro: "De Facundo a la presidencia: su vida entera fue una guerra contra la barbarie, escrita con escuelas y con pluma.",
  },
  "30-de-octubre": {
    hook: "En 1974, murió el general Juan Domingo Perón — tres veces presidente y figura central del siglo XX argentino.",
    giro: "Su muerte dejó un vacío de poder que el país aún no había terminado de llenar cuando estalló la dictadura.",
  },
  "10-de-noviembre": {
    hook: "En 1890, la Revolución del Parque estalló contra la oligarquía conservadora.",
    giro: "Fracasó en las armas, pero obligó a reformas que abrieron el camino al voto secreto y al sufragio universal masculino.",
  },
  "20-de-noviembre": {
    hook: "En 1955, un golpe militar derrocó a Perón y lo obligó al exilio.",
    giro: "La Revolución Libertadora abrió dieciocho años de proscripción peronista — y una grieta que el país nunca cerró del todo.",
  },
  "8-de-enero": {
    hook: "En 1817, San Martín cruzó los Andes con más de 5.000 hombres.",
    giro: "Fue la operación militar más audaz de la independencia sudamericana — y el clímax de su plan continental.",
  },
};

export function narrativaDeEfemeride(dia: string): NarrativaEfemeride | undefined {
  return narrativaEfemerides[dia];
}
