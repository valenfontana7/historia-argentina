/**
 * Mapa ilustrado del cruce de los Andes (Cuyo → Chile).
 * Posiciones curadas para lectura visual: norte arriba, Chile a la izquierda.
 */

const VB = { w: 900, h: 560 };

export const ILU_CRUCE = {
  laRioja: { x: 728, y: 82, nombre: "La Rioja" },
  sanJuan: { x: 702, y: 162, nombre: "San Juan" },
  mendoza: { x: 718, y: 262, nombre: "Mendoza" },
  sanCarlos: { x: 682, y: 362, nombre: "San Carlos" },
  copiapo: { x: 162, y: 68, nombre: "Copiapó" },
  laSerena: { x: 142, y: 152, nombre: "La Serena" },
  sanFelipe: { x: 242, y: 252, nombre: "San Felipe" },
  losAndes: { x: 262, y: 272, nombre: "Los Andes" },
  sanGabriel: { x: 252, y: 292, nombre: "San Gabriel" },
  curico: { x: 192, y: 362, nombre: "Curicó" },
} as const;

export type RutaIlustradaCruce = {
  nombre: string;
  jefe: string;
  destino: string;
  detalle: string;
  principal: boolean;
  d: string;
  fin: [number, number];
};

export const RUTAS_ILU_CRUCE: RutaIlustradaCruce[] = [
  {
    nombre: "Ruta de Comecaballos",
    jefe: "Zelada y Dávila",
    destino: "Copiapó",
    detalle:
      "Desde Guandacol (La Rioja), 130 hombres cruzan el desierto de Atacama por Come-Caballos y ocupan Copiapó el 13 de febrero.",
    principal: false,
    d: "M728 82 C620 72 420 62 162 68",
    fin: [162, 68],
  },
  {
    nombre: "Ruta de Guana",
    jefe: "Juan Manuel Cabot",
    destino: "Coquimbo y La Serena",
    detalle:
      "140 milicianos salen de San Juan, cruzan el paso de Guana y toman el norte chileno el 12 de febrero.",
    principal: false,
    d: "M702 162 C520 148 320 152 142 152",
    fin: [142, 152],
  },
  {
    nombre: "Paso del Portillo",
    jefe: "José León Lemos",
    destino: "San Gabriel",
    detalle:
      "Partida de distracción desde Mendoza por el Portillo de Piuquenes, amagando sobre San Gabriel.",
    principal: false,
    d: "M718 262 C520 278 380 288 252 292",
    fin: [252, 292],
  },
  {
    nombre: "Paso del Planchón",
    jefe: "Ramón Freire",
    destino: "Curicó y Talca",
    detalle:
      "Desde San Carlos, Freire cruza el Planchón por el extremo sur para sublevar el centro-sur chileno.",
    principal: false,
    d: "M682 362 C480 368 320 365 192 362",
    fin: [192, 362],
  },
  {
    nombre: "Paso de Uspallata",
    jefe: "Juan Gregorio de Las Heras",
    destino: "Valle de Los Andes",
    detalle:
      "800 hombres con toda la artillería: cañones desarmados, a lomo de mula, pieza por pieza por Uspallata.",
    principal: false,
    d: "M718 262 C520 266 380 270 262 272",
    fin: [262, 272],
  },
  {
    nombre: "Paso de Los Patos",
    jefe: "San Martín · O'Higgins · Soler",
    destino: "San Felipe",
    detalle:
      "La columna principal: más de 3.000 hombres por el paso más alto. San Felipe el 8 de febrero; Chacabuco cuatro días después.",
    principal: true,
    d: "M718 262 C580 248 420 248 242 252",
    fin: [242, 252],
  },
];

type BaseProps = { children?: React.ReactNode };

