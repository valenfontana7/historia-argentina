/**
 * Mapa ilustrado de la batalla de Ayacucho (1824): del altiplano a la independencia del Perú.
 */

const VB = { w: 900, h: 560 };

export const ILU_AYACUCHO = {
  junin: { x: 400, y: 280, nombre: "Junín" },
  ayacucho: { x: 520, y: 240, nombre: "Ayacucho" },
  lima: { x: 160, y: 400, nombre: "Lima" },
  cuzco: { x: 340, y: 300, nombre: "Cuzco" },
} as const;

export type EtapaAyacucho = {
  nombre: string;
  fecha: string;
  detalle: string;
};

export const ETAPAS_AYACUCHO: EtapaAyacucho[] = [
  {
    nombre: "Tras Junín",
    fecha: "Agosto — noviembre de 1824",
    detalle:
      "La victoria de Junín quebró al ejército realista. Antonio José de Sucre reorganiza el Ejército Unido Libertador y avanza hacia el Cuzco.",
  },
  {
    nombre: "La mesa de Pampa de la Quinua",
    fecha: "9 de diciembre de 1824",
    detalle:
      "En la pampa de la Quinua, cerca de Ayacucho, Sucre enfrenta al virrey La Serna. Bolívar no está: la batalla la pelea el brazo derecho de San Martín.",
  },
  {
    nombre: "La capitulación",
    fecha: "9 de diciembre de 1824",
    detalle:
      "Tres horas de combate. El ejército realista se rinde. Por primera vez, un virrey español en América firma la rendición total.",
  },
  {
    nombre: "Fin del imperio",
    fecha: "1824 — 1825",
    detalle:
      "Ayacucho selló la independencia del Perú y del continente. El imperio español en América terminó en un altiplano peruano.",
  },
];

export const RUTA_JUNIN_AYACUCHO = "M400 280 C440 265 480 250 520 240";
export const RUTA_AYACUCHO_LIMA = "M520 240 C380 300 260 350 160 400";
export const RUTA_CUZCO_JUNIN = "M340 300 C360 290 380 285 400 280";

type BaseProps = { children?: React.ReactNode };

export function BaseMapaAyacucho({ children }: BaseProps) {
  return (
    <svg
      className="h-full w-full"
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mapa ilustrado de la batalla de Ayacucho"
    >
      <defs>
        <linearGradient id="grad-aya-fondo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0f18" />
          <stop offset="100%" stopColor="#080b10" />
        </linearGradient>
        <pattern id="patron-aya" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.35" fill="#ffffff" opacity="0.025" />
        </pattern>
        <filter id="glow-aya-celeste" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width={VB.w} height={VB.h} fill="url(#grad-aya-fondo)" />
      <rect width={VB.w} height={VB.h} fill="url(#patron-aya)" />
      <path
        d="M0 180 L300 140 L600 120 L900 100 L900 560 L0 560 Z"
        fill="#1a2235"
        opacity="0.45"
      />
      {children}
    </svg>
  );
}

export function HitoAyacucho({
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
