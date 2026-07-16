/**
 * Mapa ilustrado de la Defensa de Buenos Aires (5 de julio de 1807).
 * La cuadrícula colonial vista desde arriba: el río a la derecha,
 * las columnas británicas entrando desde el oeste.
 */

const VB = { w: 900, h: 560 };

/** Hitos de la ciudad: oeste ← | → río */
export const ILU_DEFENSA = {
  plazaMayor: { x: 700, y: 282, nombre: "Plaza Mayor y Fuerte" },
  santoDomingo: { x: 622, y: 342, nombre: "Santo Domingo" },
  retiro: { x: 698, y: 122, nombre: "Retiro" },
  residencia: { x: 668, y: 452, nombre: "La Residencia" },
  miserere: { x: 178, y: 312, nombre: "Miserere" },
} as const;

export type EtapaDefensa = {
  nombre: string;
  fecha: string;
  detalle: string;
};

export const ETAPAS_DEFENSA: EtapaDefensa[] = [
  {
    nombre: "El desembarco",
    fecha: "28 de junio: 1.º de julio de 1807",
    detalle:
      "Whitelocke desembarca en Ensenada con cerca de 10.000 veteranos y avanza por los pantanos del sur. Del otro lado lo espera una ciudad que un año antes ya expulsó a un ejército británico.",
  },
  {
    nombre: "Miserere",
    fecha: "2 de julio de 1807",
    detalle:
      "Liniers sale a frenarlos en los corrales de Miserere y es derrotado. El camino a la Plaza Mayor parece abierto, pero el alcalde Martín de Álzaga se niega a rendir la ciudad: esa noche Buenos Aires entera cava trincheras.",
  },
  {
    nombre: "Trece columnas",
    fecha: "5 de julio, madrugada",
    detalle:
      "Whitelocke lanza sus columnas por las calles rectas hacia el río, con una orden insólita: fusiles descargados, solo bayoneta. La cuadrícula porteña se convierte en un embudo.",
  },
  {
    nombre: "La guerra de las azoteas",
    fecha: "5 de julio, mañana",
    detalle:
      "Cada terraza es un fortín. Agua hirviendo, piedras, granadas caseras y fusilería caen desde arriba; los cañones barren las calles de punta a punta. Las columnas del centro se deshacen cuadra por cuadra.",
  },
  {
    nombre: "Santo Domingo",
    fecha: "5 de julio, tarde",
    detalle:
      "El general Craufurd, acorralado, se refugia en el convento de Santo Domingo con sus mejores tropas. A media tarde iza la bandera blanca. Más de 400 británicos muertos y miles de prisioneros.",
  },
  {
    nombre: "La capitulación",
    fecha: "7 de julio de 1807",
    detalle:
      "Whitelocke firma la rendición total: evacúa Buenos Aires y también Montevideo. Una ciudad sin murallas venció al ejército más poderoso del mundo. Londres lo juzgará en corte marcial.",
  },
];

/** Ruta de aproximación desde Ensenada (etapa 0) */
export const RUTA_DESEMBARCO = "M448 548 C372 498 258 418 196 332";

/** Columnas británicas del 5 de julio (etapa 2) */
export const COLUMNAS_DEFENSA = [
  { d: "M248 142 L684 142", exito: true, fin: [684, 142] as const },
  { d: "M248 222 L472 222", exito: false, fin: [472, 222] as const },
  { d: "M248 262 L432 262", exito: false, fin: [432, 262] as const },
  { d: "M248 342 L606 342", exito: false, fin: [606, 342] as const },
  { d: "M248 422 L522 422", exito: false, fin: [522, 422] as const },
  { d: "M248 452 L652 452", exito: true, fin: [652, 452] as const },
];

/** Puntos donde las columnas del centro fueron destrozadas (etapa 3) */
export const BAJAS_DEFENSA = [
  [472, 222],
  [432, 262],
  [522, 422],
  [560, 342],
] as const;

type BaseProps = { children?: React.ReactNode };

