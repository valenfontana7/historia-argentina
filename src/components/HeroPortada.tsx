"use client";

import Link from "next/link";
import Image from "next/image";
import { animate, useReducedMotion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { obtenerImagenCronica } from "@/data/cronicas-imagenes";
import { marcarVisitaOnboarding } from "@/lib/engagement/storage";

type Props = {
  cronicaSlug: string;
  hoyHref: string;
  hoyTitulo: string;
};

/** Cabildo abierto del 22 de mayo de 1810: Pedro Subercaseaux. */
const HERO_IMAGEN_ID = "mayo-cabildo";

/** Portada: pintura del Cabildo de Mayo de fondo, titular editorial y CTAs. */
export function HeroPortada({ cronicaSlug, hoyHref, hoyTitulo }: Props) {
  const reducido = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const [esMecenas, setEsMecenas] = useState(false);
  const imagen = obtenerImagenCronica(HERO_IMAGEN_ID);

  // Post-hidratación: anima en el DOM sin estilos initial de SSR (evita #418).
  useLayoutEffect(() => {
    if (reducido) return;
    const root = rootRef.current;
    if (!root) return;

    const nodos = root.querySelectorAll<HTMLElement>("[data-hero-anim]");
    const controles = Array.from(nodos).map((nodo, i) => {
      nodo.style.opacity = "0";
      nodo.style.transform = "translateY(34px)";
      return animate(
        nodo,
        { opacity: 1, y: 0 },
        {
          duration: 0.9,
          delay: 0.1 + i * 0.15,
          ease: [0.16, 1, 0.3, 1],
        },
      );
    });

    return () => {
      for (const c of controles) c.stop();
    };
  }, [reducido]);

  useEffect(() => {
    let cancelado = false;
    fetch("/api/auth/estado")
      .then((r) => r.json())
      .then((data: { mecenas?: boolean }) => {
        if (!cancelado) setEsMecenas(Boolean(data.mecenas));
      })
      .catch(() => {});
    return () => {
      cancelado = true;
    };
  }, []);

  const cronicaHref = esMecenas ? "/mecenas" : `/cronicas/${cronicaSlug}`;
  const cronicaCta = esMecenas ? "Ir a tu museo →" : "Comenzar la visita →";

  const alEmpezar = () => {
    if (!esMecenas) marcarVisitaOnboarding();
  };

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-fondo"
    >
      {imagen && (
        <div className="absolute inset-0" aria-hidden>
          <Image
            src={imagen.url}
            alt=""
            fill
            unoptimized
            priority
            sizes="100vw"
            className="object-cover object-[center_35%] scale-105 sepia-[0.25] contrast-[1.05] brightness-[0.55]"
          />
          {/* Velos museográficos: contraste del copy + fundido inferior */}
          <div className="absolute inset-0 bg-linear-to-b from-fondo/70 via-fondo/45 to-fondo/85" />
          <div className="absolute inset-0 bg-linear-to-t from-fondo via-transparent to-fondo/40" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 50% 40%, transparent 0%, rgba(12,10,8,0.45) 100%)",
            }}
          />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-4xl px-5 pb-28 pt-32 text-center sm:pb-32">
        <p className="kicker" data-hero-anim>
          Un museo digital de historia argentina
        </p>
        <h1
          className="titulo-display mt-7 text-5xl font-semibold leading-[1.04] sm:text-7xl"
          data-hero-anim
        >
          La historia argentina, fácil de entender.
        </h1>
        <p
          className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-tinta-suave sm:text-xl"
          data-hero-anim
        >
          Recorré exhibiciones con mapas e imágenes, conocé los rostros del
          Panteón y descubrí qué pasó un día como hoy. Todo gratis para empezar.
        </p>

        <div
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          data-hero-anim
        >
          <Link
            href={cronicaHref}
            onClick={alEmpezar}
            className="inline-block w-full rounded-full bg-oro px-8 py-3.5 text-sm font-semibold text-fondo transition-colors hover:bg-oro-claro sm:w-auto"
          >
            {cronicaCta}
          </Link>
          <Link
            href={hoyHref}
            className="inline-block w-full rounded-full border border-oro/40 px-8 py-3.5 text-sm text-oro-claro transition-colors hover:bg-oro/10 sm:w-auto"
          >
            Qué pasó hoy
          </Link>
        </div>

        <div
          className="mx-auto mt-10 max-w-lg border-t border-linea-suave pt-6"
          data-hero-anim
        >
          <p className="text-[0.65rem] uppercase tracking-[0.25em] text-tinta-tenue">
            Hoy en el museo
          </p>
          <Link
            href={hoyHref}
            className="mt-2 block text-sm leading-snug text-tinta-suave transition-colors hover:text-oro-claro"
          >
            {hoyTitulo} →
          </Link>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-center sm:bottom-8">
        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-tinta-tenue">
          Deslizá
        </p>
        <div className="mx-auto mt-2 h-8 w-px animate-pulse bg-linear-to-b from-oro via-celeste/50 to-transparent" />
        {imagen && (
          <p className="mt-3 max-w-56 text-[0.55rem] leading-snug tracking-wide text-tinta-tenue/80">
            {imagen.alt}
          </p>
        )}
      </div>
    </section>
  );
}
