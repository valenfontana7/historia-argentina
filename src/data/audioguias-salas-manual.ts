import type { SegmentoAudioguia } from "@/data/audioguias";

export type AudioguiaExhibicion = {
  cronicaSlug: string;
  titulo: string;
  duracionEstimada: string;
  segmentos: SegmentoAudioguia[];
  audioUrl?: string;
};

const CRUCE: AudioguiaExhibicion = {
  cronicaSlug: "el-cruce-de-los-andes",
  titulo: "Audioguía · El Cruce de los Andes",
  duracionEstimada: "14 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "Un plan que nadie pidió",
      texto: "Tres ejércitos habían intentado llegar a Lima por el norte. Los tres volvieron destrozados. San Martín miró el mapa de otra manera: cruzar la cordillera, liberar Chile y atacar Lima por el mar.",
    },
    {
      estacion: 1,
      titulo: "Mendoza se convierte en arsenal",
      texto: "Durante dos años, Cuyo entera trabajó para un solo objetivo. Beltrán fundió cañones. Las mujeres donaron joyas. Todo se calculó: charqui, mulas, herraduras, altura. Mendoza fue una fábrica de guerra.",
    },
    {
      estacion: 2,
      titulo: "La guerra de zapa",
      texto: "San Martín no peleó como los caudillos del norte. Entrenó un ejército de élite, lo ocultó, lo movió en silencio. La sorpresa era parte del plan.",
    },
    {
      estacion: 3,
      titulo: "Seis cuchillos sobre la cordillera",
      texto: "El ejército se dividió en columnas que cruzaron por distintos pasos: Uspallata, Los Patos, Vergara. Cada ruta era una apuesta contra el hambre, el frío y la montaña.",
    },
    {
      estacion: 4,
      titulo: "La travesía",
      texto: "Enero de 1817: hombres y mulas subieron más de cuatro mil metros. Muchos no volvieron. Los que llegaron al otro lado ya no eran el mismo ejército: eran la prueba de que lo imposible podía intentarse.",
    },
    {
      estacion: 5,
      titulo: "Chacabuco",
      texto: "Doce de febrero: la maniobra envolvente de O'Higgins y Soler validó el cruce. Chile dejó de ser un sueño lejano y empezó a ser estrategia.",
    },
    {
      estacion: 6,
      titulo: "El legado",
      texto: "El cruce no terminó la guerra. Pero cambió la escala: de caudillos provinciales a un plan continental. San Martín no conquistó solo territorio: conquistó la idea de que la independencia podía pensarse desde el sur.",
    },
  ],
};

const MADRES: AudioguiaExhibicion = {
  cronicaSlug: "las-madres",
  titulo: "Audioguía · Las Madres",
  duracionEstimada: "8 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "El pañuelo blanco",
      texto: "Treinta de abril de 1977: un puñado de mujeres caminó en círculo frente a la Casa Rosada. Buscaban a sus hijos desaparecidos. La dictadura les prohibió reunirse. Caminaron igual.",
    },
    {
      estacion: 1,
      titulo: "Aparición con vida",
      texto: "Azucena Villaflor convocó a otras madres en San Cristóbal. La consigna era simple: saber dónde estaban sus hijos. El régimen respondió con desprecio, y después con terror.",
    },
    {
      estacion: 2,
      titulo: "La memoria que no calló",
      texto: "Bajo la dictadura, las Madres fueron la voz del país cuando el miedo silenciaba todo lo demás. El pañuelo blanco cruzó fronteras antes que muchos discursos oficiales.",
    },
    {
      estacion: 3,
      titulo: "De la Plaza a la democracia",
      texto: "Cuando Alfonsín juró en 1983, las Madres llevaban seis años caminando. Sin ellas, la memoria habría sido más frágil. Con ellas, la democracia recuperó un rostro.",
    },
  ],
};

