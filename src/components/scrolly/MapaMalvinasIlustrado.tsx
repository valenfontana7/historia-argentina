/**
 * Mapa ilustrado de la guerra de Malvinas (1982):
 * del desembarco a la rendición.
 */

const VB = { w: 900, h: 560 };

export const ILU_MALVINAS = {
  cono: { x: 280, y: 380, nombre: "Argentina" },
  islas: { x: 720, y: 200, nombre: "Malvinas" },
  puerto: { x: 750, y: 220, nombre: "Puerto Argentino" },
  flota: { x: 600, y: 120, nombre: "Flota británica" },
} as const;

export type EtapaMalvinas = {
  nombre: string;
  fecha: string;
  detalle: string;
};

export const ETAPAS_MALVINAS: EtapaMalvinas[] = [
  {
    nombre: "Operación Rosario",
    fecha: "2 de abril de 1982",
    detalle:
      "Tropas argentinas desembarcan en Puerto Argentino. La dictadura apuesta a una causa nacional para sostenerse en el poder.",
  },
  {
    nombre: "La movilización",
    fecha: "Abril de 1982",
    detalle:
      "En la Argentina continental, banderas y voluntarios. La guerra une por un tiempo lo que la crisis había fracturado.",
  },
  {
    nombre: "El choque en el Atlántico",
    fecha: "Mayo a junio de 1982",
    detalle:
      "Submarinos, portaaviones, aviones. 74 días de combate en un teatro remoto que el país sigue en la memoria.",
  },
  {
    nombre: "La rendición",
    fecha: "14 de junio de 1982",
    detalle:
      "Puerto Argentino cae. La guerra termina, pero la herida queda abierta. La dictadura no sobrevivirá mucho más.",
  },
];

export const RUTA_DESEMBARCO = "M280 380 C420 320 580 260 720 220";
export const RUTA_FLOTA = "M600 120 C650 150 700 180 740 210";
export const RUTA_CONFLICTO = "M720 220 C680 180 640 150 600 120";
export const RUTA_RENDICION = "M750 220 C650 300 450 360 280 380";

type BaseProps = { children?: React.ReactNode };

export function BaseMapaMalvinas({ children }: BaseProps) {
  return (
    <svg
      className="h-full w-full"
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mapa ilustrado de la guerra de Malvinas"
    >
      <defs>
        <linearGradient id="grad-mal-fondo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#050a12" />
          <stop offset="100%" stopColor="#080b10" />
        </linearGradient>
        <pattern id="patron-mal" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.35" fill="#ffffff" opacity="0.025" />
        </pattern>
        <filter id="glow-mal-celeste" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-mal-carmesi" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width={VB.w} height={VB.h} fill="url(#grad-mal-fondo)" />
      <rect width={VB.w} height={VB.h} fill="url(#patron-mal)" />
      <path
        d="M0 420 Q200 400 400 410 Q600 420 800 390 L900 420 L900 560 L0 560 Z"
        fill="#0c1828"
        opacity="0.7"
      />
      <path
        d="M0 320 Q300 300 600 310 Q800 290 900 280 L900 420 L0 420 Z"
        fill="#101e30"
        opacity="0.5"
      />
      <ellipse cx={720} cy={210} rx={45} ry={22} fill="#1a3048" opacity="0.6" />
      <ellipse cx={750} cy={205} rx={18} ry={8} fill="#243850" opacity="0.5" />
      {children}
    </svg>
  );
}

export function HitoMalvinas({
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

export { VB as VIEWBOX_MALVINAS };
