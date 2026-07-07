/**
 * Mapa ilustrado del Río de la Plata para la crónica de las Invasiones Inglesas.
 * Composición editorial: el estuario como protagonista, las dos orillas
 * enfrentadas y el océano por donde llegó la flota.
 */

const VB = { w: 720, h: 440 };

/** Posiciones ilustrativas — oeste ← | → este */
export const ILU_PLATA = {
  buenosAires: { x: 152, y: 232, nombre: "Buenos Aires" },
  lasConchas: { x: 118, y: 192, nombre: "Las Conchas" },
  quilmes: { x: 218, y: 266, nombre: "Quilmes" },
  ensenada: { x: 295, y: 302, nombre: "Ensenada" },
  colonia: { x: 258, y: 146, nombre: "Colonia" },
  montevideo: { x: 502, y: 146, nombre: "Montevideo" },
} as const;

/** Rutas trazadas como ilustración editorial */
export const RUTAS_PLATA = {
  /** 1806: la flota de Popham remonta el estuario y desembarca en Quilmes */
  invasionMar: "M695 252 C600 252 420 258 218 266",
  /** 1806: de Quilmes a la Plaza Mayor en tres días */
  invasionTierra: "M218 266 C192 254 168 242 152 232",
  /** 1806: Sobremonte abandona la capital rumbo a Córdoba */
  huidaVirrey: "M152 232 C112 244 72 252 30 258",
  /** Reconquista: Liniers junta tropas en Montevideo y cruza a Las Conchas */
  reconquistaRio: "M502 146 C405 122 322 128 258 146 C198 160 148 172 118 192",
  /** Reconquista: de Las Conchas a la ciudad */
  reconquistaTierra: "M118 192 C128 206 140 220 152 232",
} as const;

type BaseProps = { children?: React.ReactNode; className?: string };

/** Capas del mapa: las dos orillas, el estuario y el océano. */
export function BaseMapaPlata({ children, className = "" }: BaseProps) {
  return (
    <svg
      className={`h-full w-full ${className}`}
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mapa ilustrado del Río de la Plata"
    >
      <defs>
        <linearGradient id="grad-plata-rio" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor="#0a1220" />
          <stop offset="100%" stopColor="#0e1a30" />
        </linearGradient>
        <linearGradient id="grad-plata-tierra" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2230" />
          <stop offset="100%" stopColor="#0e141e" />
        </linearGradient>
        <pattern id="patron-grano-plata" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.35" fill="#ffffff" opacity="0.025" />
          <circle cx="3" cy="3" r="0.25" fill="#ffffff" opacity="0.018" />
        </pattern>
        <filter id="glow-plata-oro" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-plata-carmesi" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="sombra-plata" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Estuario de fondo */}
      <rect width={VB.w} height={VB.h} fill="url(#grad-plata-rio)" />
      <rect width={VB.w} height={VB.h} fill="url(#patron-grano-plata)" />

      {/* Líneas de corriente del río */}
      {Array.from({ length: 7 }, (_, i) => (
        <path
          key={i}
          d={`M${60 + i * 30} ${175 + i * 14} C${240 + i * 20} ${168 + i * 16} ${440 + i * 20} ${180 + i * 18} ${700} ${190 + i * 22}`}
          fill="none"
          stroke="#1a2c48"
          strokeWidth="0.7"
          opacity="0.45"
        />
      ))}

      {/* Banda Oriental — orilla norte */}
      <path
        d="M0 0 L720 0 L720 118 C640 128 560 132 502 140 C420 118 330 124 258 140 C190 152 130 166 88 178 C60 172 30 160 0 148 Z"
        fill="url(#grad-plata-tierra)"
        stroke="#283848"
        strokeWidth="1.2"
        filter="url(#sombra-plata)"
      />

      {/* Provincia de Buenos Aires — orilla sur */}
      <path
        d="M0 262 C40 252 90 240 118 228 C138 220 148 228 152 240 C176 252 200 262 218 272 C258 288 290 300 308 312 C348 342 388 380 420 440 L0 440 Z"
        fill="url(#grad-plata-tierra)"
        stroke="#283848"
        strokeWidth="1.2"
        filter="url(#sombra-plata)"
      />

      {/* Océano al este */}
      <text x="590" y="392" fill="#3a4860" fontSize="10" letterSpacing="4" opacity="0.85">
        ATLÁNTICO
      </text>
      {Array.from({ length: 5 }, (_, i) => (
        <path
          key={`o-${i}`}
          d={`M${560 + i * 8} ${340 + i * 16} Q${600 + i * 8} ${332 + i * 16} ${640 + i * 8} ${340 + i * 16} T${710} ${340 + i * 16}`}
          fill="none"
          stroke="#1a2840"
          strokeWidth="0.7"
          opacity="0.5"
        />
      ))}

      {/* Etiquetas regionales */}
      <text x="330" y="62" fill="#3a4860" fontSize="10" letterSpacing="5" opacity="0.8">
        BANDA ORIENTAL
      </text>
      <text x="90" y="392" fill="#3a4860" fontSize="10" letterSpacing="5" opacity="0.8">
        PAMPA
      </text>
      <text
        x="360"
        y="225"
        fill="#2e405e"
        fontSize="13"
        letterSpacing="7"
        textAnchor="middle"
        opacity="0.9"
        transform="rotate(4 360 225)"
      >
        RÍO DE LA PLATA
      </text>

      {/* Marco decorativo de atlas */}
      <g opacity="0.55" aria-hidden>
        <rect x="18" y="18" width={VB.w - 36} height={VB.h - 36} fill="none" stroke="#3a4558" strokeWidth="0.6" />
        <rect x="23" y="23" width={VB.w - 46} height={VB.h - 46} fill="none" stroke="#2a3548" strokeWidth="0.4" />
      </g>

      {children}
    </svg>
  );
}

