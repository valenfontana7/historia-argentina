/**
 * Mapa ilustrado de Caseros (1852): avance del Ejército Grande y caída de Rosas.
 */

const VB = { w: 900, h: 560 };

export const ILU_CASEROS = {
  campo: { x: 420, y: 280, nombre: "Caseros" },
  buenosAires: { x: 720, y: 320, nombre: "Buenos Aires" },
  urquiza: { x: 180, y: 300, nombre: "Ejército Grande" },
  rosas: { x: 520, y: 260, nombre: "Rosas" },
  palermo: { x: 640, y: 280, nombre: "Palermo" },
} as const;

export type EtapaCaseros = {
  nombre: string;
  fecha: string;
  detalle: string;
};

export const ETAPAS_CASEROS: EtapaCaseros[] = [
  {
    nombre: "El Ejército Grande avanza",
    fecha: "Enero 1852",
    detalle:
      "Urquiza cruza el Paraná con entrerrianos, correntinos, brasileños y unitarios. Rosas concentra fuerzas cerca de Buenos Aires.",
  },
  {
    nombre: "Posiciones en el campo",
    fecha: "2 de febrero de 1852",
    detalle:
      "En las lomas de Caseros se alinean dos Argentinas: la Confederación rosista y la coalición que viene a romperla.",
  },
  {
    nombre: "El choque",
    fecha: "3 de febrero de 1852",
    detalle:
      "En pocas horas la línea de Rosas se quiebra. No es una batalla larga: es el final de un orden de veinte años.",
  },
  {
    nombre: "Rosas huye",
    fecha: "3 — 4 de febrero de 1852",
    detalle:
      "El Restaurador embarca hacia el exilio inglés. Buenos Aires abre las puertas al Ejército Grande.",
  },
];

export const RUTA_AVANCE = "M180 300 C260 290 340 285 400 280";
export const RUTA_CHOQUE = "M400 280 L480 265";
export const RUTA_HUIDA = "M520 260 C580 250 650 240 720 220";
export const RUTA_ENTRADA = "M420 280 C520 290 620 305 720 320";

type BaseProps = { children?: React.ReactNode };

export function BaseMapaCaseros({ children }: BaseProps) {
  return (
    <svg
      className="h-full w-full"
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mapa ilustrado de la batalla de Caseros"
    >
      <defs>
        <linearGradient id="grad-cas-fondo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e1208" />
          <stop offset="100%" stopColor="#080b10" />
        </linearGradient>
        <pattern id="patron-cas" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.35" fill="#ffffff" opacity="0.025" />
        </pattern>
        <filter id="glow-cas-oro" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-cas-carmesi" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width={VB.w} height={VB.h} fill="url(#grad-cas-fondo)" />
      <rect width={VB.w} height={VB.h} fill="url(#patron-cas)" />
      {/* Pampa */}
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
      {/* Lomas de Caseros */}
      <ellipse cx={420} cy={290} rx={90} ry={40} fill="#222818" opacity="0.5" />
      <ellipse cx={500} cy={270} rx={60} ry={28} fill="#1a2010" opacity="0.45" />
      {/* Silueta de ciudad al este */}
      <rect x={700} y={280} width={40} height={50} fill="#1a2230" opacity="0.7" />
      <rect x={750} y={260} width={30} height={70} fill="#141b28" opacity="0.7" />
      <rect x={790} y={290} width={35} height={40} fill="#1a2230" opacity="0.7" />
      {children}
    </svg>
  );
}

export function HitoCaseros({
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

export { VB as VIEWBOX_CASEROS };
