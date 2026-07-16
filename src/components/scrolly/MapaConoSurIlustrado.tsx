/**
 * Mapa ilustrado del cono sur para el Comparador de la crónica.
 * Coordenadas curadas a mano: fieles en dirección y relación, pero
 * compuestas para leerse como grabado de atlas antiguo, no como proyección GIS.
 */

const VB = { w: 720, h: 440 };

/** Posiciones ilustrativas (x, y): oeste ← | → este */
export const ILU = {
  lima: { x: 92, y: 48, nombre: "Lima" },
  huaqui: { x: 178, y: 82, nombre: "Huaqui" },
  vilcapugio: { x: 208, y: 122, nombre: "Vilcapugio" },
  ayohuma: { x: 242, y: 98, nombre: "Ayohuma" },
  salta: { x: 398, y: 118, nombre: "Salta" },
  mendoza: { x: 328, y: 218, nombre: "Mendoza" },
  santiago: { x: 238, y: 232, nombre: "Santiago" },
  buenosAires: { x: 562, y: 268, nombre: "Buenos Aires" },
} as const;

/** Rutas trazadas como ilustración editorial */
export const RUTAS_ILU = {
  planNorte:
    "M562 268 C520 228 468 168 398 118 C348 98 278 82 208 88 C188 84 178 82 92 48",
  planTierra: "M562 268 C488 258 408 242 328 218",
  planCruce: "M328 218 C298 222 268 228 238 232",
  planMar: "M238 232 C195 178 138 108 92 48",
} as const;

type BaseProps = { children?: React.ReactNode; className?: string };

/** Capas del mapa: océanos, territorios, cordillera, altiplano. */
export function BaseMapaConoSur({ children, className = "" }: BaseProps) {
  return (
    <svg
      className={`h-full w-full ${className}`}
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mapa ilustrado del cono sur americano"
    >
      <defs>
        <linearGradient id="grad-pacifico" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#050810" />
          <stop offset="100%" stopColor="#0c1220" />
        </linearGradient>
        <linearGradient id="grad-atlantico" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0a0e16" />
          <stop offset="100%" stopColor="#101828" />
        </linearGradient>
        <linearGradient id="grad-tierra" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2230" />
          <stop offset="100%" stopColor="#0e141e" />
        </linearGradient>
        <linearGradient id="grad-cordillera" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4a62" />
          <stop offset="55%" stopColor="#222c3c" />
          <stop offset="100%" stopColor="#141b28" />
        </linearGradient>
        <linearGradient id="grad-altiplano" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#181e28" />
          <stop offset="100%" stopColor="#101620" />
        </linearGradient>

        {/* Trama de papel / grabado */}
        <pattern id="patron-grano" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.35" fill="#ffffff" opacity="0.025" />
          <circle cx="3" cy="3" r="0.25" fill="#ffffff" opacity="0.018" />
        </pattern>
        <pattern id="patron-rayado" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#ffffff" strokeWidth="0.4" opacity="0.04" />
        </pattern>
        <pattern id="patron-costa" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M0 8 L4 0 L8 8" fill="none" stroke="#2a3848" strokeWidth="0.5" opacity="0.35" />
        </pattern>

        <filter id="glow-oro" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-carmesi" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="sombra-suave" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Fondo mar profundo */}
      <rect width={VB.w} height={VB.h} fill="#060910" />
      <rect width={VB.w} height={VB.h} fill="url(#patron-grano)" />

      {/* Océanos con profundidad */}
      <rect x="0" y="0" width="210" height={VB.h} fill="url(#grad-pacifico)" />
      <rect x="500" y="0" width="220" height={VB.h} fill="url(#grad-atlantico)" />

      <OlasMar x0={0} ancho={210} />
      <OlasMar x0={500} ancho={220} invertir />

      <text x="38" y="36" fill="#3a4860" fontSize="10" letterSpacing="5" opacity="0.85">
        PACÍFICO
      </text>
      <text x="578" y="36" fill="#3a4860" fontSize="10" letterSpacing="5" opacity="0.85">
        ATLÁNTICO
      </text>

      {/* Marco decorativo de atlas */}
      <MarcoAtlas />

      {/* Altiplano: meseta con relieve sugerido */}
      <ellipse cx="200" cy="98" rx="128" ry="62" fill="url(#grad-altiplano)" opacity="0.92" />
      <ellipse cx="200" cy="98" rx="128" ry="62" fill="url(#patron-rayado)" opacity="0.5" />
      <text x="200" y="92" fill="#4a5868" fontSize="9" letterSpacing="4" textAnchor="middle" opacity="0.9">
        ALTO PERÚ
      </text>

      {/* Chile: franja costera reconocible */}
      <path
        id="silueta-chile"
        d="M108 28 C138 26 168 32 198 48 C212 88 218 138 228 188 C234 238 242 288 252 338 C252 368 228 382 188 388 C148 392 118 388 98 378 C92 318 88 248 92 178 C96 108 100 58 108 28 Z"
        fill="url(#grad-tierra)"
        stroke="#283848"
        strokeWidth="1.2"
      />
      <path
        d="M108 28 C138 26 168 32 198 48 C212 88 218 138 228 188 C234 238 242 288 252 338"
        fill="none"
        stroke="url(#patron-costa)"
        strokeWidth="6"
        opacity="0.4"
      />

      {/* Argentina: silueta compuesta para lectura inmediata */}
      <path
        id="silueta-argentina"
        d="M218 32 C268 28 318 38 378 48 C448 58 518 78 568 108 C598 138 608 178 602 228 C592 278 568 318 532 352 C488 388 428 408 358 412 C298 414 252 398 228 362 C208 318 198 268 202 218 C206 168 212 118 218 72 Z"
        fill="url(#grad-tierra)"
        stroke="#283848"
        strokeWidth="1.2"
        filter="url(#sombra-suave)"
      />
      <path
        d="M218 32 C268 28 318 38 378 48 C448 58 518 78 568 108 C598 138 608 178 602 228"
        fill="none"
        stroke="#1e3048"
        strokeWidth="1"
        strokeDasharray="3 5"
        opacity="0.45"
      />

      {/* Mesopotamia: protuberancia noreste */}
      <path
        d="M568 108 C592 118 612 138 618 168 C612 188 588 198 562 188 C548 168 558 128 568 108 Z"
        fill="#161e2a"
        stroke="#283848"
        strokeWidth="0.8"
        opacity="0.85"
      />

      {/* Río de la Plata: ancla visual de Buenos Aires */}
      <path
        d="M532 258 C552 268 572 282 598 302 C608 318 612 332 602 342"
        fill="none"
        stroke="#2a4868"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M518 272 C538 278 552 288 568 298"
        fill="none"
        stroke="#1e3858"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* Cordillera: protagonista visual */}
      <Cordillera />

      {/* Etiquetas regionales */}
      <text x="268" y="398" fill="#3a4860" fontSize="9" letterSpacing="4" opacity="0.75">
        PATAGONIA
      </text>
      <text x="488" y="168" fill="#3a4860" fontSize="9" letterSpacing="4" opacity="0.75">
        PAMPA
      </text>
      <text x="148" y="368" fill="#3a4860" fontSize="8" letterSpacing="3" opacity="0.6">
        CHILE
      </text>

      {children}
    </svg>
  );
}

