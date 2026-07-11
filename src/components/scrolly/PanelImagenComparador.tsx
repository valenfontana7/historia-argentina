"use client";

import Image from "next/image";
import Link from "next/link";
import { obtenerImagenCronica } from "@/data/cronicas-imagenes";

export function PanelImagenComparador({ imagenId, pie }: { imagenId: string; pie?: string }) {
  const imagen = obtenerImagenCronica(imagenId);
  if (!imagen) {
    return <div className="flex h-full w-full items-center justify-center bg-[#080b10]" />;
  }

  return (
    <div className="group relative h-full w-full overflow-hidden bg-[#080b10]">
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
        sizes="(max-width: 768px) 100vw, 800px"
        className="object-cover sepia-[0.3] contrast-[1.08] brightness-[0.82] transition-transform duration-700 group-hover:scale-[1.02]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-fondo via-fondo/25 to-fondo/50"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-oro/6 via-transparent to-fondo/30 mix-blend-overlay"
      />
      <p className="pointer-events-none absolute right-4 top-4 z-20 rounded-full border border-oro/30 bg-fondo/70 px-3 py-1 text-[0.6rem] uppercase tracking-[0.16em] text-oro opacity-0 transition-opacity group-hover:opacity-100">
        Ver pieza →
      </p>
      {pie && (
        <p className="pointer-events-none absolute inset-x-0 bottom-14 px-5 text-center text-sm leading-relaxed text-tinta-suave">
          {pie}
        </p>
      )}
    </div>
  );
}