const CHACABUCO: AudioguiaExhibicion = {
  cronicaSlug: "chacabuco",
  titulo: "Audioguía · Chacabuco",
  duracionEstimada: "7 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "La cordillera quedó atrás",
      texto: "Apenas días después del cruce, el Ejército de los Andes chocó con el realismo en la cuesta de Chacabuco. No era una escaramuza: era la prueba de que el plan podía funcionar.",
    },
    {
      estacion: 1,
      titulo: "La maniobra envolvente",
      texto: "O'Higgins sostuvo el frente mientras Soler rodeaba por el oeste. Zapiola remató con la caballería. En pocas horas, el ejército realista en Chile dejó de ser una amenaza existencial.",
    },
    {
      estacion: 2,
      titulo: "El valle que abrió Chile",
      texto: "El mapa scrolly de esta sala muestra cómo la batalla se dibujó en el terreno. Seguí el scroll: cada curva del valle fue parte de la maniobra.",
    },
    {
      estacion: 3,
      titulo: "Hacia Maipú y el Pacífico",
      texto: "Chacabuco no cerró la campaña. La abrió. Cancha Rayada casi aniquiló al ejército un año después. Maipú sellaría lo que Chacabuco prometió.",
    },
  ],
};

const NUNCA_MAS: AudioguiaExhibicion = {
  cronicaSlug: "nunca-mas",
  titulo: "Audioguía · Nunca Más",
  duracionEstimada: "8 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "El último golpe",
      texto: "Veinticuatro de marzo de 1976: las Fuerzas Armadas derrocaron a Isabel Perón. Prometieron orden. Instalaron terror de Estado: desapariciones, centros clandestinos, censura.",
    },
    {
      estacion: 1,
      titulo: "Malvinas y el desgaste",
      texto: "La guerra de 1982 no salvó al régimen: lo aceleró. La derrota del catorce de junio dejó al militarismo sin narrativa mientras las Madres seguían caminando.",
    },
    {
      estacion: 2,
      titulo: "Nunca Más",
      texto: "En 1984, la CONADEP publicó el relato sistemático de los centros de detención. Fue la base del Juicio a las Juntas: por primera vez, dictadores salientes respondieron ante la justicia.",
    },
    {
      estacion: 3,
      titulo: "10 de diciembre",
      texto: "Diez de diciembre de 1983: Alfonsín juró en la Plaza de Mayo. La democracia volvió. La deuda de memoria sigue abierta, pero ese día la Argentina actual empezó a existir.",
    },
  ],
};

const GUAYAQUIL: AudioguiaExhibicion = {
  cronicaSlug: "guayaquil",
  titulo: "Audioguía · Guayaquil",
  duracionEstimada: "7 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "Dos libertadores, un continente",
      texto: "Julio de 1822: San Martín y Bolívar se encontraron en Guayaquil. Uno venía del sur, el otro del norte. Entre los dos, casi toda Sudamérica estaba en juego.",
    },
    {
      estacion: 1,
      titulo: "El misterio de la casa Rodríguez",
      texto: "Nadie dejó acta completa de lo que hablaron a puerta cerrada. San Martín renunció al mando poco después. Bolívar siguió hacia el Perú. El misterio alimentó décadas de debate.",
    },
    {
      estacion: 2,
      titulo: "El mapa del Pacífico",
      texto: "Guayaquil no fue solo un encuentro personal: era una pieza en el tablero del Pacífico. Quien controlara el sur podía pensar Lima, Quito y el control del continente.",
    },
    {
      estacion: 3,
      titulo: "La renuncia que evitó la guerra civil",
      texto: "San Martín eligió el exilio antes que enfrentar a Bolívar. Muchos lo leyeron como derrota. Otros, como el gesto que evitó una guerra civil entre libertadores.",
    },
  ],
};

