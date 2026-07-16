/**
 * Mapa ilustrado de la campaña de Junín (1824): del Perú a la meseta andina.
 */

const VB = { w: 900, h: 560 };

export const ILU_JUNIN = {
  lima: { x: 160, y: 400, nombre: "Lima" },
  pasco: { x: 340, y: 300, nombre: "Pasco" },
  junin: { x: 480, y: 260, nombre: "Junín" },
  ayacucho: { x: 620, y: 220, nombre: "Ayacucho" },
} as const;

export type EtapaJunin = {
  nombre: string;
  fecha: string;
  detalle: string;
};

export const ETAPAS_JUNIN: EtapaJunin[] = [
  {
    nombre: "El ejército en el Perú",
    fecha: "1821 a 1823",
    detalle:
      "San Martín libera Lima pero no puede terminar la guerra. El Ejército del Perú queda en la meseta, agotado, esperando la batalla que decida el destino del virreinato.",
  },
  {
    nombre: "La marcha a la altura",
    fecha: "Julio de 1824",
    detalle:
      "El general José de Canterac concentra las fuerzas realistas en la meseta de Junín. San Martín reorganiza la caballería bajo Andrés de Santa Cruz y avanza hacia la sierra.",
  },
  {
    nombre: "La batalla sin fusiles",
    fecha: "6 de agosto de 1824",
    detalle:
      "En el pampas de Junín, a más de 4.000 metros, la caballería patriota y realista se enfrenta a sables y lanzas. No suena un solo disparo de fusil. Ganan los patriotas.",
  },
  {
    nombre: "Hacia Ayacucho",
    fecha: "Diciembre de 1824",
    detalle:
      "Junín no termina la guerra, pero la inclina. Cuatro meses después, en Ayacucho, el ejército de Sucre remata el imperio español en América.",
  },
];

export const RUTA_LIMA_PASCO = "M160 400 C220 360 280 330 340 300";
export const RUTA_PASCO_JUNIN = "M340 300 C400 285 440 270 480 260";
export const RUTA_JUNIN_AYACUCHO = "M480 260 C540 245 580 230 620 220";

type BaseProps = { children?: React.ReactNode };

export function BaseMapaJunin({ children }: BaseProps) {
  return (
    <svg
      className="h-full w-full"
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mapa ilustrado de la batalla de Junín"
    >
      <defs>
        <linearGradient id="grad-jun-fondo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0f18" />
          <stop offset="100%" stopColor="#080b10" />
        </linearGradient>
        <pattern id="patron-jun" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.35" fill="#ffffff" opacity="0.025" />
        </pattern>
        <filter id="glow-jun-celeste" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width={VB.w} height={VB.h} fill="url(#grad-jun-fondo)" />
      <rect width={VB.w} height={VB.h} fill="url(#patron-jun)" />
      <path
        d="M0 180 L300 140 L600 120 L900 100 L900 560 L0 560 Z"
        fill="#1a2235"
        opacity="0.45"
      />
      <path
        d="M100 300 L400 260 L700 200 L900 180 L900 560 L200 560 Z"
        fill="#2a2018"
        opacity="0.3"
      />
      {children}
    </svg>
  );
}

export function HitoJunin({
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
