"use client";

import { useRef, useState, useCallback, type ReactNode, type PointerEvent } from "react";

type ComparadorProps = {
  izquierda: ReactNode;
  derecha: ReactNode;
  etiquetaIzquierda: string;
  etiquetaDerecha: string;
  /** Qué panel se muestra al cargar. Por defecto el de la izquierda. */
  inicio?: "izquierda" | "derecha";
};

const POS_MIN = 4;
const POS_MAX = 96;

function posicionInicial(inicio: "izquierda" | "derecha") {
  return inicio === "izquierda" ? POS_MAX : POS_MIN;
}

/**
 * Comparador antes/después: la manija arranca en un extremo para que
 * el usuario vea un solo plan antes de arrastrar hacia el otro.
 */
export function Comparador({
  izquierda,
  derecha,
  etiquetaIzquierda,
  etiquetaDerecha,
  inicio = "izquierda",
}: ComparadorProps) {
  const [posicion, setPosicion] = useState(() => posicionInicial(inicio));
  const marco = useRef<HTMLDivElement>(null);
  const arrastrando = useRef(false);

  const viendoIzquierda = posicion >= 55;
  const viendoDerecha = posicion <= 45;

  const mover = useCallback((clientX: number) => {
    const caja = marco.current?.getBoundingClientRect();
    if (!caja) return;
    const pct = ((clientX - caja.left) / caja.width) * 100;
    setPosicion(Math.min(POS_MAX, Math.max(POS_MIN, pct)));
  }, []);

  const alPresionar = (e: PointerEvent) => {
    arrastrando.current = true;
    marco.current?.setPointerCapture(e.pointerId);
    mover(e.clientX);
  };

  const pista =
    inicio === "izquierda"
      ? "Deslizá hacia la derecha para ver el otro plan"
      : "Deslizá hacia la izquierda para ver el otro plan";

  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <div
        ref={marco}
        role="slider"
        aria-valuenow={Math.round(posicion)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Comparar ${etiquetaIzquierda} con ${etiquetaDerecha}`}
        tabIndex={0}
        className="relative aspect-[16/10] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-sm border border-linea bg-[#0a0d14]"
        onPointerDown={alPresionar}
        onPointerMove={(e) => arrastrando.current && mover(e.clientX)}
        onPointerUp={() => (arrastrando.current = false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPosicion((p) => Math.max(POS_MIN, p - 4));
          if (e.key === "ArrowRight") setPosicion((p) => Math.min(POS_MAX, p + 4));
        }}
      >
        <div className="absolute inset-0">{derecha}</div>
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - posicion}% 0 0)` }}
        >
          {izquierda}
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 z-20 w-px bg-oro"
          style={{ left: `${posicion}%` }}
        >
          <span className="pointer-events-auto absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-oro bg-fondo text-oro shadow-lg">
            ⇔
          </span>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-end justify-between gap-2 p-2 sm:gap-3 sm:p-3">
          <span
            className={`max-w-[44%] truncate rounded-sm px-2 py-1 text-[0.55rem] uppercase tracking-[0.12em] backdrop-blur-md transition-colors sm:max-w-[46%] sm:rounded-full sm:px-3 sm:py-1.5 sm:text-[0.65rem] sm:tracking-[0.18em] ${
              viendoIzquierda
                ? "bg-oro/25 text-oro-claro ring-1 ring-oro/50"
                : "bg-fondo/85 text-tinta-tenue"
            }`}
          >
            {etiquetaIzquierda}
          </span>
          <span
            className={`max-w-[44%] truncate rounded-sm px-2 py-1 text-right text-[0.55rem] uppercase tracking-[0.12em] backdrop-blur-md transition-colors sm:max-w-[46%] sm:rounded-full sm:px-3 sm:py-1.5 sm:text-[0.65rem] sm:tracking-[0.18em] ${
              viendoDerecha
                ? "bg-oro/25 text-oro-claro ring-1 ring-oro/50"
                : "bg-fondo/85 text-tinta-tenue"
            }`}
          >
            {etiquetaDerecha}
          </span>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-tinta-tenue">{pista}</p>
    </div>
  );
}