const MAYO: AudioguiaExhibicion = {
  cronicaSlug: "las-48-horas-de-mayo",
  titulo: "Audioguía · Las 48 Horas de Mayo",
  duracionEstimada: "10 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "La herencia de las azoteas",
      texto: "Buenos Aires llegó a 1810 con la memoria de las invasiones inglesas: una ciudad que había aprendido a pelear desde las azoteas, sin murallas, con milicias criollas.",
    },
    {
      estacion: 1,
      titulo: "Una ciudad sin rey",
      texto: "La caída de Fernando VII en España abrió una grieta: ¿a quién obedecía el virreinato? La élite porteña no esperó respuesta desde Madrid.",
    },
    {
      estacion: 2,
      titulo: "El cabildo abierto",
      texto: "Veintidós de mayo: la ciudad convocó al cabildo abierto. No era revolución armada todavía. Era una asamblea que decidió que Buenos Aires tenía derecho a hablar.",
    },
    {
      estacion: 3,
      titulo: "Cuarenta y ocho horas en la Plaza",
      texto: "Entre el veintidós y el veinticinco, la Plaza de Mayo fue el escenario de presiones, negociaciones y multitudes. El reloj corría contra el virrey y a favor de quienes querían cambio.",
    },
    {
      estacion: 4,
      titulo: "Los nueve del mediodía",
      texto: "Veinticinco de mayo, mediodía: la Primera Junta quedó proclamada. No era independencia —todavía— pero era el fin del virreinato tal como lo conocían.",
    },
    {
      estacion: 5,
      titulo: "Lo que no entró al bronce",
      texto: "La historiografía celebró a los juntistas. Esta sala también pregunta quién quedó afuera: mujeres, esclavizados, pueblos originarios. El Mayo que conmemoramos es uno solo entre muchos posibles.",
    },
  ],
};

const INVASIONES: AudioguiaExhibicion = {
  cronicaSlug: "la-ciudad-que-vencio-a-un-imperio",
  titulo: "Audioguía · La Ciudad que Venció a un Imperio",
  duracionEstimada: "8 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "El imperio pone el ojo en el Plata",
      texto: "1806: Gran Bretaña desembarca en Buenos Aires esperando una ciudad sumisa. Encontró una colonia armada, con milicias criollas y memoria de resistencia.",
    },
    {
      estacion: 1,
      titulo: "Una ciudad en armas",
      texto: "La primera invasión terminó en Reconquista. Liniers pasó de prisionero a héroe. Buenos Aires aprendió que podía pelear sin mandato de Madrid.",
    },
    {
      estacion: 2,
      titulo: "La segunda invasión",
      texto: "1807: Whitelocke volvió con más tropas. La respuesta fueron las azoteas, el combate casa por casa y una humillación británica que resonó en todo el imperio.",
    },
    {
      estacion: 3,
      titulo: "El día después",
      texto: "Las invasiones no dieron independencia, pero sí confianza. Una ciudad sin murallas había vencido dos veces al ejército más poderoso del mundo.",
    },
  ],
};

const MAIPU: AudioguiaExhibicion = {
  cronicaSlug: "maipu",
  titulo: "Audioguía · Maipú",
  duracionEstimada: "7 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "Casi aniquilados",
      texto: "Un año antes de Maipú, Cancha Rayada casi destruyó al Ejército de los Andes. San Martín tuvo que recomponer tropas, moral y tiempo.",
    },
    {
      estacion: 1,
      titulo: "Seis horas que sellaron Chile",
      texto: "Cinco de abril de 1818: en los llanos de Maipú, la caballería patriota quebró al ejército realista. Chile quedó libre en una tarde.",
    },
    {
      estacion: 2,
      titulo: "Los llanos de la libertad",
      texto: "El mapa de esta sala muestra cómo la batalla se abrió en terreno abierto. Maipú fue choque frontal y remate: menos maniobra que Chacabuco, más contundencia.",
    },
    {
      estacion: 3,
      titulo: "Hacia el Pacífico",
      texto: "Con Chile asegurado, San Martín miró el mar. Maipú cerró la campaña chilena y abrió la etapa que terminaría en Guayaquil y el Perú.",
    },
  ],
};

