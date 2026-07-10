"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { VarianteHero } from "@/data/cronicas-visuales";
import { obtenerImagenCronica } from "@/data/cronicas-imagenes";
import { SiluetaHero, gradientesHero } from "@/components/scrolly/HeroSiluetas";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type EscenaHeroProps = {
  kicker: string;
  titulo: string;
  subtitulo: string;
  meta: string;
  variante?: VarianteHero;
  imagenHero?: string;
};

/**
 * Portada cinematográfica de una crónica: silueta por variante,
 * parallax y título que se hunde al scrollear.
 */
export function EscenaHero({
  kicker,
  titulo,
  subtitulo,
  meta,
  variante = "andes",
  imagenHero,
}: EscenaHeroProps) {
  const escena = useRef<HTMLDivElement>(null);
  const imagen = imagenHero ? obtenerImagenCronica(imagenHero) : undefined;

  useGSAP(
    () => {
      gsap.from("[data-hero-texto] > *", {
        opacity: 0,
        y: 40,
        duration: 1.4,
        stagger: 0.18,
        ease: "power3.out",
        delay: 0.2,
      });
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

  const mostrarEstrellas = variante === "andes";

  return (
    <div
      ref={escena}
      className="relative flex h-svh items-center justify-center overflow-hidden"
      style={{ background: gradientesHero[variante] }}
    >
      {imagen && (
        <div className="absolute inset-0 opacity-[0.18]">
          <Image
            src={imagen.url}
            alt=""
            fill
            unoptimized
            priority
            sizes="100vw"
            className="object-cover sepia-[0.4] contrast-[1.1] brightness-[0.7]"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-b from-fondo/60 via-fondo/40 to-fondo" />
        </div>
      )}

      {mostrarEstrellas && (
        <svg aria-hidden className="absolute inset-0 h-full w-full opacity-70" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 90 }, (_, i) => {
            const x = (i * 137.5) % 1200;
            const y = ((i * 89.3) % 460) + 10;
            const r = 0.4 + ((i * 7) % 10) / 12;
            return <circle key={i} cx={x} cy={y} r={r} fill="#e8eef8" opacity={0.25 + ((i * 13) % 10) / 16} />;
          })}
        </svg>
      )}

      {variante === "mayo" && (
        <div aria-hidden className="absolute inset-0">
          <div className="absolute left-[20%] top-[30%] h-24 w-24 rounded-full bg-oro/8 blur-3xl" />
          <div className="absolute right-[25%] top-[35%] h-20 w-20 rounded-full bg-oro/6 blur-2xl" />
        </div>
      )}

      {variante === "jujuy" && (
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#b8864a]/5 via-transparent to-transparent" />
      )}

      <SiluetaHero variante={variante} />

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

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center">
        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-tinta-tenue">
          Deslizá
        </p>
        <div className="mx-auto mt-2 h-9 w-px animate-pulse bg-gradient-to-b from-oro to-transparent" />
      </div>
    </div>
  );
}
