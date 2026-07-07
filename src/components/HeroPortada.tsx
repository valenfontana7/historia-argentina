"use client";

import Link from "next/link";
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
      {/* Cielo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 110%, rgba(198,161,91,0.16) 0%, transparent 55%), linear-gradient(180deg, #05070d 0%, #0b0e18 55%, #0c0a08 100%)",
        }}
      />
      {/* Estrellas */}
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
      {/* Sol de mayo, apenas insinuado en el horizonte */}
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
        {/* El titular es el LCP: se anima solo la posición para no demorar el paint */}
        <motion.h1
          className="titulo-display mt-7 text-5xl font-semibold leading-[1.04] sm:text-7xl"
          {...(reducido ? {} : { initial: { y: 34 }, animate: { y: 0 } })}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          La historia argentina, como nunca la viste.
        </motion.h1>
        <motion.p
          className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-tinta-suave sm:text-xl"
          {...(reducido ? {} : aparicion)}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          Crónicas que se viven con el scroll, un panteón de héroes y villanos,
          y una historia nueva cada día. Sin manuales. Sin polvo. Sin permiso.
        </motion.p>
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          {...(reducido ? {} : aparicion)}
          transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/cronicas/el-cruce-de-los-andes"
            className="rounded-full bg-oro px-8 py-4 text-sm font-semibold text-fondo transition-colors hover:bg-oro-claro"
          >
            Vivir el Cruce de los Andes
          </Link>
          <Link
            href="/panteon"
            className="rounded-full border border-linea px-8 py-4 text-sm text-tinta-suave transition-colors hover:border-oro/50 hover:text-oro-claro"
          >
            Entrar al Panteón
          </Link>
        </motion.div>
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