const PAVON: AudioguiaExhibicion = {
  cronicaSlug: "pavon",
  titulo: "Audioguía · Pavón",
  duracionEstimada: "7 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "Puerto contra interior",
      texto: "Después de Caseros, Argentina no estaba unificada. Buenos Aires y las provincias disputaban qué país construir: confederación o centralismo.",
    },
    {
      estacion: 1,
      titulo: "La hegemonía porteña",
      texto: "Bartolomé Mitre encarnó la apuesta porteña. Urquiza, el vencedor de Rosas, defendía otra arquitectura de poder. Pavón decidió entre las dos.",
    },
    {
      estacion: 2,
      titulo: "El campo de la unificación",
      texto: "Dieciséis de abril de 1859: cerca de Pavón, las armas resolvieron lo que el federalismo no pudo negociar. Seguí el mapa: el río y la llanura marcaron la batalla.",
    },
    {
      estacion: 3,
      titulo: "El Estado que nació en Pavón",
      texto: "Mitre ganó y en 1862 asumió como presidente de una Argentina unificada. Pavón no fue solo una batalla: fue el origen del Estado nacional moderno.",
    },
  ],
};

const AYACUCHO: AudioguiaExhibicion = {
  cronicaSlug: "ayacucho",
  titulo: "Audioguía · Ayacucho",
  duracionEstimada: "7 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "El fin del imperio",
      texto: "1824: el virreinato del Perú era el último bastión realista fuerte en Sudamérica. Quien lo tomara, cerraba la guerra de independencia continental.",
    },
    {
      estacion: 1,
      titulo: "Tres horas que cambiaron el mundo",
      texto: "Nueve de diciembre: Sucre derrotó a La Serna en el altiplano. En pocas horas, el ejército realista dejó de existir como fuerza continental.",
    },
    {
      estacion: 2,
      titulo: "El mapa del altiplano",
      texto: "La sala recrea el terreno de Ayacucho. Altura, flancos y posición explican por qué la batalla fue breve y decisiva.",
    },
    {
      estacion: 3,
      titulo: "El legado de San Martín",
      texto: "San Martín no estuvo en Ayacucho, pero el plan que cruzó los Andes terminó acá. Con Ayacucho, el imperio español en América quedó roto.",
    },
  ],
};

const JUNIN: AudioguiaExhibicion = {
  cronicaSlug: "junin",
  titulo: "Audioguía · Junín",
  duracionEstimada: "7 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "La última batalla de San Martín",
      texto: "Agosto de 1824: San Martín volvió al campo de batalla por última vez. Junín fue cuerpo a cuerpo en la meseta andina, sin un solo tiro de fusil.",
    },
    {
      estacion: 1,
      titulo: "Sables en la meseta",
      texto: "La caballería decidió la jornada en combate confuso y brutal. Junín no fue victoria total, pero quebró al ejército realista en el Perú.",
    },
    {
      estacion: 2,
      titulo: "El mapa de la sierra",
      texto: "Recorré el mapa scrolly: la altura, el clima y la logística explican por qué Junín fue tan distinta a las batallas de llanura.",
    },
    {
      estacion: 3,
      titulo: "El preludio de Ayacucho",
      texto: "Dos meses después, Sucre completaría en Ayacucho lo que Junín abrió. Esta batalla es el puente entre el cruce de los Andes y el fin del imperio.",
    },
  ],
};

const DESIERTO: AudioguiaExhibicion = {
  cronicaSlug: "la-conquista-del-desierto",
  titulo: "Audioguía · La Conquista del Desierto",
  duracionEstimada: "8 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "La frontera que se movía",
      texto: "Durante décadas, el sur argentino fue frontera móvil: territorio disputado entre el Estado, pueblos originarios y colonos.",
    },
    {
      estacion: 1,
      titulo: "Fusiles, caballos y telégrafo",
      texto: "Roca llegó al poder con un proyecto claro: someter el sur con campañas militares, fuertes y colonización. El Estado moderno avanzaba con telégrafo y Remington.",
    },
    {
      estacion: 2,
      titulo: "El mapa del sur",
      texto: "El mapa de esta sala dibuja las columnas de 1878 a 1885. Cada avance redibujaba el país que conocemos hoy — y dejaba heridas abiertas.",
    },
    {
      estacion: 3,
      titulo: "Progreso y memoria",
      texto: "La Conquista del Desierto unificó territorio y abrió la Patagonia al modelo agroexportador. También fue despojo, muerte y silencio. El museo no elige un solo relato.",
    },
  ],
};

