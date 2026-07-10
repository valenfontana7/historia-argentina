"use client";

import Image from "next/image";
import { obtenerImagenCronica } from "@/data/cronicas-imagenes";

export function PanelImagenComparador({ imagenId, pie }: { imagenId: string; pie?: string }) {
  const imagen = obtenerImagenCronica(imagenId);
  if (!imagen) {
    return <div className="flex h-full w-full items-center justify-center bg-[#080b10]" />;
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#080b10]">
      <Image
        src={imagen.url}
        alt={imagen.alt}
        fill
        unoptimized
        sizes="(max-width: 768px) 100vw, 800px"
        className="object-cover sepia-[0.3] contrast-[1.08] brightness-[0.82]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-fondo via-fondo/25 to-fondo/50"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-oro/6 via-transparent to-fondo/30 mix-blend-overlay"
      />
      {pie && (
        <p className="absolute inset-x-0 bottom-14 px-5 text-center text-sm leading-relaxed text-tinta-suave">
          {pie}
        </p>
      )}
    </div>
  );
}
