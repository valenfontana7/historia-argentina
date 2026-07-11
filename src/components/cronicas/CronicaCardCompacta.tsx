import Image from "next/image";
import Link from "next/link";
import { MiniSiluetaHero, gradientesHero } from "@/components/scrolly/HeroSiluetas";
import type { CronicaMeta } from "@/content/cronicas/registro";
import { obtenerImagenCronica } from "@/data/cronicas-imagenes";

type Props = {
  cronica: CronicaMeta;
  esMecenas?: boolean;
};

export function CronicaCardCompacta({ cronica, esMecenas = false }: Props) {
  const exclusiva = cronica.acceso !== "publico";
  const imagen = cronica.visual.imagenHero
    ? obtenerImagenCronica(cronica.visual.imagenHero)
    : undefined;
  const variante = cronica.visual.varianteHero;

  return (
    <Link
      href={`/cronicas/${cronica.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-sm border transition-colors ${
        exclusiva
          ? "border-oro/30 hover:border-oro/55"
          : "border-linea hover:border-oro/40"
      }`}
    >
      <div
        className="relative aspect-[16/10] overflow-hidden"
        style={{ background: gradientesHero[variante] }}
      >
        {imagen ? (
          <Image
            src={imagen.url}
            alt={imagen.alt}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover opacity-55 sepia-[0.3] transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <MiniSiluetaHero variante={variante} />
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-fondo via-fondo/30 to-transparent"
        />
        {exclusiva && (
          <span className="absolute right-3 top-3 rounded-full border border-oro/40 bg-fondo/80 px-2.5 py-0.5 text-[0.6rem] uppercase tracking-[0.18em] text-oro backdrop-blur-sm">
            Mecenas
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col bg-fondo-2 p-4 sm:p-5">
        <p className="text-[0.6rem] uppercase tracking-[0.2em] text-tinta-tenue">
          {cronica.kicker}
        </p>
        <h3 className="titulo-display mt-2 text-lg font-semibold leading-snug transition-colors group-hover:text-oro-claro sm:text-xl">
          {cronica.titulo}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-tinta-suave">
          {cronica.subtitulo}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.65rem] uppercase tracking-[0.16em] text-tinta-tenue">
          <span>{cronica.periodo}</span>
          <span>{cronica.duracion}</span>
        </div>
        <p className="mt-3 text-[0.65rem] uppercase tracking-[0.18em] text-oro transition-transform duration-300 group-hover:translate-x-1">
          {exclusiva
            ? esMecenas
              ? "Incluida →"
              : "Exclusiva →"
            : "Leer →"}
        </p>
      </div>
    </Link>
  );
}
