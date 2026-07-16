/**
 * Mapa ilustrado de la Constitución de 1853.
 */

const VB = { w: 900, h: 560 };

export const ILU_CONSTITUCION = {
  buenosAires: { x: 720, y: 400, nombre: "Buenos Aires (afuera)" },
  santaFe: { x: 480, y: 280, nombre: "Santa Fe" },
  sanNicolas: { x: 580, y: 350, nombre: "San Nicolás" },
  confederacion: { x: 350, y: 220, nombre: "Confederación" },
} as const;

export type EtapaConstitucion = {
  nombre: string;
  fecha: string;
  detalle: string;
};

export const ETAPAS_CONSTITUCION: EtapaConstitucion[] = [
  {
    nombre: "Después de Caseros",
    fecha: "1852 a 1853",
    detalle:
      "Rosas cae, pero el país sigue dividido. Urquiza necesita un marco legal: una Constitución que ordene la Confederación.",
  },
  {
    nombre: "El Acuerdo de San Nicolás",
    fecha: "31 de mayo de 1852",
    detalle:
      "Las provincias pactan convocar un Congreso constituyente. Buenos Aires firma, pero después se separará del resto.",
  },
  {
    nombre: "Las Bases de Alberdi",
    fecha: "1852 a 1853",
    detalle:
      "Desde el exilio, Juan Bautista Alberdi escribe las Bases: federalismo, libertad de comercio, educación laica. El texto guía el Congreso.",
  },
  {
    nombre: "1 de mayo de 1853",
    fecha: "Santa Fe",
    detalle:
      "Se promulga la Constitución Nacional. Por primera vez, la Argentina tiene una carta magna propia. Buenos Aires queda afuera hasta 1860.",
  },
];

export const RUTA_ACUERDO = "M580 350 C520 320 450 290 400 260";
export const RUTA_CONGRESO = "M400 260 L480 280";
export const RUTA_PROMULGACION = "M480 280 C400 250 320 230 350 220";
export const RUTA_SEPARACION = "M720 400 C650 360 580 320 480 280";

type BaseProps = { children?: React.ReactNode };

export function BaseMapaConstitucion({ children }: BaseProps) {
  return (
    <svg
      className="h-full w-full"
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mapa ilustrado de la Constitución de 1853"
    >
      <defs>
        <linearGradient id="grad-const-fondo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e1208" />
          <stop offset="100%" stopColor="#080b10" />
        </linearGradient>
        <pattern id="patron-const" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.35" fill="#ffffff" opacity="0.025" />
        </pattern>
        <filter id="glow-const-oro" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width={VB.w} height={VB.h} fill="url(#grad-const-fondo)" />
      <rect width={VB.w} height={VB.h} fill="url(#patron-const)" />
      <path
        d="M0 420 Q300 390 600 400 Q800 385 900 370 L900 560 L0 560 Z"
        fill="#1a2010"
        opacity="0.7"
      />
      {children}
    </svg>
  );
}

export function HitoConstitucion({
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

export { VB as VIEWBOX_CONSTITUCION };
