/**
 * Mapa ilustrado de Chacabuco (1817): del paso andino a la victoria en el valle chileno.
 */

const VB = { w: 900, h: 560 };

export const ILU_CHACABUCO = {
  mendoza: { x: 720, y: 320, nombre: "Mendoza" },
  losAndes: { x: 280, y: 280, nombre: "Los Andes" },
  cuesta: { x: 220, y: 220, nombre: "Cuesta de Chacabuco" },
  santiago: { x: 160, y: 160, nombre: "Santiago" },
  ohiggins: { x: 200, y: 240, nombre: "O'Higgins" },
  soler: { x: 320, y: 200, nombre: "Soler" },
} as const;

export type EtapaChacabuco = {
  nombre: string;
  fecha: string;
  detalle: string;
};

export const ETAPAS_CHACABUCO: EtapaChacabuco[] = [
  {
    nombre: "Tras el cruce",
    fecha: "Enero a febrero de 1817",
    detalle:
      "El Ejército de los Andes desciende del paso. San Martín reagrupa en el valle de Los Andes: la cordillera quedó atrás, pero el realismo sigue en pie.",
  },
  {
    nombre: "Posiciones en la cuesta",
    fecha: "11 de febrero de 1817",
    detalle:
      "El general Rafael Maroto concentra las fuerzas realistas en la cuesta de Chacabuco. O'Higgins atacará de frente; Soler envolverá por el oeste.",
  },
  {
    nombre: "La maniobra envolvente",
    fecha: "12 de febrero de 1817",
    detalle:
      "Mientras O'Higgins fija al enemigo, Soler rodea la posición española. La caballería de Zapiola remata la jornada.",
  },
  {
    nombre: "Chile libre",
    fecha: "Febrero de 1817",
    detalle:
      "La victoria abre el camino a Santiago. Por primera vez, el plan continental de San Martín parece posible.",
  },
];

export const RUTA_DESCENSO = "M720 320 C520 310 380 295 280 280";
export const RUTA_FRONTAL = "M200 240 L240 230";
export const RUTA_ENVOLVENTE = "M320 200 C280 210 240 220 220 230";
export const RUTA_VICTORIA = "M220 220 C190 200 170 180 160 160";

type BaseProps = { children?: React.ReactNode };

export function BaseMapaChacabuco({ children }: BaseProps) {
  return (
    <svg
      className="h-full w-full"
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mapa ilustrado de la batalla de Chacabuco"
    >
      <defs>
        <linearGradient id="grad-cha-fondo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c1018" />
          <stop offset="100%" stopColor="#080b10" />
        </linearGradient>
        <pattern id="patron-cha" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.35" fill="#ffffff" opacity="0.025" />
        </pattern>
        <filter id="glow-cha-celeste" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width={VB.w} height={VB.h} fill="url(#grad-cha-fondo)" />
      <rect width={VB.w} height={VB.h} fill="url(#patron-cha)" />
      <path
        d="M0 120 L200 80 L400 100 L600 60 L900 90 L900 400 L0 420 Z"
        fill="#1a2235"
        opacity="0.5"
      />
      <path
        d="M600 200 L900 180 L900 560 L500 560 L400 400 Z"
        fill="#2a2018"
        opacity="0.35"
      />
      {children}
    </svg>
  );
}

export function HitoChacabuco({
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
