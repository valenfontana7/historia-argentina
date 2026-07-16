/**
 * Mapa ilustrado de la Batalla de Tucumán (1812):
 * del Éxodo Jujeño al campo de batalla.
 */

const VB = { w: 900, h: 560 };

export const ILU_TUCUMAN = {
  jujuy: { x: 280, y: 120, nombre: "Jujuy" },
  tucuman: { x: 450, y: 280, nombre: "Tucumán" },
  campo: { x: 480, y: 320, nombre: "Campo de batalla" },
  cordoba: { x: 580, y: 400, nombre: "Córdoba (orden de retirada)" },
  belgrano: { x: 420, y: 300, nombre: "Belgrano" },
} as const;

export type EtapaTucuman = {
  nombre: string;
  fecha: string;
  detalle: string;
};

export const ETAPAS_TUCUMAN: EtapaTucuman[] = [
  {
    nombre: "El Éxodo Jujeño",
    fecha: "Julio a agosto de 1812",
    detalle:
      "Belgrano evacúa Jujuy y quema la tierra. Miles de civiles marchan al sur. La ciudad queda vacía para frenar al enemigo.",
  },
  {
    nombre: "La orden de retirarse",
    fecha: "Septiembre de 1812",
    detalle:
      "Desde Buenos Aires llega la orden: retroceder a Córdoba. Belgrano tiene otro plan: dar batalla en Tucumán.",
  },
  {
    nombre: "La batalla",
    fecha: "24 a 25 de septiembre de 1812",
    detalle:
      "Soldados bisoños, gauchos con lanzas y cuchillos atados a cañas enfrentan a Pío Tristán. La geografía y la desobediencia salvan la Revolución.",
  },
  {
    nombre: "La victoria se esparce",
    fecha: "Octubre de 1812",
    detalle:
      "La noticia llega al norte y al litoral. Tucumán no fue solo una batalla: fue la prueba de que el país podía resistir.",
  },
];

export const RUTA_EXODO = "M280 120 C320 160 380 220 420 280";
export const RUTA_ORDEN = "M580 400 C540 380 500 350 450 310";
export const RUTA_BATALLA = "M420 280 L480 320";
export const RUTA_VICTORIA = "M480 320 C400 280 320 200 280 140";

type BaseProps = { children?: React.ReactNode };

export function BaseMapaTucuman({ children }: BaseProps) {
  return (
    <svg
      className="h-full w-full"
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mapa ilustrado de la batalla de Tucumán"
    >
      <defs>
        <linearGradient id="grad-tuc-fondo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#140f08" />
          <stop offset="100%" stopColor="#080b10" />
        </linearGradient>
        <pattern id="patron-tuc" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.35" fill="#ffffff" opacity="0.025" />
        </pattern>
        <filter id="glow-tuc-oro" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-tuc-celeste" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width={VB.w} height={VB.h} fill="url(#grad-tuc-fondo)" />
      <rect width={VB.w} height={VB.h} fill="url(#patron-tuc)" />
      <path
        d="M0 400 Q200 360 450 370 Q700 380 900 350 L900 560 L0 560 Z"
        fill="#1a1408"
        opacity="0.7"
      />
      <path
        d="M200 80 L350 60 L500 90 L650 70 L800 100 L900 80 L900 200 L200 200 Z"
        fill="#2a2018"
        opacity="0.4"
      />
      <rect x={400} y={250} width={100} height={70} fill="#1a2230" opacity="0.6" rx="4" />
      {children}
    </svg>
  );
}

export function HitoTucuman({
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

export { VB as VIEWBOX_TUCUMAN };
