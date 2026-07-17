"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ControlesEtapasInline } from "@/components/scrolly/MapaCompactoNav";
import {
  BaseMapaJunin,
  ETAPAS_JUNIN,
  HitoJunin,
  ILU_JUNIN,
  RUTA_JUNIN_AYACUCHO,
  RUTA_LIMA_PASCO,
  RUTA_PASCO_JUNIN,
} from "@/components/scrolly/MapaJuninIlustrado";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function MapaJunin() {
  const envoltorio = useRef<HTMLDivElement>(null);
  const etapas = ETAPAS_JUNIN;

  useGSAP(
    () => {
      const fichas = gsap.utils.toArray<HTMLElement>("[data-ficha-mapa]");
      const trazos = gsap.utils.toArray<SVGPathElement>("[data-trazo-jun]");
      const capas = gsap.utils.toArray<SVGGElement>("[data-capa-jun]");

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

        const capa = capas.find((c) => c.dataset.capaJun === String(i));
        if (capa) tl.to(capa, { autoAlpha: 1, duration: 0.5 }, t + 0.3);

        const trazosEtapa = trazos.filter((tr) => tr.dataset.trazoJun === String(i));
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
          <BaseMapaJunin>
            <g data-capa-jun="0">
              <HitoJunin {...ILU_JUNIN.lima} color="var(--celeste)" lado="abajo" />
            </g>
            <path
              data-trazo-jun="0"
              d={RUTA_LIMA_PASCO}
              fill="none"
              stroke="var(--celeste)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />

            <g data-capa-jun="1">
              <HitoJunin {...ILU_JUNIN.pasco} color="var(--oro-claro)" lado="izq" />
            </g>
            <path
              data-trazo-jun="1"
              d={RUTA_PASCO_JUNIN}
              fill="none"
              stroke="var(--oro)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />

            <g data-capa-jun="2">
              <HitoJunin {...ILU_JUNIN.junin} color="var(--celeste)" lado="der" />
              <circle cx={480} cy={260} r={36} fill="var(--celeste)" opacity="0.1" />
              <text x={480} y={220} fill="var(--celeste)" fontSize="12" textAnchor="middle" fontWeight="500">
                6 de agosto · batalla de caballería
              </text>
            </g>

            <g data-capa-jun="3">
              <HitoJunin {...ILU_JUNIN.ayacucho} color="var(--oro)" lado="arriba" />
            </g>
            <path
              data-trazo-jun="3"
              d={RUTA_JUNIN_AYACUCHO}
              fill="none"
              stroke="var(--oro)"
              strokeWidth="2.6"
              strokeLinecap="round"
              filter="url(#glow-jun-celeste)"
            />
          </BaseMapaJunin>
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
