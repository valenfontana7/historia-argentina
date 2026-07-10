"use client";

import { useState } from "react";
import Image from "next/image";
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
        <Image
          src={imagen.url}
          alt={imagen.alt}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 960px"
          className="object-cover sepia-[0.35] contrast-[1.08] brightness-[0.85] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          onError={() => setError(true)}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-fondo via-fondo/20 to-fondo/40"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-oro/8 via-transparent to-fondo/30 mix-blend-overlay"
        />
        {(pie || imagen.credito) && (
          <figcaption className="absolute inset-x-0 bottom-0 z-10 px-5 pb-4 pt-20">
            {pie && (
              <p className="text-sm leading-relaxed text-tinta-suave">{pie}</p>
            )}
            <p className="mt-1 text-[0.6rem] uppercase tracking-[0.2em] text-tinta-tenue opacity-80 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
              {imagen.credito}
            </p>
          </figcaption>
        )}
      </figure>
    </Reveal>
  );
}
