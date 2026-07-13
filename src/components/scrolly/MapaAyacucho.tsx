"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ControlesEtapasInline } from "@/components/scrolly/MapaCompactoNav";
import {
  BaseMapaAyacucho,
  ETAPAS_AYACUCHO,
  HitoAyacucho,
  ILU_AYACUCHO,
  RUTA_AYACUCHO_LIMA,
  RUTA_CUZCO_JUNIN,
  RUTA_JUNIN_AYACUCHO,
} from "@/components/scrolly/MapaAyacuchoIlustrado";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function MapaAyacucho() {
  const envoltorio = useRef<HTMLDivElement>(null);
  const etapas = ETAPAS_AYACUCHO;

  useGSAP(
    () => {
      const fichas = gsap.utils.toArray<HTMLElement>("[data-ficha-mapa]");
      const trazos = gsap.utils.toArray<SVGPathElement>("[data-trazo-aya]");
      const capas = gsap.utils.toArray<SVGGElement>("[data-capa-aya]");

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

        const capa = capas.find((c) => c.dataset.capaAya === String(i));
        if (capa) tl.to(capa, { autoAlpha: 1, duration: 0.5 }, t + 0.3);

        const trazosEtapa = trazos.filter((tr) => tr.dataset.trazoAya === String(i));
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
          <BaseMapaAyacucho>
            <g data-capa-aya="0">
              <HitoAyacucho {...ILU_AYACUCHO.junin} color="var(--oro-claro)" lado="izq" />
              <HitoAyacucho {...ILU_AYACUCHO.cuzco} color="#8d8271" lado="der" />
            </g>
            <path
              data-trazo-aya="0"
              d={RUTA_CUZCO_JUNIN}
              fill="none"
              stroke="var(--oro-claro)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="6 4"
            />
            <path
              data-trazo-aya="0"
              d={RUTA_JUNIN_AYACUCHO}
              fill="none"
              stroke="var(--celeste)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />

            <g data-capa-aya="1">
              <HitoAyacucho {...ILU_AYACUCHO.ayacucho} color="var(--celeste)" lado="arriba" />
              <circle cx={520} cy={240} r={36} fill="var(--celeste)" opacity="0.1" />
              <text x={520} y={200} fill="var(--celeste)" fontSize="12" textAnchor="middle" fontWeight="500">
                9 de diciembre · Pampa de la Quinua
              </text>
            </g>

            <g data-capa-aya="2">
              <text x={520} y={280} fill="var(--oro)" fontSize="10" textAnchor="middle">
                capitulación del virrey La Serna
              </text>
            </g>

            <g data-capa-aya="3">
              <HitoAyacucho {...ILU_AYACUCHO.lima} color="var(--oro)" lado="abajo" />
            </g>
            <path
              data-trazo-aya="3"
              d={RUTA_AYACUCHO_LIMA}
              fill="none"
              stroke="var(--oro)"
              strokeWidth="2.6"
              strokeLinecap="round"
              filter="url(#glow-aya-celeste)"
            />
          </BaseMapaAyacucho>
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