export function BaseMapaCruce({ children }: BaseProps) {
  return (
    <svg
      className="h-full w-full"
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mapa ilustrado del cruce de los Andes"
    >
      <defs>
        <linearGradient id="grad-cruce-cord" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4d68" />
          <stop offset="100%" stopColor="#141b28" />
        </linearGradient>
        <linearGradient id="grad-cruce-cuyo" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#161e2a" />
          <stop offset="100%" stopColor="#0e141e" />
        </linearGradient>
        <linearGradient id="grad-cruce-chile" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#101620" />
          <stop offset="100%" stopColor="#0c1018" />
        </linearGradient>
        <pattern id="patron-grano-cruce" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.35" fill="#ffffff" opacity="0.025" />
        </pattern>
        <filter id="glow-cruce-oro" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width={VB.w} height={VB.h} fill="#060910" />
      <rect width={VB.w} height={VB.h} fill="url(#patron-grano-cruce)" />

      {/* Chile — valle central */}
      <path
        d="M0 0 L372 0 L372 560 L0 560 Z"
        fill="url(#grad-cruce-chile)"
      />
      {/* Cuyo — llanura oriental */}
      <path
        d="M372 0 L900 0 L900 560 L372 560 Z"
        fill="url(#grad-cruce-cuyo)"
      />

      {/* Costa chilena ondulada */}
      <path
        d="M372 32 C352 112 342 212 358 312 C365 392 370 472 372 528"
        fill="none"
        stroke="#1e3048"
        strokeWidth="2.5"
        opacity="0.45"
      />
      <path
        d="M372 32 C352 112 342 212 358 312"
        fill="none"
        stroke="#283848"
        strokeWidth="1"
        strokeDasharray="4 6"
        opacity="0.35"
      />

      {/* Desierto de Atacama — banda árida al norte */}
      <rect x="0" y="0" width="372" height="120" fill="#121018" opacity="0.55" />
      <text x="148" y="42" fill="#5a5048" fontSize="9" letterSpacing="4" opacity="0.75">
        DESIERTO DE ATACAMA
      </text>

      <text x="128" y="538" fill="#3a4860" fontSize="13" letterSpacing="5" opacity="0.85">
        CHILE
      </text>
      <text x="688" y="538" fill="#3a4860" fontSize="13" letterSpacing="5" opacity="0.85">
        CUYO
      </text>
      <text x="48" y="28" fill="#2a3548" fontSize="10" letterSpacing="3" opacity="0.7">
        PACÍFICO
      </text>

      {/* Cordillera — franja central dramática con nieve */}
      <g aria-hidden>
        <path
          d="M388 28 L398 140 L392 260 L405 380 L398 520"
          fill="none"
          stroke="#0a1018"
          strokeWidth="14"
          strokeLinecap="round"
          opacity="0.3"
        />
        {Array.from({ length: 18 }, (_, i) => {
          const cx = 392 + (i % 3) * 10;
          const cy = 28 + i * 28;
          const ancho = 22 + (i % 4) * 6;
          const alto = 20 + (i % 5) * 5;
          return (
            <polygon
              key={i}
              points={`${cx - ancho},${cy + alto} ${cx},${cy} ${cx + ancho},${cy + alto}`}
              fill="url(#grad-cruce-cord)"
              opacity={0.72 + (i % 3) * 0.08}
            />
          );
        })}
      </g>

      <text x="408" y="24" fill="#5a6a82" fontSize="10" letterSpacing="5" opacity="0.85">
        CORDILLERA DE LOS ANDES
      </text>

      {/* Marco decorativo */}
      <rect x="16" y="16" width={868} height={528} fill="none" stroke="#3a4558" strokeWidth="0.6" opacity="0.5" />
      <rect x="22" y="22" width={856} height={516} fill="none" stroke="#2a3548" strokeWidth="0.4" opacity="0.4" />

      {children}
    </svg>
  );
}

export function MarcadorCruce({
  x,
  y,
  nombre,
  lado,
}: {
  x: number;
  y: number;
  nombre: string;
  lado: "izq" | "der";
}) {
  return (
    <g>
      <circle cx={x} cy={y} r={10} fill="#c6a15b" opacity="0.06" />
      <circle cx={x} cy={y} r={5} fill="#0a0d14" stroke="#8a94a8" strokeWidth="1.2" />
      <circle cx={x} cy={y} r={2} fill="#aab4c8" />
      <text
        x={lado === "der" ? x + 12 : x - 12}
        y={y + 4}
        fill="#aab4c8"
        fontSize="12"
        textAnchor={lado === "der" ? "start" : "end"}
      >
        {nombre}
      </text>
    </g>
  );
}

export { VB as VIEWBOX_CRUCE };
