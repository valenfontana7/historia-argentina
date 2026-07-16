/** Colecciones curadas de piezas con comentario editorial: exclusivas mecenas. */

export type ColeccionPremium = {
  id: string;
  titulo: string;
  descripcion: string;
  piezas: string[];
};

export type PiezaPremiumMeta = {
  /** ID en cronicas-imagenes.ts */
  id: string;
  coleccionId: string;
  /** Comentario curatorial extendido. */
  comentario: string;
  /** Primera línea visible como teaser público. */
  teaser: string;
};

export const COLECCIONES_PREMIUM: ColeccionPremium[] = [
  {
    id: "nacion",
    titulo: "Nación y constitución",
    descripcion:
      "Actas, retratos y escenas de los momentos en que Argentina se definió como país.",
    piezas: ["julio-acta", "constitucion-1853", "caseros-urquiza", "guayaquil-entrevista"],
  },
  {
    id: "campanas",
    titulo: "Campañas y mapas",
    descripcion:
      "Grabados y mapas de las guerras que dibujaron el territorio y la independencia.",
    piezas: ["andes-cruce", "andes-chacabuco", "chacabuco-realista", "salta-batalla"],
  },
  {
    id: "memoria",
    titulo: "Memoria y democracia",
    descripcion:
      "Fotografías y documentos del siglo XX: peronismo, dictadura y retorno republicano.",
    piezas: ["evita-multitud", "memoria-golpe", "conadep-sabato", "memoria-alfonsin"],
  },
];

