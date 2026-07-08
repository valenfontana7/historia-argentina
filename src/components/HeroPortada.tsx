"use client";

import Link from "next/link";
import { animate, useReducedMotion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { marcarVisitaOnboarding } from "@/lib/engagement/storage";

type Props = {
  cronicaSlug: string;
  hoyHref: string;
  hoyTitulo: string;
};

/** Portada del sitio: cielo nocturno, sol de mayo insinuado y titular editorial. */
export function HeroPortada({ cronicaSlug, hoyHref, hoyTitulo }: Props) {
  const reducido = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const [esMecenas, setEsMecenas] = useState(false);

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
  const cronicaCta = esMecenas ? "Ir a tu museo →" : "Empezar la crónica →";

  const alEmpezar = () => {
    if (!esMecenas) marcarVisitaOnboarding();
  };

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 110%, rgba(198,161,91,0.16) 0%, transparent 55%), linear-gradient(180deg, #05070d 0%, #0b0e18 55%, #0c0a08 100%)",
        }}
      />
      <svg aria-hidden className="absolute inset-0 h-full w-full opacity-60" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 110 }, (_, i) => {
          const x = (i * 149.7) % 1200;
          const y = (i * 97.3) % 560;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={0.5 + ((i * 7) % 9) / 11}
              fill="#dfe7f4"
              opacity={0.2 + ((i * 13) % 11) / 18}
            />
          );
        })}
      </svg>
      <svg
        aria-hidden
        className="absolute bottom-[-14rem] left-1/2 w-[44rem] -translate-x-1/2 opacity-[0.16]"
        viewBox="0 0 400 400"
      >
        {Array.from({ length: 32 }, (_, i) => {
          const angulo = (i / 32) * Math.PI * 2;
          const largo = i % 2 === 0 ? 190 : 150;
          return (
            <line
              key={i}
              x1={200 + Math.cos(angulo) * 80}
              y1={200 + Math.sin(angulo) * 80}
              x2={200 + Math.cos(angulo) * largo}
              y2={200 + Math.sin(angulo) * largo}
              stroke="var(--oro)"
              strokeWidth={i % 2 === 0 ? 3 : 1.6}
            />
          );
        })}
        <circle cx={200} cy={200} r={64} fill="none" stroke="var(--oro)" strokeWidth={3} />
      </svg>

      <div className="relative z-10 mx-auto max-w-4xl px-5 pb-24 pt-32 text-center">
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
          Leé crónicas con imágenes y mapas, conocé personajes del Panteón y
          descubrí qué pasó un día como hoy. Todo gratis para empezar.
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

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center">
        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-tinta-tenue">
          Deslizá
        </p>
        <div className="mx-auto mt-2 h-9 w-px animate-pulse bg-gradient-to-b from-oro to-transparent" />
      </div>
    </section>
  );
}