const SAN_LORENZO: AudioguiaExhibicion = {
  cronicaSlug: "san-lorenzo",
  titulo: "Audioguía · San Lorenzo",
  duracionEstimada: "7 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "Quince minutos que cambiaron todo",
      texto: "Tres de febrero de 1813: un combate brevísimo en el Paraná le dio a San Martín fama, tropas leales y respaldo para pensar en grande.",
    },
    {
      estacion: 1,
      titulo: "El Regimiento nace en combate",
      texto: "Los Granaderos a Caballo se forjaron en San Lorenzo. No fue solo una escaramuza fluvial: fue el nacimiento del cuerpo de élite del libertador.",
    },
    {
      estacion: 2,
      titulo: "El río como escenario",
      texto: "El mapa scrolly muestra el convento, la barranca y el desembarco. San Lorenzo fue batalla de pocos minutos, pero de geometría precisa.",
    },
    {
      estacion: 3,
      titulo: "El primer paso del plan",
      texto: "Antes del cruce, antes de Chile, antes de Lima: San Lorenzo. El plan continental empezó con quince minutos de chispa en el río.",
    },
  ],
};

const SALTA: AudioguiaExhibicion = {
  cronicaSlug: "la-batalla-de-salta",
  titulo: "Audioguía · La Batalla de Salta",
  duracionEstimada: "7 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "Tucumán abrió la puerta",
      texto: "Después de Tucumán, Belgrano tenía moral pero pocos recursos. Salta sería la prueba de si la victoria del norte podía sostenerse.",
    },
    {
      estacion: 1,
      titulo: "Castañares",
      texto: "Veinte de febrero de 1813: Belgrano atacó al ejército realista de Pío Tristán. La maniobra fue audaz, la ejecución decisiva.",
    },
    {
      estacion: 2,
      titulo: "El mapa de la victoria",
      texto: "Seguí el scroll del mapa: la topografía de Salta explica la sorpresa patriota y la capitulación española.",
    },
    {
      estacion: 3,
      titulo: "El cierre del arco norte",
      texto: "Salta fue la primera capitulación total de un ejército realista en la guerra. Belgrano cerró, con Tucumán, el arco libertador del norte.",
    },
  ],
};

const CASEROS: AudioguiaExhibicion = {
  cronicaSlug: "caseros",
  titulo: "Audioguía · Caseros",
  duracionEstimada: "8 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "Veinte años de un solo hombre",
      texto: "1852: Rosas llevaba dos décadas gobernando con hierro. Urquiza armó el Ejército Grande con una consigna: terminar con el rosismo.",
    },
    {
      estacion: 1,
      titulo: "La marcha hacia Buenos Aires",
      texto: "Desde el interior, Urquiza avanzó sobre la capital. Caseros no fue improvisación: fue el choque de dos proyectos de país.",
    },
    {
      estacion: 2,
      titulo: "El campo de batalla",
      texto: "Tres de febrero: en las margen del arroyo, las tropas de Urquiza quebraron a las de Rosas. El mapa de la sala muestra cómo se cerró la jornada.",
    },
    {
      estacion: 3,
      titulo: "Después del polvo",
      texto: "Rosas partió al exilio. Se abrió la Constitución de 1853, Pavón, Mitre y otra Argentina. Caseros cerró la era del Restaurador.",
    },
  ],
};

