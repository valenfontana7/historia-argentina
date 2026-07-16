import type { CitaEfemeride } from "@/data/efemerides";

/** Capa narrativa editorial para efemérides prioritarias (hook / giro / cita). */
export type NarrativaEfemeride = {
  hook: string;
  giro: string;
  cita?: CitaEfemeride;
};

export const narrativaEfemerides: Record<string, NarrativaEfemeride> = {
  "31-de-enero": {
    hook: "El primer congreso soberano de las Provincias Unidas abrió sesiones sin declarar la independencia, y cambió el país para siempre.",
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
    giro: "No fue un grito ni una bandera: fue un cabildo abierto que eligió continuar en nombre de Fernando VII, y abrió la grieta irreversible.",
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
    hook: "Un día que el calendario marcó como descubrimiento, y que en Argentina se debate desde hace décadas.",
    giro: "La pregunta ya no es solo qué pasó en 1492: es qué historia elegimos contar y a quién le debemos la memoria.",
  },
  "17-de-agosto": {
    hook: "Belgrano condujo el Éxodo Jujeño: abandonar la ciudad para salvar al ejército y al pueblo.",
    giro: "Pocos meses después, en Tucumán, esa misma tropa hambrienta venció al ejército realista y cambió el curso de la guerra del Norte.",
  },
  "23-de-agosto": {
    hook: "En la batalla de Tucumán, el Ejército del Norte detuvo la contraofensiva realista.",
    giro: "Fue el giro que impidió que la revolución fuera aplastada desde el Alto Perú, y abrió el camino a Salta y a la bandera.",
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
    giro: "Lo que siguió fue una de las violencias de Estado más brutales del siglo XX en América Latina, y una herida que la democracia argentina sigue procesando.",
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
    giro: "Ese día nació el peronismo como fuerza de masas, y redefinió la política argentina para siempre.",
  },
  "26-de-julio": {
    hook: "Evita murió a los 33 años, con el país entero de luto.",
    giro: "Su funeral reunió a millones en las calles: la figura más poderosa del peronismo se había ido en el pico de su influencia.",
  },
  "2-de-febrero": {
    hook: "Pedro de Mendoza fundó la primera Buenos Aires, una ciudad condenada al hambre y al fuego.",
    giro: "Duró poco: en 1541 sus propios pobladores la abandonaron e incendiaron. La capital definitiva llegaría con Garay, cuarenta años después.",
  },
  "20-de-febrero": {
    hook: "La batalla de Salta cerró la campaña del Norte con una victoria decisiva de Belgrano.",
    giro: "El general donó sus premios para fundar escuelas, y demostró que la revolución también podía construir, no solo destruir.",
  },
  "6-de-septiembre": {
    hook: "En 1930, el primer golpe de Estado de la historia argentina derrocó a Hipólito Yrigoyen.",
    giro: "Abrió una serie de interrupciones democráticas que marcarían el siglo XX: la política argentina nunca volvería a ser la misma.",
  },
  "16-de-junio": {
    hook: "Aviones de la Marina bombardearon y ametrallaron la Plaza de Mayo en plena tarde de un día hábil.",
    giro: "El intento de asesinar a Perón dejó más de 300 civiles muertos: entre ellos escolares en un colectivo.",
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
    giro: "La dictadura apostó a una causa nacional profunda, y abrió una guerra de 74 días que el país aún no terminó de procesar.",
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
    giro: "Fue una de las leyes más radicales del mundo en su momento, y un símbolo de la revolución que el país aún procesa.",
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
  "16-de-julio": {
    hook: "Un puñado de estancieros firmó el acta de una sociedad que no parecía política, y cambió el poder económico del país.",
    giro: "La Sociedad Rural se convirtió en el altavoz del modelo agroexportador: la Argentina de la carne y el trigo mirando a Europa.",
  },
  "17-de-julio": {
    hook: "En Tucumán nació el militar que unificaría el Estado nacional a fuerza de campaña, ferrocarril y poder.",
    giro: "Roca fue dos veces presidente y cerró el mapa argentino: dejando también la herida abierta de la Campaña al Desierto.",
  },
  "19-de-julio": {
    hook: "Nació el abogado que en el Cabildo Abierto diría la frase que cambió el virreinato: caducado el rey, la soberanía vuelve al pueblo.",
    giro: "Castelli llevó esa idea al Alto Perú y pagó con juicio, enfermedad y olvido temprano el precio de la revolución sin máscaras.",
  },
  "21-de-julio": {
    hook: "Doce días después del Acta, los diputados volvieron a poner el cuerpo: juraron la independencia ante Dios y la Patria.",
    giro: "Ya no bastaba haberla declarado: cada provincia prometía defenderla frente a España y a cualquier otra dominación extranjera.",
  },
  "22-de-julio": {
    hook: "En Buenos Aires abrió un instituto que mezcló arte, diseño y ciencias sociales como si fuera un laboratorio del futuro.",
    giro: "El Di Tella fue la vanguardia urbana de los 60, hasta que la dictadura lo asfixó y lo convirtió en mito cultural.",
  },
  "23-de-julio": {
    hook: "Buenos Aires estaba ocupada por los ingleses. Desde Montevideo, un oficial francés al servicio de España propuso recuperarla.",
    giro: "Liniers armó milicias, cruzó el río y semanas después la ciudad volvió a manos locales: la Reconquista había empezado.",
  },
  "24-de-julio": {
    hook: "En Caracas nació el otro libertador del continente: el que miraría al sur desde el norte.",
    giro: "Bolívar y San Martín se encontrarían en Guayaquil: dos estrategias para un mismo sueño de emancipación americana.",
  },
  "25-de-julio": {
    hook: "La bandera que Belgrano izó a contrapelo de Buenos Aires dejó de ser un gesto militar: el Congreso la hizo ley.",
    giro: "Celeste y blanca, bandera menor de ejércitos y fortalezas, el Sol vendría después; el símbolo, ya era de la Nación.",
  },
  "27-de-julio": {
    hook: "En Guayaquil, a puertas cerradas, San Martín y Bolívar volvieron a hablar del Perú y del mando de la guerra.",
    giro: "San Martín se retiró; Bolívar tomó el relevo. El mapa de la independencia americana se redibujó sin un tratado público.",
  },
  "31-de-julio": {
    hook: "Murió el ingeniero que soñó una Argentina capaz de forjar su propio acero.",
    giro: "Savio dejó Fabricaciones Militares, Zapla y el plan de Somisa: la soberanía también se mide en hornos y rieles.",
  },
  "1-de-agosto": {
    hook: "Carlos III dibujó un virreinato nuevo con capital en Buenos Aires.",
    giro: "Tres décadas después, esa misma capital haría la revolución que destrozaría el mapa colonial.",
  },
  "2-de-agosto": {
    hook: "Hoteleros y gastronómicos de todo el país se unieron en una sola federación.",
    giro: "Bajo el peronismo, el sindicato dejó de ser periferia: pasó a ser actor central de la política laboral.",
  },
  "3-de-agosto": {
    hook: "A los 25 años murió Remedios de Escalada, la esposa que había sostenido a San Martín desde la retaguardia.",
    giro: "El Libertador recibió la noticia lejos: otra herida privada de una guerra que no perdonaba a nadie.",
  },
  "6-de-agosto": {
    hook: "En los Andes peruanos, la caballería patriota quebrantó a los realistas en Junín.",
    giro: "Era el preludio de Ayacucho: la emancipación del sur ya no tenía marcha atrás.",
  },
  "8-de-agosto": {
    hook: "El Chaco dejó de ser territorio nacional y pasó a ser provincia.",
    giro: "El primer peronismo redibujó el mapa federal: más provincias, más representación desde el interior.",
  },
  "9-de-agosto": {
    hook: "Murió el presidente que hizo secreto y obligatorio el voto.",
    giro: "Sin la ley Sáenz Peña, Yrigoyen no habría llegado por las urnas: la democracia imperfecta quedó abierta.",
  },
  "10-de-agosto": {
    hook: "En El Palomar nació la Escuela de Aviación Militar.",
    giro: "Décadas después sería el Día de la Fuerza Aérea: el cielo también entró en la historia argentina.",
  },
  "11-de-agosto": {
    hook: "Buenos Aires inauguró un homenaje a la casa francesa donde San Martín envejeció en el exilio.",
    giro: "El país traía de vuelta, en símbolos, a quien se había negado a pelear en las guerras civiles.",
  },
  "13-de-agosto": {
    hook: "En La Rioja nació la maestra que fundaría el primer jardín de infantes del país.",
    giro: "Rosario Vera Peñaloza convirtió el juego infantil en pedagogía nacional, el sueño sarmientino, en clave de infancia.",
  },
  "14-de-agosto": {
    hook: "Cerró la primera etapa del juicio que ningún país de la región se había atrevido a hacer.",
    giro: "Bajo Alfonsín, la democracia argentina juzgó a sus propios genocidas y se volvió referencia mundial.",
  },
  "16-de-agosto": {
    hook: "La revolución de mayo ya no cabía en Buenos Aires: había que ganar el interior.",
    giro: "Expediciones, milicias y la prensa de Moreno tejieron un poder frágil, pero irreversible.",
  },
  "19-de-agosto": {
    hook: "Nació una universidad pensada para ingenieros e industria, no solo para abogados y médicos.",
    giro: "La UTN extendió el saber técnico por el mapa: el desarrollo también se estudia en aulas.",
  },
  "20-de-agosto": {
    hook: "Nació Monteagudo: el revolucionario más brillante y más temido del ciclo independentista.",
    giro: "De secretario de Castelli a pieza de San Martín en el Perú, murió asesinado: la revolución como apuesta total.",
  },
  "21-de-agosto": {
    hook: "El Senado dio el paso decisivo hacia el voto femenino.",
    giro: "Evita había convertido esa causa en bandera: en 1951 las argentinas votarían por primera vez.",
  },
  "24-de-agosto": {
    hook: "Nació Borges: el escritor que pondría a Buenos Aires en el centro del canon mundial.",
    giro: "No gobernó ni peleó batallas: reinventó cómo se lee el país desde una biblioteca.",
  },
  "25-de-agosto": {
    hook: "En el corazón del territorio cuyano se fundó San Luis de Loyola.",
    giro: "Otra ciudad-eslabón del camino colonial entre el Alto Perú y el Río de la Plata.",
  },
  "28-de-agosto": {
    hook: "El Estado decidió guardar sus papeles: nació el Archivo General de la Nación.",
    giro: "Sin memoria escrita, la revolución no podría contar su propia historia.",
  },
  "29-de-agosto": {
    hook: "En Tucumán nació quien pensó la Constitución antes de que existiera.",
    giro: "Alberdi escribió las Bases; el Congreso de 1853 las convirtió en ley. Gobernar, para él, era poblar.",
  },
  "30-de-agosto": {
    hook: "La Porteña silbó por primera vez entre el Parque y Flores.",
    giro: "Nacía el ferrocarril argentino: el riel cambiaría la economía, la guerra y la vida cotidiana.",
  },
  "31-de-agosto": {
    hook: "En Inglaterra se botó la fragata escuela que formaría a generaciones de oficiales argentinos.",
    giro: "La Presidente Sarmiento dio la vuelta al mundo, y hoy es museo en Puerto Madero.",
  },
  "2-de-septiembre": {
    hook: "Japón firmó la rendición: la guerra más destructiva del siglo llegaba a su fin.",
    giro: "La Argentina entraba al orden de posguerra, el mismo escenario en el que Perón consolidaría su poder.",
  },
  "3-de-septiembre": {
    hook: "Mitre fundó un instituto para mapear e historiar el Río de la Plata.",
    giro: "Antes de ser presidente, ya pensaba la nación como archivo, mapa y relato.",
  },
  "4-de-septiembre": {
    hook: "Una nevada mortal cayó sobre Buenos Aires… en viñetas.",
    giro: "El Eternauta nació en Hora Cero; décadas después se leería como alegoría de la resistencia.",
  },
  "5-de-septiembre": {
    hook: "Buenos Aires estrenó el Teatro Cervantes, templo de la dramaturgia nacional.",
    giro: "Desde entonces, el país también se mira a sí mismo sobre un escenario.",
  },
  "7-de-septiembre": {
    hook: "El príncipe Pedro gritó la independencia a orillas del Ipiranga.",
    giro: "Nacía el Imperio del Brasil, y una nueva rivalidad que pronto llegaría a la Banda Oriental.",
  },
  "8-de-septiembre": {
    hook: "En Santa Fe nació la primera colonia agrícola organizada del país.",
    giro: "Esperanza anticipó el «gobernar es poblar»: arados, inmigrantes y la Argentina del trigo.",
  },
  "10-de-septiembre": {
    hook: "En la crisis de 1880, Roca consolidó el camino hacia una capital para todos.",
    giro: "Buenos Aires dejaría de ser botín de una provincia: sería la capital de la Nación.",
  },
  "12-de-septiembre": {
    hook: "El Congreso dio a los maestros un estatuto de alcance nacional.",
    giro: "Sin carrera docente estable, recordaba Sarmiento, no hay República.",
  },
  "13-de-septiembre": {
    hook: "Moreno convenció a la Junta: la revolución también necesitaba una biblioteca.",
    giro: "Nació la Biblioteca Pública, y con ella, el sueño de un pueblo que lee el poder.",
  },
  "14-de-septiembre": {
    hook: "Roca creó el Banco Hipotecario: crédito largo sobre la tierra.",
    giro: "La Argentina del Centenario también se construyó hipotecando el futuro.",
  },
  "15-de-septiembre": {
    hook: "Nació Bioy Casares, el cómplice literario de Borges.",
    giro: "La invención de Morel bastó para poner a la fantasía argentina en el canon mundial.",
  },
  "17-de-septiembre": {
    hook: "En Pavón, Mitre y Urquiza midieron el país a cañonazos.",
    giro: "Buenos Aires volvió al centro: la Confederación quedó herida de muerte.",
  },
  "20-de-septiembre": {
    hook: "En el Monumental, Soda Stereo apagó los amplificadores por última vez.",
    giro: "Una generación despide al rock que había sonado en democracia.",
  },
  "22-de-septiembre": {
    hook: "Curupaytí convirtió el asalto aliado en una carnicería.",
    giro: "La Triple Alianza descubrió el precio más alto de la guerra total.",
  },
  "25-de-septiembre": {
    hook: "El Estado adoptó la versión musical del Himno arreglada por Esnaola.",
    giro: "La marcha de la Asamblea del Año XIII se volvió ritual escolar y ceremonia.",
  },
  "27-de-septiembre": {
    hook: "La Biblioteca Nacional estrenó sede en la calle Perú, bajo Groussac.",
    giro: "El sueño de Moreno ya era monumento del Centenario.",
  },
  "28-de-septiembre": {
    hook: "Abrió el Museo Etnográfico Ambrosetti: la universidad mira a los pueblos originarios.",
    giro: "Otra forma de contar el pasado nacional: lejos del bronce heroico.",
  },
  "29-de-septiembre": {
    hook: "Vélez Sarsfield entregó al país un Código Civil.",
    giro: "Familia, contratos y propiedad: la vida privada también quedó bajo una ley común.",
  },
  "30-de-septiembre": {
    hook: "Moreno pidió al virrey la libertad de comercio en un memorial demoledor.",
    giro: "La Representación de los Hacendados anticipó Mayo: primero el comercio, después el poder.",
  },
  "2-de-octubre": {
    hook: "Nació el librero en cuya trastienda se reuniría el Salón Literario.",
    giro: "Sastre unió libros y paisaje: la Generación del 37 empezaba a imaginar el país en una librería.",
  },
  "4-de-octubre": {
    hook: "Nació Marcelo T. de Alvear, la otra cara del radicalismo.",
    giro: "Frente al personalismo de Yrigoyen, el alvearismo apostó a un radicalismo más cercano a las élites.",
  },
  "5-de-octubre": {
    hook: "Murió Vieytes, el periodista que soñaba árboles, cultivos y un país productivo.",
    giro: "La revolución ilustrada también se hacía con semilla e imprenta.",
  },
  "7-de-octubre": {
    hook: "A orillas del Paraná nació el pueblo que sería Rosario.",
    giro: "Allí Belgrano izaría la bandera: la ciudad del interior mirando al río y a la historia.",
  },
  "9-de-octubre": {
    hook: "En Jujuy murió Lavalle, el general que había fusilado a Dorrego.",
    giro: "La tragedia unitaria cerraba un ciclo de gloria militar y venganza política.",
  },
  "10-de-octubre": {
    hook: "Murió Vicente López y Planes, autor de la letra del Himno.",
    giro: "La marcha estrenada en la tertulia de Mariquita sigue siendo la voz colectiva del país.",
  },
  "11-de-octubre": {
    hook: "Nació Pellegrini, el vicepresidente que salvaría al Estado en la crisis del 90.",
    giro: "Fundó el Banco Nación y sostuvo la República cuando el abismo financiero parecía inevitable.",
  },
  "13-de-octubre": {
    hook: "Murió Carriego, el poeta del organito y la costurerita.",
    giro: "El arrabal entró en la literatura argentina — y Borges lo leería como revelación.",
  },
  "14-de-octubre": {
    hook: "La Universidad Obrera pasó a llamarse Universidad Tecnológica Nacional.",
    giro: "El saber técnico se extendió por el mapa: ingenieros para un país industrial.",
  },
  "15-de-octubre": {
    hook: "Milstein recibió el Nobel de Medicina por los anticuerpos monoclonales.",
    giro: "La ciencia argentina volvía a transformar la medicina global.",
  },
  "19-de-octubre": {
    hook: "Murió Roca: el presidente que cerró el mapa… y abrió una herida.",
    giro: "Federalización, ferrocarriles y Campaña al Desierto: su legado sigue dividiendo la memoria.",
  },
  "20-de-octubre": {
    hook: "El Cabildo de la aldea eligió a San Martín de Tours como patrono.",
    giro: "La Buenos Aires de Garay se daba un santo — siglos antes de ser capital.",
  },
  "22-de-octubre": {
    hook: "El país fijó un día para el derecho a la identidad.",
    giro: "Las Abuelas de Plaza de Mayo convirtieron la búsqueda de nietos en política de Estado.",
  },
  "23-de-octubre": {
    hook: "En Cepeda, Urquiza derrotó a Buenos Aires.",
    giro: "El Pacto de San José de Flores haría negociable la grieta que Pavón reabriría después.",
  },
  "25-de-octubre": {
    hook: "Alfonsina eligió el mar de Mar del Plata.",
    giro: "Su poesía había puesto la voz femenina en el centro de la lírica argentina.",
  },
  "26-de-octubre": {
    hook: "La Junta Grande reglamentó la libertad de imprenta.",
    giro: "Un paso frágil, pero claro: sin prensa no hay opinión pública revolucionaria.",
  },
  "27-de-octubre": {
    hook: "Leloir recibió el Nobel de Química en Estocolmo.",
    giro: "Con recursos escasos y genio sobrado, el laboratorio también fue una forma de patria.",
  },
  "28-de-octubre": {
    hook: "Nació Frondizi, el presidente del desarrollismo.",
    giro: "Apostó a la industria y al petróleo — y cayó por la fragilidad democrática de su época.",
  },
  "29-de-octubre": {
    hook: "Se inauguró la Base Marambio, con pista permanente en la Antártida.",
    giro: "La soberanía blanca se volvió hecho cotidiano: aviones, ciencia y una bandera en el hielo.",
  },
  "31-de-octubre": {
    hook: "Murió José Ingenieros, autor de El hombre mediocre.",
    giro: "Diagnosticó las mediocridades del poder con la prosa del positivismo argentino.",
  },
  "2-de-noviembre": {
    hook: "Nació Victorino de la Plaza, el último presidente conservador antes del radicalismo.",
    giro: "Entregó el poder a Yrigoyen: la República Conservadora cerraba su ciclo.",
  },
  "4-de-noviembre": {
    hook: "Murió Martínez Estrada, el ensayista que radiografió la pampa.",
    giro: "Su prosa áspera convirtió al país en un diagnóstico sin anestesia.",
  },
  "6-de-noviembre": {
    hook: "Murió Estanislao del Campo, autor del Fausto gauchesco.",
    giro: "Un peón en la ópera: el habla rural entraba en la literatura letrada.",
  },
  "7-de-noviembre": {
    hook: "En Suipacha, la revolución ganó su primera batalla.",
    giro: "Mayo dejó de ser solo un cabildo: se convirtió en una guerra que se podía ganar.",
  },
  "8-de-noviembre": {
    hook: "Los estancieros del sur se alzaron contra Rosas.",
    giro: "Los Libres del Sur fueron aplastados, pero dejaron una grieta en el orden rosista.",
  },
  "9-de-noviembre": {
    hook: "En Mendoza, San Martín fundó un colegio para la juventud cuyana.",
    giro: "El plan continental también se pelea con aulas: sin educación no hay ciudadanía.",
  },
  "13-de-noviembre": {
    hook: "Nació Jauretche, la prosa sospechosa del pensamiento nacional.",
    giro: "FORJA y El medio pelo: escuela permanente contra el colonialismo cultural.",
  },
  "15-de-noviembre": {
    hook: "Garay fundó Santa Fe a orillas del Paraná.",
    giro: "Río, comercio y frontera: el Litoral empezaba a escribirse en el mapa.",
  },
  "16-de-noviembre": {
    hook: "Belgrano partió hacia el Paraguay a sumar provincias a Mayo.",
    giro: "La campaña falló en lo militar, pero dejó claro el sueño continental.",
  },
  "18-de-noviembre": {
    hook: "Murió Rondeau, Director Supremo de las Provincias Unidas.",
    giro: "De la gloria independentista a la anarquía: el precio de pelear sin acordar.",
  },
  "19-de-noviembre": {
    hook: "Dardo Rocha trazó La Plata sobre el pasto.",
    giro: "Diagonales y progreso: la provincia se dio una capital digna del ochenta.",
  },
  "21-de-noviembre": {
    hook: "Nació Domingo French, el de las escarapelas en la plaza.",
    giro: "Mayo hecho fusil y cinta celeste: la revolución de la calle.",
  },
  "22-de-noviembre": {
    hook: "El cuerpo de Evita desapareció de la CGT.",
    giro: "Ni muerta pudo ser borrada: el secuestro la volvió mito aún más poderoso.",
  },
  "23-de-noviembre": {
    hook: "Buenos Aires aceptó la Constitución reformada tras Cepeda.",
    giro: "Mitre cerró el reingreso porteño: un mismo texto para casi todo el mapa.",
  },
  "24-de-noviembre": {
    hook: "Bouchard izó la bandera en Monterey, California.",
    giro: "La emancipación americana llegó —aunque fuera un instante— al Pacífico norte.",
  },
  "25-de-noviembre": {
    hook: "Murió Avellaneda en alta mar, rumbo al olvido físico y a la memoria política.",
    giro: "Escuelas, inmigración y Desierto: el ochenta ya no necesitaba a su presidente.",
  },
  "26-de-noviembre": {
    hook: "Nació Pérez Esquivel, futuro Nobel de la Paz.",
    giro: "La resistencia no violenta argentina tendría voz en Estocolmo.",
  },
  "28-de-noviembre": {
    hook: "En Lima, San Martín organizaba el Protectorado del Perú.",
    giro: "Había patria nueva, pero aún faltaba Ayacucho — y otro libertador.",
  },
  "29-de-noviembre": {
    hook: "Argentina y Chile firmaron la paz del Beagle en el Vaticano.",
    giro: "Alfonsín eligió negociar: la soberanía también se defiende sin guerra.",
  },
  "30-de-noviembre": {
    hook: "La disputa por la Banda Oriental incendió la guerra con el Brasil.",
    giro: "Un conflicto costoso: al final nacería el Uruguay como Estado tapón.",
  },
  "22-de-agosto": {
    hook: "Cerca de un millón de personas colmaron la avenida 9 de Julio pidiendo que Evita aceptara la vicepresidencia.",
    giro: "Desde el palco, entre lágrimas, pidió tiempo: «Haré lo que diga el pueblo», y el justicialismo mostró su fuerza de masas.",
  },
  "27-de-agosto": {
    hook: "Desde el techo del Teatro Coliseo, cuatro jóvenes transmitieron la ópera Parsifal por primera vez al público.",
    giro: "Los «locos de la azotea» inventaron la radiodifusión regular: la radio como medio masivo nació en Buenos Aires.",
  },
  "16-de-septiembre": {
    hook: "Un alzamiento cívico-militar iniciado en Córdoba terminó con la renuncia de Perón en pocos días.",
    giro: "La Revolución Libertadora lo envió al exilio por 18 años, y abrió la proscripción peronista que marcaría el siglo.",
  },
  "8-de-octubre": {
    hook: "En Lobos, provincia de Buenos Aires, nació quien redefiniría la política argentina del siglo XX.",
    giro: "Juan Domingo Perón pasaría del Colegio Militar a la Secretaría de Trabajo, y a tres presidencias que aún dividen al país.",
  },
  "30-de-octubre": {
    hook: "Tras siete años de dictadura, los argentinos volvieron a las urnas con el país quebrado y herido.",
    giro: "Raúl Alfonsín ganó con el 52 % prometiendo juzgar el terrorismo de Estado, y la democracia volvió para quedarse.",
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
    giro: "La Triple Alianza abrió la guerra más sangrienta de América del Sur, y una herida que el continente aún procesa.",
  },
  "1-de-enero": {
    hook: "Empezó a regir el Código Civil de Vélez Sarsfield.",
    giro: "Familia, contratos y propiedad: la Argentina liberal también se escribió en artículos.",
  },
  "2-de-enero": {
    hook: "Nació Juan José Paso, futuro secretario de la Primera Junta.",
    giro: "La revolución también se hizo con legajos, actas y una pluma de abogado.",
  },
  "3-de-enero": {
    hook: "Gran Bretaña desalojó Puerto Soledad y ocupó las Malvinas.",
    giro: "Nació la disputa atlántica que 1982 reabriría con sangre.",
  },
  "4-de-enero": {
    hook: "Buenos Aires, Santa Fe y Entre Ríos firmaron el Pacto Federal.",
    giro: "El federalismo argentino nació de acuerdos entre provincias, no de un solo centro.",
  },
  "5-de-enero": {
    hook: "Lisandro de la Torre se quitó la vida tras años de duelos políticos.",
    giro: "Se apagó una ética opositora intransigente de la Década Infame.",
  },
  "6-de-enero": {
    hook: "Argentina y Paraguay fijaron fronteras tras la Triple Alianza.",
    giro: "La diplomacia cerró en el mapa lo que la guerra había dejado abierto.",
  },
  "7-de-enero": {
    hook: "El conflicto Vasena encendió la Semana Trágica en Buenos Aires.",
    giro: "Huelga, represión y cientos de muertos: la ciudad industrial bajo Yrigoyen.",
  },
  "9-de-enero": {
    hook: "Nació Rodolfo Walsh, el periodista de Operación Masacre.",
    giro: "Su Carta abierta a la Junta sería su última batalla: desapareció al día siguiente.",
  },
  "10-de-enero": {
    hook: "Murió el Deán Funes, clérigo ilustrado de la Gazeta.",
    giro: "Púlpito e imprenta: acompañó la década de Mayo con pluma y sermón.",
  },
  "11-de-enero": {
    hook: "La Plata estrenó alumbrado eléctrico público.",
    giro: "La capital provincial se ofreció como vitrina del progreso del ochenta.",
  },
  "12-de-enero": {
    hook: "La fragata Sarmiento zarpó a dar la vuelta al mundo.",
    giro: "La Armada educaba oficiales mirando el horizonte con el nombre del maestro.",
  },
  "13-de-enero": {
    hook: "El Alto Perú se proclamó República de Bolívar.",
    giro: "Charcas y Potosí dejaron el proyecto rioplatense: el mapa de Mayo se partió.",
  },
  "14-de-enero": {
    hook: "Nació Ascasubi, poeta gauchesco enemigo de Rosas.",
    giro: "El verso popular se volvió arma: gaucho contra el Restaurador.",
  },
  "15-de-enero": {
    hook: "Un terremoto arrasó San Juan y dejó miles de muertos.",
    giro: "De la catástrofe nacería, días después, el encuentro de Perón y Eva.",
  },
  "16-de-enero": {
    hook: "La AFA retiró a la selección del Mundial de Brasil 1950.",
    giro: "Hasta las ausencias del fútbol hicieron diplomacia bajo el peronismo.",
  },
  "17-de-enero": {
    hook: "Belgrano entregó el Ejército del Norte a San Martín.",
    giro: "Dos estrategias se miraron a la cara: el Norte herido y el plan de los Andes.",
  },
  "18-de-enero": {
    hook: "Murió Arturo Illia, el presidente derrocado por su honestidad.",
    giro: "Su ética radical alimentó el camino que Alfonsín recorrería ese mismo año.",
  },
  "19-de-enero": {
    hook: "Murió Mitre: presidente, general, historiador y fundador de La Nación.",
    giro: "Dejó una historiografía fundacional y un diario para seguir disputando el país.",
  },
  "20-de-enero": {
    hook: "Moreno izó la bandera en el Nahuel Huapi.",
    giro: "Exploración y soberanía: la Patagonia entró al mapa con la mirada del perito.",
  },
  "21-de-enero": {
    hook: "Murió Cayetano Rodríguez, mentor de Moreno y diputado del Año XIII.",
    giro: "Fraile ilustrado: versos y actas en los años en que Buenos Aires aprendía a gobernarse.",
  },
  "22-de-enero": {
    hook: "En el Luna Park, Perón conoció a Eva Duarte.",
    giro: "De una noche solidaria nació la pareja política más poderosa del siglo.",
  },
  "23-de-enero": {
    hook: "En Montevideo murió Juan Cruz Varela, poeta rivadaviano.",
    giro: "Se apagó una generación que había soñado la república en verso neoclásico.",
  },
  "24-de-enero": {
    hook: "Murió Oliverio Girondo, poeta de la vanguardia martinfierrista.",
    giro: "La ciudad quedó sin uno de sus experimentos verbales más feroces.",
  },
  "25-de-enero": {
    hook: "Se firmó el Tratado del Cuadrilátero en Santa Fe.",
    giro: "Otro pacto preexistente: el federalismo litoraleño antes de la Constitución.",
  },
  "26-de-enero": {
    hook: "Murió el Cura Brochero, el gaucho de las sierras cordobesas.",
    giro: "Caminos, escuelas y pastoral a caballo: primero constructor, después santo.",
  },
  "27-de-enero": {
    hook: "Perón dejó el Caribe y se instaló en la España de Franco.",
    giro: "Desde Madrid tejería la proscripción hasta el regreso de los setenta.",
  },
  "28-de-enero": {
    hook: "Murió Quinquela Martín, el pintor del Riachuelo.",
    giro: "Grúas, barcos y humo: La Boca quedó convertida en mito visual.",
  },
  "29-de-enero": {
    hook: "Se inauguró la Casa de Correos en Buenos Aires.",
    giro: "Cartas y telégrafo: comunicar el territorio también es gobernarlo.",
  },
  "30-de-enero": {
    hook: "Se creó el Consulado de Buenos Aires y Belgrano fue su secretario.",
    giro: "Antes de la revolución ya pensaba el país: comercio libre, escuelas y lino.",
  },
  "8-de-febrero": {
    hook: "Nació en Salta Martín Miguel de Güemes.",
    giro: "Sin su guerra gaucha, el plan de San Martín hacia los Andes quedaba expuesto.",
  },
  "1-de-febrero": {
    hook: "En Cepeda, los federales derribaron el Directorio.",
    giro: "Sin autoridad central, el Año XX enseñó el precio del vacío institucional.",
  },
  "4-de-febrero": {
    hook: "La Asamblea liberó a los esclavos extranjeros que llegaran al territorio.",
    giro: "Paso incompleto, pero la revolución empezó a medir la libertad también en cuerpos.",
  },
  "5-de-febrero": {
    hook: "Victoria Ocampo impulsó el Fondo Nacional de las Artes.",
    giro: "La cultura ganó una institución con reglas, no solo mecenas y censores.",
  },
  "6-de-febrero": {
    hook: "Tras Caseros, Rosas partió al exilio bajo amparo británico.",
    giro: "Terminó el poder personal: tocaba reinventar el país en Constitución.",
  },
  "7-de-febrero": {
    hook: "Rivadavia asumió la primera presidencia de las Provincias Unidas.",
    giro: "Universidad y crédito contra caudillos: el experimento unitario duró poco.",
  },
  "9-de-febrero": {
    hook: "En los Corales, las Provincias Unidas golpearon al Imperio del Brasil.",
    giro: "La guerra cisplatina se pelea también con escuadra: soberanía no es solo tierra.",
  },
  "10-de-febrero": {
    hook: "Se sancionó la Ley Sáenz Peña: voto secreto y obligatorio.",
    giro: "El fraude patriótico perdió su herramienta; Yrigoyen entraría por esa puerta.",
  },
  "11-de-febrero": {
    hook: "La Asamblea del Año XIII aprobó la marcha que sería Himno.",
    giro: "La revolución también se cantó: identidad en verso y música.",
  },
  "13-de-febrero": {
    hook: "Belgrano pidió la escarapela celeste y blanca para sus tropas.",
    giro: "El símbolo nació de una necesidad militar: distinguir amigos de realistas.",
  },
  "14-de-febrero": {
    hook: "San Martín entró triunfal en Santiago tras Chacabuco.",
    giro: "Chile libre era el peldaño hacia el Perú y el fin del poder español.",
  },
  "16-de-febrero": {
    hook: "En Barranca Yaco asesinaron a Facundo Quiroga.",
    giro: "La violencia de los caudillos terminó fortaleciendo a Rosas con más poder.",
  },
  "17-de-febrero": {
    hook: "Murió Enrique Finochietto, cirujano e inventor de instrumental.",
    giro: "El país también acumula capital humano: hospitales y oficio, no solo proclamas.",
  },
  "18-de-febrero": {
    hook: "Nació Dalmacio Vélez Sarsfield, autor del Código Civil.",
    giro: "Propiedad y contratos tendrían ley común: la República del orden privado.",
  },
  "19-de-febrero": {
    hook: "Yrigoyen volvió de la prisión en Martín García.",
    giro: "El golpe de 1930 había humillado al voto: empezaba la Década Infame.",
  },
  "21-de-febrero": {
    hook: "Detuvieron a Galtieri en el retorno democrático.",
    giro: "Malvinas y las juntas ya no se archivarían en silencio.",
  },
  "22-de-febrero": {
    hook: "Quedó asentado el observatorio argentino en las Orcadas del Sur.",
    giro: "Soberanía antártica con instrumentos y turnos de invierno, no solo banderas.",
  },
  "23-de-febrero": {
    hook: "Se firmó el Tratado del Pilar entre Buenos Aires, Santa Fe y Entre Ríos.",
    giro: "Otro pacto preexistente: el federalismo intentó nacer de acuerdos escritos.",
  },
  "24-de-febrero": {
    hook: "Perón ganó su primera elección con el 52 % de los votos.",
    giro: "Nació el peronismo en las urnas: masas, derechos laborales y Estado presente.",
  },
  "26-de-febrero": {
    hook: "Un atentado destruyó la Embajada de Israel en Buenos Aires.",
    giro: "29 muertos: la democracia abierta aprendió el costo de bajar la guardia.",
  },
  "28-de-febrero": {
    hook: "Tras Cepeda, el vacío de poder del Año XX se consolidó.",
    giro: "Sin Directorio ni Constitución, el país esperaba reglas — o un nuevo dueño.",
  },
  "1-de-diciembre": {
    hook: "Lavalle derrocó a Dorrego y abrió la herida más profunda de las guerras civiles.",
    giro: "Doce días después el fusilamiento encendería la venganza federal y el camino de Rosas al poder.",
  },
  "2-de-diciembre": {
    hook: "Brasil frenó en Río el avión del retorno: Perón tuvo que volver a España.",
    giro: "La proscripción ganó otra ronda; el general aún esperaría casi una década para gobernar otra vez.",
  },
  "3-de-diciembre": {
    hook: "Murió Rodríguez Peña, el anfitrión de las conspiraciones de Mayo.",
    giro: "Su casa había sido taller secreto de 1810: allí se cocinó el primer gobierno patrio.",
  },
  "4-de-diciembre": {
    hook: "Corrientes, aliada a Paraguay, declaró la guerra a Rosas.",
    giro: "La Confederación pelearía a la vez contra unitarios, europeos y caudillos del litoral.",
  },
  "5-de-diciembre": {
    hook: "La Junta Militar se disolvió: el Proceso entregaba el poder.",
    giro: "Cinco días después Alfonsín juraría y la democracia volvería a tener nombre.",
  },
  "6-de-diciembre": {
    hook: "Felipe Varela se alzó en el norte contra Mitre y la Guerra del Paraguay.",
    giro: "Lo aplastaron, pero quedó como bandera del federalismo interior frente a Buenos Aires.",
  },
  "7-de-diciembre": {
    hook: "Mitre perdió en Santa Rosa y Roca ganó el generalato.",
    giro: "El mitrismo armado fracasó; el militar del Desierto ya tenía carrera abierta.",
  },
  "8-de-diciembre": {
    hook: "Rosas fue proclamado Restaurador de las Leyes con facultades extraordinarias.",
    giro: "Empezaba el primer ciclo rosista: orden, campaña y poder personal por dos décadas.",
  },
  "9-de-diciembre": {
    hook: "En Ayacucho, Sucre y los granaderos cerraron el dominio español en América del Sur.",
    giro: "Era el remate militar de la gesta que San Martín había abierto desde Mendoza.",
  },
  "11-de-diciembre": {
    hook: "Murió Güiraldes, el autor de Don Segundo Sombra.",
    giro: "La gauchesca moderna perdía a su novelista más pulido.",
  },
  "12-de-diciembre": {
    hook: "En el Cerro de la Gloria se inauguró el monumento al Ejército de los Andes.",
    giro: "Bronce y piedra: San Martín mira desde Mendoza hacia Chile y el Perú.",
  },
  "13-de-diciembre": {
    hook: "En Comodoro Rivadavia, buscando agua, brotó petróleo.",
    giro: "De ese pozo nacería YPF: la Patagonia se volvió corazón energético del país.",
  },
  "14-de-diciembre": {
    hook: "Inglaterra reconoció la independencia de las Provincias Unidas.",
    giro: "La diplomacia abrió mercados: la soberanía también se gana en Londres.",
  },
  "15-de-diciembre": {
    hook: "Alfonsín creó la CONADEP y puso a Sábato al frente.",
    giro: "El Nunca Más convertiría el horror en informe: memoria antes que olvido.",
  },
  "16-de-diciembre": {
    hook: "Se instaló el Congreso Constituyente y nació la taquigrafía parlamentaria argentina.",
    giro: "Rivadavia tendría escenario: unidad, presidencia y la Constitución unitaria de 1826.",
  },
  "17-de-diciembre": {
    hook: "La Plaza coreó «que se vayan todos» mientras se derrumbaba un gobierno.",
    giro: "El 2001 no pidió un nombre: pidió que se fuera la política entera.",
  },
  "18-de-diciembre": {
    hook: "Se fundó la APDH, anticipo de la batalla por los derechos humanos.",
    giro: "Antes del juicio a las juntas, la sociedad civil ya estaba organizando la memoria.",
  },
  "19-de-diciembre": {
    hook: "La primera turbina de El Chocón empezó a generar energía.",
    giro: "Perón soñaba soberanía hídrica: la Patagonia encendía la industria.",
  },
  "20-de-diciembre": {
    hook: "De la Rúa renunció y abandonó la Rosada en helicóptero.",
    giro: "Saqueos, muertos y default: la imagen del helicóptero quedó como símbolo del colapso.",
  },
  "21-de-diciembre": {
    hook: "Nació la Academia Porteña del Lunfardo.",
    giro: "La jerga del conventillo pasó a patrimonio: Buenos Aires se tomó en serio su lengua.",
  },
  "22-de-diciembre": {
    hook: "Galtieri desplazó a Viola y asumió la dictadura.",
    giro: "Malvinas vendría después: la derrota aceleraría el fin del Proceso.",
  },
  "23-de-diciembre": {
    hook: "El Congreso sancionó la Ley de Punto Final.",
    giro: "Alfonsín acotó los juicios: la democracia eligió gobernabilidad, y el debate quedó abierto.",
  },
  "24-de-diciembre": {
    hook: "Rodríguez Saá juró en Nochebuena: default y una semana de mandato.",
    giro: "Cinco presidentes en dos semanas: la crisis se comía los nombres enteros.",
  },
  "25-de-diciembre": {
    hook: "Nació Rosario Vera Peñaloza, la Maestra de la Patria.",
    giro: "Prolongó a Sarmiento en la infancia: educar también es jardín de infantes.",
  },
  "26-de-diciembre": {
    hook: "Los cacerolazos no le dieron tregua a Rodríguez Saá.",
    giro: "Sin confianza, en 2001 ningún nombre alcanzaba para gobernar.",
  },
  "27-de-diciembre": {
    hook: "Murió Bernardo de Irigoyen, canciller del ochenta y puente al radicalismo.",
    giro: "Negoció con Chile y anticipó la política de masas que vendría con Yrigoyen.",
  },
  "28-de-diciembre": {
    hook: "La democracia derogó la autoamnistía que los militares se habían firmado solos.",
    giro: "Sin ese escudo, el juicio a las juntas quedó al alcance de la Justicia.",
  },
  "29-de-diciembre": {
    hook: "Sarmiento fundó el Observatorio Astronómico de Córdoba.",
    giro: "Mapear el cielo del sur era también un proyecto de Estado moderno.",
  },
  "30-de-diciembre": {
    hook: "Cromañón ardió: 194 muertos en una noche de rock en Buenos Aires.",
    giro: "El duelo se volvió reclamo: permisos, salidas y una generación marcada por el fuego.",
  },
  "31-de-diciembre": {
    hook: "Murió Cándido López, el pintor manco de la Triple Alianza.",
    giro: "Sus horizontes bajos siguen siendo el testimonio visual más feroz de esa guerra.",
  },
};

export function narrativaDeEfemeride(dia: string): NarrativaEfemeride | undefined {
  return narrativaEfemerides[dia];
}
