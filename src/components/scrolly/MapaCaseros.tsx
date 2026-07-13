"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ControlesEtapasInline } from "@/components/scrolly/MapaCompactoNav";
import {
  BaseMapaCaseros,
  ETAPAS_CASEROS,
  HitoCaseros,
  ILU_CASEROS,
  RUTA_AVANCE,
  RUTA_CHOQUE,
  RUTA_ENTRADA,
  RUTA_HUIDA,
} from "@/components/scrolly/MapaCaserosIlustrado";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Scrolly de Caseros: del avance de Urquiza a la huida de Rosas. */
export function MapaCaseros() {
  const envoltorio = useRef<HTMLDivElement>(null);
  const etapas = ETAPAS_CASEROS;

  useGSAP(
    () => {
      const fichas = gsap.utils.toArray<HTMLElement>("[data-ficha-mapa]");
      const trazos = gsap.utils.toArray<SVGPathElement>("[data-trazo-cas]");
      const capas = gsap.utils.toArray<SVGGElement>("[data-capa-cas]");

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

        const capa = capas.find((c) => c.dataset.capaCas === String(i));
        if (capa) tl.to(capa, { autoAlpha: 1, duration: 0.5 }, t + 0.3);

        const trazosEtapa = trazos.filter((tr) => tr.dataset.trazoCas === String(i));
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
          <BaseMapaCaseros>
            <path
              data-trazo-cas="0"
              d={RUTA_AVANCE}
              fill="none"
              stroke="var(--celeste)"
              strokeWidth="2.8"
              strokeLinecap="round"
              opacity="0.9"
            />
            <g data-capa-cas="0">
              <HitoCaseros {...ILU_CASEROS.urquiza} color="var(--celeste)" lado="abajo" />
              <text x={280} y={250} fill="var(--celeste)" fontSize="10" textAnchor="middle">
                avance desde el oeste
              </text>
            </g>

            <g data-capa-cas="1">
              <HitoCaseros {...ILU_CASEROS.campo} color="var(--oro)" lado="abajo" />
              <HitoCaseros {...ILU_CASEROS.rosas} color="var(--carmesi)" lado="arriba" />
              <text x={450} y={200} fill="#8d8271" fontSize="10" textAnchor="middle">
                dos líneas frente a frente
              </text>
            </g>

            <path
              data-trazo-cas="2"
              d={RUTA_CHOQUE}
              fill="none"
              stroke="var(--carmesi)"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#glow-cas-carmesi)"
            />
            <g data-capa-cas="2">
              <circle cx={450} cy={272} r={30} fill="var(--carmesi)" opacity="0.12" />
              <text x={450} y={195} fill="var(--carmesi)" fontSize="12" textAnchor="middle" fontWeight="500">
                3 de febrero · el choque
              </text>
            </g>

            <path
              data-trazo-cas="3"
              d={RUTA_HUIDA}
              fill="none"
              stroke="var(--carmesi)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="6 4"
              opacity="0.8"
            />
            <path
              data-trazo-cas="3"
              d={RUTA_ENTRADA}
              fill="none"
              stroke="var(--oro)"
              strokeWidth="2.6"
              strokeLinecap="round"
              filter="url(#glow-cas-oro)"
            />
            <g data-capa-cas="3">
              <HitoCaseros {...ILU_CASEROS.buenosAires} color="var(--oro-claro)" lado="der" />
              <text x={620} y={200} fill="var(--oro-claro)" fontSize="10" textAnchor="middle">
                Rosas al exilio · la ciudad se abre
              </text>
            </g>
          </BaseMapaCaseros>
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
