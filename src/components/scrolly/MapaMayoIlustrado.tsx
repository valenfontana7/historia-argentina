/**
 * Mapa ilustrado de la Plaza de Mayo y el casco colonial (mayo de 1810).
 * Zoom sobre el Fuerte, el Cabildo y las calles por donde convergieron
 * las milicias entre el 22 y el 25 de mayo.
 */

const VB = { w: 900, h: 560 };

export const ILU_MAYO = {
  fuerte: { x: 712, y: 278, nombre: "Fuerte" },
  plaza: { x: 684, y: 278, nombre: "Plaza de la Victoria" },
  cabildo: { x: 648, y: 318, nombre: "Cabildo" },
  recova: { x: 612, y: 352, nombre: "Recova" },
  jaboneria: { x: 318, y: 388, nombre: "Jabonería de Vieytes" },
  anonima: { x: 268, y: 198, nombre: "Club de la Anónima" },
  patricios: { x: 412, y: 162, nombre: "Cuartel Patricios" },
  arribeños: { x: 198, y: 248, nombre: "Arribeños" },
} as const;

export type EtapaMayo = {
  nombre: string;
  fecha: string;
  detalle: string;
};

export const ETAPAS_MAYO: EtapaMayo[] = [
  {
    nombre: "La noticia que abrió la grieta",
    fecha: "18 de mayo de 1810",
    detalle:
      "Un bergantín inglés trae la confirmación: Fernando VII está preso y el Consejo de Regencia de Cádiz gobierna en su nombre. Sin rey reconocido, el virrey Cisneros pierde el argumento que lo sostenía. En tertulias y pasquines empieza a circular otra pregunta: ¿quién manda en el Plata?",
  },
  {
    nombre: "Doscientos vecinos con voz",
    fecha: "22 de mayo · Cabildo abierto",
    detalle:
      "El Cabildo convoca a unos doscientos vecinos notables. No es plebiscito universal: es la élite porteña, comerciantes criollos y oficiales de milicias. Pero entre ellos están los mismos Patricios que en 1807 defendieron las azoteas. El cabildo deja de ser consejo: se vuelve tribunal.",
  },
  {
    nombre: "La Plaza se llena",
    fecha: "23 de mayo",
    detalle:
      "Mientras el Cabildo debate, la Plaza se llena de uniformes. Saavedra concentra al regimiento de Patricios; otros cuerpos ocupan las esquinas. No hay órdenes de disparar: la presión es física. Cisneros entiende que cualquier firma sin la Plaza detrás no vale nada.",
  },
  {
    nombre: "La Junta que no convenció",
    fecha: "24 de mayo · noche",
    detalle:
      "Se proclama una Junta con Cisneros a la cabeza —un arreglo que salva las formas y mata la revolución. La Plaza lo rechaza a gritos. Pasquines, peticiones, más milicias. La noche del 24 al 25 la ciudad no duerme: el poder está en la calle, no en el acta.",
  },
  {
    nombre: "El mediodía del 25",
    fecha: "25 de mayo · mañana",
    detalle:
      "Nuevas sesiones, nuevas listas. Moreno, Belgrano, Castelli, Matheu, Alberti, Paso, Larrea, Azcuénaga y Saavedra como presidente. Nueve vocales. El nombre cambia —Primera Junta— y el mensaje también: el virreinato ya no tiene dueño legítimo.",
  },
  {
    nombre: "El Fuerte cambia de manos",
    fecha: "25 de mayo · mediodía",
    detalle:
      "La Primera Junta entra al Fuerte. Cisneros queda arrestado en casa. En cuarenta y ocho horas, una ciudad sin flota ni fábrica de cañones hizo lo que tres ejércitos británicos no pudieron: decidir quién gobierna. El resto del continente tardará años en enterarse; Buenos Aires ya lo sabe.",
  },
];

/** Rutas de convergencia de milicias hacia la Plaza (etapas 2–4) */
export const RUTAS_MILICIAS = [
  { d: "M412 162 C468 178 548 208 612 248", etapa: "2" },
  { d: "M198 248 C312 258 468 268 612 278", etapa: "2" },
  { d: "M318 388 C402 358 512 328 612 308", etapa: "3" },
  { d: "M268 198 C368 218 488 248 612 268", etapa: "3" },
  { d: "M412 162 C512 198 612 238 684 268", etapa: "4" },
  { d: "M198 248 C368 262 528 272 648 282", etapa: "4" },
] as const;

/** Onda de pasquines / rumor (etapa 0) */
export const RUTA_RUMOR = "M318 388 C402 328 488 298 648 318";

/** Entrada simbólica al Fuerte (etapa 5) */
export const RUTA_FUERTE = "M648 318 C672 302 696 288 712 278";

type BaseProps = { children?: React.ReactNode };

