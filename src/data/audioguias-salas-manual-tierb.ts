import type { AudioguiaExhibicion } from "@/data/audioguias-salas-manual";

/** Guías editoriales curadas: tier B (exhibiciones visuales). */
export const MANUAL_TIERB_INDICE: Record<string, AudioguiaExhibicion> = {
  belgrano: {
    cronicaSlug: "belgrano",
    titulo: "Audioguía · Belgrano",
    duracionEstimada: "7 minutos",
    segmentos: [
      {
        estacion: 0,
        titulo: "El general que no quiso ser militar",
        texto: "Belgrano era abogado y economista. La revolución lo empujó a mandar ejércitos, crear la bandera y sostener el norte cuando el plan de Lima parecía imposible.",
      },
      {
        estacion: 1,
        titulo: "Economista, jurista, revolucionario",
        texto: "De la Junta de 1810 al Alto Perú: perdió en Huaqui, ordenó el Éxodo Jujeño y volvió a ganar en Tucumán y Salta. Deslizá el comparador entre el retrato y el legado.",
      },
      {
        estacion: 2,
        titulo: "El retrato del fundador",
        texto: "La sala contrasta dos Belgrano: el funcionario ilustrado y el general que convirtió la revolución en territorio liberado.",
      },
      {
        estacion: 3,
        titulo: "El héroe ambiguo",
        texto: "Belgrano murió pobre y discutido. Hoy es símbolo nacional, pero su historia mezcla obediencia, desobediencia y una independencia que costó más de una derrota.",
      },
    ],
  },
  rosas: {
    cronicaSlug: "rosas",
    titulo: "Audioguía · Rosas",
    duracionEstimada: "7 minutos",
    segmentos: [
      {
        estacion: 0,
        titulo: "Veinte años de machete rojo",
        texto: "Juan Manuel de Rosas gobernó casi sin interrupción entre 1829 y 1852. Ordenó la frontera, cerró el puerto y gobernó con miedo como herramienta de Estado.",
      },
      {
        estacion: 1,
        titulo: "Orden, miedo y bloqueo",
        texto: "La Mazorca, el bloqueo de Buenos Aires y la sumisión de las provincias construyeron un régimen personal. El comparador muestra el rostro público y la violencia de la intimidad política.",
      },
      {
        estacion: 2,
        titulo: "El retrato del tirano",
        texto: "Para unos, Restaurador; para otros, tirano. Rosas unificó el país con hierro y dejó una herencia imposible de mirar sin contradicciones.",
      },
      {
        estacion: 3,
        titulo: "La caída en Caseros",
        texto: "Urquiza lo venció en Caseros. Rosas partió al exilio y el país intentó armar otra Argentina sobre las cenizas del machete rojo.",
      },
    ],
  },
  roca: {
    cronicaSlug: "roca",
    titulo: "Audioguía · Roca",
    duracionEstimada: "7 minutos",
    segmentos: [
      {
        estacion: 0,
        titulo: "El Zorro",
        texto: "Julio Argentino Roca llegó al poder después de Ituzaingó y la política del machete. Encarnó la Generación del Ochenta: orden, exportación, frontera.",
      },
      {
        estacion: 1,
        titulo: "Paz y administración",
        texto: "Dos veces presidente, Roca estabilizó finanzas y encabezó la Conquista del Desierto. El comparador enfrenta progreso material y costo humano.",
      },
      {
        estacion: 2,
        titulo: "El retrato del orden",
        texto: "Roca es padre del modelo agroexportador. También es figura central de un despojo que el museo no oculta.",
      },
      {
        estacion: 3,
        titulo: "El legado doble",
        texto: "Sin Roca no se entiende la Argentina moderna. Con Roca tampoco se entiende la herida mapuche y tehuelche que sigue abierta.",
      },
    ],
  },
  sarmiento: {
    cronicaSlug: "sarmiento",
    titulo: "Audioguía · Sarmiento",
    duracionEstimada: "7 minutos",
    segmentos: [
      {
        estacion: 0,
        titulo: "El maestro de América",
        texto: "Domingo Faustino Sarmiento pasó de exiliado a presidente. Escribió Facundo, combatió a Rosas y soñó una nación alfabetizada.",
      },
      {
        estacion: 1,
        titulo: "Presidente contra el analfabetismo",
        texto: "Como presidente impulsó escuelas, ferrocarriles y una idea de progreso basada en la educación. El comparador muestra al polemista y al estadista.",
      },
      {
        estacion: 2,
        titulo: "El retrato del fundador",
        texto: "Sarmiento es héroe civilizatorio para unos, autoritarismo ilustrado para otros. Las dos lecturas conviven en esta sala.",
      },
      {
        estacion: 3,
        titulo: "El legado doble",
        texto: "La escuela pública y la Campaña del Desierto llevan la misma firma. Por eso Sarmiento sigue siendo debate vivo, no sólo busto en un aula.",
      },
    ],
  },
  mitre: {
    cronicaSlug: "mitre",
    titulo: "Audioguía · Mitre",
    duracionEstimada: "7 minutos",
    segmentos: [
      {
        estacion: 0,
        titulo: "El general que escribió la historia",
        texto: "Bartolomé Mitre ganó en Pavón, unificó la Argentina en 1862 y escribió la historia de Belgrano y San Martín mientras la hacía.",
      },
      {
        estacion: 1,
        titulo: "La guerra más sangrienta",
        texto: "La guerra del Paraguay marcó su presidencia. Mitre llevó al país a un conflicto continental de escala inédita.",
      },
      {
        estacion: 2,
        titulo: "Historiador de la nación",
        texto: "El comparador enfrenta al militar y al escritor. Mitre inventó parte del relato nacional mientras lo gobernaba.",
      },
      {
        estacion: 3,
        titulo: "El legado doble",
        texto: "Unificador, historiador, liberal. Mitre dejó un país más centralizado y una memoria donde él ocupa lugar central.",
      },
    ],
  },
  urquiza: {
    cronicaSlug: "urquiza",
    titulo: "Audioguía · Urquiza",
    duracionEstimada: "7 minutos",
    segmentos: [
      {
        estacion: 0,
        titulo: "El caudillo que unió al interior",
        texto: "Justo José de Urquiza encarnó el federalismo en armas. Entre Entre Ríos y el Ejército Grande, desafió el poder porteño de Rosas.",
      },
      {
        estacion: 1,
        titulo: "El Pacto de Palermo",
        texto: "Urquiza negoció alianzas antes de pelear. Caseros fue resultado de política provincial y de un interior cansado del rosismo.",
      },
      {
        estacion: 2,
        titulo: "El retrato del estadista",
        texto: "Vencedor de Rosas y convocante de la Constitución de 1853. El comparador muestra al caudillo y al constructor institucional.",
      },
      {
        estacion: 3,
        titulo: "Después de Caseros",
        texto: "Perdió Pavón y el liderazgo unificador, pero abrió la puerta a la Argentina pos-Rosas. Sin Urquiza, Caseros no tiene sentido.",
      },
    ],
  },
  alberdi: {
    cronicaSlug: "alberdi",
    titulo: "Audioguía · Alberdi",
    duracionEstimada: "7 minutos",
    segmentos: [
      {
        estacion: 0,
        titulo: "El pensador del exilio",
        texto: "Juan Bautista Alberdi escribió las Bases desde el exilio. Pensó la nación antes de que existiera legalmente.",
      },
      {
        estacion: 1,
        titulo: "Gobierno barato, pueblo educado",
        texto: "Liberal, federal en el papel, centralista en la práctica. Alberdi imaginó un país moderno apoyado en inmigración y educación.",
      },
      {
        estacion: 2,
        titulo: "De la pluma a la Constitución",
        texto: "Un año después de Caseros, sus ideas se volvieron texto constitucional. El comparador muestra al pensador y al arquitecto jurídico.",
      },
      {
        estacion: 3,
        titulo: "El arquitecto invisible",
        texto: "Nunca fue presidente, pero fundó la República sobre papel. La Constitución de 1853 lleva su huella en cada artículo clave.",
      },
    ],
  },
  menem: {
    cronicaSlug: "menem",
    titulo: "Audioguía · Menem",
    duracionEstimada: "7 minutos",
    segmentos: [
      {
        estacion: 0,
        titulo: "El peronismo en los noventa",
        texto: "Carlos Menem llegó en 1989 con hiperinflación y terminó transformando el peronismo en convertibilidad, privatizaciones y consumo.",
      },
      {
        estacion: 1,
        titulo: "Reforma y consumo",
        texto: "Un peso, un dólar: la convertibilidad domó precios y abrió una década de autos importados y shopping. El comparador muestra la euforia y el costo.",
      },
      {
        estacion: 2,
        titulo: "El retrato del menemismo",
        texto: "Menem reescribió el relato peronista. Para unos, modernización; para otros, venta del Estado y corrupción sistémica.",
      },
      {
        estacion: 3,
        titulo: "Del menemismo al 2001",
        texto: "La convertibilidad sostuvo el modelo hasta que no pudo más. Menem dejó un país distinto, y una crisis que explotaría en diciembre de 2001.",
      },
    ],
  },
  cristina: {
    cronicaSlug: "cristina",
    titulo: "Audioguía · Cristina",
    duracionEstimada: "7 minutos",
    segmentos: [
      {
        estacion: 0,
        titulo: "La continuidad K",
        texto: "Cristina Fernández heredó el proyecto kirchnerista en 2007 y lo llevó a escala personal: más Estado, más polarización, más litigios.",
      },
      {
        estacion: 1,
        titulo: "Crecimiento y polarización",
        texto: "Los commodities financiaron derechos y obras. También inflación, cepo y una grieta que definió la década. Usá el comparador de imágenes.",
      },
      {
        estacion: 2,
        titulo: "El retrato del kirchnerismo",
        texto: "CFK concentra el amor y el odio del peronismo del siglo XXI. Esta sala no elige bando: muestra el arco completo.",
      },
      {
        estacion: 3,
        titulo: "Después de los K",
        texto: "Dos mandatos, voto joven, causas judiciales y un peronismo que ya no volvió a ser el mismo. Cristina sigue siendo eje del presente.",
      },
    ],
  },
  macri: {
    cronicaSlug: "macri",
    titulo: "Audioguía · Macri",
    duracionEstimada: "7 minutos",
    segmentos: [
      {
        estacion: 0,
        titulo: "Cambiemos",
        texto: "Mauricio Macri rompió doce años de kirchnerismo en 2015. Prometió normalidad, apertura y un país sin grieta.",
      },
      {
        estacion: 1,
        titulo: "Apertura y deuda",
        texto: "Levantó cepos, firmó con holdouts y tomó deuda récord. El crecimiento tardó; la inflación no. El comparador muestra expectativa y resultado.",
      },
      {
        estacion: 2,
        titulo: "El retrato del cambio",
        texto: "Macri representó al sector privado en el poder. Para sus votores, modernización; para sus críticos, ajuste sin plan.",
      },
      {
        estacion: 3,
        titulo: "El fin del ciclo",
        texto: "La derrota ante Alberto Fernández en 2019 cerró el experimento cambiemos. Dejó deuda, inflación y una derecha que tuvo que recomponerse.",
      },
    ],
  },
  kirchner: {
    cronicaSlug: "kirchner",
    titulo: "Audioguía · Kirchner",
    duracionEstimada: "7 minutos",
    segmentos: [
      {
        estacion: 0,
        titulo: "Después del colapso",
        texto: "Néstor Kirchner asumió en 2003 con un país en ruinas post-2001. Reestructuró deuda, reactivó la economía y reconstruyó el peronismo.",
      },
      {
        estacion: 1,
        titulo: "Pago a los acreedores, juicio a los militares",
        texto: "Anuló leyes de impunidad y empujó el juicio a las empresas. Pagó al FMI con agencia política. Dos gestos que marcaron su presidencia.",
      },
      {
        estacion: 2,
        titulo: "El retrato del post-2001",
        texto: "El comparador muestra al Nestor pragmático y al líder que armó un bloque hegemónico. Pocos mandatos cambiaron tanto el clima político.",
      },
      {
        estacion: 3,
        titulo: "El legado K",
        texto: "Renunció a reelegirse y abrió paso a Cristina. El kirchnerismo nació como respuesta al colapso y se volvió escuela del peronismo actual.",
      },
    ],
  },
  milei: {
    cronicaSlug: "milei",
    titulo: "Audioguía · Milei",
    duracionEstimada: "7 minutos",
    segmentos: [
      {
        estacion: 0,
        titulo: "La libertad avanza",
        texto: "Javier Milei ganó en 2023 con un discurso anti-casta y liberal radical. Llegó desde fuera del establishment con motosierra incluida.",
      },
      {
        estacion: 1,
        titulo: "Ajuste y shock",
        texto: "Devaluación, reducción de ministerios y reformas por decreto. El comparador muestra promesa libertaria y realidad económica.",
      },
      {
        estacion: 2,
        titulo: "El retrato de la ruptura",
        texto: "Milei concentra esperanza anti-inflacionaria y temor al desguace estatal. Es la exhibición más reciente del museo.",
      },
      {
        estacion: 3,
        titulo: "Un país en experimento",
        texto: "Todavía es temprano para cerrar juicio. Esta sala documenta el inicio de un ciclo que redefine derecha y peronismo.",
      },
    ],
  },
  "el-cordobazo": {
    cronicaSlug: "el-cordobazo",
    titulo: "Audioguía · El Cordobazo",
    duracionEstimada: "7 minutos",
    segmentos: [
      {
        estacion: 0,
        titulo: "La calle contra el régimen",
        texto: "Mayo de 1969: Córdoba se levantó contra Onganía. Obreros y estudiantes tomaron la calle contra un gobierno que prohibía la política.",
      },
      {
        estacion: 1,
        titulo: "Tanques en la ciudad",
        texto: "El ejército respondió con tanques. Hubo muertos, pero el mensaje quedó: el autoritarismo no tenía respaldo popular ilimitado.",
      },
      {
        estacion: 2,
        titulo: "Preludio de la década del terror",
        texto: "El Cordobazo abrió una secuencia de luchas que terminó en el golpe de 1976. El comparador muestra calle y represión.",
      },
      {
        estacion: 3,
        titulo: "Del Cordobazo a Nunca Más",
        texto: "Sin Cordobazo no se entiende Montoneros, el Proceso ni las Madres. Fue la primera grieta grande en la Argentina del siglo XX tardío.",
      },
    ],
  },
  huaqui: {
    cronicaSlug: "huaqui",
    titulo: "Audioguía · Huaqui",
    duracionEstimada: "7 minutos",
    segmentos: [
      {
        estacion: 0,
        titulo: "El cementerio del Alto Perú",
        texto: "1811: Belgrano chocó con el ejército realista en Huaqui. Fue la primera gran derrota del Ejército del Norte.",
      },
      {
        estacion: 1,
        titulo: "Tres desastres, una lección",
        texto: "Huaqui se sumó a Vilcapugio y Ayohuma. El camino a Lima por el norte parecía un cementerio de ejércitos patriotas.",
      },
      {
        estacion: 2,
        titulo: "Del desastre al Éxodo",
        texto: "Belgrano ordenó el Éxodo Jujeño: quemar campos, mover población, ganar tiempo. El mapa muestra retirada y resistencia.",
      },
      {
        estacion: 3,
        titulo: "La derrota que salvó la revolución",
        texto: "Huaqui enseñó que el norte no caía fácil. Belgrano aprendió, recompuso tropas y volvió a ganar. La revolución sobrevivió a su peor día.",
      },
    ],
  },
  conadep: {
    cronicaSlug: "conadep",
    titulo: "Audioguía · CONADEP",
    duracionEstimada: "7 minutos",
    segmentos: [
      {
        estacion: 0,
        titulo: "La CONADEP",
        texto: "1983: Alfonsín creó la Comisión Nacional sobre la Desaparición de Personas. Por primera vez, el Estado investigaba su propio terror.",
      },
      {
        estacion: 1,
        titulo: "Nunca Más",
        texto: "Testimonios, centros clandestinos, nombres. El informe Nunca Más fijó la verdad que la dictadura quiso borrar.",
      },
      {
        estacion: 2,
        titulo: "El retrato de la verdad",
        texto: "El comparador enfrenta silencio oficial y palabra de sobrevivientes. La CONADEP convirtió memoria en documento público.",
      },
      {
        estacion: 3,
        titulo: "La deuda que sigue",
        texto: "El informe abrió juicios, pero la impunidad regresó en parte. CONADEP no cerró la herida: la hizo indiscutible.",
      },
    ],
  },
  "la-revolucion-libertadora": {
    cronicaSlug: "la-revolucion-libertadora",
    titulo: "Audioguía · La Revolución Libertadora",
    duracionEstimada: "7 minutos",
    segmentos: [
      {
        estacion: 0,
        titulo: "El golpe contra Perón",
        texto: "Septiembre de 1955: las Fuerzas Armadas derrocaron a Perón. La Revolución Libertadora prometió salvar la República del peronismo.",
      },
      {
        estacion: 1,
        titulo: "Proscripción y resistencia",
        texto: "Prohibieron el peronismo, persiguieron sindicatos y abrieron un vacío que la política no supo llenar durante años.",
      },
      {
        estacion: 2,
        titulo: "El retrato del antiperonismo",
        texto: "El comparador muestra al golpista ilustrado y al país partido. Libertadora es nombre que un bando se dio a sí mismo.",
      },
      {
        estacion: 3,
        titulo: "El retorno inevitable",
        texto: "Proscribir Perón no lo borró. La Revolución Libertadora preparó el terreno para el 17 de Octubre de 1973.",
      },
    ],
  },
  esma: {
    cronicaSlug: "esma",
    titulo: "Audioguía · ESMA",
    duracionEstimada: "7 minutos",
    segmentos: [
      {
        estacion: 0,
        titulo: "La Escuela de la muerte",
        texto: "La ESMA fue centro clandestino de detención durante la dictadura. Un espacio de formación naval convertido en máquina de terror.",
      },
      {
        estacion: 1,
        titulo: "Vuelos de la muerte",
        texto: "Detenidos desaparecidos, tortura sistemática, aviones sobre el Río de la Plata. La ESMA simboliza el horror planificado.",
      },
      {
        estacion: 2,
        titulo: "El retrato del crimen",
        texto: "El comparador contrasta la fachada institucional y la verdad testimonial. Hoy el espacio es sitio de memoria.",
      },
      {
        estacion: 3,
        titulo: "Memoria como museo",
        texto: "Juicios, condenas y museo. La ESMA no es pasado cerrado: es advertencia sobre lo que el Estado puede hacer a sus ciudadanos.",
      },
    ],
  },
  montoneros: {
    cronicaSlug: "montoneros",
    titulo: "Audioguía · Montoneros",
    duracionEstimada: "7 minutos",
    segmentos: [
      {
        estacion: 0,
        titulo: "La guerrilla peronista",
        texto: "Montoneros nació en la década de 1960 como brazo armado del peronismo revolucionario. Mezcló idealismo, violencia y utopía.",
      },
      {
        estacion: 1,
        titulo: "Del apoyo a Perón al enfrentamiento",
        texto: "Apoyaron el retorno de Perón y luego chocaron con él. La guerrilla y el movimiento obrero no fueron la misma cosa.",
      },
      {
        estacion: 2,
        titulo: "El retrato del compañero",
        texto: "El comparador muestra rostro heroico y rostro temido. Montoneros sigue siendo símbolo según quién cuente la historia.",
      },
      {
        estacion: 3,
        titulo: "Represión y derrota",
        texto: "El Proceso los persiguió sin cuartel. Montoneros no explica solo la dictadura, pero forma parte del clima que la habilitó.",
      },
    ],
  },
};
