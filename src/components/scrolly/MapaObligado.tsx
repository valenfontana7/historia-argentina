"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MapaCompactoNav } from "@/components/scrolly/MapaCompactoNav";
import {
  BaseMapaObligado,
  ETAPAS_OBLIGADO,
  HitoObligado,
  ILU_OBLIGADO,
  RUTA_COMBATE,
  RUTA_FLOTA,
  RUTA_RETIRADA,
  RUTA_SOBERANIA,
} from "@/components/scrolly/MapaObligadoIlustrado";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Scrolly de la Vuelta de Obligado: del bloqueo a la retirada enemiga. */
export function MapaObligado() {
  const envoltorio = useRef<HTMLDivElement>(null);
  const etapas = ETAPAS_OBLIGADO;

  useGSAP(
    () => {
      const fichas = gsap.utils.toArray<HTMLElement>("[data-ficha-mapa]");
      const trazos = gsap.utils.toArray<SVGPathElement>("[data-trazo-obl]");
      const capas = gsap.utils.toArray<SVGGElement>("[data-capa-obl]");

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

        const capa = capas.find((c) => c.dataset.capaObl === String(i));
        if (capa) tl.to(capa, { autoAlpha: 1, duration: 0.5 }, t + 0.3);

        const trazosEtapa = trazos.filter((tr) => tr.dataset.trazoObl === String(i));
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
          <BaseMapaObligado>
            <path
              data-trazo-obl="0"
              d={RUTA_FLOTA}
              fill="none"
              stroke="var(--carmesi)"
              strokeWidth="2.6"
              strokeLinecap="round"
              opacity="0.85"
            />
            <g data-capa-obl="0">
              <HitoObligado {...ILU_OBLIGADO.flota} color="var(--carmesi)" lado="arriba" />
              <text x={300} y={170} fill="var(--carmesi)" fontSize="10" textAnchor="middle">
                bloqueo anglofrancés
              </text>
            </g>

            <g data-capa-obl="1">
              <line x1={380} y1={300} x2={520} y2={300} stroke="var(--oro)" strokeWidth="2" opacity="0.7" />
              <HitoObligado {...ILU_OBLIGADO.cadenas} color="var(--oro)" lado="abajo" />
              <HitoObligado {...ILU_OBLIGADO.recodo} color="var(--oro-claro)" lado="arriba" />
            </g>

            <path
              data-trazo-obl="2"
              d={RUTA_COMBATE}
              fill="none"
              stroke="var(--celeste)"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#glow-obl-celeste)"
            />
            <g data-capa-obl="2">
              <circle cx={450} cy={272} r={30} fill="var(--celeste)" opacity="0.12" />
              <HitoObligado {...ILU_OBLIGADO.baterias} color="var(--celeste)" lado="izq" />
              <text x={450} y={220} fill="var(--celeste)" fontSize="12" textAnchor="middle" fontWeight="500">
                20 de noviembre · siete horas
              </text>
            </g>

            <path
              data-trazo-obl="3"
              d={RUTA_RETIRADA}
              fill="none"
              stroke="var(--carmesi)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="6 4"
              opacity="0.7"
            />
            <path
              data-trazo-obl="3"
              d={RUTA_SOBERANIA}
              fill="none"
              stroke="var(--oro)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <g data-capa-obl="3">
              <HitoObligado {...ILU_OBLIGADO.rosas} color="var(--oro-claro)" lado="der" />
              <text x={600} y={300} fill="var(--oro-claro)" fontSize="10" textAnchor="middle">
                símbolo de soberanía nacional
              </text>
            </g>
          </BaseMapaObligado>
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
