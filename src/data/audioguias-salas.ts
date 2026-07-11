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

const INDICE: Record<string, AudioguiaExhibicion> = {
  "el-cruce-de-los-andes": CRUCE,
  "las-madres": MADRES,
  chacabuco: CHACABUCO,
  "nunca-mas": NUNCA_MAS,
  guayaquil: GUAYAQUIL,
  "las-48-horas-de-mayo": MAYO,
};

export function obtenerAudioguiaSala(cronicaSlug: string): AudioguiaExhibicion | undefined {
  return INDICE[cronicaSlug];
}

export function exhibicionesConAudioguia(): string[] {
  return Object.keys(INDICE);
}

export function tieneAudioguia(cronicaSlug: string): boolean {
  return cronicaSlug in INDICE;
}