type MarcadorProps = {
  x: number;
  y: number;
  nombre: string;
  color?: string;
  etiqueta?: "izq" | "der" | "arriba" | "abajo";
};

export function MarcadorPlata({
  x,
  y,
  nombre,
  color = "#c8d0e0",
  etiqueta = "der",
}: MarcadorProps) {
  const offsets = {
    izq: { lx: x - 13, ly: y + 4, anchor: "end" as const },
    der: { lx: x + 13, ly: y + 4, anchor: "start" as const },
    arriba: { lx: x, ly: y - 12, anchor: "middle" as const },
    abajo: { lx: x, ly: y + 18, anchor: "middle" as const },
  };
  const o = offsets[etiqueta];

  return (
    <g>
      <circle cx={x} cy={y} r={11} fill={color} opacity="0.07" />
      <circle cx={x} cy={y} r={5.5} fill="#0a0d14" stroke={color} strokeWidth="1.5" />
      <circle cx={x} cy={y} r={2} fill={color} />
      <text x={o.lx} y={o.ly} fill={color} fontSize="12" fontWeight="500" textAnchor={o.anchor}>
        {nombre}
      </text>
    </g>
  );
}

type RutaProps = {
  d: string;
  color: string;
  grosor?: number;
  punteada?: boolean;
  glow?: string;
};

export function RutaPlata({ d, color, grosor = 2.5, punteada = false, glow }: RutaProps) {
  return (
    <g filter={glow}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={grosor + 5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.1"
      />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={grosor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={punteada ? "8 6" : undefined}
      />
    </g>
  );
}

/** Velero estilizado — la flota invasora o los transportes de la Reconquista. */
export function Velero({ x, y, color = "#8fb8d8" }: { x: number; y: number; color?: string }) {
  return (
    <g transform={`translate(${x}, ${y})`} opacity="0.85">
      <path d="M-8 6 L8 6 L5 10 L-5 10 Z" fill={color} opacity="0.7" />
      <line x1="0" y1="6" x2="0" y2="-10" stroke={color} strokeWidth="1" />
      <path d="M0 -10 L7 2 L0 2 Z" fill={color} opacity="0.55" />
      <path d="M0 -8 L-5 1 L0 1 Z" fill={color} opacity="0.4" />
    </g>
  );
}

export { VB as VIEWBOX_PLATA };
