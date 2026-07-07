"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import type { ImagenPersonaje } from "@/data/personajes-imagenes";
import type { Epoca } from "@/components/ui/Retrato";

type RetratoFotoProps = {
  nombre: string;
  epoca: Epoca;
  anios: string;
  imagen: ImagenPersonaje;
  className?: string;
  fallback: ReactNode;
};

export function RetratoFoto({
  nombre,
  anios,
  imagen,
  className = "",
  fallback,
}: RetratoFotoProps) {
  const [error, setError] = useState(false);

  if (error) {
    return <>{fallback}</>;
  }

  return (
    <figure
      className={`group relative aspect-[3/4] overflow-hidden rounded-sm border border-linea bg-fondo ${className}`}
    >
      <Image
        src={imagen.url}
        alt={`Retrato de ${nombre}`}
        fill
        unoptimized
        sizes="(max-width: 768px) 50vw, 300px"
        className="object-cover object-top sepia-[0.25] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        onError={() => setError(true)}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-fondo/80 via-fondo/10 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-oro/10 via-transparent to-fondo/20 mix-blend-overlay"
      />
      <figcaption className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-16">
        <span className="block text-[0.6rem] uppercase tracking-[0.3em] text-tinta-suave">
          {anios}
        </span>
        <span className="mt-1 block text-[0.55rem] text-tinta-tenue opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          {imagen.credito}
        </span>
      </figcaption>
    </figure>
  );
}