const OBLIGADO: AudioguiaExhibicion = {
  cronicaSlug: "la-vuelta-de-obligado",
  titulo: "Audioguía · La Vuelta de Obligado",
  duracionEstimada: "8 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "Soberanía en el río",
      texto: "1845: Gran Bretaña y Francia bloquearon el Paraná para imponer libre comercio. Rosas respondió con cañones, cadenas y un recodo del río.",
    },
    {
      estacion: 1,
      titulo: "El recodo y las cadenas",
      texto: "En Obligado, el río se estrecha. Las cadenas cruzadas y la batería artillera convirtieron el paso en trampa para la escuadra combinada.",
    },
    {
      estacion: 2,
      titulo: "Siete horas que pesan siglos",
      texto: "Dieciocho horas de combate: los buques enemigos forzaron el paso, pero pagaron un precio altísimo. La resistencia se volvió símbolo nacional.",
    },
    {
      estacion: 3,
      titulo: "El día que sigue vigente",
      texto: "Militarmente, Obligado no fue victoria total. Políticamente, fue la defensa más recordada de la soberanía sobre los ríos. Por eso sigue siendo feriado.",
    },
  ],
};

const MALVINAS: AudioguiaExhibicion = {
  cronicaSlug: "setenta-y-cuatro-dias",
  titulo: "Audioguía · 74 días",
  duracionEstimada: "8 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "Operación Rosario",
      texto: "Dos de abril de 1982: Argentina recuperó las islas por sorpresa. La movilización patriótica fue inmediata. La guerra también.",
    },
    {
      estacion: 1,
      titulo: "74 días en el Atlántico Sur",
      texto: "Setenta y cuatro días separaron el desembarco de la rendición. Soldados conscriptos, frío, logística imposible y un conflicto que nadie terminó de dominar.",
    },
    {
      estacion: 2,
      titulo: "Del mapa a la rendición",
      texto: "El mapa de la sala recorre operaciones, frentes y derrota. Malvinas fue también una guerra de distancias: cada milla del Atlántico pesaba.",
    },
    {
      estacion: 3,
      titulo: "La herida que quedó",
      texto: "Catorce de junio: la rendición cerró la guerra, no el debate. Malvinas sigue siendo herida nacional, memoria de jóvenes y pregunta política abierta.",
    },
  ],
};

const CONSTITUCION: AudioguiaExhibicion = {
  cronicaSlug: "la-constitucion-de-1853",
  titulo: "Audioguía · La Constitución de 1853",
  duracionEstimada: "8 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "Un país sin Constitución",
      texto: "Después de Caseros, Argentina necesitaba reglas comunes. Sin Constitución, cada crisis terminaba en armas.",
    },
    {
      estacion: 1,
      titulo: "Las Bases",
      texto: "Alberdi escribió las Bases desde el exilio: un manual para un país moderno, liberal y exportador. Urquiza lo convirtió en convocatoria.",
    },
    {
      estacion: 2,
      titulo: "Santa Fe, 1 de mayo",
      texto: "El mapa congresual muestra cómo se armó la convención. Buenos Aires quedó afuera, pero el texto empezó a regir un país posible.",
    },
    {
      estacion: 3,
      titulo: "El país que empezó a existir",
      texto: "La Constitución de 1853 sigue siendo la base del orden argentino. No nació del consenso total: nació de la urgencia de existir como nación.",
    },
  ],
};

const ITUZAINGO: AudioguiaExhibicion = {
  cronicaSlug: "ituzaingo",
  titulo: "Audioguía · Ituzaingó",
  duracionEstimada: "7 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "La guerra con Brasil",
      texto: "1825: la Provincia Oriental se rebeló contra Brasil y arrastró al Río de la Plata a una guerra por fronteras, comercio y poder regional.",
    },
    {
      estacion: 1,
      titulo: "20 de febrero en el arroyo",
      texto: "Ituzaingó fue una victoria argentina en campo abierto. Las tropas de Las Heras contuvieron al ejército imperial en el arroyo que da nombre a la batalla.",
    },
    {
      estacion: 2,
      titulo: "El mapa del litoral",
      texto: "Recorré el mapa: ríos, pantanos y líneas de abastecimiento explican por qué la guerra se arrastró años después de la batalla.",
    },
    {
      estacion: 3,
      titulo: "Del campo al machete rojo",
      texto: "Ituzaingó no cerró el conflicto, pero forjó experiencia y liderazgos — entre ellos, un joven Juan Manuel de Rosas en logística y política.",
    },
  ],
};

