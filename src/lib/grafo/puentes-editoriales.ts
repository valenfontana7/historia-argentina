/** Puentes narrativos editoriales: origen → { destinoSlug: texto puente }. */
export const PUENTES_EDITORIALES: Record<string, Record<string, string>> = {
  // Independencia y campañas
  "el-cruce-de-los-andes": {
    chacabuco: "Después del cruce, la primera gran victoria en suelo chileno",
    maipu: "La batalla que cerró la independencia de Chile",
    "jose-de-san-martin": "El retrato del Libertador que cruzó lo imposible",
    guayaquil: "El encuentro con Bolívar que definió el destino de América",
  },
  chacabuco: {
    maipu: "La batalla que selló la independencia de Chile",
    "manuel-belgrano": "Mientras San Martín avanzaba por el sur, Belgrano sostenía el norte",
    guayaquil: "El misterio de la entrevista que partió América en dos",
    "el-cruce-de-los-andes": "Volvé al mapa del cruce: la logística antes de la epopeya",
  },
  maipu: {
    guayaquil: "Con Chile libre, quedaba resolver el destino de Perú",
    chacabuco: "La victoria anterior que hizo posible Maipú",
    "jose-de-san-martin": "El abrazo de Maipú en el retrato del Libertador",
    independencia: "La sala de las guerras que forjaron la patria",
  },
  guayaquil: {
    "el-cruce-de-los-andes": "Todo empezó con el cruce: la campaña que llevó a Guayaquil",
    chacabuco: "Las victorias chilenas que precedieron la entrevista",
    "jose-de-san-martin": "San Martín en el Panteón: el hombre detrás del misterio",
    ayacucho: "Bolívar siguió sin él: la batalla final del imperio español",
  },
  "las-48-horas-de-mayo": {
    "jose-de-san-martin": "El joven coronel que observaba desde lejos",
    "la-ciudad-que-vencio-a-un-imperio": "Tres años antes, la ciudad ya había resistido invasores",
    "mariano-moreno": "El Moreno de la Primera Junta: tinta contra el virreinato",
    independencia: "La sala donde empieza la Argentina moderna",
  },
  "la-ciudad-que-vencio-a-un-imperio": {
    "las-48-horas-de-mayo": "De la Reconquista a la Revolución: la ciudad que no se rinde",
    liniers: "Liniers: héroe de 1806, víctima de 1809",
    "santiago-de-liniers": "Su retrato en el Panteón",
    colonia: "La sala del virreinato y sus últimos años",
  },
  "el-9-de-julio": {
    "el-9-de-julio": "La exhibición del congreso que declaró la independencia",
    "manuel-belgrano": "Quien izó la bandera en Tucumán",
    "la-batalla-de-tucuman": "Belgrano ganó la batalla antes de firmar el acta",
    independencia: "La sala de la patria nueva",
  },
  "el-exodo-jujeno": {
    "la-batalla-de-tucuman": "La retirada que precedió la victoria decisiva",
    "manuel-belgrano": "Belgrano en el Panteón: el general que desobedeció",
    "la-guerra-gaucha": "Güemes sostenía el norte mientras Belgrano retrocedía",
    "martin-miguel-de-guemes": "El caudillo de la frontera",
  },
  "la-batalla-de-tucuman": {
    "el-exodo-jujeno": "La retirada que hizo posible esta victoria",
    "la-batalla-de-salta": "La reconquista del norte en dos campañas",
    "el-9-de-julio": "Meses después, Tucumán declaraba la independencia",
    "manuel-belgrano": "El general que convirtió la retirada en triunfo",
  },
  caseros: {
    rosas: "Veinte años de rosismo antes de Caseros",
    "juan-manuel-de-rosas": "El retrato del caudillo derrotado",
    "la-constitucion-de-1853": "Después de Rosas, la Constitución federal",
    organizacion: "La sala de caudillos y constituciones",
  },
  rosas: {
    caseros: "La batalla que cerró su régimen",
    "la-vuelta-de-obligado": "Cuando el imperio británico probó sus límites",
    "el-facundo": "La barbarie que Sarmiento le atribuyó al interior",
    "juan-manuel-de-rosas": "Su retrato en el Panteón",
  },
  "la-constitucion-de-1853": {
    "juan-bautista-alberdi": "Alberdi escribió las bases; Urquiza las impuso",
    alberdi: "La exhibición del pensador de la organización nacional",
    pavon: "Mitre y Urquiza aún tenían cuentas pendientes",
    organizacion: "La sala donde nació el Estado moderno",
  },
  "la-conquista-del-desierto": {
    roca: "Roca: el general que se convirtió en presidente",
    "patagonia-rebelde": "Antes de la Conquista, la Patagonia rebelde",
    "julio-argentino-roca": "El retrato del general que ordenó la campaña",
    moderna: "La sala de la Argentina agroexportadora",
  },

  // Peronismo y siglo XX
  peron: {
    "eva-peron": "La compañera que transformó la política argentina",
    evita: "La exhibición de Evita: multitudes, voto y renuncia",
    "juan-domingo-peron": "Su retrato en el Panteón",
    "el-17-de-octubre": "El día que Perón volvió a la plaza",
  },
  evita: {
    peron: "El movimiento que construyeron juntos",
    "juan-domingo-peron": "Su retrato en el Panteón",
    "voto-femenino": "1947: el voto que Evita conquistó para millones",
    contemporanea: "La sala del peronismo y sus transformaciones",
  },
  "el-17-de-octubre": {
    peron: "La exhibición del ascenso peronista",
    "17-de-octubre": "La efeméride que sigue movilizando la plaza",
    "juan-domingo-peron": "Perón en el Panteón",
    contemporanea: "La sala del siglo XX argentino",
  },
  "la-revolucion-libertadora": {
    peron: "Lo que el golpe de 1955 intentó borrar",
    "el-17-de-octubre": "Antes del golpe, la plaza había hablado",
    frondizi: "1958: el peronismo proscripto vuelve por las urnas",
    contemporanea: "La sala de golpes y retornos",
  },
  "el-cordobazo": {
    ongania: "El general que el Cordobazo sacudió en 1969",
    peron: "La calle industrial prefiguraba el retorno peronista",
    "el-proceso": "Una década después, los militares tomaron el poder",
    contemporanea: "La sala de autoritarismos y resistencia",
  },
  menem: {
    "la-convertibilidad": "El plan que sostuvo los noventa, hasta que no",
    "el-2001": "El colapso que cerró la década menemista",
    peron: "El peronismo que Menem transformó",
    contemporanea: "La sala de privatizaciones y crisis",
  },
  "el-2001": {
    "la-convertibilidad": "El modelo que explotó antes del corralito",
    menem: "La década que dejó la bomba lista",
    piqueteros: "Del colapso nació la protesta de los sin trabajo",
    contemporanea: "La sala de la democracia bajo presión",
  },
  milei: {
    "el-2001": "Veinte años antes, otra crisis sacudió el país",
    macri: "El gobierno que precedió al cambio libertario",
    menem: "Menem también prometió un shock: otra lección reciente",
    contemporanea: "La sala de la Argentina de hoy",
  },
  macri: {
    milei: "Lo que vino después del cambiemos",
    cristina: "Doce años de K antes de Cambiemos",
    "el-2001": "El fantasma del colapso sigue rondando la política",
    contemporanea: "La sala del siglo XXI",
  },

  // Dictadura, memoria y democracia
  "el-proceso": {
    "las-madres": "Las madres que caminaron cuando el silencio era ley",
    conadep: "La comisión que documentó el horror",
    "nunca-mas": "El informe que el país necesitaba leer",
    "raul-alfonsin": "Quien devolvió la democracia",
  },
  "las-madres": {
    "el-proceso": "La dictadura que las empujó a la plaza",
    conadep: "La verdad que el Estado tardó en reconocer",
    "nunca-mas": "El informe que llevan bajo el brazo desde 1985",
    alfonsin: "Alfonsín: el presidente que las escuchó",
  },
  conadep: {
    "nunca-mas": "Del informe a la exhibición: la memoria hecha relato",
    "las-madres": "Las madres que exigieron verdad antes que nadie",
    "el-proceso": "La dictadura que la comisión investigó",
    alfonsin: "Alfonsín convocó la verdad y pagó el precio político",
  },
  "nunca-mas": {
    conadep: "La comisión que produjo el informe",
    "el-proceso": "Los años que el informe condensa",
    alfonsin: "La exhibición del retorno democrático",
    "raul-alfonsin": "Su retrato en el Panteón",
  },
  alfonsin: {
    "nunca-mas": "El informe que marcó su presidencia",
    "elecciones-83": "La vuelta a las urnas que él encabenzó",
    "el-proceso": "Lo que vino antes: la dictadura y su memoria",
    contemporanea: "La sala de la democracia recuperada",
  },
  "setenta-y-cuatro-dias": {
    galtieri: "El general que apostó todo a Malvinas",
    "malvinas-ciudad": "La guerra vista desde la Plaza de Mayo",
    "2-de-abril": "La efeméride que abrió los 74 días",
    contemporanea: "La sala de la herida que no cierra",
  },
  galtieri: {
    "setenta-y-cuatro-dias": "La apuesta que lo llevó al desastre",
    "el-proceso": "La dictadura que Malvinas aceleró hacia el fin",
    videla: "Videla: el primer presidente de la junta",
    contemporanea: "La sala del autoritarismo reciente",
  },

  // Panteón (retratos)
  "jose-de-san-martin": {
    "el-cruce-de-los-andes": "La exhibición que cuenta cómo cruzó lo imposible",
    chacabuco: "La victoria que abrió el camino a Chile libre",
    guayaquil: "El encuentro con Bolívar que cambió América",
    "manuel-belgrano": "Quien sostenía el norte mientras él avanzaba al sur",
  },
  "manuel-belgrano": {
    "jose-de-san-martin": "El Libertador que cruzó los Andes mientras Belgrano defendía el norte",
    "la-batalla-de-tucuman": "Su victoria más decisiva en el norte",
    "juan-manuel-de-rosas": "Otra figura que marcó la organización nacional",
    independencia: "La sala de la Revolución y las guerras de independencia",
  },
  "juan-domingo-peron": {
    peron: "La exhibición sobre su ascenso y su legado",
    "eva-peron": "La compañera que transformó la política argentina",
    "el-17-de-octubre": "El día que volvió a la plaza",
    contemporanea: "La sala del peronismo",
  },
  "eva-peron": {
    evita: "La exhibición de Evita: poder, multitudes y voto",
    peron: "El movimiento que construyeron juntos",
    "juan-domingo-peron": "Su retrato en el Panteón",
    contemporanea: "La sala de la Argentina del siglo XX",
  },
  "juan-manuel-de-rosas": {
    rosas: "La crónica inmersiva del rosismo",
    caseros: "La batalla que derrocó su régimen",
    "domingo-faustino-sarmiento": "Quien encarnó la oposición intelectual",
    organizacion: "La sala de caudillos y constituciones",
  },
  "raul-alfonsin": {
    alfonsin: "La exhibición del retorno democrático",
    "el-proceso": "Lo que vino antes: la dictadura y su memoria",
    "elecciones-83": "La vuelta a las urnas",
    contemporanea: "La sala de la democracia recuperada",
  },
  "domingo-faustino-sarmiento": {
    sarmiento: "La obsesión escolar hecha exhibición",
    "juan-manuel-de-rosas": "El caudillo contra el que luchó toda su vida",
    "el-facundo": "Facundo: civilización o barbarie",
    moderna: "La sala de la Argentina que soñó educar",
  },

  // Efemérides
  "25-de-mayo": {
    "las-48-horas-de-mayo": "La exhibición de las 48 horas que cambiaron todo",
    "jose-de-san-martin": "El joven coronel que observaba desde lejos",
    independencia: "La sala donde empieza la Argentina moderna",
  },
  "12-de-octubre": {
    peron: "El líder que convirtió el Día de la Raza en Día del Respeto",
    "juan-domingo-peron": "Su retrato en el Panteón",
    contemporanea: "La sala del peronismo y sus transformaciones",
  },
  "20-de-junio": {
    "la-bandera": "La historia de la bandera que se conmemora",
    "manuel-belgrano": "Quien la creó en el río Paraná",
    independencia: "La sala de los primeros símbolos nacionales",
  },
  "2-de-abril": {
    "setenta-y-cuatro-dias": "La exhibición sobre la guerra de 1982",
    galtieri: "El general que ordenó la operación",
    "malvinas-ciudad": "Malvinas desde la ciudad, no solo desde el frente",
    contemporanea: "La sala de la Argentina reciente",
  },
};

export const ORIGENES_CON_PUENTES = Object.keys(PUENTES_EDITORIALES);
