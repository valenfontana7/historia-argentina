"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type EscenaHeroProps = {
  kicker: string;
  titulo: string;
  subtitulo: string;
  meta: string;
};

/**
 * Portada cinematográfica de una crónica: cielo nocturno, tres capas
 * de cordillera con parallax y el título que se hunde al scrollear.
 */
export function EscenaHero({ kicker, titulo, subtitulo, meta }: EscenaHeroProps) {
  const escena = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Entrada del título
      gsap.from("[data-hero-texto] > *", {
        opacity: 0,
        y: 40,
        duration: 1.4,
        stagger: 0.18,
        ease: "power3.out",
        delay: 0.2,
      });
      // Parallax: cada capa de montaña sube a distinta velocidad
      const capas: Array<[string, number]> = [
        ["[data-capa='fondo']", -40],
        ["[data-capa='media']", -110],
        ["[data-capa='frente']", -200],
      ];
      for (const [selector, y] of capas) {
        gsap.to(selector, {
          y,
          ease: "none",
          scrollTrigger: {
            trigger: escena.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
      gsap.to("[data-hero-texto]", {
        y: 140,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: escena.current,
          start: "top top",
          end: "70% top",
          scrub: true,
        },
      });
    },
    { scope: escena },
  );

  return (
    <div
      ref={escena}
      className="relative flex h-svh items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #05070d 0%, #0a1020 45%, #16202f 78%, #0c0a08 100%)",
      }}
    >
      {/* Estrellas */}
      <svg aria-hidden className="absolute inset-0 h-full w-full opacity-70" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 90 }, (_, i) => {
          const x = (i * 137.5) % 1200;
          const y = ((i * 89.3) % 460) + 10;
          const r = 0.4 + ((i * 7) % 10) / 12;
          return <circle key={i} cx={x} cy={y} r={r} fill="#e8eef8" opacity={0.25 + ((i * 13) % 10) / 16} />;
        })}
      </svg>

      {/* Cordillera: tres capas con parallax */}
      <svg data-capa="fondo" aria-hidden className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 300" preserveAspectRatio="none">
        <path
          d="M0 300 L0 190 L90 120 L170 175 L260 90 L350 160 L430 70 L520 150 L610 55 L700 140 L790 85 L880 165 L960 100 L1050 170 L1130 115 L1200 180 L1200 300 Z"
          fill="#1b2434"
        />
        <path d="M430 70 L455 95 L470 82 L490 108 L430 108 Z M610 55 L640 88 L660 74 L610 90 Z" fill="#39465c" />
      </svg>
      <svg data-capa="media" aria-hidden className="absolute -bottom-6 left-0 w-full" viewBox="0 0 1200 300" preserveAspectRatio="none">
        <path
          d="M0 300 L0 220 L120 140 L230 200 L340 105 L470 195 L580 90 L710 190 L830 120 L950 205 L1070 140 L1200 215 L1200 300 Z"
          fill="#121826"
        />
        <path d="M340 105 L370 140 L390 122 L410 150 L340 148 Z M580 90 L615 130 L640 112 L580 128 Z" fill="#2a3547" />
      </svg>
      <svg data-capa="frente" aria-hidden className="absolute -bottom-10 left-0 w-full" viewBox="0 0 1200 260" preserveAspectRatio="none">
        <path
          d="M0 260 L0 210 L150 130 L300 205 L450 110 L620 210 L780 125 L940 215 L1090 150 L1200 205 L1200 260 Z"
          fill="#080a10"
        />
      </svg>

      {/* Texto */}
      <div data-hero-texto className="relative z-10 mx-auto max-w-4xl px-5 text-center">
        <p className="kicker">{kicker}</p>
        <h1 className="titulo-display mt-6 text-5xl font-semibold leading-[1.02] text-tinta sm:text-7xl">
          {titulo}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-tinta-suave sm:text-xl">
          {subtitulo}
        </p>
        <p className="mt-8 text-xs uppercase tracking-[0.28em] text-tinta-tenue">
          {meta}
        </p>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center">
        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-tinta-tenue">
          Deslizá
        </p>
        <div className="mx-auto mt-2 h-9 w-px animate-pulse bg-gradient-to-b from-oro to-transparent" />
      </div>
    </div>
  );
}