const CASTELLI: AudioguiaExhibicion = {
  cronicaSlug: "castelli",
  titulo: "Audioguía · Castelli",
  duracionEstimada: "7 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "El orador de la revolución",
      texto: "Castelli fue voz y acción de Mayo: el hombre que llevó la revolución desde la ciudad al campo, con palabra afilada y decisión militar.",
    },
    {
      estacion: 1,
      titulo: "La revolución se expande",
      texto: "Desde Buenos Aires, la revolución necesitaba aliados y territorio. Castelli encarnó la ofensiva: convencer, avanzar, no negociar con el virreinato.",
    },
    {
      estacion: 2,
      titulo: "El mapa del Alto Perú",
      texto: "La campaña hacia el norte abrió frentes y esperanzas. El mapa muestra cómo la revolución intentó ser continental desde el primer año.",
    },
    {
      estacion: 3,
      titulo: "La caída del tribuno",
      texto: "Castelli murió joven. Su legado es la idea de una revolución sin freno — y el recuerdo de que Mayo no terminó en la Plaza.",
    },
  ],
};

const EVITA: AudioguiaExhibicion = {
  cronicaSlug: "evita",
  titulo: "Audioguía · Evita",
  duracionEstimada: "8 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "De la periferia al centro",
      texto: "Eva Duarte llegó a Buenos Aires desde la provincia y terminó en el corazón del poder. Su biografía mezcla teatro, ascenso social y política de masas.",
    },
    {
      estacion: 1,
      titulo: "Derechos concretos",
      texto: "Evita no fue solo símbolo: impulsó sufragio femenino, ayuda social y una relación directa con los sectores populares que el peronismo movilizaba.",
    },
    {
      estacion: 2,
      titulo: "El Cabildo Abierto de 1951",
      texto: "1951: multitudes pidieron que fuera vicepresidenta. El episodio muestra hasta dónde llegaba su capital político — y los límites del propio Perón.",
    },
    {
      estacion: 3,
      titulo: "El mito que no se fue",
      texto: "Murió en 1952, pero el mito creció. Evita sigue siendo icono, controversia y espejo de cómo la Argentina entiende liderazgo, clase y género.",
    },
  ],
};

const EL_2001: AudioguiaExhibicion = {
  cronicaSlug: "el-2001",
  titulo: "Audioguía · El 2001",
  duracionEstimada: "7 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "El corralito",
      texto: "Diciembre de 2001: el Estado limitó los retiros bancarios. El corralito convirtió una crisis económica en crisis de confianza total.",
    },
    {
      estacion: 1,
      titulo: "Que se vayan todos",
      texto: "Cacerolazos, piquetes y la Plaza de Mayo llena. La consigna no apuntaba a un solo nombre: apuntaba al sistema entero.",
    },
    {
      estacion: 2,
      titulo: "La democracia bajo estrés",
      texto: "Cinco presidentes en dos semanas. Nunca antes la institucionalidad argentina había tambaleado así sin un golpe clásico.",
    },
    {
      estacion: 3,
      titulo: "El país que salió distinto",
      texto: "El 2001 no resolvió la deuda ni la pobreza, pero cambió el lenguaje político. La democracia sobrevivió — dañada, discutida, viva.",
    },
  ],
};

