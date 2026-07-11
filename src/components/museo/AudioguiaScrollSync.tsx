"use client";

import { useEffect } from "react";

type Props = {
  enabled: boolean;
  onCapitulo: (index: number) => void;
};

/** Sincroniza el segmento activo de la audioguía con el capítulo visible. */
export function AudioguiaScrollSync({ enabled, onCapitulo }: Props) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const secciones = Array.from(
      document.querySelectorAll<HTMLElement>("[data-audioguia-capitulo]"),
    );
    if (secciones.length === 0) return;

    const visibles = new Map<number, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const raw = entry.target.getAttribute("data-audioguia-capitulo");
          const index = raw ? Number.parseInt(raw, 10) : NaN;
          if (Number.isNaN(index)) continue;
          if (entry.isIntersecting) {
            visibles.set(index, entry.intersectionRatio);
          } else {
            visibles.delete(index);
          }
        }

        if (visibles.size === 0) return;
        const mejor = [...visibles.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
        if (mejor !== undefined) onCapitulo(mejor);
      },
      {
        root: null,
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.15, 0.35, 0.55, 0.75],
      },
    );

    for (const seccion of secciones) observer.observe(seccion);
    return () => observer.disconnect();
  }, [enabled, onCapitulo]);

  return null;
}
