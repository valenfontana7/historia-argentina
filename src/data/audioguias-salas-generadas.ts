/** Generado por scripts/audioguias-indexar.ts: tier C narrativo */
import type { AudioguiaExhibicion } from "@/data/audioguias-salas-manual";

const ALSOGARAY: AudioguiaExhibicion = {
  cronicaSlug: "alsogaray",
  titulo: "Audioguía · Alsogaray",
  duracionEstimada: "7 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "Pasar el invierno",
      texto: "1959 a 1999. Alsogaray: estabilizar antes de prometer milagros.",
    },
    {
      estacion: 1,
      titulo: "Una voz minoritaria",
      texto: "Décadas predicando lo que el peronismo y el desarrollismo rechazaban.",
    },
    {
      estacion: 2,
      titulo: "Ideas que vuelven",
      texto: "Cada hiperinflación reabre el manual de Alsogaray.",
    },
    {
      estacion: 3,
      titulo: "Del invierno al 1 a 1",
      texto: "Alsogaray no inventó la convertibilidad. Anticipó su obsesión.",
    }
  ],
};

const CODIGO_CIVIL: AudioguiaExhibicion = {
  cronicaSlug: "codigo-civil",
  titulo: "Audioguía · El Código Civil",
  duracionEstimada: "7 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "La ley de la vida privada",
      texto: "1869 a 1871. Después de la Constitución, faltaba otra regla: la de la propiedad y los contratos.",
    },
    {
      estacion: 1,
      titulo: "Propiedad, contratos, familia",
      texto: "Una República liberal necesita reglas exigibles, no arbitrio de vecinos.",
    },
    {
      estacion: 2,
      titulo: "El legado de Vélez",
      texto: "Murió en 1875. Su código le sobrevivió generaciones.",
    },
    {
      estacion: 3,
      titulo: "La República en el detalle",
      texto: "Sin ley civil común, la Constitución queda a mitad de camino.",
    }
  ],
};

const CRISIS_DEL_TEQUILA: AudioguiaExhibicion = {
  cronicaSlug: "crisis-del-tequila",
  titulo: "Audioguía · La crisis del Tequila",
  duracionEstimada: "7 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "El shock mexicano",
      texto: "1994 a 1995: el efecto Tequila pone a prueba el 1 a 1.",
    },
    {
      estacion: 1,
      titulo: "Bancos bajo presión",
      texto: "1995: corridas, rescates y una convertibilidad que aguantó… por entonces.",
    },
    {
      estacion: 2,
      titulo: "Puente sin default",
      texto: "Del Tequila al 2001 hay un camino. No es el mismo día.",
    },
    {
      estacion: 3,
      titulo: "La lección del aviso",
      texto: "Una ancla puede sobrevivir un shock… y fallar en el siguiente.",
    }
  ],
};

const LEY_DE_RESIDENCIA: AudioguiaExhibicion = {
  cronicaSlug: "ley-de-residencia",
  titulo: "Audioguía · La Ley de Residencia",
  duracionEstimada: "7 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "Poblar… y expulsar",
      texto: "1902: el orden liberal también tenía policía de fronteras.",
    },
    {
      estacion: 1,
      titulo: "La herramienta del orden",
      texto: "Huelgas, anarquismo y una ley pensada para el puerto.",
    },
    {
      estacion: 2,
      titulo: "La sombra del granero",
      texto: "Abrir el país y cerrar la protesta: dos caras del mismo orden.",
    },
    {
      estacion: 3,
      titulo: "El orden que queda",
      texto: "La ley cambió. La pregunta sobre quién puede quedarse, no.",
    }
  ],
};

const PLAN_AUSTRAL: AudioguiaExhibicion = {
  cronicaSlug: "plan-austral",
  titulo: "Audioguía · El Plan Austral",
  duracionEstimada: "7 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "Una moneda nueva",
      texto: "1985: Alfonsín apuesta a congelar precios y bautizar el austral.",
    },
    {
      estacion: 1,
      titulo: "Heterodoxia y límites",
      texto: "Congelar no es lo mismo que ordenar las cuentas.",
    },
    {
      estacion: 2,
      titulo: "Cuando el ancla se rompe",
      texto: "Sin el Austral, el camino a 1989 se entiende a medias.",
    },
    {
      estacion: 3,
      titulo: "Puente a la hiper",
      texto: "Un experimento monetario en una democracia joven.",
    }
  ],
};

const PRIVATIZACIONES: AudioguiaExhibicion = {
  cronicaSlug: "privatizaciones",
  titulo: "Audioguía · Las privatizaciones",
  duracionEstimada: "7 minutos",
  segmentos: [
    {
      estacion: 0,
      titulo: "El Estado productor se vende",
      texto: "1989 a 1999. Menem privatizó lo que el peronismo había estatizado.",
    },
    {
      estacion: 1,
      titulo: "Competencia y costos",
      texto: "Servicios mejores para unos, despidos y vacíos para otros.",
    },
    {
      estacion: 2,
      titulo: "Separar dos reformas",
      texto: "Privatizar no es lo mismo que el 1 a 1.",
    },
    {
      estacion: 3,
      titulo: "El saldo que discute el país",
      texto: "Después del 2001, la palabra privatización volvió a ser batalla.",
    }
  ],
};

export const GENERADO_INDICE: Record<string, AudioguiaExhibicion> = {
  alsogaray: ALSOGARAY,
  "codigo-civil": CODIGO_CIVIL,
  "crisis-del-tequila": CRISIS_DEL_TEQUILA,
  "ley-de-residencia": LEY_DE_RESIDENCIA,
  "plan-austral": PLAN_AUSTRAL,
  privatizaciones: PRIVATIZACIONES,
};
