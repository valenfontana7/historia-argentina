import type { ImagenPersonaje } from "@/data/personajes-imagenes";
import { RetratoFoto } from "@/components/ui/RetratoFoto";

const paletas = {
  colonia: "from-[#3d2f1e] via-[#241c10] to-[#12100a]",
  independencia: "from-[#1e3a52] via-[#152738] to-[#0b1420]",
  organizacion: "from-[#4a2420] via-[#2e1613] to-[#160b09]",
  moderna: "from-[#2e3d2a] via-[#1d271a] to-[#0e130d]",
  contemporanea: "from-[#41304f] via-[#281d31] to-[#141019]",
} as const;

export type Epoca = keyof typeof paletas;

type RetratoProps = {
  nombre: string;
  epoca: Epoca;
  anios: string;
  imagen?: ImagenPersonaje;
  className?: string;
};

function iniciales(nombre: string): string {
  const partes = nombre
    .split(" ")
    .filter((p) => p.length > 3 || /^[A-ZÁÉÍÓÚ]/.test(p));
  const primera = partes[0]?.[0] ?? "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return `${primera}${ultima}`.toUpperCase();
}

function RetratoMonograma({
  nombre,
  epoca,
  anios,
  className,
}: Omit<RetratoProps, "imagen">) {
  return (
    <div
      className={`relative flex aspect-[3/4] flex-col items-center justify-center overflow-hidden rounded-sm border border-linea bg-gradient-to-b ${paletas[epoca]} ${className}`}
    >
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full opacity-[0.12]"
        viewBox="0 0 100 133"
        preserveAspectRatio="xMidYMid slice"
      >
        {Array.from({ length: 24 }, (_, i) => {
          const angulo = (i / 24) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={50}
              y1={62}
              x2={50 + Math.cos(angulo) * 90}
              y2={62 + Math.sin(angulo) * 90}
              stroke="var(--oro)"
              strokeWidth={0.4}
            />
          );
        })}
        <circle cx={50} cy={62} r={26} fill="none" stroke="var(--oro)" strokeWidth={0.6} />
        <circle cx={50} cy={62} r={30} fill="none" stroke="var(--oro)" strokeWidth={0.3} />
      </svg>
      <span className="titulo-display relative text-6xl font-semibold text-oro-claro/90">
        {iniciales(nombre)}
      </span>
      <span className="relative mt-3 text-[0.6rem] uppercase tracking-[0.3em] text-tinta-suave">
        {anios}
      </span>
    </div>
  );
}

export function Retrato({ nombre, epoca, anios, imagen, className = "" }: RetratoProps) {
  const monograma = (
    <RetratoMonograma
      nombre={nombre}
      epoca={epoca}
      anios={anios}
      className={className}
    />
  );

  if (!imagen) {
    return monograma;
  }

  return (
    <RetratoFoto
      nombre={nombre}
      epoca={epoca}
      anios={anios}
      imagen={imagen}
      className={className}
      fallback={monograma}
    />
  );
}
