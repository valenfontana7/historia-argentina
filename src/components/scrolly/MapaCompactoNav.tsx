"use client";

import { useCallback, useEffect, useState } from "react";

export const SELECTOR_FICHA_MAPA = "[data-ficha-mapa]";

type Etapa = {
  nombre: string;
};

type Props = {
  etapas: Etapa[];
  /** Altura del contenedor scrolly en vh por etapa */
  vhPorEtapa: number;
  contenedorRef?: React.RefObject<HTMLElement | null>;
};

/**
 * Controles de salto entre etapas, embebidos en el panel de fichas del mapa.
 * No usa position:fixed para no tapar el contenido ni duplicar la barra inferior.
 */
export function ControlesEtapasInline({
  etapas,
  vhPorEtapa,
  contenedorRef,
}: Props) {
  const [etapaActiva, setEtapaActiva] = useState(0);

  const irAEtapa = useCallback(
    (indice: number) => {
      const contenedor =
        contenedorRef?.current ??
        document.querySelector<HTMLElement>(SELECTOR_FICHA_MAPA)?.closest(".relative");
      if (!contenedor) return;
      const top = contenedor.offsetTop + indice * vhPorEtapa * (window.innerHeight / 100);
      window.scrollTo({ top, behavior: "smooth" });
      setEtapaActiva(indice);
    },
    [contenedorRef, vhPorEtapa],
  );

  useEffect(() => {
    const fichas = document.querySelectorAll(SELECTOR_FICHA_MAPA);
    if (fichas.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.fichaMapa);
            if (!Number.isNaN(idx)) setEtapaActiva(idx);
          }
        }
      },
      { threshold: 0.5, rootMargin: "-40% 0px -40% 0px" },
    );

    fichas.forEach((f) => observer.observe(f));
    return () => observer.disconnect();
  }, [etapas.length]);

  if (etapas.length <= 1) return null;

  return (
    <div className="mx-auto mt-3 flex max-w-2xl items-center gap-3 border-t border-linea-suave/60 pt-3 lg:hidden">
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
        <p className="truncate text-xs font-medium text-oro-claro">
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
      <div className="flex shrink-0 gap-1">
        {etapas.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => irAEtapa(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === etapaActiva ? "w-4 bg-oro" : "w-1.5 bg-linea"
            }`}
            aria-label={`Ir a etapa ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/** @deprecated Usar ControlesEtapasInline dentro del panel de fichas. */
export function MapaCompactoNav(_props: Props) {
  return null;
}