const PERON: AudioguiaExhibicion = {
  cronicaSlug: "peron",
  titulo: "Audioguía · Perón",
  duracionEstimada: "7 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "El coronel que leyó el país",
      texto: "Desde el golpe de 1943, Perón entendió que el poder estaba en los sindicatos, el Ejército y una clase obrera que nadie había representado del todo.",
    },
    {
      estacion: 1,
      titulo: "El 17 de Octubre",
      texto: "1945: la multitud sacó a Perón de la cárcel y lo llevó a la Casa Rosada. El 17 de Octubre es el origen mítico del peronismo como movimiento de masas.",
    },
    {
      estacion: 2,
      titulo: "El retrato del líder",
      texto: "Esta sala usa el comparador para mostrar dos Perón: el reformista social y el caudillo político. Las dos caras conviven en la historia argentina.",
    },
    {
      estacion: 3,
      titulo: "El movimiento que definió el siglo",
      texto: "Perón gobernó, fue derrocado, volvió y dividió al país durante décadas. Con él nace un eje que todavía ordena la política argentina.",
    },
  ],
};

const PROCESO: AudioguiaExhibicion = {
  cronicaSlug: "el-proceso",
  titulo: "Audioguía · El Proceso",
  duracionEstimada: "7 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "El Proceso",
      texto: "Veinticuatro de marzo de 1976: las Fuerzas Armadas derrocaron a Isabel Perón e instalaron el Proceso de Reorganización Nacional. Prometieron orden. Impusieron terror.",
    },
    {
      estacion: 1,
      titulo: "Terror de Estado",
      texto: "Desapariciones, centros clandestinos, censura y exilio. El Estado dejó de proteger derechos y empezó a producir miedo sistemático.",
    },
    {
      estacion: 2,
      titulo: "La junta en el poder",
      texto: "Videla, Massera y Agosti encarnaron distintas alas de las Fuerzas Armadas. El poder militar no fue monolítico, pero el método sí.",
    },
    {
      estacion: 3,
      titulo: "La herida que no cierra",
      texto: "El Proceso terminó en 1983, pero la discusión sigue: memoria, justicia, impunidad. Esta sala recorre el origen de una herida que el país todavía habita.",
    },
  ],
};

export const MANUAL_INDICE: Record<string, AudioguiaExhibicion> = {
  alfonsin: {
    cronicaSlug: "alfonsin",
    titulo: "Audioguía · Alfonsín",
    duracionEstimada: "7 minutos",
    segmentos: [
      {
        estacion: 0,
        titulo: "El presidente de la democracia",
        texto: "1983: Raúl Alfonsín asumió después de siete años de dictadura. No fue continuidad: fue ruptura con el terror de Estado.",
      },
      {
        estacion: 1,
        titulo: "De la urna al juicio",
        texto: "Alfonsín convirtió el retorno democrático en política concreta: CONADEP, Juicio a las Juntas y límites a los militares.",
      },
      {
        estacion: 2,
        titulo: "El retrato del restaurador",
        texto: "El comparador de la sala muestra dos Alfonsín: el idealista de los derechos humanos y el gestor de una economía en crisis.",
      },
      {
        estacion: 3,
        titulo: "El legado que no se revierte",
        texto: "Ningún golpe volvió después de 1983. Ese es su legado central. La deuda de memoria y la hiperinflación marcaron sus límites.",
      },
    ],
  },
  ayacucho: AYACUCHO,
  caseros: CASEROS,
  castelli: CASTELLI,
  chacabuco: CHACABUCO,
  "el-cruce-de-los-andes": CRUCE,
  "el-2001": EL_2001,
  "el-proceso": PROCESO,
  evita: EVITA,
  guayaquil: GUAYAQUIL,
  ituzaingo: ITUZAINGO,
  junin: JUNIN,
  "la-batalla-de-salta": SALTA,
  "la-ciudad-que-vencio-a-un-imperio": INVASIONES,
  "la-conquista-del-desierto": DESIERTO,
  "la-constitucion-de-1853": CONSTITUCION,
  "la-vuelta-de-obligado": OBLIGADO,
  "las-48-horas-de-mayo": MAYO,
  "las-madres": MADRES,
  maipu: MAIPU,
  "nunca-mas": NUNCA_MAS,
  pavon: PAVON,
  peron: PERON,
  "san-lorenzo": SAN_LORENZO,
  "setenta-y-cuatro-dias": MALVINAS,
};
