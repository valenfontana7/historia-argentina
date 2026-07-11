"use client";

import { useCallback, useEffect, useState } from "react";

type Etapa = {
  nombre: string;
};

type Props = {
  etapas: Etapa[];
  /** Selector de fichas, ej. `[data-ficha-cha]` */
  selectorFicha: string;
  /** Altura del contenedor scrolly en vh por etapa */
  vhPorEtapa: number;
  contenedorRef?: React.RefObject<HTMLElement | null>;
};

/**
 * Navegación compacta para mapas scrolly en mobile.
 * Permite saltar entre etapas sin recorrer todo el scroll.
 */
export function MapaCompactoNav({
  etapas,
  selectorFicha,
  vhPorEtapa,
  contenedorRef,
}: Props) {
  const [etapaActiva, setEtapaActiva] = useState(0);

  const irAEtapa = useCallback(
    (indice: number) => {
      const contenedor =
        contenedorRef?.current ??
        document.querySelector<HTMLElement>(selectorFicha)?.closest(".relative");
      if (!contenedor) return;
      const top = contenedor.offsetTop + indice * vhPorEtapa * (window.innerHeight / 100);
      window.scrollTo({ top, behavior: "smooth" });
      setEtapaActiva(indice);
    },
    [contenedorRef, selectorFicha, vhPorEtapa],
  );

  useEffect(() => {
    const fichas = document.querySelectorAll(selectorFicha);
    if (fichas.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.fichaCha);
            if (!Number.isNaN(idx)) setEtapaActiva(idx);
          }
        }
      },
      { threshold: 0.5, rootMargin: "-40% 0px -40% 0px" },
    );

    fichas.forEach((f) => observer.observe(f));
    return () => observer.disconnect();
  }, [selectorFicha, etapas.length]);

  return (
    <div className="fixed inset-x-0 bottom-16 z-40 border-t border-linea-suave bg-fondo/95 px-4 py-3 backdrop-blur-md sm:hidden lg:bottom-0">
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <button
          type="button"
          onClick={() => irAEtapa(Math.max(0, etapaActiva - 1))}
          disabled={etapaActiva === 0}
          className="shrink-0 text-tinta-tenue disabled:opacity-30"
          aria-label="Etapa anterior"
        >
          ←
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.6rem] uppercase tracking-[0.16em] text-tinta-tenue">
            Etapa {etapaActiva + 1} / {etapas.length}
          </p>
          <p className="truncate text-sm font-medium text-oro-claro">
            {etapas[etapaActiva]?.nombre}
          </p>
        </div>
        <button
          type="button"
          onClick={() => irAEtapa(Math.min(etapas.length - 1, etapaActiva + 1))}
          disabled={etapaActiva >= etapas.length - 1}
          className="shrink-0 text-tinta-tenue disabled:opacity-30"
          aria-label="Etapa siguiente"
        >
          →
        </button>
      </div>
      <div className="mx-auto mt-2 flex max-w-lg justify-center gap-1.5">
        {etapas.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => irAEtapa(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === etapaActiva ? "w-6 bg-oro" : "w-1.5 bg-linea"
            }`}
            aria-label={`Ir a etapa ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
