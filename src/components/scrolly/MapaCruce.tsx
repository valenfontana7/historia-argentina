"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ControlesEtapasInline } from "@/components/scrolly/MapaCompactoNav";
import {
  BaseMapaCruce,
  ILU_CRUCE,
  MarcadorCruce,
  RUTAS_ILU_CRUCE,
} from "@/components/scrolly/MapaCruceIlustrado";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CIUDADES = [
  { ...ILU_CRUCE.laRioja, lado: "der" as const },
  { ...ILU_CRUCE.sanJuan, lado: "der" as const },
  { ...ILU_CRUCE.mendoza, lado: "der" as const },
  { ...ILU_CRUCE.sanCarlos, lado: "der" as const },
  { ...ILU_CRUCE.copiapo, lado: "izq" as const },
  { ...ILU_CRUCE.laSerena, lado: "izq" as const },
  { ...ILU_CRUCE.sanFelipe, lado: "izq" as const },
  { ...ILU_CRUCE.losAndes, lado: "izq" as const },
  { ...ILU_CRUCE.curico, lado: "izq" as const },
];

/**
 * Mapa ilustrado del cruce: seis rutas que se dibujan al scrollear.
 */
export function MapaCruce() {
  const envoltorio = useRef<HTMLDivElement>(null);
  const rutas = RUTAS_ILU_CRUCE;

  useGSAP(
    () => {
      const trazos = gsap.utils.toArray<SVGPathElement>("[data-ruta]");
      const fichas = gsap.utils.toArray<HTMLElement>("[data-ficha]");
      const destinos = gsap.utils.toArray<SVGGElement>("[data-destino]");

      for (const trazo of trazos) {
        const largo = trazo.getTotalLength();
        gsap.set(trazo, { strokeDasharray: largo, strokeDashoffset: largo });
      }
      gsap.set(fichas, { autoAlpha: 0, y: 16 });
      gsap.set(destinos, { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: envoltorio.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      rutas.forEach((_, i) => {
        const t = i * 3;
        tl.to(fichas[i], { autoAlpha: 1, y: 0, duration: 0.5 }, t);
        tl.to(trazos[i], { strokeDashoffset: 0, duration: 2 }, t + 0.3);
        tl.to(destinos[i], { autoAlpha: 1, duration: 0.4 }, t + 2.1);
        if (i < rutas.length - 1) {
          tl.to(fichas[i], { autoAlpha: 0, y: -16, duration: 0.5 }, t + 2.6);
        }
      });
    },
    { scope: envoltorio },
  );

  return (
    <>
    <div ref={envoltorio} className="relative" style={{ height: `${rutas.length * 120}vh` }}>
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden bg-[#080b10]">
        <div className="relative min-h-0 flex-1 px-3 pt-3 sm:px-6 sm:pt-5">
          <BaseMapaCruce>
            {rutas.map((ruta, i) => (
              <g key={ruta.nombre}>
                <path
                  d={ruta.d}
                  fill="none"
                  stroke={ruta.principal ? "var(--oro)" : "var(--celeste)"}
                  strokeWidth={ruta.principal ? 8 : 6}
                  strokeLinecap="round"
                  opacity="0.1"
                />
                <path
                  data-ruta={i}
                  d={ruta.d}
                  fill="none"
                  stroke={ruta.principal ? "var(--oro)" : "var(--celeste)"}
                  strokeWidth={ruta.principal ? 3.5 : 2.5}
                  strokeLinecap="round"
                  filter={ruta.principal ? "url(#glow-cruce-oro)" : undefined}
                />
                <g data-destino={i}>
                  <circle
                    cx={ruta.fin[0]}
                    cy={ruta.fin[1]}
                    r={ruta.principal ? 9 : 6}
                    fill="none"
                    stroke={ruta.principal ? "var(--oro)" : "var(--celeste)"}
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={ruta.fin[0]}
                    cy={ruta.fin[1]}
                    r={3}
                    fill={ruta.principal ? "var(--oro)" : "var(--celeste)"}
                  />
                </g>
              </g>
            ))}
            {CIUDADES.map((c) => (
              <MarcadorCruce key={c.nombre} x={c.x} y={c.y} nombre={c.nombre} lado={c.lado} />
            ))}
          </BaseMapaCruce>
        </div>

        <div className="relative shrink-0 border-t border-linea-suave bg-fondo/90 px-4 py-5 backdrop-blur-md sm:px-8">
          <div className="relative mx-auto min-h-[7rem] max-h-[40vh] max-w-2xl overflow-y-auto sm:min-h-[9.5rem] sm:max-h-none">
            {rutas.map((ruta, i) => (
              <div
                key={ruta.nombre}
                data-ficha-mapa={i}
                className="absolute inset-0 flex flex-col justify-center"
              >
                <p className="text-[0.65rem] uppercase tracking-[0.24em] text-tinta-tenue">
                  Columna {i + 1} de {rutas.length}
                </p>
                <h3
                  className="titulo-display mt-1.5 text-lg font-semibold sm:text-xl lg:text-2xl"
                  style={{ color: ruta.principal ? "var(--oro)" : "var(--celeste)" }}
                >
                  {ruta.nombre}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-tinta-suave">
                  {ruta.jefe} → {ruta.destino}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-tinta-suave sm:text-[0.9375rem]">
                  {ruta.detalle}
                </p>
              </div>
            ))}
          </div>
          <ControlesEtapasInline
            etapas={rutas}
            vhPorEtapa={120}
            contenedorRef={envoltorio}
          />
        </div>
      </div>
    </div>

    </>
  );
}
