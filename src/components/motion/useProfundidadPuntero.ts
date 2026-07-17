"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";

type Opciones = {
  /** Rotación máxima en grados (default 2). */
  maxDeg?: number;
  /** Traslación máxima en px (default 8). */
  maxPx?: number;
};

/**
 * Profundidad falsa por puntero: escribe --rx, --ry, --tx, --ty en el nodo.
 * No-op con reduced-motion o pointer coarse (touch).
 */
export function useProfundidadPuntero<T extends HTMLElement>(
  opciones: Opciones = {},
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const reducido = useReducedMotion();
  const maxDeg = opciones.maxDeg ?? 2;
  const maxPx = opciones.maxPx ?? 8;

  useEffect(() => {
    if (reducido) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const el = ref.current;
    if (!el) return;

    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--tx", "0px");
    el.style.setProperty("--ty", "0px");

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.setProperty("--rx", `${(-y * maxDeg * 2).toFixed(3)}deg`);
        el.style.setProperty("--ry", `${(x * maxDeg * 2).toFixed(3)}deg`);
        el.style.setProperty("--tx", `${(x * maxPx * 2).toFixed(2)}px`);
        el.style.setProperty("--ty", `${(y * maxPx * 2).toFixed(2)}px`);
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
      el.style.setProperty("--tx", "0px");
      el.style.setProperty("--ty", "0px");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [reducido, maxDeg, maxPx]);

  return ref;
}
