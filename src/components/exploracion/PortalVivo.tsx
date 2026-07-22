"use client";

import Link from "next/link";
import Image from "next/image";
import { animate, useReducedMotion } from "framer-motion";
import { useLayoutEffect } from "react";
import { obtenerImagenCronica } from "@/data/cronicas-imagenes";
import { marcarVisitaOnboarding } from "@/lib/engagement/storage";
import type { GanchoPortal } from "@/lib/exploracion/rieles-home";
import { useProfundidadPuntero } from "@/components/motion/useProfundidadPuntero";

type Props = {
  gancho: GanchoPortal;
};

/**
 * Portal cinematográfico: un solo gancho, media en movimiento, cero decisión.
 * Objetivo: curiosidad en menos de 5 segundos.
 */
export function PortalVivo({ gancho }: Props) {
  const reducido = useReducedMotion();
  const rootRef = useProfundidadPuntero<HTMLElement>({ maxDeg: 1.5, maxPx: 6 });
  const imagen =
    gancho.imagenUrl
      ? { url: gancho.imagenUrl, alt: gancho.credito ?? "" }
      : gancho.imagenId
        ? obtenerImagenCronica(gancho.imagenId)
        : obtenerImagenCronica("mayo-cabildo");

  useLayoutEffect(() => {
    if (reducido) return;
    const root = rootRef.current;
    if (!root) return;

    const nodos = root.querySelectorAll<HTMLElement>("[data-portal-anim]");
    const controles = Array.from(nodos).map((nodo, i) => {
      nodo.style.opacity = "0";
      nodo.style.transform = "translateY(28px)";
      return animate(
        nodo,
        { opacity: 1, y: 0 },
        {
          duration: 0.85,
          delay: 0.08 + i * 0.12,
          ease: [0.16, 1, 0.3, 1],
        },
      );
    });

    return () => {
      for (const c of controles) c.stop();
    };
  }, [reducido, rootRef]);

  return (
    <section
      ref={rootRef}
      data-tilt-root
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-fondo pb-28 pt-20 sm:pb-32 sm:pt-28"
    >
      {imagen && (
        <div className="absolute inset-0" aria-hidden data-tilt-layer="back">
          <div
            className={
              reducido ? "absolute inset-0" : "absolute inset-[-4%] portal-kenburns"
            }
          >
            <Image
              src={imagen.url}
              alt=""
              fill
              unoptimized
              priority
              sizes="100vw"
              className="object-cover object-[center_30%] sepia-[0.2] contrast-[1.05] brightness-[0.5]"
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-b from-fondo/80 via-fondo/40 to-fondo/90" />
          <div className="absolute inset-0 bg-linear-to-t from-fondo via-transparent to-fondo/45" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 50% 40%, transparent 0%, rgba(12,10,8,0.5) 100%)",
            }}
          />
        </div>
      )}

      <div
        className="relative z-10 mx-auto w-full max-w-3xl px-5 text-left sm:text-center"
        data-tilt-layer="front"
      >
        <p className="kicker text-oro" data-portal-anim>
          {gancho.kicker}
        </p>
        <h1
          className="titulo-display mt-3 text-[2rem] font-semibold leading-[1.08] sm:mt-5 sm:text-6xl lg:text-7xl"
          data-portal-anim
        >
          {gancho.titulo}
        </h1>
        <p
          className="mt-3 max-w-xl text-sm leading-relaxed text-tinta-suave sm:mx-auto sm:mt-5 sm:text-lg"
          data-portal-anim
        >
          {gancho.misterio}
        </p>

        <div className="mt-7 sm:mt-9" data-portal-anim>
          <Link
            href={gancho.href}
            prefetch
            onClick={() => marcarVisitaOnboarding()}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-oro px-8 py-3.5 text-sm font-semibold text-fondo shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-[transform,colors,box-shadow] duration-300 hover:scale-[1.02] hover:bg-oro-claro hover:shadow-[0_12px_28px_rgba(0,0,0,0.4)] active:scale-[0.99] sm:w-auto"
          >
            {gancho.cta}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-[4.75rem] left-1/2 z-10 -translate-x-1/2 text-center sm:bottom-8">
        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-tinta-tenue">
          O deslizá
        </p>
        <div className="mx-auto mt-2 h-8 w-px animate-pulse bg-linear-to-b from-oro via-celeste/50 to-transparent" />
      </div>
    </section>
  );
}
