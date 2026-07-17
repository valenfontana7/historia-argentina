"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { EtiquetaCta } from "@/components/ui/FlechaCta";
import { Reveal } from "@/components/ui/Reveal";
import { obtenerImagenCronica } from "@/data/cronicas-imagenes";

type FormatoIlustracion = "panoramica" | "cuadrado" | "retrato";

type IlustracionEscenaProps = {
  imagenId: string;
  pie?: string;
  formato?: FormatoIlustracion;
};

const aspectos: Record<FormatoIlustracion, string> = {
  panoramica: "aspect-[21/9] sm:aspect-[2.4/1]",
  cuadrado: "aspect-square max-w-2xl mx-auto",
  retrato: "aspect-[3/4] max-w-md mx-auto",
};

/** Bloque editorial con imagen histórica integrada al tema nocturno. */
export function IlustracionEscena({
  imagenId,
  pie,
  formato = "panoramica",
}: IlustracionEscenaProps) {
  const imagen = obtenerImagenCronica(imagenId);
  const [error, setError] = useState(false);

  if (!imagen || error) return null;

  return (
    <Reveal className="mx-auto max-w-5xl px-5 py-10">
      <figure className={`capa-vineta group relative overflow-hidden rounded-sm border border-linea ${aspectos[formato]}`}>
        <Link
          href={`/piezas/${imagenId}`}
          className="absolute inset-0 z-10"
          aria-label={`Ver pieza: ${imagen.alt}`}
        >
          <span className="sr-only">Ver pieza en la colección</span>
        </Link>
        <Image
          src={imagen.url}
          alt={imagen.alt}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 960px"
          className="object-cover sepia-[0.3] contrast-[1.05] brightness-[0.75] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          onError={() => setError(true)}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-fondo via-fondo/35 to-fondo/30"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-fondo from-25% via-fondo/85 to-transparent"
        />
        <p className="pointer-events-none absolute right-4 top-4 z-20 rounded-full border border-oro/30 bg-fondo/70 px-3 py-1 text-[0.6rem] uppercase tracking-[0.16em] text-oro opacity-0 transition-opacity group-hover:opacity-100">
          <EtiquetaCta>Ver pieza</EtiquetaCta>
        </p>
        {(pie || imagen.credito) && (
          <figcaption className="absolute inset-x-0 bottom-0 z-10 px-5 pb-4 pt-10 sm:pb-5">
            {pie && (
              <p className="text-sm font-medium leading-relaxed text-[#f0e8d8] drop-shadow-[0_1px_10px_rgba(0,0,0,0.9)] sm:text-base">
                {pie}
              </p>
            )}
            <p className="mt-1.5 text-[0.6rem] uppercase tracking-[0.18em] text-[#cfc5b0] drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)] sm:opacity-90 sm:transition-opacity sm:group-hover:opacity-100">
              {imagen.credito}
            </p>
          </figcaption>
        )}
      </figure>
    </Reveal>
  );
}
