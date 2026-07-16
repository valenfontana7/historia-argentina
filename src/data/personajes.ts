import type { Epoca } from "@/components/ui/Retrato";
import type { Hito } from "@/components/ui/LineaDeVida";
import { obtenerImagenPersonaje, type ImagenPersonaje } from "@/data/personajes-imagenes";

export type { ImagenPersonaje };

export type Personaje = {
  slug: string;
  nombre: string;
  titulo: string;
  rol: string;
  epoca: Epoca;
  nacimiento: { anio: number; lugar: string };
  muerte: { anio: number; lugar: string } | null;
  resumen: string;
  biografia: string[];
  hitos: Hito[];
  aliados: string[];
  enemigos: string[];
  frase?: { texto: string; contexto: string };
  /** Momento definitorio destacado en la ficha (opcional; si falta, se deriva). */
  momento?: {
    anio: number;
    linea: string;
    cita?: string;
    contextoCita?: string;
  };
};

export const nombresEpocas: Record<Epoca, string> = {
  colonia: "La Colonia",
  independencia: "La Independencia",
  organizacion: "La Organización Nacional",
  moderna: "La Argentina Moderna",
  contemporanea: "La Argentina Contemporánea",
};

export const personajes: Personaje[] = [
  {
    slug: "jose-de-san-martin",
    nombre: "José de San Martín",
    titulo: "El Libertador",
    rol: "Militar y estadista",
    epoca: "independencia",
    nacimiento: { anio: 1778, lugar: "Yapeyú, Corrientes" },
    muerte: { anio: 1850, lugar: "Boulogne-sur-Mer, Francia" },
    resumen:
      "Libertador de Argentina, Chile y Perú. Concibió y ejecutó el plan continental que quebró el poder español en Sudamérica.",
    biografia: [
      "Nació en Yapeyú, en la frontera guaraní del Virreinato, y se formó como militar en España, donde combatió contra Napoleón. En 1812, con 34 años y una carrera hecha en Europa, se embarcó de regreso hacia un país que casi no conocía para ponerse al servicio de la Revolución.",
      "Entendió antes que nadie que la independencia argentina era imposible mientras el poder realista siguiera intacto en Lima. Su respuesta fue una de las operaciones militares más audaces de la historia: cruzar la cordillera de los Andes con un ejército completo, liberar Chile y atacar Perú por mar.",
      "Después de entrevistarse con Bolívar en Guayaquil, renunció a todos sus cargos y eligió el exilio antes que la guerra civil. Murió en Francia, lejos del país que había liberado, sin volver a empuñar un arma contra otros americanos.",
    ],
    hitos: [
      { anio: 1778, texto: "Nace en Yapeyú, hijo de un oficial español destinado en las misiones." },
      { anio: 1812, texto: "Regresa al Río de la Plata y funda el Regimiento de Granaderos a Caballo." },
      { anio: 1813, texto: "Primera victoria en el combate de San Lorenzo, a orillas del Paraná." },
      { anio: 1817, texto: "Cruza los Andes con más de 5.000 hombres y triunfa en Chacabuco." },
      { anio: 1818, texto: "Sella la independencia de Chile en la batalla de Maipú." },
      { anio: 1821, texto: "Proclama la independencia del Perú y asume como Protector." },
      { anio: 1822, texto: "Tras la entrevista de Guayaquil con Bolívar, se retira de la vida pública." },
      { anio: 1850, texto: "Muere en Boulogne-sur-Mer, Francia, a los 72 años." },
    ],
    aliados: ["manuel-belgrano", "martin-miguel-de-guemes"],
    enemigos: ["bernardino-rivadavia"],
    frase: {
      texto: "Serás lo que debas ser, y si no, no serás nada.",
      contexto: "Máxima que solía repetir, convertida en lema de su vida pública.",
    },
    momento: {
      anio: 1817,
      linea: "Cruza los Andes con más de 5.000 hombres, la operación que validó su plan continental.",
      cita: "Serás lo que debas ser, y si no, no serás nada.",
      contextoCita: "Máxima de José de San Martín",
    },
  },
  {
    slug: "manuel-belgrano",
    nombre: "Manuel Belgrano",
    titulo: "El creador de la bandera",
    rol: "Abogado, economista y general",
    epoca: "independencia",
    nacimiento: { anio: 1770, lugar: "Buenos Aires" },
    muerte: { anio: 1820, lugar: "Buenos Aires" },
    resumen:
      "Intelectual de la Ilustración convertido en general por necesidad. Creó la bandera argentina y ganó las batallas que salvaron la Revolución.",
    biografia: [
      "Era un economista formado en Salamanca que soñaba con escuelas, agricultura y libre comercio. La Revolución lo convirtió, contra su voluntad y sin formación militar, en uno de sus generales más importantes.",
      "Al mando del Ejército del Norte protagonizó la hazaña del Éxodo Jujeño y obtuvo en Tucumán y Salta las dos victorias que impidieron que la contrarrevolución bajara desde el Alto Perú. Entre ambas campañas, a orillas del Paraná, izó por primera vez una bandera celeste y blanca.",
      "Donó los premios que recibió para fundar escuelas y murió en la pobreza el mismo año en que el país se disolvía en la anarquía. Pidió ser enterrado con el hábito de los dominicos; su tumba se pagó con la lápida de una cómoda de mármol.",
    ],
    hitos: [
      { anio: 1770, texto: "Nace en Buenos Aires, hijo de un comerciante italiano." },
      { anio: 1794, texto: "Asume como secretario del Consulado y promueve la educación y la industria." },
      { anio: 1810, texto: "Integra la Primera Junta como vocal." },
      { anio: 1812, texto: "Iza por primera vez la bandera celeste y blanca en Rosario." },
      { anio: 1812, texto: "Conduce el Éxodo Jujeño y vence en la batalla de Tucumán." },
      { anio: 1813, texto: "Triunfa en la batalla de Salta; dona sus premios para fundar cuatro escuelas." },
      { anio: 1814, texto: "Entrega el mando del Ejército del Norte a San Martín en la posta de Yatasto." },
      { anio: 1820, texto: "Muere en Buenos Aires, en la pobreza, a los 50 años." },
    ],
    aliados: ["jose-de-san-martin", "mariano-moreno", "juan-jose-castelli", "juana-azurduy"],
    enemigos: [],
    frase: {
      texto: "Mucho me falta para ser un verdadero padre de la patria; me contentaría con ser un buen hijo de ella.",
      contexto: "Respuesta a quienes lo llamaban padre de la patria.",
    },
    momento: {
      anio: 1812,
      linea: "Iza por primera vez la bandera celeste y blanca a orillas del Paraná, en plena guerra del Norte.",
    },
  },
  {
    slug: "mariano-moreno",
    nombre: "Mariano Moreno",
    titulo: "El alma de la Revolución",
    rol: "Abogado, periodista y político",
    epoca: "independencia",
    nacimiento: { anio: 1778, lugar: "Buenos Aires" },
    muerte: { anio: 1811, lugar: "Alta mar, océano Atlántico" },
    resumen:
      "El ideólogo más radical de Mayo. Secretario de la Primera Junta, fundador de la prensa revolucionaria, muerto en el mar a los 32 años.",
    biografia: [
      "Abogado formado en Chuquisaca, donde leyó a Rousseau y vio de cerca la explotación de los pueblos originarios en las minas. De regreso en Buenos Aires se convirtió en la pluma más filosa de la Revolución de Mayo.",
      "Como secretario de la Primera Junta concentró una energía febril: fundó la Gazeta de Buenos Ayres, creó la Biblioteca Pública, tradujo el Contrato Social y empujó las medidas más duras contra la contrarrevolución. Su ala chocó de frente con la de Cornelio Saavedra, presidente de la Junta.",
      "Derrotado políticamente tras la incorporación de los diputados del interior, aceptó una misión diplomática a Londres. Murió en alta mar en circunstancias nunca aclaradas del todo. Tenía 32 años. Saavedra escribió: «Hacía falta tanta agua para apagar tanto fuego».",
    ],
    hitos: [
      { anio: 1778, texto: "Nace en Buenos Aires; estudia leyes en Chuquisaca, el corazón intelectual del virreinato." },
      { anio: 1809, texto: "Escribe la Representación de los Hacendados, alegato por el libre comercio." },
      { anio: 1810, texto: "Asume como secretario de la Primera Junta tras la Revolución de Mayo." },
      { anio: 1810, texto: "Funda la Gazeta de Buenos Ayres, primer periódico de la Revolución." },
      { anio: 1810, texto: "Crea la Biblioteca Pública, antecedente de la Biblioteca Nacional." },
      { anio: 1811, texto: "Desplazado por el sector saavedrista, parte en misión a Londres y muere en el viaje." },
    ],
    aliados: ["juan-jose-castelli", "manuel-belgrano"],
    enemigos: ["cornelio-saavedra"],
    frase: {
      texto: "Si los pueblos no se ilustran, si no se vulgarizan sus derechos, quizá cambiaremos de tiranos, pero nunca destruiremos la tiranía.",
      contexto: "Gazeta de Buenos Ayres, 1810.",
    },
    momento: {
      anio: 1810,
      linea: "Como secretario de la Primera Junta funda la Gazeta y la Biblioteca Pública en semanas de fuego revolucionario.",
      cita: "Si los pueblos no se ilustran, si no se vulgarizan sus derechos, quizá cambiaremos de tiranos, pero nunca destruiremos la tiranía.",
      contextoCita: "Gazeta de Buenos Ayres, 1810",
    },
  },
  {
    slug: "cornelio-saavedra",
    nombre: "Cornelio Saavedra",
    titulo: "El presidente de la Primera Junta",
    rol: "Militar y político",
    epoca: "independencia",
    nacimiento: { anio: 1759, lugar: "Hacienda La Fombera, Potosí" },
    muerte: { anio: 1829, lugar: "Buenos Aires" },
    resumen:
      "Jefe del regimiento de Patricios y presidente de la Primera Junta. Encarnó el ala moderada de la Revolución frente al jacobinismo de Moreno.",
    biografia: [
      "Comerciante y miliciano criollo, saltó a la historia al mando de los Patricios, el regimiento que defendió Buenos Aires durante las Invasiones Inglesas. Ese prestigio militar lo convirtió en la figura clave de la Semana de Mayo: sin sus bayonetas, no había revolución posible.",
      "Como presidente de la Primera Junta representó la vía gradualista: revolución sí, pero sin quemar las naves con España ni con las élites del interior. El choque con Mariano Moreno fue inmediato y feroz, y terminó con la victoria política de Saavedra y la partida de su rival.",
      "Su triunfo duró poco: la derrota de Huaqui arrastró su prestigio, fue apartado del poder y pasó años perseguido y desterrado. La historia lo trató con la misma ambigüedad con la que él trató a la Revolución.",
    ],
    hitos: [
      { anio: 1759, texto: "Nace cerca de Potosí, en el Alto Perú; su familia se instala en Buenos Aires." },
      { anio: 1806, texto: "Comanda el regimiento de Patricios en la defensa contra las Invasiones Inglesas." },
      { anio: 1810, texto: "Es elegido presidente de la Primera Junta el 25 de mayo." },
      { anio: 1811, texto: "Su enfrentamiento con Moreno divide a la Revolución en dos alas irreconciliables." },
      { anio: 1811, texto: "Tras la derrota de Huaqui parte hacia el norte; es destituido y perseguido." },
      { anio: 1829, texto: "Muere en Buenos Aires tras años de ostracismo y una tardía rehabilitación." },
    ],
    aliados: [],
    enemigos: ["mariano-moreno"],
    frase: {
      texto: "Hacía falta tanta agua para apagar tanto fuego.",
      contexto: "Comentario atribuido al enterarse de la muerte de Moreno en el mar.",
    },
  },
  {
    slug: "juan-jose-castelli",
    nombre: "Juan José Castelli",
    titulo: "El orador de la Revolución",
    rol: "Abogado y político",
    epoca: "independencia",
    nacimiento: { anio: 1764, lugar: "Buenos Aires" },
    muerte: { anio: 1812, lugar: "Buenos Aires" },
    resumen:
      "La voz de Mayo. Defendió ante el Cabildo el derecho del pueblo a gobernarse y llevó la Revolución al Alto Perú. Murió sin poder hablar.",
    biografia: [
      "Primo de Belgrano y abogado brillante, fue el encargado de argumentar ante el Cabildo Abierto del 22 de mayo de 1810 por qué, caído el rey, la soberanía volvía al pueblo. Ese razonamiento jurídico es la piedra fundacional del poder político argentino.",
      "Como representante de la Junta en el Alto Perú aplicó el programa más radical de la Revolución: proclamó la igualdad de los pueblos originarios en las ruinas de Tiahuanaco y fusiló a los jefes contrarrevolucionarios. La derrota de Huaqui, en 1811, terminó con su campaña y con su carrera.",
      "De regreso en Buenos Aires fue sometido a juicio. Un cáncer de lengua le quitó la voz: el mayor orador de la Revolución pasó sus últimos meses defendiéndose por escrito. Murió en 1812, a los 48 años, pobre y olvidado.",
    ],
    hitos: [
      { anio: 1764, texto: "Nace en Buenos Aires; estudia leyes en Charcas, como Moreno." },
      { anio: 1810, texto: "Su discurso del 22 de mayo funda la doctrina de la soberanía popular en el Río de la Plata." },
      { anio: 1810, texto: "Ordena la ejecución de Liniers y los contrarrevolucionarios de Córdoba." },
      { anio: 1811, texto: "Proclama la emancipación de los pueblos originarios en Tiahuanaco." },
      { anio: 1811, texto: "La derrota de Huaqui hunde la primera expedición al Alto Perú." },
      { anio: 1812, texto: "Muere de cáncer de lengua mientras era sometido a juicio." },
    ],
    aliados: ["mariano-moreno", "manuel-belgrano"],
    enemigos: ["santiago-de-liniers"],
    frase: {
      texto: "Si ves al futuro, dile que no venga.",
      contexto: "Atribuida: la habría escrito en su cuaderno poco antes de morir.",
    },
  },
  {
    slug: "santiago-de-liniers",
    nombre: "Santiago de Liniers",
    titulo: "El héroe de la Reconquista",
    rol: "Marino y virrey",
    epoca: "colonia",
    nacimiento: { anio: 1753, lugar: "Niort, Francia" },
    muerte: { anio: 1810, lugar: "Cabeza de Tigre, Córdoba" },
    resumen:
      "Marino francés al servicio de España. Reconquistó Buenos Aires de los ingleses, fue virrey y terminó fusilado por la Revolución que su gesta hizo posible.",
    biografia: [
      "Nacido en Francia y educado como caballero de la Orden de Malta, sirvió toda su vida a la corona española. En 1806, cuando los ingleses tomaron Buenos Aires, organizó desde Montevideo la expedición que reconquistó la ciudad, y un año después dirigió la defensa que derrotó al segundo intento invasor.",
      "El pueblo lo aclamó y la corona lo nombró virrey: era el hombre más popular del Río de la Plata. Pero esa misma gesta había armado y politizado a las milicias criollas, la fuerza que en 1810 haría la Revolución.",
      "Cuando estalló Mayo, Liniers organizó desde Córdoba la contrarrevolución. Fue capturado y fusilado por orden de la Junta. El héroe de 1806 murió como enemigo del país que había ayudado, sin saberlo, a fundar.",
    ],
    hitos: [
      { anio: 1753, texto: "Nace en Niort, Francia; ingresa de joven a la marina española." },
      { anio: 1806, texto: "Encabeza la Reconquista de Buenos Aires durante la primera Invasión Inglesa." },
      { anio: 1807, texto: "Dirige la Defensa: la ciudad en armas derrota a 10.000 soldados británicos." },
      { anio: 1807, texto: "Es designado virrey del Río de la Plata, el único de origen francés." },
      { anio: 1810, texto: "Organiza en Córdoba la resistencia contra la Primera Junta." },
      { anio: 1810, texto: "Es fusilado en Cabeza de Tigre por orden de la Junta revolucionaria." },
    ],
    aliados: [],
    enemigos: ["juan-jose-castelli", "mariano-moreno"],
    momento: {
      anio: 1807,
      linea: "Dirige la defensa de Buenos Aires contra la segunda invasión inglesa, y demuestra que el virreinato puede autogobernarse.",
    },
  },
  {
    slug: "martin-miguel-de-guemes",
    nombre: "Martín Miguel de Güemes",
    titulo: "El caudillo gaucho",
    rol: "Militar y gobernador",
    epoca: "independencia",
    nacimiento: { anio: 1785, lugar: "Salta" },
    muerte: { anio: 1821, lugar: "Cañada de la Horqueta, Salta" },
    resumen:
      "Con sus gauchos sostuvo durante años la frontera norte contra los realistas. El único general argentino muerto en acción de guerra en la Independencia.",
    biografia: [
      "Hijo de una familia acomodada de Salta, eligió pelear la guerra a su manera: con gauchos a caballo, conocimiento absoluto del terreno y una guerra de guerrillas que los ejércitos regulares españoles nunca supieron contestar.",
      "Mientras San Martín preparaba el cruce de los Andes, Güemes y su Guerra Gaucha fueron el escudo que contuvo seis invasiones realistas desde el Alto Perú. Sin ese muro de lanzas y ponchos rojos, el plan continental habría sido imposible.",
      "Gobernó Salta apoyado en los sectores populares y enfrentado con la élite local, que llegó a pactar con el enemigo. Herido en una emboscada realista en 1821, murió diez días después en un paraje del monte salteño. Tenía 36 años.",
    ],
    hitos: [
      { anio: 1785, texto: "Nace en Salta; de joven combate en las Invasiones Inglesas." },
      { anio: 1814, texto: "Toma el mando de la resistencia gaucha en la frontera norte." },
      { anio: 1815, texto: "Es elegido gobernador de Salta, el primero surgido del voto popular de la provincia." },
      { anio: 1817, texto: "Contiene la gran invasión realista del general La Serna." },
      { anio: 1821, texto: "Herido en una incursión realista en la ciudad de Salta, muere en la Cañada de la Horqueta." },
    ],
    aliados: ["jose-de-san-martin", "juana-azurduy"],
    enemigos: [],
    frase: {
      texto: "De mis gauchos no me separo, ni los cambio por todos los ejércitos del mundo.",
      contexto: "Atribuida, en respuesta a las críticas de la élite salteña a sus milicias.",
    },
  },
  {
    slug: "juana-azurduy",
    nombre: "Juana Azurduy",
    titulo: "La teniente coronela de América",
    rol: "Militar",
    epoca: "independencia",
    nacimiento: { anio: 1780, lugar: "Chuquisaca, Alto Perú" },
    muerte: { anio: 1862, lugar: "Sucre, Bolivia" },
    resumen:
      "Comandó guerrillas en el Alto Perú, perdió a su esposo y a cuatro hijos en la guerra y murió en la pobreza. Hoy es símbolo de las mujeres de la Independencia.",
    biografia: [
      "Mestiza, criada entre el convento y el campo, se sumó junto a su esposo Manuel Ascensio Padilla a la insurgencia altoperuana. Llegó a comandar el escuadrón de los Leales y a pelear ella misma a sable en más de una acción.",
      "En 1816, tras arrebatar un estandarte realista en combate, el gobierno de Buenos Aires la ascendió a teniente coronela; Belgrano, conmovido, le regaló su propio sable. Ese mismo año Padilla murió en batalla y su cabeza fue exhibida en una pica.",
      "La guerra le quitó todo: el esposo, cuatro de sus cinco hijos, la hacienda. Sobrevivió décadas en la pobreza, pidiendo una pensión que casi nunca llegó. Murió a los 82 años; fue enterrada en una fosa común. Los homenajes llegaron un siglo tarde.",
    ],
    hitos: [
      { anio: 1780, texto: "Nace en Chuquisaca, en el corazón del Alto Perú." },
      { anio: 1811, texto: "Se une con Padilla a la guerra de guerrillas contra los realistas." },
      { anio: 1816, texto: "Es ascendida a teniente coronela; Belgrano le obsequia su sable." },
      { anio: 1816, texto: "Muere Padilla en La Laguna; Juana continúa la lucha en el sur." },
      { anio: 1825, texto: "Bolívar la visita y la asciende a coronela: «Este país no debería llamarse Bolivia sino Padilla»." },
      { anio: 1862, texto: "Muere en la pobreza en Sucre, a los 82 años." },
    ],
    aliados: ["manuel-belgrano", "martin-miguel-de-guemes"],
    enemigos: [],
    momento: {
      anio: 1816,
      linea: "Ascendida a teniente coronela tras arrebatar un estandarte realista; Belgrano le regala su propio sable.",
    },
  },
  {
    slug: "mariquita-sanchez-de-thompson",
    nombre: "Mariquita Sánchez de Thompson",
    titulo: "La anfitriona de la patria",
    rol: "Salonera y cronista",
    epoca: "independencia",
    nacimiento: { anio: 1786, lugar: "Buenos Aires" },
    muerte: { anio: 1868, lugar: "Buenos Aires" },
    resumen:
      "En su salón se conspiró, se debatió y (según la tradición) se cantó por primera vez el Himno Nacional. Sus cartas son la mejor crónica de medio siglo argentino.",
    biografia: [
      "A los 14 años desafió a sus padres y al orden colonial entero: se negó a un matrimonio arreglado y litigó ante el virrey para casarse con el hombre que amaba. Ganó. Esa mezcla de inteligencia y coraje definió su vida.",
      "Su casa de la calle Umquera fue el salón donde se cruzaron todos los protagonistas de la Revolución. La tradición ubica allí, el 14 de mayo de 1813, la primera interpretación del Himno Nacional, con Mariquita al clave.",
      "Vivió la Independencia, la anarquía, Rosas (de quien fue opositora y exiliada) y la Organización Nacional. Sus cartas, lúcidas y mordaces, son uno de los grandes documentos del siglo XIX argentino.",
    ],
    hitos: [
      { anio: 1786, texto: "Nace en Buenos Aires, hija de una familia acaudalada del virreinato." },
      { anio: 1805, texto: "Gana su juicio de disenso y se casa por amor con Martín Thompson." },
      { anio: 1813, texto: "Según la tradición, en su salón se canta por primera vez el Himno Nacional." },
      { anio: 1823, texto: "Integra la Sociedad de Beneficencia, primera institución pública dirigida por mujeres." },
      { anio: 1839, texto: "Opositora a Rosas, parte al exilio en Montevideo." },
      { anio: 1868, texto: "Muere en Buenos Aires a los 81 años, testigo de toda la historia patria." },
    ],
    aliados: ["bernardino-rivadavia"],
    enemigos: ["juan-manuel-de-rosas"],
  },
  {
    slug: "bernardino-rivadavia",
    nombre: "Bernardino Rivadavia",
    titulo: "El primer presidente",
    rol: "Político y reformista",
    epoca: "organizacion",
    nacimiento: { anio: 1780, lugar: "Buenos Aires" },
    muerte: { anio: 1845, lugar: "Cádiz, España" },
    resumen:
      "Modernizador obsesivo y primer presidente de las Provincias Unidas. Su proyecto centralista duró un año y medio y encendió décadas de guerra civil.",
    biografia: [
      "Creía que la Argentina podía convertirse en una república europea por decreto. Como ministro de Buenos Aires en los años veinte fundó la Universidad, promovió la inmigración, reformó la Iglesia y trajo el crédito británico, incluido el célebre empréstito de la Baring Brothers.",
      "En 1826 fue elegido primer presidente de las Provincias Unidas y jugó todo a una carta: una constitución centralista que subordinaba las provincias a Buenos Aires. El interior, encabezado por los caudillos federales, la rechazó en bloque.",
      "Atrapado entre la guerra con Brasil y la rebelión interior, renunció en 1827. Murió en el exilio en Cádiz, pidiendo que ni sus restos volvieran a Buenos Aires. Volvieron, décadas después, al mausoleo de la plaza que hoy lleva el nombre de Miserere.",
    ],
    hitos: [
      { anio: 1780, texto: "Nace en Buenos Aires; participa joven en las milicias de las Invasiones Inglesas." },
      { anio: 1821, texto: "Como ministro de Martín Rodríguez lanza sus reformas: universidad, sufragio, inmigración." },
      { anio: 1824, texto: "Contrata el empréstito Baring: un millón de libras que se pagarían durante 80 años." },
      { anio: 1826, texto: "Asume como primer presidente de las Provincias Unidas del Río de la Plata." },
      { anio: 1827, texto: "Su constitución centralista es rechazada; renuncia y parte al exilio." },
      { anio: 1845, texto: "Muere en Cádiz, España, sin haber vuelto a pisar Buenos Aires." },
    ],
    aliados: ["mariquita-sanchez-de-thompson"],
    enemigos: ["jose-de-san-martin", "manuel-dorrego", "juan-facundo-quiroga"],
  },
  {
    slug: "manuel-dorrego",
    nombre: "Manuel Dorrego",
    titulo: "El coronel del pueblo",
    rol: "Militar y gobernador federal",
    epoca: "organizacion",
    nacimiento: { anio: 1787, lugar: "Buenos Aires" },
    muerte: { anio: 1828, lugar: "Navarro, Buenos Aires" },
    resumen:
      "Caudillo porteño del federalismo popular. Su fusilamiento sin juicio en 1828 abrió la etapa más sangrienta de las guerras civiles argentinas.",
    biografia: [
      "Militar valiente hasta la temeridad e insolente hasta con sus superiores, peleó en las guerras de la Independencia y fue desterrado dos veces por enfrentarse al poder de turno. En el exilio estadounidense descubrió el federalismo que marcaría su vida política.",
      "Como gobernador de Buenos Aires encarnó un federalismo con base popular: los orilleros y la campaña lo adoraban. Le tocó, además, firmar la paz con Brasil que aceptó la independencia del Uruguay, una decisión impuesta por las circunstancias que sus enemigos usaron en su contra.",
      "En diciembre de 1828, el general unitario Juan Lavalle lo derrocó, lo capturó y lo hizo fusilar sin juicio en Navarro. «Mi muerte no hará más que agravar los males del país», escribió antes de morir. Tuvo razón: la venganza federal se llamó Juan Manuel de Rosas.",
    ],
    hitos: [
      { anio: 1787, texto: "Nace en Buenos Aires; combate en el Alto Perú a las órdenes de Belgrano." },
      { anio: 1816, texto: "Desterrado por el Directorio, se exilia en Estados Unidos, donde estudia el sistema federal." },
      { anio: 1827, texto: "Asume como gobernador federal de Buenos Aires tras la caída de Rivadavia." },
      { anio: 1828, texto: "Firma la Convención Preliminar de Paz que reconoce la independencia del Uruguay." },
      { anio: 1828, texto: "Es derrocado por Lavalle y fusilado sin juicio en Navarro, a los 41 años." },
    ],
    aliados: ["juan-manuel-de-rosas"],
    enemigos: ["bernardino-rivadavia"],
    frase: {
      texto: "Mi muerte no hará más que agravar los males del país.",
      contexto: "Carta escrita horas antes de su fusilamiento, diciembre de 1828.",
    },
  },
  {
    slug: "juan-manuel-de-rosas",
    nombre: "Juan Manuel de Rosas",
    titulo: "El Restaurador",
    rol: "Estanciero y gobernador",
    epoca: "organizacion",
    nacimiento: { anio: 1793, lugar: "Buenos Aires" },
    muerte: { anio: 1877, lugar: "Southampton, Inglaterra" },
    resumen:
      "Gobernó Buenos Aires con la suma del poder público durante casi dos décadas. Para unos, tirano sangriento; para otros, defensor de la soberanía. Nadie es neutral.",
    biografia: [
      "Estanciero, saladerista y jinete legendario, construyó su poder en la campaña bonaerense: conocía a los gauchos, hablaba su idioma y los encuadró en sus milicias. Llegó al gobierno en 1829 como el hombre de orden tras el caos del fusilamiento de Dorrego.",
      "Desde 1835 gobernó con la suma del poder público y un aparato de propaganda y terror (la Mazorca) que no admitía disidencias: el punzó era obligatorio, los unitarios eran «salvajes» y el exilio o el degüello esperaban a los enemigos. A la vez, enfrentó bloqueos de Francia e Inglaterra, y la resistencia de la Vuelta de Obligado lo convirtió en símbolo de soberanía.",
      "En 1852 su antiguo aliado Urquiza lo derrotó en Caseros. Se embarcó esa misma noche hacia Inglaterra, donde vivió sus últimos 25 años como chacarero pobre cerca de Southampton. Su figura sigue siendo la grieta original de la historia argentina.",
    ],
    hitos: [
      { anio: 1793, texto: "Nace en Buenos Aires en una familia de estancieros." },
      { anio: 1829, texto: "Asume su primer gobierno de Buenos Aires con facultades extraordinarias." },
      { anio: 1835, texto: "Vuelve al poder con la suma del poder público, ratificada en plebiscito." },
      { anio: 1845, texto: "La Vuelta de Obligado: sus baterías enfrentan a la flota anglo-francesa en el Paraná." },
      { anio: 1852, texto: "Es derrotado por Urquiza en la batalla de Caseros y parte al exilio." },
      { anio: 1877, texto: "Muere en Southampton, Inglaterra, trabajando una pequeña granja." },
    ],
    aliados: ["juan-facundo-quiroga", "manuel-dorrego"],
    enemigos: ["justo-jose-de-urquiza", "domingo-faustino-sarmiento", "mariquita-sanchez-de-thompson"],
    frase: {
      texto: "No soy amigo ni enemigo de nadie: soy federal.",
      contexto: "Atribuida, síntesis de su estilo político.",
    },
    momento: {
      anio: 1852,
      linea: "Derrotado en Caseros por Urquiza, parte al exilio esa misma noche, y cierra dos décadas de rosismo.",
    },
  },
  {
    slug: "juan-facundo-quiroga",
    nombre: "Juan Facundo Quiroga",
    titulo: "El Tigre de los Llanos",
    rol: "Caudillo federal",
    epoca: "organizacion",
    nacimiento: { anio: 1788, lugar: "San Antonio, La Rioja" },
    muerte: { anio: 1835, lugar: "Barranca Yaco, Córdoba" },
    resumen:
      "El caudillo federal más temido del interior. Su asesinato en Barranca Yaco es el gran crimen político del siglo XIX y el pretexto de la dictadura de Rosas.",
    biografia: [
      "Caudillo de La Rioja, dueño de una fuerza personal que sus contemporáneos describían como sobrenatural, dominó el interior a lanza y carisma. Venció una y otra vez a los ejércitos unitarios y se convirtió en el brazo armado del federalismo del interior.",
      "No era el bárbaro analfabeto del mito: administraba minas y negocios, y hacia el final de su vida defendía la necesidad de organizar el país con una constitución, cosa que lo distanciaba de Rosas, que prefería esperar.",
      "En 1835, de regreso de una misión de paz en el norte, su galera fue emboscada en Barranca Yaco. Facundo enfrentó a los asesinos a cara descubierta; le dispararon en el ojo. Sarmiento lo convirtió en el protagonista del libro fundacional de la literatura argentina.",
    ],
    hitos: [
      { anio: 1788, texto: "Nace en los Llanos de La Rioja." },
      { anio: 1826, texto: "En armas contra el gobierno de Rivadavia y su constitución centralista." },
      { anio: 1831, texto: "Vence a los unitarios de Paz y consolida el dominio federal del interior." },
      { anio: 1834, texto: "Parte hacia el norte en misión de paz entre Salta y Tucumán." },
      { anio: 1835, texto: "Es asesinado en Barranca Yaco por la partida de Santos Pérez." },
    ],
    aliados: ["juan-manuel-de-rosas"],
    enemigos: ["bernardino-rivadavia", "domingo-faustino-sarmiento"],
  },
  {
    slug: "justo-jose-de-urquiza",
    nombre: "Justo José de Urquiza",
    titulo: "El vencedor de Caseros",
    rol: "Caudillo, militar y presidente",
    epoca: "organizacion",
    nacimiento: { anio: 1801, lugar: "Talar del Arroyo Largo, Entre Ríos" },
    muerte: { anio: 1870, lugar: "Palacio San José, Entre Ríos" },
    resumen:
      "El caudillo entrerriano que volteó a Rosas, convocó la Constitución de 1853 y fue el primer presidente constitucional. Murió asesinado en su propio palacio.",
    biografia: [
      "Fue durante años el mejor general de Rosas, hasta que entendió que el Restaurador nunca iba a organizar constitucionalmente el país. En 1851 se «pronunció» contra él y, al año siguiente, lo derrotó en Caseros al frente del Ejército Grande.",
      "A diferencia de casi todos los vencedores de la historia argentina, usó la victoria para institucionalizar: convocó el Acuerdo de San Nicolás y el Congreso de Santa Fe que sancionó la Constitución de 1853, con Alberdi como inspirador intelectual. Fue el primer presidente constitucional de la Confederación.",
      "Buenos Aires resistió el nuevo orden y la lucha con Mitre marcó su década final. En 1870, milicianos jordanistas lo asesinaron a tiros y puñaladas en su palacio de San José, ante su familia. El organizador del país murió por orden de un caudillo de su propia provincia.",
    ],
    hitos: [
      { anio: 1801, texto: "Nace en Entre Ríos; hace fortuna como comerciante y estanciero." },
      { anio: 1851, texto: "El Pronunciamiento: retira a Entre Ríos la delegación de poderes en Rosas." },
      { anio: 1852, texto: "Derrota a Rosas en Caseros al frente del Ejército Grande." },
      { anio: 1853, texto: "Impulsa la Constitución Nacional sancionada en Santa Fe." },
      { anio: 1854, texto: "Asume como primer presidente constitucional de la Confederación Argentina." },
      { anio: 1870, texto: "Es asesinado en el Palacio San José por hombres de Ricardo López Jordán." },
    ],
    aliados: ["juan-bautista-alberdi"],
    enemigos: ["juan-manuel-de-rosas", "bartolome-mitre"],
    momento: {
      anio: 1852,
      linea: "Vence a Rosas en Caseros y abre el camino a la Constitución de 1853.",
    },
  },
  {
    slug: "juan-bautista-alberdi",
    nombre: "Juan Bautista Alberdi",
    titulo: "El padre de la Constitución",
    rol: "Jurista y pensador",
    epoca: "organizacion",
    nacimiento: { anio: 1810, lugar: "San Miguel de Tucumán" },
    muerte: { anio: 1884, lugar: "Neuilly-sur-Seine, Francia" },
    resumen:
      "Escribió las Bases sobre las que se redactó la Constitución de 1853. Pensó el país desde el exilio y murió en el exilio, peleado con casi todos.",
    biografia: [
      "Nació en 1810, el mismo año que la patria, y pasó fuera de ella la mayor parte de su vida. Desde el exilio chileno, cuando cayó Rosas, escribió en semanas las «Bases y puntos de partida para la organización política de la República Argentina», el texto que moldeó la Constitución de 1853.",
      "Su fórmula («gobernar es poblar») resumía un programa: inmigración europea, ferrocarriles, libertades económicas y un ejecutivo fuerte pero constitucional. Fue diplomático de la Confederación de Urquiza en Europa y enemigo intelectual de Mitre y Sarmiento, contra quienes libró polémicas feroces.",
      "Su condena de la Guerra del Paraguay lo volvió un apestado para la élite porteña, que lo trató de traidor. Murió cerca de París en 1884. La Constitución que inspiró, con reformas, sigue vigente.",
    ],
    hitos: [
      { anio: 1810, texto: "Nace en Tucumán, hijo de un comerciante vasco." },
      { anio: 1837, texto: "Integra la Generación del 37 en el Salón Literario de Buenos Aires." },
      { anio: 1838, texto: "Parte al exilio: Montevideo, Europa y Chile, huyendo del rosismo." },
      { anio: 1852, texto: "Publica las Bases, el borrador intelectual de la Constitución Nacional." },
      { anio: 1853, texto: "Se sanciona la Constitución; Alberdi es nombrado diplomático de la Confederación." },
      { anio: 1884, texto: "Muere en Neuilly-sur-Seine, Francia, a los 74 años." },
    ],
    aliados: ["justo-jose-de-urquiza"],
    enemigos: ["domingo-faustino-sarmiento", "bartolome-mitre"],
    frase: {
      texto: "Gobernar es poblar.",
      contexto: "Bases y puntos de partida para la organización política, 1852.",
    },
  },
  {
    slug: "domingo-faustino-sarmiento",
    nombre: "Domingo Faustino Sarmiento",
    titulo: "El maestro de América",
    rol: "Escritor, educador y presidente",
    epoca: "organizacion",
    nacimiento: { anio: 1811, lugar: "San Juan" },
    muerte: { anio: 1888, lugar: "Asunción, Paraguay" },
    resumen:
      "Escribió el Facundo, fundó cientos de escuelas y fue presidente. Genial, colérico y contradictorio: nadie hizo tanto por la educación argentina ni polemizó con tanta furia.",
    biografia: [
      "Hijo de una casa pobre de San Juan, se educó solo, a fuerza de lecturas devoradas. Exiliado dos veces por el rosismo, escribió en Chile el «Facundo», mezcla de biografía, panfleto y ensayo que inventó la dicotomía con la que Argentina se piensa desde entonces: civilización o barbarie.",
      "Su obsesión fue la escuela pública. Como gobernador, ministro y presidente multiplicó las aulas, trajo maestras desde Estados Unidos, fundó observatorios y bibliotecas populares. Durante su presidencia (1868–1874) el país hizo su primer censo: 71 por ciento de analfabetos. Contra eso peleó toda su vida.",
      "Fue también implacable con sus enemigos: celebró crueldades contra los caudillos y polemizó con Alberdi, con Mitre, con todos. Murió en Asunción en 1888. Su fecha de muerte, el 11 de septiembre, es el Día del Maestro en toda América Latina.",
    ],
    hitos: [
      { anio: 1811, texto: "Nace en San Juan, en una casa que hoy es museo nacional." },
      { anio: 1845, texto: "Publica el Facundo en el exilio chileno." },
      { anio: 1852, texto: "Combate en Caseros como boletinero del Ejército Grande." },
      { anio: 1868, texto: "Asume la presidencia mientras viaja desde Estados Unidos." },
      { anio: 1869, texto: "Primer censo nacional: 1.800.000 habitantes, 71 % de analfabetismo." },
      { anio: 1884, texto: "Impulsa la ley 1420 de educación común, laica, gratuita y obligatoria." },
      { anio: 1888, texto: "Muere en Asunción del Paraguay; es el Día del Maestro en América Latina." },
    ],
    aliados: ["bartolome-mitre"],
    enemigos: ["juan-manuel-de-rosas", "juan-facundo-quiroga", "juan-bautista-alberdi"],
    frase: {
      texto: "Las ideas no se matan.",
      contexto: "Versión de la frase que escribió en francés al partir al exilio en 1840.",
    },
    momento: {
      anio: 1845,
      linea: "Publica el Facundo en el exilio chileno, el libro que inventó la dicotomía civilización o barbarie.",
      cita: "Las ideas no se matan.",
      contextoCita: "Carta al exilio, 1840",
    },
  },
  {
    slug: "bartolome-mitre",
    nombre: "Bartolomé Mitre",
    titulo: "El fundador del Estado",
    rol: "Militar, presidente e historiador",
    epoca: "organizacion",
    nacimiento: { anio: 1821, lugar: "Buenos Aires" },
    muerte: { anio: 1906, lugar: "Buenos Aires" },
    resumen:
      "Primer presidente de la Nación unificada, fundador del diario La Nación y de la historiografía argentina. Gobernó, guerreó y escribió la versión oficial del pasado.",
    biografia: [
      "Militar, poeta, traductor de Dante, periodista e historiador: Mitre fue muchas cosas, casi todas al mismo tiempo. Lideró la resistencia de Buenos Aires contra la Confederación de Urquiza y, tras la batalla de Pavón, se convirtió en 1862 en el primer presidente de la República unificada.",
      "Su presidencia organizó el Estado: justicia federal, códigos, ferrocarriles, correos. También lo metió en la guerra más trágica del continente, la Guerra de la Triple Alianza contra el Paraguay, que dejó cicatrices que aún duelen.",
      "Fuera del poder fundó La Nación, «tribuna de doctrina», y escribió las biografías monumentales de Belgrano y San Martín que fundaron la historia oficial argentina. Murió en 1906 convertido en patriarca; su entierro fue una de las mayores manifestaciones que vio Buenos Aires.",
    ],
    hitos: [
      { anio: 1821, texto: "Nace en Buenos Aires; se forma como militar en el exilio uruguayo." },
      { anio: 1852, texto: "Lidera la revolución del 11 de septiembre que separa a Buenos Aires de la Confederación." },
      { anio: 1861, texto: "Vence en Pavón y queda al frente del proceso de unificación nacional." },
      { anio: 1862, texto: "Asume como primer presidente de la Nación Argentina unificada." },
      { anio: 1865, texto: "Comanda los ejércitos aliados en la Guerra de la Triple Alianza." },
      { anio: 1870, texto: "Funda el diario La Nación, que sigue publicándose hoy." },
      { anio: 1906, texto: "Muere en Buenos Aires; el país entero acompaña su funeral." },
    ],
    aliados: ["domingo-faustino-sarmiento"],
    enemigos: ["justo-jose-de-urquiza", "juan-bautista-alberdi"],
  },
  {
    slug: "julio-argentino-roca",
    nombre: "Julio Argentino Roca",
    titulo: "El Zorro",
    rol: "Militar y dos veces presidente",
    epoca: "moderna",
    nacimiento: { anio: 1843, lugar: "San Miguel de Tucumán" },
    muerte: { anio: 1914, lugar: "Buenos Aires" },
    resumen:
      "El político más hábil de su siglo: comandó la Conquista del Desierto, presidió dos veces el país y construyó el orden que hizo de Argentina un granero del mundo.",
    biografia: [
      "Militar de carrera desde los 15 años, comandó en 1879 la campaña militar sobre la Patagonia conocida como Conquista del Desierto: incorporó millones de hectáreas al Estado y a la vez desposeyó y sometió a los pueblos originarios, una herida que la Argentina todavía discute.",
      "Con ese prestigio llegó dos veces a la presidencia. Bajo su lema («paz y administración») el país se transformó: capital federalizada, educación laica y obligatoria, registro civil, ferrocarriles, inmigración masiva. Argentina pasó a ser uno de los países de mayor crecimiento del planeta.",
      "Lo llamaban el Zorro porque nunca daba una pelea que no tuviera ganada de antemano. Manejó la política argentina durante tres décadas, casi siempre desde las sombras. Murió en 1914, cuando el orden conservador que había construido empezaba a resquebrajarse.",
    ],
    hitos: [
      { anio: 1843, texto: "Nace en Tucumán; a los 15 años ya combate en Cepeda." },
      { anio: 1879, texto: "Comanda la Conquista del Desierto sobre los territorios indígenas de la Patagonia." },
      { anio: 1880, texto: "Asume su primera presidencia; Buenos Aires es federalizada." },
      { anio: 1884, texto: "Su gobierno sanciona la ley 1420 de educación laica, gratuita y obligatoria." },
      { anio: 1898, texto: "Vuelve a la presidencia; resuelve la crisis limítrofe con Chile mediante el abrazo del Estrecho." },
      { anio: 1914, texto: "Muere en Buenos Aires, patriarca del régimen conservador." },
    ],
    aliados: [],
    enemigos: ["hipolito-yrigoyen"],
  },
  {
    slug: "hipolito-yrigoyen",
    nombre: "Hipólito Yrigoyen",
    titulo: "El Peludo",
    rol: "Caudillo radical y presidente",
    epoca: "moderna",
    nacimiento: { anio: 1852, lugar: "Buenos Aires" },
    muerte: { anio: 1933, lugar: "Buenos Aires" },
    resumen:
      "Primer presidente elegido por voto secreto y obligatorio. Encarnó la llegada del pueblo llano al poder y fue derrocado por el primer golpe de Estado argentino.",
    biografia: [
      "Conspirador silencioso durante décadas, construyó la Unión Cívica Radical sobre una sola consigna: abstención y revolución hasta que hubiera elecciones limpias. Cuando la ley Sáenz Peña las garantizó, en 1916 ganó la presidencia. Por primera vez, el voto popular decidía quién gobernaba.",
      "Gobernó con un estilo inédito: recibía a delegaciones de obreros, mediaba en huelgas, creó YPF con Mosconi al frente. También cargó con episodios trágicos, como la Semana Trágica de 1919 y la represión de la Patagonia rebelde.",
      "Reelecto masivamente en 1928, la crisis mundial y una feroz campaña de prensa erosionaron su gobierno. El 6 de septiembre de 1930 el general Uriburu lo derrocó: fue el primer golpe de Estado de la historia argentina, e inauguró la era más inestable del país. Murió tres años después; su funeral fue una marea humana.",
    ],
    hitos: [
      { anio: 1852, texto: "Nace en Buenos Aires; de joven es comisario, docente y estanciero." },
      { anio: 1891, texto: "Participa de la fundación de la Unión Cívica Radical." },
      { anio: 1916, texto: "Gana las primeras elecciones con voto secreto y obligatorio." },
      { anio: 1922, texto: "Crea la Dirección General de YPF, la petrolera estatal." },
      { anio: 1928, texto: "Es reelecto con el 62 % de los votos: «el plebiscito»." },
      { anio: 1930, texto: "Es derrocado por el primer golpe de Estado de la historia argentina." },
      { anio: 1933, texto: "Muere en Buenos Aires; una multitud acompaña su cortejo." },
    ],
    aliados: [],
    enemigos: ["julio-argentino-roca"],
    momento: {
      anio: 1930,
      linea: "Derrocado por el primer golpe de Estado de la historia argentina, y cae la democracia que él había inaugurado en 1916.",
    },
  },
  {
    slug: "juan-domingo-peron",
    nombre: "Juan Domingo Perón",
    titulo: "El líder del movimiento",
    rol: "Militar y tres veces presidente",
    epoca: "contemporanea",
    nacimiento: { anio: 1895, lugar: "Lobos, Buenos Aires" },
    muerte: { anio: 1974, lugar: "Olivos, Buenos Aires" },
    resumen:
      "Tres veces presidente y fundador del movimiento político más duradero de la Argentina. Desde 1945, toda la política argentina se define a favor o en contra de él.",
    biografia: [
      "Coronel del ejército, entendió antes que nadie que la Argentina industrial de los años cuarenta había creado un actor nuevo: los trabajadores urbanos. Desde la Secretaría de Trabajo construyó con ellos una alianza que cambió el país para siempre.",
      "Encarcelado por sus pares, fue liberado por la movilización obrera del 17 de octubre de 1945, la fecha fundacional del peronismo. Como presidente amplió derechos laborales, impulsó la industrialización y, junto a Evita, consagró el voto femenino. Su gobierno fue también acusado de autoritarismo con la prensa y la oposición.",
      "Derrocado y proscripto en 1955, gobernó el imaginario argentino durante 18 años de exilio. Volvió en 1973, fue elegido presidente por tercera vez con el 62 % de los votos y murió en el cargo un año después, dejando un país que todavía discute su herencia.",
    ],
    hitos: [
      { anio: 1895, texto: "Nace en Lobos, provincia de Buenos Aires." },
      { anio: 1943, texto: "Asume la Secretaría de Trabajo y Previsión: convenios colectivos, aguinaldo, jubilaciones." },
      { anio: 1945, texto: "El 17 de octubre, una movilización obrera exige y logra su liberación." },
      { anio: 1946, texto: "Gana la presidencia; lanza la industrialización y el primer plan quinquenal." },
      { anio: 1947, texto: "Se sanciona la ley de voto femenino impulsada junto a Evita." },
      { anio: 1955, texto: "Es derrocado por la autodenominada Revolución Libertadora; comienzan 18 años de proscripción." },
      { anio: 1973, texto: "Regresa al país y es electo presidente por tercera vez." },
      { anio: 1974, texto: "Muere en ejercicio de la presidencia, el 1° de julio." },
    ],
    aliados: ["eva-peron"],
    enemigos: [],
    momento: {
      anio: 1945,
      linea: "El 17 de octubre, una movilización obrera exige y logra su liberación: fecha fundacional del peronismo.",
    },
  },
  {
    slug: "eva-peron",
    nombre: "Eva Perón",
    titulo: "La abanderada de los humildes",
    rol: "Dirigente política",
    epoca: "contemporanea",
    nacimiento: { anio: 1919, lugar: "Los Toldos, Buenos Aires" },
    muerte: { anio: 1952, lugar: "Buenos Aires" },
    resumen:
      "De actriz de radio a la mujer más poderosa de América. Impulsó el voto femenino, fundó un imperio de ayuda social y murió a los 33 años convertida en mito.",
    biografia: [
      "Nació pobre e ilegítima en un pueblo de la pampa y llegó a Buenos Aires a los 15 años a buscar un destino de actriz. Lo encontró, pero la historia le tenía reservado otro papel: en 1944 conoció al coronel Perón y su vida se fundió con la política argentina.",
      "Como primera dama rompió todos los moldes: la Fundación Eva Perón construyó hospitales, escuelas y hogares a un ritmo nunca visto, y su militancia fue decisiva para la ley de voto femenino de 1947 y para la irrupción de las mujeres en la política a través del Partido Peronista Femenino.",
      "En 1951 el cáncer la alcanzó en plena campaña: renunció a la vicepresidencia y votó por primera y única vez desde su cama de hospital. Murió el 26 de julio de 1952, a los 33 años. Su cuerpo embalsamado fue secuestrado por la dictadura de 1955 y peregrinó por el mundo durante 16 años: ni muerta dejó de ser un problema para sus enemigos.",
    ],
    hitos: [
      { anio: 1919, texto: "Nace en Los Toldos; a los 15 años emigra a Buenos Aires." },
      { anio: 1944, texto: "Conoce a Perón en el festival por el terremoto de San Juan." },
      { anio: 1947, texto: "Se sanciona la ley 13.010: las mujeres argentinas conquistan el voto." },
      { anio: 1948, texto: "Crea la Fundación Eva Perón: hospitales, hogares, ciudades infantiles." },
      { anio: 1951, texto: "El Cabildo Abierto del justicialismo pide su candidatura; renuncia enferma." },
      { anio: 1952, texto: "Muere el 26 de julio a los 33 años; el país entero la llora en las calles." },
    ],
    aliados: ["juan-domingo-peron"],
    enemigos: [],
    frase: {
      texto: "Donde existe una necesidad, nace un derecho.",
      contexto: "Principio rector de la Fundación Eva Perón.",
    },
    momento: {
      anio: 1947,
      linea: "Impulsa la ley de voto femenino, y abre la política argentina a millones de mujeres.",
      cita: "Donde existe una necesidad, nace un derecho.",
      contextoCita: "Fundación Eva Perón",
    },
  },
  {
    slug: "raul-alfonsin",
    nombre: "Raúl Alfonsín",
    titulo: "El padre de la democracia",
    rol: "Abogado y presidente",
    epoca: "contemporanea",
    nacimiento: { anio: 1927, lugar: "Chascomús, Buenos Aires" },
    muerte: { anio: 2009, lugar: "Buenos Aires" },
    resumen:
      "Recuperó la democracia en 1983 y sentó a las juntas militares en el banquillo: el Juicio a las Juntas es un hito mundial de derechos humanos.",
    biografia: [
      "Abogado radical de Chascomús, durante la dictadura defendió presos políticos y presentó hábeas corpus cuando hacerlo era jugarse la vida. En 1983, con el país quebrado por el terrorismo de Estado y la derrota de Malvinas, ganó la presidencia recitando el preámbulo de la Constitución como una oración laica.",
      "Su decisión más trascendente fue también la más riesgosa: crear la CONADEP, que documentó la desaparición de miles de personas en el informe «Nunca Más», y llevar a juicio civil a las juntas militares. En 1985, por primera vez en el mundo, tribunales civiles de un país condenaban a sus propios dictadores.",
      "Gobernó acosado por alzamientos militares y una economía en llamas que lo obligó a entregar el poder seis meses antes. Pero cuando murió, en 2009, el país entero (peronistas incluidos) lo despidió como lo que fue: el fundador de la democracia argentina moderna, ininterrumpida desde 1983.",
    ],
    hitos: [
      { anio: 1927, texto: "Nace en Chascomús, provincia de Buenos Aires." },
      { anio: 1983, texto: "Gana las elecciones que cierran la dictadura más sangrienta de la historia argentina." },
      { anio: 1983, texto: "Crea la CONADEP, presidida por Ernesto Sabato." },
      { anio: 1985, texto: "El Juicio a las Juntas condena a los excomandantes de la dictadura." },
      { anio: 1987, texto: "Enfrenta el alzamiento carapintada de Semana Santa: «la casa está en orden»." },
      { anio: 2009, texto: "Muere en Buenos Aires; su velatorio convoca a una multitud transversal." },
    ],
    aliados: [],
    enemigos: [],
    frase: {
      texto: "Con la democracia se come, se cura y se educa.",
      contexto: "Consigna central de su campaña presidencial de 1983.",
    },
    momento: {
      anio: 1985,
      linea: "El Juicio a las Juntas condena a los excomandantes de la dictadura, un hito mundial de derechos humanos.",
      cita: "Con la democracia se come, se cura y se educa.",
      contextoCita: "10 de diciembre de 1983",
    },
  },
];

export function obtenerPersonaje(slug: string): Personaje | undefined {
  return personajes.find((p) => p.slug === slug);
}

export function obtenerPersonajeConImagen(
  slug: string,
): (Personaje & { imagen?: ImagenPersonaje }) | undefined {
  const personaje = obtenerPersonaje(slug);
  if (!personaje) return undefined;
  return { ...personaje, imagen: obtenerImagenPersonaje(slug) };
}

export function obtenerVarios(slugs: string[]): Personaje[] {
  return slugs
    .map((slug) => obtenerPersonaje(slug))
    .filter((p): p is Personaje => p !== undefined);
}
