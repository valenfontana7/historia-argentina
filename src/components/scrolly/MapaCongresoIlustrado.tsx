/**
 * Mapa ilustrado del Congreso de Tucumán (1816):
 * provincias convergen hacia la Casa Histórica.
 */

const VB = { w: 900, h: 560 };

export const ILU_CONGRESO = {
  casa: { x: 450, y: 280, nombre: "Casa Histórica" },
  plaza: { x: 450, y: 320, nombre: "Plaza" },
  buenosAires: { x: 720, y: 420, nombre: "Buenos Aires" },
  cordoba: { x: 580, y: 380, nombre: "Córdoba" },
  salta: { x: 280, y: 140, nombre: "Salta" },
  cuyano: { x: 200, y: 360, nombre: "Cuyo" },
  litoral: { x: 780, y: 300, nombre: "Litoral" },
} as const;

export type EtapaCongreso = {
  nombre: string;
  fecha: string;
  detalle: string;
};

export const ETAPAS_CONGRESO: EtapaCongreso[] = [
  {
    nombre: "Los diputados llegan",
    fecha: "Marzo — junio 1816",
    detalle:
      "Desde provincias lejanas, los representantes cruzan caminos inseguros hacia Tucumán. El Congreso se abre el 24 de marzo.",
  },
  {
    nombre: "Debates bajo techo de adobe",
    fecha: "Abril — junio 1816",
    detalle:
      "Monarquía incaica, república, forma de gobierno: se discute todo. Afuera, la guerra no espera.",
  },
  {
    nombre: "La firma del Acta",
    fecha: "9 de julio de 1816",
    detalle:
      "En la Casa Histórica se declara la Independencia de las Provincias Unidas. El papel cambia el mapa.",
  },
  {
    nombre: "La noticia se esparce",
    fecha: "Julio — agosto 1816",
    detalle:
      "Jinetes y mensajeros llevan el Acta al norte, al litoral y a Cuyo. La independencia deja de ser un rumor.",
  },
];

export const RUTAS_DIPUTADOS = [
  { d: "M720 420 C620 380 520 320 470 295", etapa: "0" },
  { d: "M580 380 C520 340 480 310 460 295", etapa: "0" },
  { d: "M280 140 C340 180 400 240 430 270", etapa: "0" },
  { d: "M200 360 C300 330 380 300 430 285", etapa: "0" },
  { d: "M780 300 C650 290 520 285 480 282", etapa: "0" },
] as const;

export const RUTAS_NOTICIA = [
  { d: "M450 280 C520 300 620 360 720 420", etapa: "3" },
  { d: "M450 280 C400 220 320 160 280 140", etapa: "3" },
  { d: "M450 280 C380 310 280 340 200 360", etapa: "3" },
] as const;

type BaseProps = { children?: React.ReactNode };

export function BaseMapaCongreso({ children }: BaseProps) {
  return (
    <svg
      className="h-full w-full"
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mapa ilustrado del Congreso de Tucumán"
    >
      <defs>
        <linearGradient id="grad-cong-fondo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e1208" />
          <stop offset="100%" stopColor="#080b10" />
        </linearGradient>
        <pattern id="patron-cong" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.35" fill="#ffffff" opacity="0.025" />
        </pattern>
        <filter id="glow-cong-oro" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width={VB.w} height={VB.h} fill="url(#grad-cong-fondo)" />
      <rect width={VB.w} height={VB.h} fill="url(#patron-cong)" />
      {/* Terreno / meseta */}
      <ellipse cx={450} cy={300} rx={280} ry={160} fill="#1a160c" opacity="0.6" />
      <ellipse cx={450} cy={300} rx={180} ry={100} fill="#141109" opacity="0.5" />
      {/* Casa Histórica */}
      <rect x={410} y={250} width={80} height={55} fill="#1a2230" stroke="#3a4a62" strokeWidth="1" />
      <path d="M405 250 L450 220 L495 250 Z" fill="#2a3547" />
      <rect x={430} y={270} width={18} height={28} rx="8" fill="#141b28" />
      <rect x={455} y={270} width={18} height={28} rx="8" fill="#141b28" />
      {children}
    </svg>
  );
}

export function HitoCongreso({
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

export { VB as VIEWBOX_CONGRESO };
