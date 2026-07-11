/**
 * Mapa ilustrado de Maipú (1818): de Cancha Rayada a la independencia de Chile.
 */

const VB = { w: 900, h: 560 };

export const ILU_MAIPU = {
  santiago: { x: 200, y: 120, nombre: "Santiago" },
  canchaRayada: { x: 280, y: 280, nombre: "Cancha Rayada" },
  maipu: { x: 240, y: 220, nombre: "Maipú" },
  sanMartin: { x: 300, y: 240, nombre: "San Martín" },
  osorio: { x: 220, y: 260, nombre: "Osorio" },
} as const;

export type EtapaMaipu = {
  nombre: string;
  fecha: string;
  detalle: string;
};

export const ETAPAS_MAIPU: EtapaMaipu[] = [
  {
    nombre: "La traición de Cancha Rayada",
    fecha: "19 de marzo de 1818",
    detalle:
      "Una emboscada casi aniquila al Ejército de los Andes. San Martín reagrupa en los llanos: la revolución chilena pende de un hilo.",
  },
  {
    nombre: "El rearme",
    fecha: "Marzo — abril de 1818",
    detalle:
      "En pocas semanas, San Martín reconstruye el ejército. La segunda oportunidad será en los llanos de Maipú.",
  },
  {
    nombre: "Seis horas en Maipú",
    fecha: "5 de abril de 1818",
    detalle:
      "En el campo de Maipú, San Martín destroza al ejército realista de Osorio. El poder español en Chile deja de existir.",
  },
  {
    nombre: "El abrazo",
    fecha: "Abril de 1818",
    detalle:
      "San Martín y O'Higgins sellan la independencia de Chile. El plan continental apunta ahora al Pacífico y Lima.",
  },
];

export const RUTA_REGRUPO = "M280 280 C270 260 255 240 240 220";
export const RUTA_BATALLA = "M300 240 L240 230";
export const RUTA_LIBERACION = "M240 220 C220 180 210 150 200 120";

type BaseProps = { children?: React.ReactNode };

export function BaseMapaMaipu({ children }: BaseProps) {
  return (
    <svg
      className="h-full w-full"
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mapa ilustrado de la batalla de Maipú"
    >
      <defs>
        <linearGradient id="grad-maip-fondo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e1208" />
          <stop offset="100%" stopColor="#080b10" />
        </linearGradient>
        <pattern id="patron-maip" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.35" fill="#ffffff" opacity="0.025" />
        </pattern>
        <filter id="glow-maip-celeste" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width={VB.w} height={VB.h} fill="url(#grad-maip-fondo)" />
      <rect width={VB.w} height={VB.h} fill="url(#patron-maip)" />
      <path
        d="M0 350 Q250 320 450 340 Q700 360 900 330 L900 560 L0 560 Z"
        fill="#1a1408"
        opacity="0.65"
      />
      <path
        d="M100 80 L350 60 L550 90 L700 70 L900 100 L900 200 L100 220 Z"
        fill="#2a2018"
        opacity="0.35"
      />
      {children}
    </svg>
  );
}

export function HitoMaipu({
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
