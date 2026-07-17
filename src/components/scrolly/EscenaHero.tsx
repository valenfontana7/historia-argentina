"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";
import type { VarianteHero } from "@/content/cronicas/tipos";
import { obtenerImagenCronica } from "@/data/cronicas-imagenes";
import { SiluetaHero, gradientesHero } from "@/components/scrolly/HeroSiluetas";
import { nombreTransicionExhibicion } from "@/lib/view-transitions";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type EscenaHeroProps = {
  kicker: string;
  titulo: string;
  subtitulo: string;
  meta: string;
  variante?: VarianteHero;
  imagenHero?: string;
  /** Slug de la crónica para transición compartida con la ficha. */
  slug?: string;
};

/** Si el kicker es genérico (“Crónica N.º…”) preferimos la meta de época. */
function kickerNarrativo(kicker: string, meta: string): string {
  const generico =
    /^cr[oó]nica\s*n\.?\s*º?/i.test(kicker.trim()) ||
    /^exclusiva\s+mecenas/i.test(kicker.trim());
  if (!generico) return kicker;
  const epoca = meta.split("·")[0]?.trim();
  return epoca || kicker;
}

/**
 * Portada cinematográfica de una crónica: imagen viva, parallax y título
 * que se hunde al scrollear.
 */
export function EscenaHero({
  kicker,
  titulo,
  subtitulo,
  meta,
  variante = "andes",
  imagenHero,
  slug,
}: EscenaHeroProps) {
  const escena = useRef<HTMLDivElement>(null);
  const reducido = useReducedMotion();
  const imagen = imagenHero ? obtenerImagenCronica(imagenHero) : undefined;
  const kickerVisible = kickerNarrativo(kicker, meta);
  const metaLimpia = meta
    .replace(/\s*·\s*Con audioguía/gi, "")
    .replace(/\s*·\s*con audioguía/gi, "")
    .trim();

  useGSAP(
    () => {
      if (reducido) return;

      gsap.from("[data-hero-texto] > *", {
        opacity: 0,
        y: 40,
        duration: 1.4,
        stagger: 0.18,
        ease: "power3.out",
        delay: 0.2,
      });

      gsap.to("[data-hero-parallax]", {
        y: -48,
        scale: 1.06,
        ease: "none",
        scrollTrigger: {
          trigger: escena.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      const capas: Array<[string, number]> = [
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
        y: 160,
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
    { scope: escena, dependencies: [reducido] },
  );

  const mostrarEstrellas = variante === "andes" && !imagen;
  const vtName = slug ? nombreTransicionExhibicion(slug) : undefined;

  return (
    <div
      ref={escena}
      className="relative flex h-svh items-center justify-center overflow-hidden bg-fondo"
      style={{
        background: imagen ? undefined : gradientesHero[variante],
        viewTransitionName: vtName,
      }}
    >
      {imagen ? (
        <div
          className="absolute inset-0"
          data-capa="fondo"
          style={{ viewTransitionName: vtName }}
        >
          <div
            data-hero-parallax
            className="absolute inset-0 origin-center will-change-transform"
          >
            <div
              className={
                reducido
                  ? "absolute inset-0"
                  : "absolute inset-[-5%] portal-kenburns"
              }
            >
              <Image
                src={imagen.url}
                alt=""
                fill
                unoptimized
                priority
                sizes="100vw"
                className="object-cover object-[center_30%] opacity-[0.55] sepia-[0.2] contrast-[1.05] brightness-[0.65]"
                aria-hidden
              />
            </div>
          </div>
          <div className="absolute inset-0 bg-linear-to-b from-fondo/70 via-fondo/35 to-fondo" />
          <div className="absolute inset-0 bg-linear-to-t from-fondo via-transparent to-fondo/50" />
        </div>
      ) : (
        <>
          {mostrarEstrellas && (
            <svg
              aria-hidden
              className="absolute inset-0 h-full w-full opacity-70"
              viewBox="0 0 1200 800"
              preserveAspectRatio="xMidYMid slice"
            >
              {Array.from({ length: 90 }, (_, i) => {
                const x = (i * 137.5) % 1200;
                const y = ((i * 89.3) % 460) + 10;
                const r = 0.4 + ((i * 7) % 10) / 12;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={r}
                    fill="#e8eef8"
                    opacity={0.25 + ((i * 13) % 10) / 16}
                  />
                );
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
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-t from-[#b8864a]/5 via-transparent to-transparent"
            />
          )}
          <SiluetaHero variante={variante} />
        </>
      )}

      <div
        data-hero-texto
        className="relative z-10 mx-auto max-w-4xl px-5 pb-16 text-center"
      >
        <p className="kicker text-oro">{kickerVisible}</p>
        <h1 className="titulo-display mt-5 text-4xl font-semibold leading-[1.05] text-tinta sm:mt-6 sm:text-7xl">
          {titulo}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-tinta-suave sm:mt-6 sm:text-xl">
          {subtitulo}
        </p>
        {metaLimpia && (
          <p className="mt-6 text-xs uppercase tracking-[0.28em] text-tinta-tenue sm:mt-8">
            {metaLimpia}
          </p>
        )}
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center">
        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-tinta-tenue">
          Deslizá
        </p>
        <div className="mx-auto mt-2 h-9 w-px animate-pulse bg-linear-to-b from-oro to-transparent" />
      </div>
    </div>
  );
}