/** Olas estilizadas en los márgenes oceánicos. */
function OlasMar({ x0, ancho, invertir = false }: { x0: number; ancho: number; invertir?: boolean }) {
  return (
    <g opacity="0.45">
      {Array.from({ length: 9 }, (_, i) => {
        const y = 48 + i * 44;
        const fase = invertir ? -1 : 1;
        return (
          <path
            key={i}
            d={`M${x0} ${y} Q${x0 + fase * 28} ${y - 8} ${x0 + ancho * 0.4} ${y} T${x0 + ancho * 0.85} ${y}`}
            fill="none"
            stroke="#1a2840"
            strokeWidth="0.7"
          />
        );
      })}
    </g>
  );
}

/** Borde doble con esquinas: estética de mapa antiguo. */
function MarcoAtlas() {
  const m = 18;
  const w = VB.w - m * 2;
  const h = VB.h - m * 2;
  return (
    <g opacity="0.55" aria-hidden>
      <rect x={m} y={m} width={w} height={h} fill="none" stroke="#3a4558" strokeWidth="0.6" />
      <rect x={m + 5} y={m + 5} width={w - 10} height={h - 10} fill="none" stroke="#2a3548" strokeWidth="0.4" />
      {[
        [m, m],
        [m + w, m],
        [m, m + h],
        [m + w, m + h],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={3} fill="none" stroke="#4a5568" strokeWidth="0.5" />
      ))}
    </g>
  );
}

/** Cadena montañosa estilizada a lo largo del límite Chile–Argentina. */
function Cordillera() {
  const picos = [
    [252, 48, 26, 48],
    [268, 88, 32, 56],
    [258, 132, 36, 62],
    [272, 178, 34, 58],
    [262, 222, 38, 64],
    [278, 268, 32, 54],
    [268, 312, 36, 52],
    [258, 352, 30, 46],
  ] as const;

  return (
    <g aria-hidden>
      {/* Sombra base de la cordillera */}
      <path
        d="M248 38 L262 120 L258 195 L272 280 L265 365"
        fill="none"
        stroke="#0a1018"
        strokeWidth="12"
        strokeLinecap="round"
        opacity="0.35"
      />
      {picos.map(([cx, cy, ancho, alto], i) => (
        <polygon
          key={i}
          points={`${cx - ancho},${cy + alto} ${cx},${cy} ${cx + ancho},${cy + alto}`}
          fill="url(#grad-cordillera)"
          opacity={0.78 + (i % 3) * 0.06}
        />
      ))}
      {/* Nieve en cumbres */}
      {picos.slice(0, 5).map(([cx, cy, ancho], i) => (
        <path
          key={`n-${i}`}
          d={`M${cx - ancho * 0.35},${cy + 8} L${cx},${cy + 2} L${cx + ancho * 0.35},${cy + 8}`}
          fill="#5a6a80"
          opacity="0.35"
        />
      ))}
      <text x="292" y="168" fill="#5a6a82" fontSize="8" letterSpacing="5" transform="rotate(82 292 168)">
        ANDES
      </text>
    </g>
  );
}

