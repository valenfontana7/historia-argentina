"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  BaseMapaCongreso,
  ETAPAS_CONGRESO,
  HitoCongreso,
  ILU_CONGRESO,
  RUTAS_DIPUTADOS,
  RUTAS_NOTICIA,
} from "@/components/scrolly/MapaCongresoIlustrado";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Scrolly del Congreso de Tucumán: de la llegada de diputados a la difusión del Acta. */
export function MapaCongreso() {
  const envoltorio = useRef<HTMLDivElement>(null);
  const etapas = ETAPAS_CONGRESO;

  useGSAP(
    () => {
      const fichas = gsap.utils.toArray<HTMLElement>("[data-ficha-cong]");
      const trazos = gsap.utils.toArray<SVGPathElement>("[data-trazo-cong]");
      const capas = gsap.utils.toArray<SVGGElement>("[data-capa-cong]");

      for (const trazo of trazos) {
        const largo = trazo.getTotalLength();
        gsap.set(trazo, { strokeDasharray: largo, strokeDashoffset: largo });
      }
      gsap.set(fichas, { autoAlpha: 0, y: 16 });
      gsap.set(capas, { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: envoltorio.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      etapas.forEach((_, i) => {
        const t = i * 3;
        tl.to(fichas[i], { autoAlpha: 1, y: 0, duration: 0.5 }, t);

        const capa = capas.find((c) => c.dataset.capaCong === String(i));
        if (capa) tl.to(capa, { autoAlpha: 1, duration: 0.5 }, t + 0.3);

        const trazosEtapa = trazos.filter((tr) => tr.dataset.trazoCong === String(i));
        trazosEtapa.forEach((tr, j) => {
          tl.to(tr, { strokeDashoffset: 0, duration: 1.6 }, t + 0.4 + j * 0.1);
        });

        if (i < etapas.length - 1) {
          tl.to(fichas[i], { autoAlpha: 0, y: -16, duration: 0.5 }, t + 2.6);
        }
      });
    },
    { scope: envoltorio },
  );

  return (
    <div ref={envoltorio} className="relative" style={{ height: `${etapas.length * 120}vh` }}>
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden bg-[#080b10]">
        <div className="relative min-h-0 flex-1 px-3 pt-3 sm:px-6 sm:pt-5">
          <BaseMapaCongreso>
            {RUTAS_DIPUTADOS.map((ruta, j) => (
              <path
                key={`d-${j}`}
                data-trazo-cong={ruta.etapa}
                d={ruta.d}
                fill="none"
                stroke="var(--celeste)"
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity="0.85"
              />
            ))}
            <g data-capa-cong="0">
              <HitoCongreso {...ILU_CONGRESO.buenosAires} color="var(--celeste)" lado="abajo" />
              <HitoCongreso {...ILU_CONGRESO.cordoba} color="var(--celeste)" lado="der" />
              <HitoCongreso {...ILU_CONGRESO.salta} color="var(--celeste)" lado="arriba" />
              <HitoCongreso {...ILU_CONGRESO.cuyano} color="var(--celeste)" lado="izq" />
              <HitoCongreso {...ILU_CONGRESO.litoral} color="var(--celeste)" lado="der" />
            </g>

            <g data-capa-cong="1">
              <circle cx={450} cy={275} r={36} fill="var(--oro)" opacity="0.08" />
              <text x={450} y={200} fill="var(--oro-claro)" fontSize="11" textAnchor="middle" letterSpacing="1.5">
                DEBATES
              </text>
            </g>

            <g data-capa-cong="2">
              <circle cx={450} cy={275} r={28} fill="var(--oro)" opacity="0.16" filter="url(#glow-cong-oro)" />
              <circle cx={450} cy={275} r={14} fill="none" stroke="var(--oro)" strokeWidth="1.5" />
              <text x={450} y={195} fill="var(--oro-claro)" fontSize="12" textAnchor="middle" fontWeight="500">
                9 de julio · Independencia
              </text>
            </g>

            {RUTAS_NOTICIA.map((ruta, j) => (
              <path
                key={`n-${j}`}
                data-trazo-cong={ruta.etapa}
                d={ruta.d}
                fill="none"
                stroke="var(--oro)"
                strokeWidth="2.4"
                strokeLinecap="round"
                opacity="0.9"
                filter="url(#glow-cong-oro)"
              />
            ))}
            <g data-capa-cong="3">
              <text x={450} y={380} fill="var(--oro-claro)" fontSize="10" textAnchor="middle">
                el Acta viaja al territorio
              </text>
            </g>

            <HitoCongreso {...ILU_CONGRESO.casa} color="#aab4c8" lado="abajo" />
          </BaseMapaCongreso>
        </div>

        <div className="relative shrink-0 border-t border-linea-suave bg-fondo/90 px-4 py-5 backdrop-blur-md sm:px-8">
          <div className="relative mx-auto min-h-[7rem] max-h-[40vh] max-w-2xl overflow-y-auto sm:min-h-[9.5rem] sm:max-h-none">
            {etapas.map((etapa, i) => (
              <div
                key={etapa.nombre}
                data-ficha-cong={i}
                className="absolute inset-0 flex flex-col justify-center"
              >
                <p className="text-[0.65rem] uppercase tracking-[0.24em] text-tinta-tenue">
                  Etapa {i + 1} de {etapas.length} · {etapa.fecha}
                </p>
                <h3 className="titulo-display mt-1.5 text-lg font-semibold text-oro sm:text-xl lg:text-2xl">
                  {etapa.nombre}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-tinta-suave sm:text-[0.9375rem]">
                  {etapa.detalle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