export function BaseMapaMayo({ children }: BaseProps) {
  const grid = { x0: 168, x1: 732, y0: 98, y1: 472, paso: 44 };
  const verticales: number[] = [];
  for (let x = grid.x0; x <= grid.x1; x += grid.paso) verticales.push(x);
  const horizontales: number[] = [];
  for (let y = grid.y0; y <= grid.y1; y += grid.paso) horizontales.push(y);

  return (
    <svg
      className="h-full w-full"
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mapa ilustrado de la Revolución de Mayo en Buenos Aires, 1810"
    >
      <defs>
        <linearGradient id="grad-mayo-rio" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0c1626" />
          <stop offset="100%" stopColor="#101e36" />
        </linearGradient>
        <pattern id="patron-grano-mayo" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.35" fill="#ffffff" opacity="0.025" />
        </pattern>
        <filter id="glow-mayo-oro" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-mayo-celeste" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-mayo-carmesi" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width={VB.w} height={VB.h} fill="#080b10" />
      <rect width={VB.w} height={VB.h} fill="url(#patron-grano-mayo)" />

      <path
        d={`M748 0 C738 140 742 300 736 420 C734 470 738 520 744 560 L900 560 L900 0 Z`}
        fill="url(#grad-mayo-rio)"
      />
      {Array.from({ length: 5 }, (_, i) => (
        <path
          key={i}
          d={`M${772 + i * 20} 30 C${762 + i * 20} 200 ${770 + i * 20} 380 ${764 + i * 20} 540`}
          fill="none"
          stroke="#1c3050"
          strokeWidth="0.7"
          opacity="0.5"
        />
      ))}
      <text
        x="822"
        y="270"
        fill="#2e4666"
        fontSize="11"
        letterSpacing="6"
        textAnchor="middle"
        transform="rotate(90 822 270)"
        opacity="0.9"
      >
        RÍO DE LA PLATA
      </text>

      <g opacity="0.9">
        {verticales.map((x) => (
          <line key={`v-${x}`} x1={x} y1={grid.y0} x2={x} y2={grid.y1} stroke="#1c2534" strokeWidth="1" />
        ))}
        {horizontales.map((y) => (
          <line key={`h-${y}`} x1={grid.x0} y1={y} x2={grid.x1} y2={y} stroke="#1c2534" strokeWidth="1" />
        ))}
        {verticales.slice(0, -1).map((x, i) =>
          horizontales.slice(0, -1).map((y, j) =>
            (i + j) % 4 === 0 ? (
              <rect
                key={`m-${x}-${y}`}
                x={x + 5}
                y={y + 5}
                width={grid.paso - 10}
                height={grid.paso - 10}
                fill="#121826"
                opacity="0.5"
              />
            ) : null,
          ),
        )}
      </g>

      {/* Plaza y edificios clave */}
      <rect x={662} y={258} width={48} height={40} fill="#0a0e16" stroke="#3a4a62" strokeWidth="1" />
      <rect x={628} y={298} width={52} height={36} fill="#141c28" stroke="#3a4a62" strokeWidth="0.9" rx="2" />
      <rect x={596} y={338} width={40} height={28} fill="#121a26" stroke="#2e3d52" strokeWidth="0.8" />
      <rect x={708} y={262} width={18} height={32} fill="#1a2434" stroke="var(--oro)" strokeWidth="1" opacity="0.9" />

      <text x="384" y="62" fill="#3a4860" fontSize="10" letterSpacing="5" opacity="0.85">
        BUENOS AIRES · MAYO DE 1810
      </text>
      <text x="386" y="516" fill="#2e3d52" fontSize="8" letterSpacing="3" opacity="0.8">
        48 HORAS · DEL CABILDO AL FUERTE
      </text>

      <g opacity="0.5" aria-hidden>
        <rect x="16" y="16" width={VB.w - 32} height={VB.h - 32} fill="none" stroke="#3a4558" strokeWidth="0.6" />
        <rect x="22" y="22" width={VB.w - 44} height={VB.h - 44} fill="none" stroke="#2a3548" strokeWidth="0.4" />
      </g>

      {children}
    </svg>
  );
}

export function HitoMayo({
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
    izq: { lx: x - 12, ly: y + 4, anchor: "end" as const },
    der: { lx: x + 12, ly: y + 4, anchor: "start" as const },
    arriba: { lx: x, ly: y - 11, anchor: "middle" as const },
    abajo: { lx: x, ly: y + 17, anchor: "middle" as const },
  };
  const o = offsets[lado];
  return (
    <g>
      <circle cx={x} cy={y} r={4.5} fill="#0a0d14" stroke={color} strokeWidth="1.2" />
      <circle cx={x} cy={y} r={1.8} fill={color} />
      <text x={o.lx} y={o.ly} fill={color} fontSize="11" fontWeight="500" textAnchor={o.anchor}>
        {nombre}
      </text>
    </g>
  );
}

export { VB as VIEWBOX_MAYO };
