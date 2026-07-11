/**
 * Mapa ilustrado de la batalla de Ituzaingó (1827): la guerra con el Brasil.
 */

const VB = { w: 900, h: 560 };

export const ILU_ITUZAINGO = {
  buenosAires: { x: 720, y: 340, nombre: "Buenos Aires" },
  ituzaingo: { x: 420, y: 280, nombre: "Ituzaingó" },
  brandsen: { x: 480, y: 320, nombre: "Brandsen" },
  brasil: { x: 160, y: 260, nombre: "Ejército brasileño" },
} as const;

export type EtapaItuzaingo = {
  nombre: string;
  fecha: string;
  detalle: string;
};

export const ETAPAS_ITUZAINGO: EtapaItuzaingo[] = [
  {
    nombre: "La guerra con Brasil",
    fecha: "1825 — 1827",
    detalle:
      "Las Provincias Unidas enfrentan al Imperio del Brasil por la Banda Oriental. Rivadavia gobierna y la guerra se traba en el litoral.",
  },
  {
    nombre: "El campo de batalla",
    fecha: "20 de febrero de 1827",
    detalle:
      "En Ituzaingó, a orillas del arroyo, las tropas argentinas y brasileñas se enfrentan. Entre los oficiales jóvenes está Juan Manuel de Rosas.",
  },
  {
    nombre: "La jornada decisiva",
    fecha: "20 de febrero de 1827",
    detalle:
      "La batalla termina sin vencedor claro, pero Argentina contiene el avance brasileño. Coronel Brandsen muere en el frente.",
  },
  {
    nombre: "El preludio del rosismo",
    fecha: "1827 — 1835",
    detalle:
      "Ituzaingó no resolvió la guerra, pero forjó a una generación militar. Rosas volvería del campo de batalla hacia el poder absoluto.",
  },
];

export const RUTA_BRASIL = "M160 260 C260 270 340 275 420 280";
export const RUTA_BRANDSEN = "M420 280 L480 320";
export const RUTA_RETORNO = "M420 280 C520 300 620 320 720 340";

type BaseProps = { children?: React.ReactNode };

export function BaseMapaItuzaingo({ children }: BaseProps) {
  return (
    <svg
      className="h-full w-full"
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mapa ilustrado de la batalla de Ituzaingó"
    >
      <defs>
        <linearGradient id="grad-itu-fondo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c1018" />
          <stop offset="100%" stopColor="#080b10" />
        </linearGradient>
        <pattern id="patron-itu" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.35" fill="#ffffff" opacity="0.025" />
        </pattern>
        <filter id="glow-itu-celeste" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width={VB.w} height={VB.h} fill="url(#grad-itu-fondo)" />
      <rect width={VB.w} height={VB.h} fill="url(#patron-itu)" />
      <path
        d="M0 200 L400 160 L900 140 L900 560 L0 560 Z"
        fill="#1a2235"
        opacity="0.4"
      />
      {children}
    </svg>
  );
}

export function HitoItuzaingo({
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
