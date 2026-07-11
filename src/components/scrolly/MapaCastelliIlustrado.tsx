/**
 * Mapa ilustrado de la revolución del norte (1810): la campaña de Castelli.
 */

const VB = { w: 900, h: 560 };

export const ILU_CASTELLI = {
  buenosAires: { x: 720, y: 380, nombre: "Buenos Aires" },
  cordoba: { x: 520, y: 300, nombre: "Córdoba" },
  cochabamba: { x: 300, y: 220, nombre: "Cochabamba" },
  chuquisaca: { x: 240, y: 160, nombre: "Chuquisaca" },
} as const;

export type EtapaCastelli = {
  nombre: string;
  fecha: string;
  detalle: string;
};

export const ETAPAS_CASTELLI: EtapaCastelli[] = [
  {
    nombre: "La revolución sale de Buenos Aires",
    fecha: "Mayo — junio de 1810",
    detalle:
      "Tras el 25 de Mayo, la Primera Junta envía a Castelli al norte con un ejército de milicias. La revolución no puede quedarse en la ciudad: tiene que conquistar el interior.",
  },
  {
    nombre: "La marcha hacia el Alto Perú",
    fecha: "Julio — agosto de 1810",
    detalle:
      "Castelli avanza por Córdoba y el noroeste. Su oratoria convence a algunos, aterroriza a otros. La revolución se expande por la fuerza y la palabra.",
  },
  {
    nombre: "La victoria en Cochabamba",
    fecha: "7 de noviembre de 1810",
    detalle:
      "En Cochabamba, las tropas de Castelli derrotan a los realistas. Por primera vez, la revolución triunfa fuera del Río de la Plata.",
  },
  {
    nombre: "El Alto Perú en llamas",
    fecha: "1810 — 1811",
    detalle:
      "Chuquisaca y La Paz se suman a la revolución. Castelli llega al límite de su poder — y de su salud. La contraofensiva realista vendrá pronto.",
  },
];

export const RUTA_BA_CORDOBA = "M720 380 C640 350 580 320 520 300";
export const RUTA_CORDOBA_COCHA = "M520 300 C420 270 360 240 300 220";
export const RUTA_COCHA_CHUQUI = "M300 220 C270 190 250 175 240 160";

type BaseProps = { children?: React.ReactNode };

export function BaseMapaCastelli({ children }: BaseProps) {
  return (
    <svg
      className="h-full w-full"
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mapa ilustrado de la campaña de Castelli"
    >
      <defs>
        <linearGradient id="grad-cas-fondo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c1018" />
          <stop offset="100%" stopColor="#080b10" />
        </linearGradient>
        <pattern id="patron-cas" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.35" fill="#ffffff" opacity="0.025" />
        </pattern>
        <filter id="glow-cas-celeste" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width={VB.w} height={VB.h} fill="url(#grad-cas-fondo)" />
      <rect width={VB.w} height={VB.h} fill="url(#patron-cas)" />
      <path
        d="M200 120 L500 100 L900 80 L900 560 L100 560 Z"
        fill="#1a2235"
        opacity="0.4"
      />
      {children}
    </svg>
  );
}

export function HitoCastelli({
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
  lado?: "der" | "izq" | "arriba" | "abajo";
}) {
  const tx = lado === "der" ? x + 14 : lado === "izq" ? x - 14 : x;
  const ty = lado === "arriba" ? y - 14 : lado === "abajo" ? y + 22 : y + 4;
  const anchor =
    lado === "der" ? "start" : lado === "izq" ? "end" : "middle";

  return (
    <g>
      <circle cx={x} cy={y} r={5} fill={color} opacity="0.9" />
      <circle cx={x} cy={y} r={10} fill={color} opacity="0.15" />
      <text x={tx} y={ty} fill={color} fontSize="11" textAnchor={anchor} fontWeight="500">
        {nombre}
      </text>
    </g>
  );
}