type MarcadorProps = {
  x: number;
  y: number;
  nombre: string;
  color?: string;
  etiqueta?: "izq" | "der" | "arriba" | "abajo";
  /** Posición absoluta de la etiqueta; dibuja línea guía desde el punto. */
  etiquetaX?: number;
  etiquetaY?: number;
};

/** Ciudad: punto luminoso + anillo + etiqueta. */
export function MarcadorCiudad({
  x,
  y,
  nombre,
  color = "#c8d0e0",
  etiqueta = "der",
  etiquetaX,
  etiquetaY,
}: MarcadorProps) {
  const offsets = {
    izq: { lx: x - 14, ly: y + 4, anchor: "end" as const },
    der: { lx: x + 14, ly: y + 4, anchor: "start" as const },
    arriba: { lx: x, ly: y - 12, anchor: "middle" as const },
    abajo: { lx: x, ly: y + 18, anchor: "middle" as const },
  };
  const o =
    etiquetaX !== undefined && etiquetaY !== undefined
      ? {
          lx: etiquetaX,
          ly: etiquetaY,
          anchor:
            Math.abs(etiquetaX - x) >= Math.abs(etiquetaY - y)
              ? etiquetaX < x
                ? ("end" as const)
                : ("start" as const)
              : ("middle" as const),
        }
      : offsets[etiqueta];
  const conGuia = etiquetaX !== undefined && etiquetaY !== undefined;

  return (
    <g>
      {conGuia && (
        <line
          x1={x}
          y1={y}
          x2={o.lx}
          y2={o.ly - 4}
          stroke={color}
          strokeWidth={0.8}
          opacity={0.45}
          strokeDasharray="2 3"
        />
      )}
      <circle cx={x} cy={y} r={12} fill={color} opacity="0.06" />
      <circle cx={x} cy={y} r={6} fill="#0a0d14" stroke={color} strokeWidth="1.5" />
      <circle cx={x} cy={y} r={2.2} fill={color} />
      <text x={o.lx} y={o.ly} fill={color} fontSize="12" fontWeight="500" textAnchor={o.anchor}>
        {nombre}
      </text>
    </g>
  );
}

type BatallaProps = {
  x: number;
  y: number;
  anio: string;
  nombre: string;
  lx: number;
  ly: number;
};

/** Batalla: cruz sobre el terreno + cartela con línea guía. */
export function MarcadorBatalla({ x, y, anio, nombre, lx, ly }: BatallaProps) {
  const cartW = 112;
  const cartH = 36;
  const anchorX = lx + cartW / 2;
  const anchorY = ly + cartH / 2;

  return (
    <g>
      <line x1={x} y1={y} x2={anchorX} y2={anchorY} stroke="#6e4038" strokeWidth="0.8" opacity="0.55" strokeDasharray="2 3" />
      <circle cx={x} cy={y} r={9} fill="#b04a38" opacity="0.12" />
      <text x={x} y={y + 5} fill="var(--carmesi)" fontSize="15" textAnchor="middle" fontWeight="bold">
        ✕
      </text>
      <rect
        x={lx}
        y={ly}
        width={cartW}
        height={cartH}
        rx="2"
        fill="#141109"
        stroke="#6e4038"
        strokeWidth="0.8"
        opacity="0.96"
        filter="url(#sombra-suave)"
      />
      <text x={lx + 8} y={ly + 14} fill="#8a6258" fontSize="8" letterSpacing="1.5">
        {anio}
      </text>
      <text x={lx + 8} y={ly + 28} fill="#c89080" fontSize="11" fontWeight="500">
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

export function RutaIlustrada({ d, color, grosor = 2.5, punteada = false, glow }: RutaProps) {
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

/** Brújula decorativa de atlas antiguo */
export function BrújulaDecorativa() {
  return (
    <g transform="translate(638, 358)" opacity="0.4">
      <circle r={24} fill="#0a0d14" stroke="#3a4558" strokeWidth="0.8" />
      <circle r={20} fill="none" stroke="#2a3548" strokeWidth="0.4" />
      <text y={-10} fill="#5a6478" fontSize="8" textAnchor="middle" letterSpacing="1">
        N
      </text>
      <text y={16} fill="#4a5568" fontSize="7" textAnchor="middle">
        S
      </text>
      <path d="M0 -16 L3.5 0 L0 12 L-3.5 0 Z" fill="#5a6478" />
      <path d="M0 -16 L1.5 0 L0 12 L-1.5 0 Z" fill="#8a94a8" opacity="0.5" />
    </g>
  );
}

export { VB as VIEWBOX_CONO_SUR };
