"use client";

import { useRef } from "react";
import type { ItemRiel } from "@/lib/exploracion/rieles-home";
import { TarjetaUniverso } from "@/components/exploracion/TarjetaUniverso";

export function RielCarrusel({ items }: { items: ItemRiel[] }) {
  const railRef = useRef<HTMLDivElement>(null);

  function desplazar(direction: -1 | 1) {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * Math.max(260, rail.clientWidth * 0.82), behavior: "smooth" });
  }

  function navegarConTeclado(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      desplazar(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      desplazar(-1);
    }
  }

  return (
    <div className="group/rail relative">
      <div
        ref={railRef}
        tabIndex={0}
        onKeyDown={navegarConTeclado}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 scroll-smooth outline-none focus-visible:ring-2 focus-visible:ring-oro/70 sm:gap-4 sm:px-[max(1.25rem,calc((100vw-72rem)/2+1.25rem))]"
        style={{ scrollbarWidth: "none" }}
        aria-label="Historias desplazables"
      >
        {items.map((item, i) => <TarjetaUniverso key={`${item.href}-${i}`} item={item} />)}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-fondo via-fondo/55 to-transparent" />
      <button type="button" onClick={() => desplazar(-1)} aria-label="Ver historias anteriores" className="absolute left-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-linea bg-fondo/90 text-xl text-tinta transition-all hover:border-oro hover:text-oro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oro group-hover/rail:flex sm:flex">‹</button>
      <button type="button" onClick={() => desplazar(1)} aria-label="Ver más historias" className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-linea bg-fondo/90 text-xl text-tinta transition-all hover:border-oro hover:text-oro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oro">›</button>
    </div>
  );
}
