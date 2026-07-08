"use client";

import { motion, useReducedMotion } from "framer-motion";

const aparicion = {
  initial: { opacity: 0, y: 34 },
  animate: { opacity: 1, y: 0 },
};

/** Portada del sitio: cielo nocturno, sol de mayo insinuado y titular editorial. */
export function HeroPortada() {
  const reducido = useReducedMotion();

  return (
    <section className="relative flex min-h-svh items-center justify-center overflow-hidden">
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

      <div className="relative z-10 mx-auto max-w-4xl px-5 py-32 text-center">
        <motion.p
          className="kicker"
          {...(reducido ? {} : aparicion)}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Un museo digital de historia argentina
        </motion.p>
        <motion.h1
          className="titulo-display mt-7 text-5xl font-semibold leading-[1.04] sm:text-7xl"
          {...(reducido ? {} : { initial: { y: 34 }, animate: { y: 0 } })}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          La historia argentina, fácil de entender.
        </motion.h1>
        <motion.p
          className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-tinta-suave sm:text-xl"
          {...(reducido ? {} : aparicion)}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          Leé crónicas con imágenes y mapas, conocé personajes del Panteón y
          descubrí qué pasó un día como hoy. Todo gratis para empezar.
        </motion.p>
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
