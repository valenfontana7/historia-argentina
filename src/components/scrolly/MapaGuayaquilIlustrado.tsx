/**
 * Mapa ilustrado de la entrevista de Guayaquil (1822).
 */

const VB = { w: 900, h: 560 };

export const ILU_GUAYAQUIL = {
  lima: { x: 180, y: 320, nombre: "Lima" },
  guayaquil: { x: 420, y: 380, nombre: "Guayaquil" },
  santiago: { x: 280, y: 480, nombre: "Santiago" },
  quito: { x: 360, y: 260, nombre: "Quito" },
} as const;

export type EtapaGuayaquil = {
  nombre: string;
  fecha: string;
  detalle: string;
};

export const ETAPAS_GUAYAQUIL: EtapaGuayaquil[] = [
  {
    nombre: "El Libertador del Sur",
    fecha: "1817 a 1821",
    detalle:
      "San Martín cruza los Andes, libera Chile y Perú. Bolívar avanza desde el norte. Dos ejércitos, dos proyectos: ¿quién manda en la independencia?",
  },
  {
    nombre: "La cita en Guayaquil",
    fecha: "26 a 27 de julio de 1822",
    detalle:
      "En la casa de la viuda de Rodríguez, San Martín y Bolívar se reúnen en secreto. Nadie sabe exactamente qué dijeron. El mundo entero especula.",
  },
  {
    nombre: "La renuncia",
    fecha: "Agosto de 1822",
    detalle:
      "San Martín deja el mando del Ejército del Perú y renuncia a todos sus cargos. Prefiere el exilio antes que una guerra civil entre americanos.",
  },
  {
    nombre: "El silencio del héroe",
    fecha: "1824 a 1850",
    detalle:
      "Bolívar sigue peleando. San Martín parte a Europa y nunca vuelve. Guayaquil queda como el misterio que cerró una era.",
  },
];

export const RUTA_LIMA = "M180 320 C260 340 340 360 420 380";
export const RUTA_SANTIAGO = "M280 480 C320 440 370 410 420 380";
export const RUTA_QUITO = "M360 260 C390 310 410 350 420 380";
export const RUTA_EXILIO = "M420 380 C520 320 620 260 720 220";

type BaseProps = { children?: React.ReactNode };

export function BaseMapaGuayaquil({ children }: BaseProps) {
  return (
    <svg
      className="h-full w-full"
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mapa ilustrado de la entrevista de Guayaquil"
    >
      <defs>
        <linearGradient id="grad-gua-fondo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#050a14" />
          <stop offset="100%" stopColor="#080b10" />
        </linearGradient>
        <pattern id="patron-gua" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.35" fill="#ffffff" opacity="0.025" />
        </pattern>
        <filter id="glow-gua-celeste" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width={VB.w} height={VB.h} fill="url(#grad-gua-fondo)" />
      <rect width={VB.w} height={VB.h} fill="url(#patron-gua)" />
      <path
        d="M0 180 Q200 140 450 160 Q700 180 900 150 L900 560 L0 560 Z"
        fill="#0a1828"
        opacity="0.5"
      />
      <path
        d="M0 420 Q300 380 600 400 Q800 410 900 390 L900 560 L0 560 Z"
        fill="#0c1a12"
        opacity="0.6"
      />
      <text x={450} y={120} fill="#5a7a9a" fontSize="11" textAnchor="middle" opacity="0.6">
        PACÍFICO · 1822
      </text>
      {children}
    </svg>
  );
}

export function HitoGuayaquil({
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

export { VB as VIEWBOX_GUAYAQUIL };
