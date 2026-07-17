import Image from "next/image";
import Link from "next/link";
import type { ItemRiel } from "@/lib/exploracion/rieles-home";

type Props = {
  item: ItemRiel;
};

/** Nodo del universo como pieza visual dominante (sin card institucional). */
export function TarjetaUniverso({ item }: Props) {
  return (
    <Link
      href={item.href}
      prefetch
      className="group relative block h-[260px] w-[min(78vw,280px)] shrink-0 snap-start overflow-hidden rounded-sm border border-linea bg-fondo-3 sm:h-[300px] sm:w-[300px]"
    >
      {item.imagen ? (
        <Image
          src={item.imagen}
          alt=""
          fill
          unoptimized
          sizes="300px"
          className="object-cover object-top opacity-80 sepia-[0.12] transition-transform duration-700 ease-out group-hover:scale-105"
          aria-hidden
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-fondo-3 via-fondo-2 to-fondo" />
      )}
      {/* Imagen visible arriba; solo el tercio inferior se oscurece para el texto */}
      <div className="absolute inset-0 bg-linear-to-t from-fondo via-fondo/55 to-transparent to-55%" />
      <div className="absolute inset-x-0 bottom-0 h-[45%] bg-linear-to-t from-fondo from-30% via-fondo/85 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5">
        {(item.kicker || item.meta) && (
          <p className="text-[0.55rem] uppercase tracking-[0.2em] text-oro">
            {[item.kicker, item.meta].filter(Boolean).join(" · ")}
          </p>
        )}
        <h3 className="titulo-display mt-1.5 text-lg font-semibold leading-snug text-tinta transition-colors group-hover:text-oro-claro sm:text-xl">
          {item.titulo}
        </h3>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#d8cfbc] sm:text-sm">
          {item.teaser}
        </p>
      </div>
    </Link>
  );
}