export function BaseMapaDefensa({ children }: BaseProps) {
  const grid = { x0: 248, x1: 732, y0: 98, y1: 472, paso: 44 };
  const verticales: number[] = [];
  for (let x = grid.x0; x <= grid.x1; x += grid.paso) verticales.push(x);
  const horizontales: number[] = [];
  for (let y = grid.y0; y <= grid.y1; y += grid.paso) horizontales.push(y);

  return (
    <svg
      className="h-full w-full"
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mapa ilustrado de la defensa de Buenos Aires en 1807"
    >
      <defs>
        <linearGradient id="grad-defensa-rio" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0c1626" />
          <stop offset="100%" stopColor="#101e36" />
        </linearGradient>
        <pattern id="patron-grano-defensa" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.35" fill="#ffffff" opacity="0.025" />
        </pattern>
        <filter id="glow-defensa-oro" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-defensa-carmesi" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width={VB.w} height={VB.h} fill="#080b10" />
      <rect width={VB.w} height={VB.h} fill="url(#patron-grano-defensa)" />

      {/* Río de la Plata: margen este */}
      <path
        d={`M748 0 C738 140 742 300 736 420 C734 470 738 520 744 560 L900 560 L900 0 Z`}
        fill="url(#grad-defensa-rio)"
      />
      {Array.from({ length: 6 }, (_, i) => (
        <path
          key={i}
          d={`M${772 + i * 20} 30 C${762 + i * 20} 200 ${770 + i * 20} 380 ${764 + i * 20} 540`}
          fill="none"
          stroke="#1c3050"
          strokeWidth="0.7"
          opacity="0.5"
        />
      ))}
      <text
        x="822"
        y="270"
        fill="#2e4666"
        fontSize="11"
        letterSpacing="6"
        textAnchor="middle"
        transform="rotate(90 822 270)"
        opacity="0.9"
      >
        RÍO DE LA PLATA
      </text>

      {/* Bajada ribereña */}
      <path
        d="M748 0 C738 140 742 300 736 420 C734 470 738 520 744 560"
        fill="none"
        stroke="#2a3c58"
        strokeWidth="1.5"
        opacity="0.7"
      />

      {/* La cuadrícula: calles de la ciudad colonial */}
      <g opacity="0.9">
        {verticales.map((x) => (
          <line key={`v-${x}`} x1={x} y1={grid.y0} x2={x} y2={grid.y1} stroke="#1c2534" strokeWidth="1" />
        ))}
        {horizontales.map((y) => (
          <line key={`h-${y}`} x1={grid.x0} y1={y} x2={grid.x1} y2={y} stroke="#1c2534" strokeWidth="1" />
        ))}
        {/* Manzanas insinuadas */}
        {verticales.slice(0, -1).map((x, i) =>
          horizontales.slice(0, -1).map((y, j) =>
            (i + j) % 3 === 0 ? (
              <rect
                key={`m-${x}-${y}`}
                x={x + 5}
                y={y + 5}
                width={grid.paso - 10}
                height={grid.paso - 10}
                fill="#121826"
                opacity="0.55"
              />
            ) : null,
          ),
        )}
      </g>

      {/* Plaza Mayor: vacío en la trama, frente al fuerte */}
      <rect x={678} y={260} width={44} height={44} fill="#0a0e16" stroke="#2a3548" strokeWidth="0.8" />
      <rect x={724} y={266} width={16} height={32} fill="#1a2434" stroke="#3a4a62" strokeWidth="0.8" />

      {/* Arrabales del oeste: quintas y huecos */}
      <text x="96" y="122" fill="#3a4860" fontSize="9" letterSpacing="3" opacity="0.7">
        QUINTAS
      </text>
      <text x="96" y="472" fill="#3a4860" fontSize="9" letterSpacing="3" opacity="0.7">
        HUECOS
      </text>
      <text x="384" y="62" fill="#3a4860" fontSize="10" letterSpacing="5" opacity="0.85">
        BUENOS AIRES · 1807
      </text>
      <text x="386" y="516" fill="#2e3d52" fontSize="8" letterSpacing="3" opacity="0.8">
        CADA CALLE, UN EMBUDO · CADA AZOTEA, UN FORTÍN
      </text>

      {/* Marco de atlas */}
      <g opacity="0.5" aria-hidden>
        <rect x="16" y="16" width={VB.w - 32} height={VB.h - 32} fill="none" stroke="#3a4558" strokeWidth="0.6" />
        <rect x="22" y="22" width={VB.w - 44} height={VB.h - 44} fill="none" stroke="#2a3548" strokeWidth="0.4" />
      </g>

      {children}
    </svg>
  );
}

/** Hito urbano: cúpula o punto de referencia con etiqueta. */
export function HitoDefensa({
  x,
  y,
  nombre,
  color = "#aab4c8",
  lado = "der",
}: {
  x: number;
  y: number;
  nombre: string;
  color?: string;
  lado?: "izq" | "der" | "arriba" | "abajo";
}) {
  const offsets = {
    izq: { lx: x - 12, ly: y + 4, anchor: "end" as const },
    der: { lx: x + 12, ly: y + 4, anchor: "start" as const },
    arriba: { lx: x, ly: y - 11, anchor: "middle" as const },
    abajo: { lx: x, ly: y + 17, anchor: "middle" as const },
  };
  const o = offsets[lado];
  return (
    <g>
      <circle cx={x} cy={y} r={4.5} fill="#0a0d14" stroke={color} strokeWidth="1.2" />
      <circle cx={x} cy={y} r={1.8} fill={color} />
      <text x={o.lx} y={o.ly} fill={color} fontSize="11" fontWeight="500" textAnchor={o.anchor}>
        {nombre}
      </text>
    </g>
  );
}

export { VB as VIEWBOX_DEFENSA };