export const PIEZAS_PREMIUM: Record<string, PiezaPremiumMeta> = {
  "julio-acta": {
    id: "julio-acta",
    coleccionId: "nacion",
    teaser: "El acta que declaró la independencia no fue un gesto simbólico.",
    comentario:
      "El acta que declaró la independencia no fue un gesto simbólico: fue la respuesta de un Congreso acorralado por la guerra, la anarquía y la presión británica. Mirala como documento político: cada palabra negocia entre la unión de las provincias y el miedo a quedar solos frente a España. En la exhibición del 9 de Julio, esta pieza cierra el arco entre la Revolución de Mayo y la Argentina que aún no existía como Estado.",
  },
  "constitucion-1853": {
    id: "constitucion-1853",
    coleccionId: "nacion",
    teaser: "La Constitución de 1853 no nació de consenso armónico.",
    comentario:
      "La Constitución de 1853 no nació de consenso armónico: fue el proyecto de un bloque provincial que quería un Estado fuerte, laicizado y exportador. Comparala con la Constitución de Buenos Aires de 1826: el federalismo ganó, pero dejó preguntas abiertas sobre la ciudad capital y el poder ejecutivo que explotarían décadas después.",
  },
  "caseros-urquiza": {
    id: "caseros-urquiza",
    coleccionId: "nacion",
    teaser: "Urquiza encarna la paradoja del organizador nacional.",
    comentario:
      "Urquiza encarna la paradoja del organizador nacional: derrotó a Rosas con tropas entrerrianas, correntinas y brasileñas, pero su victoria en Caseros abrió la puerta a Mitre y al centralismo porteño. Este retrato conviene leerlo junto a la escena de batalla: no es solo un héroe, es quien cerró una era caudillista para abrir otra.",
  },
  "guayaquil-entrevista": {
    id: "guayaquil-entrevista",
    coleccionId: "nacion",
    teaser: "La entrevista de Guayaquil sigue siendo una zona gris de la historiografía.",
    comentario:
      "La entrevista de Guayaquil sigue siendo una zona gris de la historiografía: no hay acta firmada, solo memorias cruzadas y reproches posteriores. Esta escena ilustra el choque de dos proyectos americanos (el protectorado de San Martín y la Gran Colombia de Bolívar) que nunca se reconciliaron del todo. Por eso la pieza funciona como puerta hacia toda la campaña continental.",
  },
  "andes-cruce": {
    id: "andes-cruce",
    coleccionId: "campanas",
    teaser: "Los mapas del cruce condensan lo imposible en trazos casi didácticos.",
    comentario:
      "Los mapas del cruce condensan lo imposible en trazos casi didácticos: pasos, alturas, columnas. No son decoración: son la prueba de que la campaña se planeó como logística antes que como epopeya. Compará este mapa con los grabados de Chacabuco: primero el terreno, después la batalla.",
  },
  "andes-chacabuco": {
    id: "andes-chacabuco",
    coleccionId: "campanas",
    teaser: "Chacabuco en un grabado europeo: la victoria vista desde lejos.",
    comentario:
      "Chacabuco en un grabado europeo: la victoria vista desde lejos, con uniformes limpios y composición teatral. Sirve para preguntarse qué partes de la batalla real desaparecen cuando el relato viaja al otro lado del Atlántico, y por qué esas imágenes alimentaron el mito del Libertador.",
  },
  "chacabuco-realista": {
    id: "chacabuco-realista",
    coleccionId: "campanas",
    teaser: "El lado realista de Chacabuco casi nunca entra al relato escolar.",
    comentario:
      "El lado realista de Chacabuco casi nunca entra al relato escolar. Esta pieza muestra la retirada, el desorden, la derrota desde el bando que perdió. En el museo, conviene mirarla en diálogo con la escena victoriosa: la guerra no tiene un solo punto de vista.",
  },
  "salta-batalla": {
    id: "salta-batalla",
    coleccionId: "campanas",
    teaser: "La batalla de Salta reunió en un mismo campo a Güemes, Belgrano y milicias locales.",
    comentario:
      "La batalla de Salta reunió en un mismo campo a Güemes, Belgrano y milicias locales. El grabado enfatiza la caballería en terreno abierto, el tipo de combate que Belgrano aprendió a evitar después de Huaqui. Es una pieza puente entre el norte rebelde y la reconquista de Tucumán.",
  },
  "evita-multitud": {
    id: "evita-multitud",
    coleccionId: "memoria",
    teaser: "Evita no hablaba solo a los sindicatos: construía una multitud visible.",
    comentario:
      "Evita no hablaba solo a los sindicatos: construía una multitud visible. Esta fotografía captura la escala del peronismo como fenómeno urbano: Plaza de Mayo, banderas, cuerpos apretados. Leela junto a la pieza del voto femenino: el mismo movimiento que movilizaba calles también redefinía ciudadanía.",
  },
  "memoria-golpe": {
    id: "memoria-golpe",
    coleccionId: "memoria",
    teaser: "El golpe de 1976 no empezó con tanques en la tele.",
    comentario:
      "El golpe de 1976 no empezó con tanques en la tele: empezó con un silencio administrativo, listas y un país cansado de la violencia. Esta imagen pertenece al archivo de lo que vino después (memoria, juicio, Nunca Más) y por eso está en la colección de democracia recuperada.",
  },
  "conadep-sabato": {
    id: "conadep-sabato",
    coleccionId: "memoria",
    teaser: "Sabato encarnó la voz moral que el informe necesitaba.",
    comentario:
      "Sabato encarnó la voz moral que el informe necesitaba: escritor, no militar, no político partidario. La foto del Conadep es documento y símbolo a la vez: marca el instante en que la verdad dejó de ser tabú oficial. En la exhibición del Proceso, esta pieza cierra el arco hacia Alfonsín y el Juicio a las Juntas.",
  },
  "memoria-alfonsin": {
    id: "memoria-alfonsin",
    coleccionId: "memoria",
    teaser: "Alfonsín asumió con una deuda imposible: democracia sin impunidad total.",
    comentario:
      "Alfonsín asumió con una deuda imposible: democracia sin impunidad total, economía en ruinas, militares aún fuertes. Esta imagen resume el tono de los primeros años del retorno: esperanza contenida, no euforia. Conecta directamente con las salas de hiperinflación y el menemismo que vino después.",
  },
};

export const IDS_PIEZAS_PREMIUM = Object.keys(PIEZAS_PREMIUM);
