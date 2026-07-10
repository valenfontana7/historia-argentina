/**
 * Mapa ilustrado de la Batalla de Salta (1813).
 */

const VB = { w: 900, h: 560 };

export const ILU_SALTA = {
  tucuman: { x: 450, y: 380, nombre: "Tucumán" },
  salta: { x: 320, y: 140, nombre: "Salta" },
  campo: { x: 350, y: 200, nombre: "Campo de batalla" },
  tristan: { x: 400, y: 180, nombre: "Pío Tristán" },
} as const;

export type EtapaSalta = {
  nombre: string;
  fecha: string;
  detalle: string;
};

export const ETAPAS_SALTA: EtapaSalta[] = [
  {
    nombre: "Después de Tucumán",
    fecha: "Octubre 1812 — enero 1813",
    detalle:
      "Belgrano reorganiza el Ejército del Norte. La victoria de Tucumán abrió una ventana: ahora hay que rematar al enemigo en Salta.",
  },
  {
    nombre: "El avance al norte",
    fecha: "Febrero de 1813",
    detalle:
      "El ejército patriota sube hacia Salta. Tristán concentra las fuerzas realistas en las afueras de la ciudad.",
  },
  {
    nombre: "La batalla",
    fecha: "20 de febrero de 1813",
    detalle:
      "En el campo de Castañares, Belgrano enfrenta a Tristán. Es la primera vez que un ejército español capitula por completo en la guerra.",
  },
  {
    nombre: "La rendición total",
    fecha: "Febrero — marzo de 1813",
    detalle:
      "La noticia recorre el territorio. El norte, que parecía perdido un año antes, vuelve a ser patriota.",
  },
];

export const RUTA_AVANCE = "M450 380 C400 320 360 260 340 200";
export const RUTA_BATALLA = "M340 200 L380 190";
export const RUTA_VICTORIA = "M350 200 C300 160 280 140 320 120";

type BaseProps = { children?: React.ReactNode };

export function BaseMapaSalta({ children }: BaseProps) {
  return (
    <svg
      className="h-full w-full"
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mapa ilustrado de la batalla de Salta"
    >
      <defs>
        <linearGradient id="grad-sal-fondo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#140f08" />
          <stop offset="100%" stopColor="#080b10" />
        </linearGradient>
        <pattern id="patron-sal" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.35" fill="#ffffff" opacity="0.025" />
        </pattern>
        <filter id="glow-sal-celeste" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width={VB.w} height={VB.h} fill="url(#grad-sal-fondo)" />
      <rect width={VB.w} height={VB.h} fill="url(#patron-sal)" />
      <path
        d="M0 400 Q200 360 450 370 Q700 380 900 350 L900 560 L0 560 Z"
        fill="#1a1408"
        opacity="0.7"
      />
      <path
        d="M200 80 L350 60 L500 90 L650 70 L800 100 L900 80 L900 200 L200 200 Z"
        fill="#2a2018"
        opacity="0.4"
      />
      {children}
    </svg>
  );
}

export function HitoSalta({
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

export { VB as VIEWBOX_SALTA };
