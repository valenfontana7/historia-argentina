/**
 * Mapa ilustrado de Barranca Yaco (1835).
 */

const VB = { w: 900, h: 560 };

export const ILU_YACO = {
  laRioja: { x: 280, y: 200, nombre: "La Rioja" },
  barranca: { x: 480, y: 280, nombre: "Barranca Yaco" },
  buenosAires: { x: 720, y: 380, nombre: "Buenos Aires" },
} as const;

export type EtapaBarrancaYaco = {
  nombre: string;
  fecha: string;
  detalle: string;
};

export const ETAPAS_YACO: EtapaBarrancaYaco[] = [
  {
    nombre: "El Tigre de los Llanos",
    fecha: "1830 a 1834",
    detalle:
      "Facundo Quiroga domina La Rioja y el interior con fierro y caballos. Para Rosas, es aliado incómodo; para los unitarios, enemigo mortal.",
  },
  {
    nombre: "La cita en el camino",
    fecha: "4 de enero de 1835",
    detalle:
      "Facundo viaja hacia Buenos Aires a negociar con Rosas. En Barranca Yaco, su escolta se dispersa. La emboscada está servida.",
  },
  {
    nombre: "La emboscada",
    fecha: "4 de enero de 1835",
    detalle:
      "En un angosto del camino, facciosos de Santángelo abren fuego. El caudillo cae. No hay batalla campal: hay crimen político.",
  },
  {
    nombre: "El mito que quedó",
    fecha: "1835 a 1845",
    detalle:
      "Sarmiento escribirá el Facundo diez años después. Barranca Yaco no fue solo un asesinato: fue el fin de un tipo de poder en el interior.",
  },
];

export const RUTA_VIAJE = "M280 200 C360 230 420 260 480 280";
export const RUTA_EMBOSCADA = "M480 280 L520 270";
export const RUTA_NOTICIA = "M480 280 C600 320 680 350 720 380";

type BaseProps = { children?: React.ReactNode };

export function BaseMapaBarrancaYaco({ children }: BaseProps) {
  return (
    <svg
      className="h-full w-full"
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mapa ilustrado de Barranca Yaco"
    >
      <defs>
        <linearGradient id="grad-yaco-fondo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e1208" />
          <stop offset="100%" stopColor="#080b10" />
        </linearGradient>
        <pattern id="patron-yaco" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.35" fill="#ffffff" opacity="0.025" />
        </pattern>
        <filter id="glow-yaco-carmesi" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width={VB.w} height={VB.h} fill="url(#grad-yaco-fondo)" />
      <rect width={VB.w} height={VB.h} fill="url(#patron-yaco)" />
      <path
        d="M0 400 Q200 360 450 370 Q700 380 900 350 L900 560 L0 560 Z"
        fill="#1a2010"
        opacity="0.7"
      />
      <path
        d="M0 440 Q300 410 600 425 Q800 435 900 410 L900 560 L0 560 Z"
        fill="#141808"
        opacity="0.6"
      />
      {children}
    </svg>
  );
}

export function HitoBarrancaYaco({
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

export { VB as VIEWBOX_YACO };
