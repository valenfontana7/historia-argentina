/**
 * Mapa ilustrado de la Vuelta de Obligado (1845):
 * recodo del Paraná, cadenas y bloqueo anglofrancés.
 */

const VB = { w: 900, h: 560 };

export const ILU_OBLIGADO = {
  recodo: { x: 450, y: 280, nombre: "Recodo de Obligado" },
  cadenas: { x: 420, y: 300, nombre: "Cadenas" },
  baterias: { x: 480, y: 260, nombre: "Baterías" },
  flota: { x: 200, y: 200, nombre: "Flota anglofrancesa" },
  rosas: { x: 720, y: 350, nombre: "Buenos Aires" },
} as const;

export type EtapaObligado = {
  nombre: string;
  fecha: string;
  detalle: string;
};

export const ETAPAS_OBLIGADO: EtapaObligado[] = [
  {
    nombre: "El bloqueo",
    fecha: "Noviembre de 1845",
    detalle:
      "Gran Bretaña y Francia cierran el Paraná para forzar el comercio libre. Rosas responde con soberanía: nadie entra sin permiso.",
  },
  {
    nombre: "Las cadenas del recodo",
    fecha: "18 de noviembre de 1845",
    detalle:
      "En el recodo de Obligado se estiran cadenas de un margen al otro. Es la trampa: obligar a la flota a detenerse bajo el fuego de las baterías.",
  },
  {
    nombre: "Siete horas de combate",
    fecha: "20 de noviembre de 1845",
    detalle:
      "Cañones de ribera contra navíos de guerra. La resistencia dura horas. El precio es alto, pero el mensaje es claro: la Confederación no se rinde.",
  },
  {
    nombre: "Retirada enemiga",
    fecha: "20 — 21 de noviembre de 1845",
    detalle:
      "La flota rompe las cadenas y sigue aguas arriba, pero la batalla se convierte en símbolo. Hoy es el Día de la Soberanía Nacional.",
  },
];

export const RUTA_FLOTA = "M180 200 C260 220 340 250 400 270";
export const RUTA_COMBATE = "M400 270 L480 265";
export const RUTA_RETIRADA = "M480 265 C560 240 640 220 720 200";
export const RUTA_SOBERANIA = "M450 280 C550 310 650 330 720 350";

type BaseProps = { children?: React.ReactNode };

export function BaseMapaObligado({ children }: BaseProps) {
  return (
    <svg
      className="h-full w-full"
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mapa ilustrado de la Vuelta de Obligado"
    >
      <defs>
        <linearGradient id="grad-obl-fondo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#050a10" />
          <stop offset="100%" stopColor="#080b10" />
        </linearGradient>
        <pattern id="patron-obl" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.35" fill="#ffffff" opacity="0.025" />
        </pattern>
        <filter id="glow-obl-celeste" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-obl-carmesi" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width={VB.w} height={VB.h} fill="url(#grad-obl-fondo)" />
      <rect width={VB.w} height={VB.h} fill="url(#patron-obl)" />
      <path
        d="M0 320 Q200 300 450 310 Q700 320 900 290 L900 560 L0 560 Z"
        fill="#0c1820"
        opacity="0.8"
      />
      <path
        d="M0 380 Q300 360 600 370 Q800 355 900 340 L900 560 L0 560 Z"
        fill="#101e28"
        opacity="0.6"
      />
      <path
        d="M350 200 Q450 240 550 200 Q650 160 750 200"
        fill="none"
        stroke="#1a3040"
        strokeWidth="40"
        opacity="0.3"
      />
      {children}
    </svg>
  );
}

export function HitoObligado({
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

export { VB as VIEWBOX_OBLIGADO };
