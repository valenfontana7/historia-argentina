"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ControlesEtapasInline } from "@/components/scrolly/MapaCompactoNav";
import {
  BaseMapaConstitucion,
  ETAPAS_CONSTITUCION,
  HitoConstitucion,
  ILU_CONSTITUCION,
  RUTA_ACUERDO,
  RUTA_CONGRESO,
  RUTA_PROMULGACION,
  RUTA_SEPARACION,
} from "@/components/scrolly/MapaConstitucionIlustrado";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function MapaConstitucion() {
  const envoltorio = useRef<HTMLDivElement>(null);
  const etapas = ETAPAS_CONSTITUCION;

  useGSAP(
    () => {
      const fichas = gsap.utils.toArray<HTMLElement>("[data-ficha-mapa]");
      const trazos = gsap.utils.toArray<SVGPathElement>("[data-trazo-const]");
      const capas = gsap.utils.toArray<SVGGElement>("[data-capa-const]");

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

        const capa = capas.find((c) => c.dataset.capaConst === String(i));
        if (capa) tl.to(capa, { autoAlpha: 1, duration: 0.5 }, t + 0.3);

        const trazosEtapa = trazos.filter((tr) => tr.dataset.trazoConst === String(i));
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
          <BaseMapaConstitucion>
            <g data-capa-const="0">
              <text x={450} y={180} fill="var(--oro-claro)" fontSize="10" textAnchor="middle">
                un país por armar después de Caseros
              </text>
            </g>

            <path
              data-trazo-const="1"
              d={RUTA_ACUERDO}
              fill="none"
              stroke="var(--celeste)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <g data-capa-const="1">
              <HitoConstitucion {...ILU_CONSTITUCION.sanNicolas} color="var(--celeste)" lado="abajo" />
            </g>

            <path
              data-trazo-const="2"
              d={RUTA_CONGRESO}
              fill="none"
              stroke="var(--oro)"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <g data-capa-const="2">
              <HitoConstitucion {...ILU_CONSTITUCION.santaFe} color="var(--oro)" lado="der" />
              <text x={480} y={240} fill="var(--oro-claro)" fontSize="10" textAnchor="middle">
                Alberdi escribe las Bases
              </text>
            </g>

            <path
              data-trazo-const="3"
              d={RUTA_PROMULGACION}
              fill="none"
              stroke="var(--oro)"
              strokeWidth="2.8"
              strokeLinecap="round"
              filter="url(#glow-const-oro)"
            />
            <path
              data-trazo-const="3"
              d={RUTA_SEPARACION}
              fill="none"
              stroke="var(--carmesi)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="6 4"
              opacity="0.75"
            />
            <g data-capa-const="3">
              <circle cx={480} cy={275} r={32} fill="var(--oro)" opacity="0.1" />
              <HitoConstitucion {...ILU_CONSTITUCION.confederacion} color="var(--oro-claro)" lado="arriba" />
              <HitoConstitucion {...ILU_CONSTITUCION.buenosAires} color="var(--carmesi)" lado="der" />
              <text x={480} y={210} fill="var(--oro-claro)" fontSize="12" textAnchor="middle" fontWeight="500">
                1 de mayo de 1853
              </text>
            </g>
          </BaseMapaConstitucion>
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
