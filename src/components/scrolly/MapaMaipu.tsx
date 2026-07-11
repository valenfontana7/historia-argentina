"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MapaCompactoNav } from "@/components/scrolly/MapaCompactoNav";
import {
  BaseMapaMaipu,
  ETAPAS_MAIPU,
  HitoMaipu,
  ILU_MAIPU,
  RUTA_BATALLA,
  RUTA_LIBERACION,
  RUTA_REGRUPO,
} from "@/components/scrolly/MapaMaipuIlustrado";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function MapaMaipu() {
  const envoltorio = useRef<HTMLDivElement>(null);
  const etapas = ETAPAS_MAIPU;

  useGSAP(
    () => {
      const fichas = gsap.utils.toArray<HTMLElement>("[data-ficha-mapa]");
      const trazos = gsap.utils.toArray<SVGPathElement>("[data-trazo-maip]");
      const capas = gsap.utils.toArray<SVGGElement>("[data-capa-maip]");

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

        const capa = capas.find((c) => c.dataset.capaMaip === String(i));
        if (capa) tl.to(capa, { autoAlpha: 1, duration: 0.5 }, t + 0.3);

        const trazosEtapa = trazos.filter((tr) => tr.dataset.trazoMaip === String(i));
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
          <BaseMapaMaipu>
            <g data-capa-maip="0">
              <HitoMaipu {...ILU_MAIPU.canchaRayada} color="var(--carmesi)" lado="abajo" />
              <text x={280} y={310} fill="var(--carmesi)" fontSize="10" textAnchor="middle">
                emboscada · casi aniquilados
              </text>
            </g>

            <path
              data-trazo-maip="1"
              d={RUTA_REGRUPO}
              fill="none"
              stroke="var(--oro)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <g data-capa-maip="1">
              <HitoMaipu {...ILU_MAIPU.sanMartin} color="var(--oro)" lado="der" />
            </g>

            <path
              data-trazo-maip="2"
              d={RUTA_BATALLA}
              fill="none"
              stroke="var(--celeste)"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#glow-maip-celeste)"
            />
            <g data-capa-maip="2">
              <HitoMaipu {...ILU_MAIPU.maipu} color="var(--celeste)" lado="arriba" />
              <HitoMaipu {...ILU_MAIPU.osorio} color="var(--carmesi)" lado="abajo" />
              <text x={240} y={200} fill="var(--celeste)" fontSize="12" textAnchor="middle" fontWeight="500">
                5 de abril · seis horas
              </text>
            </g>

            <path
              data-trazo-maip="3"
              d={RUTA_LIBERACION}
              fill="none"
              stroke="var(--oro-claro)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <g data-capa-maip="3">
              <HitoMaipu {...ILU_MAIPU.santiago} color="var(--oro-claro)" lado="arriba" />
            </g>
          </BaseMapaMaipu>
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

    <MapaCompactoNav

      etapas={etapas}

      vhPorEtapa={120}

      contenedorRef={envoltorio}

    />

    </>
  );
}
