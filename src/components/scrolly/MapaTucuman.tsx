"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ControlesEtapasInline } from "@/components/scrolly/MapaCompactoNav";
import {
  BaseMapaTucuman,
  ETAPAS_TUCUMAN,
  HitoTucuman,
  ILU_TUCUMAN,
  RUTA_BATALLA,
  RUTA_EXODO,
  RUTA_ORDEN,
  RUTA_VICTORIA,
} from "@/components/scrolly/MapaTucumanIlustrado";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Scrolly de Tucumán: del Éxodo a la victoria de Belgrano. */
export function MapaTucuman() {
  const envoltorio = useRef<HTMLDivElement>(null);
  const etapas = ETAPAS_TUCUMAN;

  useGSAP(
    () => {
      const fichas = gsap.utils.toArray<HTMLElement>("[data-ficha-mapa]");
      const trazos = gsap.utils.toArray<SVGPathElement>("[data-trazo-tuc]");
      const capas = gsap.utils.toArray<SVGGElement>("[data-capa-tuc]");

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

        const capa = capas.find((c) => c.dataset.capaTuc === String(i));
        if (capa) tl.to(capa, { autoAlpha: 1, duration: 0.5 }, t + 0.3);

        const trazosEtapa = trazos.filter((tr) => tr.dataset.trazoTuc === String(i));
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
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden bg-[#080b10]">
        <div className="relative min-h-0 flex-1 px-3 pt-3 sm:px-6 sm:pt-5">
          <BaseMapaTucuman>
            <path
              data-trazo-tuc="0"
              d={RUTA_EXODO}
              fill="none"
              stroke="var(--oro)"
              strokeWidth="2.6"
              strokeLinecap="round"
              opacity="0.9"
            />
            <g data-capa-tuc="0">
              <HitoTucuman {...ILU_TUCUMAN.jujuy} color="var(--oro)" lado="arriba" />
              <text x={350} y={200} fill="var(--oro-claro)" fontSize="10" textAnchor="middle">
                población en marcha al sur
              </text>
            </g>

            <path
              data-trazo-tuc="1"
              d={RUTA_ORDEN}
              fill="none"
              stroke="var(--carmesi)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="6 4"
              opacity="0.75"
            />
            <g data-capa-tuc="1">
              <HitoTucuman {...ILU_TUCUMAN.cordoba} color="var(--carmesi)" lado="abajo" />
              <HitoTucuman {...ILU_TUCUMAN.belgrano} color="var(--celeste)" lado="izq" />
              <text x={500} y={360} fill="#8d8271" fontSize="10" textAnchor="middle">
                Belgrano desobedece
              </text>
            </g>

            <path
              data-trazo-tuc="2"
              d={RUTA_BATALLA}
              fill="none"
              stroke="var(--celeste)"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#glow-tuc-celeste)"
            />
            <g data-capa-tuc="2">
              <circle cx={480} cy={310} r={32} fill="var(--celeste)" opacity="0.12" />
              <text x={480} y={250} fill="var(--celeste)" fontSize="12" textAnchor="middle" fontWeight="500">
                24 de septiembre · la batalla
              </text>
              <HitoTucuman {...ILU_TUCUMAN.campo} color="var(--celeste)" lado="abajo" />
            </g>

            <path
              data-trazo-tuc="3"
              d={RUTA_VICTORIA}
              fill="none"
              stroke="var(--oro)"
              strokeWidth="2.4"
              strokeLinecap="round"
              filter="url(#glow-tuc-oro)"
            />
            <g data-capa-tuc="3">
              <HitoTucuman {...ILU_TUCUMAN.tucuman} color="var(--oro-claro)" lado="der" />
              <text x={380} y={180} fill="var(--oro-claro)" fontSize="10" textAnchor="middle">
                la noticia recorre el territorio
              </text>
            </g>
          </BaseMapaTucuman>
        </div>

        <div className="relative shrink-0 border-t border-linea-suave bg-fondo/90 px-4 py-5 backdrop-blur-md sm:px-8">
          <div className="relative mx-auto min-h-[7rem] max-h-[40vh] max-w-2xl overflow-y-auto sm:min-h-[9.5rem] sm:max-h-none">
            {etapas.map((etapa, i) => (
              <div
                key={etapa.nombre}
                data-ficha-mapa={i}
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

    </>
  );
}
