export type SegmentoAudioguia = {
  /** Índice de estación (0-based) al que corresponde. */
  estacion: number;
  titulo: string;
  texto: string;
};

export type AudioguiaRecorrido = {
  recorridoSlug: string;
  titulo: string;
  duracionEstimada: string;
  segmentos: SegmentoAudioguia[];
  /** Ruta opcional a MP3 cuando exista grabación humana. */
  audioUrl?: string;
};

const DEMOCRACIA: AudioguiaRecorrido = {
  recorridoSlug: "democracia-y-memoria",
  titulo: "Audioguía · Democracia y memoria",
  duracionEstimada: "12 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "El golpe de Onganía",
      texto: "Empezamos en 1966, cuando un golpe militar interrumpe la convivencia frágil de la década. Onganía disuelve partidos y cierra el Congreso. La Argentina entra en una etapa autoritaria que va a explotar en la calle.",
    },
    {
      estacion: 4,
      titulo: "El retorno de Perón",
      texto: "1973: Perón vuelve después de casi veinte años de exilio. La multitud lo espera en Ezeiza, pero la fractura interna del peronismo ya no tiene remedio.",
    },
    {
      estacion: 11,
      titulo: "24 de marzo de 1976",
      texto: "Las Fuerzas Armadas derrocaron a Isabel Perón e instalaron el Proceso de Reorganización Nacional. Prometieron orden. Impusieron terror.",
    },
    {
      estacion: 15,
      titulo: "Las Madres de Plaza de Mayo",
      texto: "En 1977, un puñado de madres caminó en círculos frente a la Casa Rosada. El pañuelo blanco se convirtió en símbolo de una memoria que el Estado quería borrar.",
    },
    {
      estacion: 19,
      titulo: "Malvinas",
      texto: "Abril de 1982: la dictadura apuesta todo en Malvinas. La movilización patriótica dura poco; la derrota precipita el fin del régimen.",
    },
    {
      estacion: 24,
      titulo: "La democracia vuelve",
      texto: "10 de diciembre de 1983: Alfonsín jura como presidente constitucional. La Plaza de Mayo recupera lo que había perdido en siete años de oscuridad.",
    },
    {
      estacion: 32,
      titulo: "El 2001",
      texto: "Cerramos en diciembre de 2001: corralito, cacerolazos y cinco presidentes en dos semanas. La democracia sobrevive, pero tambaleante.",
    },
  ],
};

const SAN_MARTIN: AudioguiaRecorrido = {
  recorridoSlug: "san-martin-continental",
  titulo: "Audioguía · San Martín continental",
  duracionEstimada: "10 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "El Regimiento de Granaderos",
      texto: "San Martín no llegó a ser un caudillo más del interior. Formó un cuerpo de élite en Buenos Aires y desde ahí pensó en escala continental.",
    },
    {
      estacion: 2,
      titulo: "San Lorenzo",
      texto: "Quince minutos en el Paraná le dieron fama, tropas leales y el respaldo para un plan que nadie más se atrevía a proponer.",
    },
    {
      estacion: 3,
      titulo: "El cruce de los Andes",
      texto: "Mendoza se convirtió en arsenal. Cuando el ejército cruzó la cordillera, la independencia dejó de ser un sueño del norte y se volvió estrategia del sur.",
    },
    {
      estacion: 4,
      titulo: "Chacabuco",
      texto: "12 de febrero de 1817: la maniobra envolvente de O'Higgins y Soler valida el cruce. Chile empieza a ser posible.",
    },
    {
      estacion: 5,
      titulo: "Maipú",
      texto: "Una tarde en los llanos de Maipú selló la independencia de Chile. San Martín ya mira al Pacífico.",
    },
    {
      estacion: 14,
      titulo: "Guayaquil",
      texto: "Terminamos en la entrevista con Bolívar. San Martín renuncia al mando. Eligió evitar una guerra civil americana.",
    },
  ],
};

const PATAGONIA: AudioguiaRecorrido = {
  recorridoSlug: "patagonia-y-el-estado",
  titulo: "Audioguía · Patagonia y el Estado",
  duracionEstimada: "8 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "Rivadavia y el desierto",
      texto: "En la década de 1820, Rivadavia imaginó una Patagonia incorporada al Estado. El proyecto fracasó, pero la idea quedó.",
    },
    {
      estacion: 2,
      titulo: "Roca",
      texto: "Medio siglo después, Roca llega al poder con otra visión: la frontera se cierra con campañas militares.",
    },
    {
      estacion: 3,
      titulo: "La Conquista del Desierto",
      texto: "Entre 1878 y 1885, el Estado argentino avanza sobre el sur. El mapa que conocemos hoy se dibuja en esos años, y la herida sigue abierta.",
    },
    {
      estacion: 4,
      titulo: "Patagonia rebelde",
      texto: "No todo fue pasividad. Obreros anarquistas y colonos enfrentaron al Estado en la Patagonia de 1920.",
    },
  ],
};

const INDICE: Record<string, AudioguiaRecorrido> = {
  "democracia-y-memoria": DEMOCRACIA,
  "san-martin-continental": SAN_MARTIN,
  "patagonia-y-el-estado": PATAGONIA,
};

export function obtenerAudioguia(recorridoSlug: string): AudioguiaRecorrido | undefined {
  return INDICE[recorridoSlug];
}

export function recorridosConAudioguia(): string[] {
  return Object.keys(INDICE);
}
