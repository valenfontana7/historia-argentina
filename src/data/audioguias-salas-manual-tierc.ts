import type { AudioguiaExhibicion } from "@/data/audioguias-salas-manual";

/** Guías editoriales curadas: tier C (exhibiciones narrativas). */
export const MANUAL_TIERC_INDICE: Record<string, AudioguiaExhibicion> = {
  celman: {
    cronicaSlug: "celman",
    titulo: "Audioguía · Celman",
    duracionEstimada: "7 minutos",
    segmentos: [
      {
        estacion: 0,
        titulo: "La Generación del Ochenta",
        texto: "1886: Miguel Juárez Celman asumió la presidencia del modelo agroexportador. Terratenientes jóvenes prometían modernizar la Argentina exportando granos y carne.",
      },
      {
        estacion: 1,
        titulo: "Pan y circo, deuda y fraude",
        texto: "Buenos Aires se embelleció mientras el interior padecía sequía y fraude electoral. Leandro Alem denunció el pan y circo. En 1890, la Revolución del Parque lo derrocó.",
      },
      {
        estacion: 2,
        titulo: "El retrato del régimen",
        texto: "Celman encarnó la opulencia visible y la pobreza creciente del ochenta oligárquico. Esta sala es prosa e imágenes: recorre las piezas como vitrinas de una época.",
      },
      {
        estacion: 3,
        titulo: "Del ochenta al radicalismo",
        texto: "Celman cayó, pero el sistema sobrevivió. La ley Sáenz Peña y el voto secreto tardaron décadas en llegar. Del ochenta nace la grieta que el radicalismo intentó cerrar.",
      },
    ],
  },
  "el-17-de-octubre": {
    cronicaSlug: "el-17-de-octubre",
    titulo: "Audioguía · El 17 de Octubre",
    duracionEstimada: "7 minutos",
    segmentos: [
      {
        estacion: 0,
        titulo: "Un coronel preso y una ciudad en vilo",
        texto: "Octubre de 1945: Perón estaba preso en la Isla Martín García. Los sindicatos convocaron a la Plaza. Buenos Aires contuvo el aliento.",
      },
      {
        estacion: 1,
        titulo: "Pies en el agua",
        texto: "Cientos de miles caminaron hacia la Casa Rosada. El 17 de octubre no fue sólo multitud: fue el nacimiento mítico del peronismo como fuerza de masas.",
      },
      {
        estacion: 2,
        titulo: "El nacimiento de una fuerza",
        texto: "Perón salió de la cárcel y entró en la historia como líder sindical convertido en caudillo electoral. Esta exhibición narrativa cierra el arco del peronismo que empieza acá.",
      },
    ],
  },
  "el-9-de-julio": {
    cronicaSlug: "el-9-de-julio",
    titulo: "Audioguía · El 9 de Julio",
    duracionEstimada: "8 minutos",
    segmentos: [
      {
        estacion: 0,
        titulo: "Una independencia que faltaba escribir",
        texto: "1816: seis años de guerra y todavía no había un acta que dijera independencia. El Congreso se reunió en Tucumán, cerca del frente, no en Buenos Aires.",
      },
      {
        estacion: 1,
        titulo: "Diputados en camino",
        texto: "Llegar a Tucumán era una hazaña: caminos inseguros, provincias divididas, un país que aún no sabía si existía como nación.",
      },
      {
        estacion: 2,
        titulo: "El 9 de julio",
        texto: "Nueve de julio de 1816: las Provincias Unidas del Río de la Plata declararon la independencia de España. Usá el comparador entre el Congreso antes y después del acta.",
      },
      {
        estacion: 3,
        titulo: "Lo que el Acta no resolvió",
        texto: "Declarar independencia no terminó la guerra ni unificó el territorio. El Acta abrió preguntas que el siglo XIX completo intentó responder.",
      },
    ],
  },
  "el-exodo-jujeno": {
    cronicaSlug: "el-exodo-jujeno",
    titulo: "Audioguía · El Éxodo Jujeño",
    duracionEstimada: "7 minutos",
    segmentos: [
      {
        estacion: 0,
        titulo: "La tierra que no podía quedar",
        texto: "Julio de 1812: Belgrano ordenó evacuar Jujuy, quemar campos y llevarse todo lo que pudiera alimentar al enemigo. No huyó: convirtió la geografía en arma.",
      },
      {
        estacion: 1,
        titulo: "Un pueblo en marcha",
        texto: "Más de tres mil familias cruzaron cuatrocientos kilómetros bajo el sol de la puna. El éxodo no fue sólo militar: fue una ciudad entera caminando hacia el sur.",
      },
    ],
  },
  "el-primer-golpe": {
    cronicaSlug: "el-primer-golpe",
    titulo: "Audioguía · El Primer Golpe",
    duracionEstimada: "7 minutos",
    segmentos: [
      {
        estacion: 0,
        titulo: "La democracia que no terminó",
        texto: "1928: Yrigoyen ganó con el 62 % de los votos. En 1930, Uriburu lo derrocó. Fue el primer golpe de Estado de la historia argentina.",
      },
      {
        estacion: 1,
        titulo: "Tanques en la Plaza",
        texto: "La Plaza del Congreso amaneció con tanques. Yrigoyen fue detenido, el Congreso disuelto. Deslizá el comparador entre democracia radical y golpe militar.",
      },
      {
        estacion: 2,
        titulo: "La Plaza como escenario",
        texto: "El golpe fue visible y público. La oligarquía y parte del ejército celebraron el fin del caudillismo radical sin ver la puerta que abrían.",
      },
      {
        estacion: 3,
        titulo: "El origen de la inestabilidad",
        texto: "Después vendrían 1943, 1955, 1966, 1976… Recién en 1983 un ciclo democrático se completó. Esta sala marca el origen de esa maldición.",
      },
    ],
  },
  "juana-azurduy": {
    cronicaSlug: "juana-azurduy",
    titulo: "Audioguía · Juana Azurduy",
    duracionEstimada: "7 minutos",
    segmentos: [
      {
        estacion: 0,
        titulo: "Una guerra que no salía en los partes",
        texto: "Mientras los generales firmaban derrotas en el Alto Perú, Juana Azurduy armaba otra resistencia: guerrilla, reclutamiento, combate sin permiso oficial.",
      },
      {
        estacion: 1,
        titulo: "Cerros, pueblos, caminos",
        texto: "Azurduy combatió, perdió hijos, quedó viuda y siguió. El comparador enfrenta la guerra regular con la guerrilla que sostuvo el norte real.",
      },
      {
        estacion: 2,
        titulo: "El reconocimiento tardío",
        texto: "Durante siglos quedó fuera del bronce oficial. Hoy es teniente coronela de América: la revolución también fue de mujeres, pueblos originarios y mestizos.",
      },
    ],
  },
  "la-batalla-de-tucuman": {
    cronicaSlug: "la-batalla-de-tucuman",
    titulo: "Audioguía · La Batalla de Tucumán",
    duracionEstimada: "7 minutos",
    segmentos: [
      {
        estacion: 0,
        titulo: "La orden era retirarse",
        texto: "1812: Belgrano debía retirarse ante el avance realista. Desobedeció la orden y eligió pelear en Tucumán. La revolución estaba a un paso del colapso.",
      },
      {
        estacion: 1,
        titulo: "Un ejército de bisoños",
        texto: "Soldados jóvenes, mal armados, alentados por la población tucumana. No era el ejército de los libros europeos: era lo que la revolución tenía.",
      },
      {
        estacion: 2,
        titulo: "Tucumán salva la Revolución",
        texto: "Veinticuatro y 25 de septiembre: victoria patriota decisiva. Seguí el mapa scrolly para ver cómo la batalla se dibujó en el terreno.",
      },
      {
        estacion: 3,
        titulo: "Lo que vino después",
        texto: "Tucumán abrió el camino al Éxodo invertido: Belgrano volvió al norte, ganó en Salta y sentó las bases del Congreso de 1816.",
      },
    ],
  },
  "la-guerra-gaucha": {
    cronicaSlug: "la-guerra-gaucha",
    titulo: "Audioguía · La Guerra Gaucha",
    duracionEstimada: "7 minutos",
    segmentos: [
      {
        estacion: 0,
        titulo: "El norte que no se rinde",
        texto: "Después de Huaqui, Güemes inventó otra forma de pelear: montoneras, caballos, conocimiento del terreno. Salta se convirtió en escudo del norte.",
      },
      {
        estacion: 1,
        titulo: "Montoneras",
        texto: "No era caos: era guerra irregular con reglas propias. Cortaban convoyes, hostigaban columnas y se diluían en el campo. El comparador muestra ejército regular contra gauchos.",
      },
      {
        estacion: 2,
        titulo: "Morir defendiendo el umbral",
        texto: "Güemes murió en 1821 resistiendo el avance realista. La guerra gaucha no ganó batallas campales, pero impidió que el norte cayera sin lucha.",
      },
    ],
  },
};
