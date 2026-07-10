/**
 * Mapa ilustrado de la Batalla de San Lorenzo (1813).
 */

const VB = { w: 900, h: 560 };

export const ILU_SAN_LORENZO = {
  convento: { x: 680, y: 280, nombre: "Convento de San Carlos" },
  rio: { x: 750, y: 320, nombre: "Río Paraná" },
  desembarco: { x: 200, y: 240, nombre: "Desembarco español" },
  granaderos: { x: 500, y: 300, nombre: "Granaderos" },
} as const;

export type EtapaSanLorenzo = {
  nombre: string;
  fecha: string;
  detalle: string;
};

export const ETAPAS_SAN_LORENZO: EtapaSanLorenzo[] = [
  {
    nombre: "El convoy realista",
    fecha: "3 de febrero de 1813",
    detalle:
      "Un convoy español navega el Paraná con pertrechos para Montevideo. San Martín lo detecta y arma una emboscada en San Lorenzo.",
  },
  {
    nombre: "El desembarco",
    fecha: "Madrugada del 3 de febrero",
    detalle:
      "Las tropas realistas desembarcan cerca del Convento de San Carlos. No saben que los esperan.",
  },
  {
    nombre: "La carga de los Granaderos",
    fecha: "3 de febrero, ~15 minutos",
    detalle:
      "San Martín lidera la carga del Regimiento de Granaderos a Caballo. Es su debut militar y el nacimiento de una leyenda.",
  },
  {
    nombre: "El pino de San Lorenzo",
    fecha: "3 de febrero de 1813",
    detalle:
      "La victoria dura un cuarto de hora. Queda el pino herido por una bala: símbolo del regimiento que liberará medio continente.",
  },
];

export const RUTA_CONVoy = "M150 200 C280 220 400 250 550 270";
export const RUTA_DESEMBARCO = "M200 240 L620 290";
export const RUTA_CARGA = "M500 300 L650 285";
export const RUTA_VICTORIA = "M680 280 C600 250 450 220 300 200";

type BaseProps = { children?: React.ReactNode };

export function BaseMapaSanLorenzo({ children }: BaseProps) {
  return (
    <svg
      className="h-full w-full"
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mapa ilustrado de la batalla de San Lorenzo"
    >
      <defs>
        <linearGradient id="grad-sl-fondo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#050a10" />
          <stop offset="100%" stopColor="#080b10" />
        </linearGradient>
        <pattern id="patron-sl" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.35" fill="#ffffff" opacity="0.025" />
        </pattern>
        <filter id="glow-sl-celeste" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width={VB.w} height={VB.h} fill="url(#grad-sl-fondo)" />
      <rect width={VB.w} height={VB.h} fill="url(#patron-sl)" />
      <path
        d="M550 200 Q700 250 850 280 L900 320 L900 560 L550 560 Q650 400 550 280 Z"
        fill="#0c1820"
        opacity="0.8"
      />
      <path
        d="M0 380 Q300 360 600 370 Q800 355 900 340 L900 560 L0 560 Z"
        fill="#101e28"
        opacity="0.5"
      />
      <rect x={640} y={240} width={80} height={60} fill="#1a2230" opacity="0.7" rx="4" />
      {children}
    </svg>
  );
}

export function HitoSanLorenzo({
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
    izq: { tx: -12, ty: 4, anchor: "end" as const },
    der: { tx: 12, ty: 4, anchor: "start" as const },
    arriba: { tx: 0, ty: -14, anchor: "middle" as const },
    abajo: { tx: 0, ty: 18, anchor: "middle" as const },
  };
  const o = offsets[lado];
  return (
    <g>
      <circle cx={x} cy={y} r={5} fill={color} opacity="0.9" />
      <circle cx={x} cy={y} r={9} fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <text x={x + o.tx} y={y + o.ty} fill={color} fontSize="10" textAnchor={o.anchor} opacity="0.85">
        {nombre}
      </text>
    </g>
  );
}

export { VB as VIEWBOX_SAN_LORENZO };
