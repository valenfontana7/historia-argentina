/**
 * Mapa ilustrado de Pavón (1859): Mitre vence a Urquiza y abre la unificación nacional.
 */

const VB = { w: 900, h: 560 };

export const ILU_PAVON = {
  buenosAires: { x: 720, y: 300, nombre: "Buenos Aires" },
  pavon: { x: 420, y: 280, nombre: "Pavón" },
  urquiza: { x: 180, y: 300, nombre: "Urquiza" },
  mitre: { x: 580, y: 260, nombre: "Mitre" },
  confederacion: { x: 280, y: 200, nombre: "Confederación" },
} as const;

export type EtapaPavon = {
  nombre: string;
  fecha: string;
  detalle: string;
};

export const ETAPAS_PAVON: EtapaPavon[] = [
  {
    nombre: "Dos Argentinas",
    fecha: "1853 a 1859",
    detalle:
      "Buenos Aires quedó fuera de la Constitución. Urquiza gobierna la Confederación; Mitre lidera la resistencia porteña.",
  },
  {
    nombre: "El campo de Pavón",
    fecha: "16 de abril de 1859",
    detalle:
      "En Santa Fe, dos ejércitos se enfrentan por la hegemonía del país: el federalismo del interior contra el proyecto unitario del puerto.",
  },
  {
    nombre: "La victoria de Mitre",
    fecha: "16 de abril de 1859",
    detalle:
      "Urquiza es derrotado. Buenos Aires impone su modelo y abre el camino a la República unificada de 1862.",
  },
  {
    nombre: "La Nación unificada",
    fecha: "1861 a 1862",
    detalle:
      "Mitre asume como primer presidente de la Nación Argentina. El mapa político que Rosas y Urquiza habían disputado queda reordenado.",
  },
];

export const RUTA_CONFRONTACION = "M180 300 C300 290 360 285 420 280";
export const RUTA_VICTORIA = "M420 280 C500 275 600 285 720 300";
export const RUTA_HEGEMONIA = "M580 260 C640 270 680 285 720 300";

type BaseProps = { children?: React.ReactNode };

export function BaseMapaPavon({ children }: BaseProps) {
  return (
    <svg
      className="h-full w-full"
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mapa ilustrado de la batalla de Pavón"
    >
      <defs>
        <linearGradient id="grad-pav-fondo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#140f08" />
          <stop offset="100%" stopColor="#080b10" />
        </linearGradient>
        <pattern id="patron-pav" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.35" fill="#ffffff" opacity="0.025" />
        </pattern>
        <filter id="glow-pav-oro" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width={VB.w} height={VB.h} fill="url(#grad-pav-fondo)" />
      <rect width={VB.w} height={VB.h} fill="url(#patron-pav)" />
      <path
        d="M0 380 Q300 350 500 370 Q750 390 900 360 L900 560 L0 560 Z"
        fill="#1a1408"
        opacity="0.7"
      />
      {children}
    </svg>
  );
}

export function HitoPavon({
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
