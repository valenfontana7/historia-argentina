/**
 * Mapa ilustrado de la Conquista del Desierto (1878 a 1885).
 */

const VB = { w: 900, h: 560 };

export const ILU_DESIERTO = {
  buenosAires: { x: 720, y: 420, nombre: "Buenos Aires" },
  viedma: { x: 580, y: 480, nombre: "Viedma" },
  neuquen: { x: 420, y: 400, nombre: "Neuquén" },
  chubut: { x: 300, y: 460, nombre: "Chubut" },
  santaCruz: { x: 180, y: 520, nombre: "Santa Cruz" },
} as const;

export type EtapaDesierto = {
  nombre: string;
  fecha: string;
  detalle: string;
};

export const ETAPAS_DESIERTO: EtapaDesierto[] = [
  {
    nombre: "La frontera móvil",
    fecha: "1870 a 1878",
    detalle:
      "Después de la unificación, el Estado argentino mira al sur. Millones de hectáreas fuera del control efectivo. Roca, ministro de Guerra, diseña la campaña.",
  },
  {
    nombre: "La Conquista del Desierto",
    fecha: "1878 a 1884",
    detalle:
      "Columnas militares avanzan por la Patagonia con fusiles, caballos y telégrafo. Incorporan territorio al mapa. Desposeen y someten a los pueblos originarios.",
  },
  {
    nombre: "La Patagonia argentina",
    fecha: "1884 a 1885",
    detalle:
      "Se crean gobernaciones, fuertes y líneas férreas. La tierra se reparte entre terratenientes y colonos. Argentina se vuelve granero del mundo.",
  },
  {
    nombre: "La herida abierta",
    fecha: "1885 a hoy",
    detalle:
      "La campaña se celebró como progreso. También dejó desplazamiento, violencia y memoria disputada. La Argentina moderna nació con esa sombra.",
  },
];

export const RUTA_FRONTERA = "M720 420 C650 430 600 440 580 480";
export const RUTA_AVANCE = "M580 480 C500 450 420 420 420 400";
export const RUTA_PATAGONIA = "M420 400 C350 420 280 450 180 520";
export const RUTA_ESTADO = "M180 520 C350 380 550 300 720 220";

type BaseProps = { children?: React.ReactNode };

export function BaseMapaDesierto({ children }: BaseProps) {
  return (
    <svg
      className="h-full w-full"
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mapa ilustrado de la Conquista del Desierto"
    >
      <defs>
        <linearGradient id="grad-des-fondo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e1008" />
          <stop offset="100%" stopColor="#080b10" />
        </linearGradient>
        <pattern id="patron-des" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.35" fill="#ffffff" opacity="0.025" />
        </pattern>
        <filter id="glow-des-oro" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width={VB.w} height={VB.h} fill="url(#grad-des-fondo)" />
      <rect width={VB.w} height={VB.h} fill="url(#patron-des)" />
      <path
        d="M0 300 Q250 280 500 290 Q750 300 900 280 L900 560 L0 560 Z"
        fill="#1a2010"
        opacity="0.65"
      />
      <path
        d="M0 380 Q300 360 600 370 Q800 375 900 360 L900 560 L0 560 Z"
        fill="#141808"
        opacity="0.55"
      />
      <text x={450} y={100} fill="#8d8271" fontSize="11" textAnchor="middle" opacity="0.6">
        PATAGONIA · 1879
      </text>
      {children}
    </svg>
  );
}

export function HitoDesierto({
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

export { VB as VIEWBOX_DESIERTO };
