"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ControlesEtapasInline } from "@/components/scrolly/MapaCompactoNav";
import {
  BaseMapaMalvinas,
  ETAPAS_MALVINAS,
  HitoMalvinas,
  ILU_MALVINAS,
  RUTA_CONFLICTO,
  RUTA_DESEMBARCO,
  RUTA_FLOTA,
  RUTA_RENDICION,
} from "@/components/scrolly/MapaMalvinasIlustrado";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Scrolly de Malvinas: 74 días del desembarco a la rendición. */
export function MapaMalvinas() {
  const envoltorio = useRef<HTMLDivElement>(null);
  const etapas = ETAPAS_MALVINAS;

  useGSAP(
    () => {
      const fichas = gsap.utils.toArray<HTMLElement>("[data-ficha-mapa]");
      const trazos = gsap.utils.toArray<SVGPathElement>("[data-trazo-mal]");
      const capas = gsap.utils.toArray<SVGGElement>("[data-capa-mal]");

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

        const capa = capas.find((c) => c.dataset.capaMal === String(i));
        if (capa) tl.to(capa, { autoAlpha: 1, duration: 0.5 }, t + 0.3);

        const trazosEtapa = trazos.filter((tr) => tr.dataset.trazoMal === String(i));
        trazosEtapa.forEach((tr, j) => {
          tl.to(tr, { strokeDashoffset: 0, duration: 1.5 }, t + 0.4 + j * 0.12);
        });

        if (i < etapas.length - 1) {
          tl.to(fichas[i], { autoAlpha: 0, y: -16, duration: 0.5 }, t + 2.6);
        }
      });
    },
    { scope: envoltorio },
  );

  return (
    <>
    <div ref={envoltorio} className="relative" style={{ height: `${etapas.length * 120}vh` }}>
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden bg-[#080b10] pb-16 lg:pb-0" data-scrolly-mapa>
        <div className="relative min-h-0 flex-1 px-3 pt-3 sm:px-6 sm:pt-5">
          <BaseMapaMalvinas>
            <path
              data-trazo-mal="0"
              d={RUTA_DESEMBARCO}
              fill="none"
              stroke="var(--celeste)"
              strokeWidth="2.8"
              strokeLinecap="round"
              filter="url(#glow-mal-celeste)"
            />
            <g data-capa-mal="0">
              <HitoMalvinas {...ILU_MALVINAS.cono} color="var(--celeste)" lado="abajo" />
              <HitoMalvinas {...ILU_MALVINAS.puerto} color="var(--celeste)" lado="der" />
              <text x={500} y={300} fill="var(--celeste)" fontSize="10" textAnchor="middle">
                2 de abril · Operación Rosario
              </text>
            </g>

            <g data-capa-mal="1">
              <circle cx={280} cy={370} r={28} fill="var(--oro)" opacity="0.1" />
              <text x={280} y={340} fill="var(--oro-claro)" fontSize="10" textAnchor="middle">
                movilización en el continente
              </text>
            </g>

            <path
              data-trazo-mal="2"
              d={RUTA_FLOTA}
              fill="none"
              stroke="var(--carmesi)"
              strokeWidth="2.6"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              data-trazo-mal="2"
              d={RUTA_CONFLICTO}
              fill="none"
              stroke="var(--carmesi)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="6 4"
            />
            <g data-capa-mal="2">
              <HitoMalvinas {...ILU_MALVINAS.flota} color="var(--carmesi)" lado="arriba" />
              <HitoMalvinas {...ILU_MALVINAS.islas} color="var(--oro)" lado="arriba" />
              <text x={650} y={160} fill="var(--carmesi)" fontSize="11" textAnchor="middle" fontWeight="500">
                74 días en el Atlántico Sur
              </text>
            </g>

            <path
              data-trazo-mal="3"
              d={RUTA_RENDICION}
              fill="none"
              stroke="var(--oro)"
              strokeWidth="2.4"
              strokeLinecap="round"
              opacity="0.8"
            />
            <g data-capa-mal="3">
              <text x={500} y={400} fill="var(--oro-claro)" fontSize="10" textAnchor="middle">
                14 de junio · la rendición
              </text>
            </g>
          </BaseMapaMalvinas>
        </div>

        <div className="relative shrink-0 border-t border-linea-suave bg-fondo/90 px-4 py-5 backdrop-blur-md sm:px-8">
          <div className="relative mx-auto grid max-w-2xl">
            {etapas.map((etapa, i) => (
              <div
                key={etapa.nombre}
                data-ficha-mapa={i}
                className="col-start-1 row-start-1 flex flex-col justify-center px-0.5 py-1"
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

    </>
  );
}
