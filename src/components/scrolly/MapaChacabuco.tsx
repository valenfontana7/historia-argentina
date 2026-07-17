"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ControlesEtapasInline } from "@/components/scrolly/MapaCompactoNav";
import {
  BaseMapaChacabuco,
  ETAPAS_CHACABUCO,
  HitoChacabuco,
  ILU_CHACABUCO,
  RUTA_DESCENSO,
  RUTA_ENVOLVENTE,
  RUTA_FRONTAL,
  RUTA_VICTORIA,
} from "@/components/scrolly/MapaChacabucoIlustrado";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function MapaChacabuco() {
  const envoltorio = useRef<HTMLDivElement>(null);
  const etapas = ETAPAS_CHACABUCO;

  useGSAP(
    () => {
      const fichas = gsap.utils.toArray<HTMLElement>("[data-ficha-mapa]");
      const trazos = gsap.utils.toArray<SVGPathElement>("[data-trazo-cha]");
      const capas = gsap.utils.toArray<SVGGElement>("[data-capa-cha]");

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

        const capa = capas.find((c) => c.dataset.capaCha === String(i));
        if (capa) tl.to(capa, { autoAlpha: 1, duration: 0.5 }, t + 0.3);

        const trazosEtapa = trazos.filter((tr) => tr.dataset.trazoCha === String(i));
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
          <BaseMapaChacabuco>
            <path
              data-trazo-cha="0"
              d={RUTA_DESCENSO}
              fill="none"
              stroke="var(--celeste)"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <g data-capa-cha="0">
              <HitoChacabuco {...ILU_CHACABUCO.mendoza} color="var(--oro)" lado="abajo" />
              <HitoChacabuco {...ILU_CHACABUCO.losAndes} color="var(--celeste)" lado="der" />
            </g>

            <g data-capa-cha="1">
              <HitoChacabuco {...ILU_CHACABUCO.cuesta} color="var(--carmesi)" lado="arriba" />
              <text x={220} y={195} fill="#8d8271" fontSize="10" textAnchor="middle">
                realistas en altura
              </text>
            </g>

            <path
              data-trazo-cha="2"
              d={RUTA_FRONTAL}
              fill="none"
              stroke="var(--oro)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              data-trazo-cha="2"
              d={RUTA_ENVOLVENTE}
              fill="none"
              stroke="var(--celeste)"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#glow-cha-celeste)"
            />
            <g data-capa-cha="2">
              <HitoChacabuco {...ILU_CHACABUCO.ohiggins} color="var(--oro)" lado="abajo" />
              <HitoChacabuco {...ILU_CHACABUCO.soler} color="var(--celeste)" lado="der" />
              <text x={260} y={175} fill="var(--celeste)" fontSize="12" textAnchor="middle" fontWeight="500">
                12 de febrero · envolvente
              </text>
            </g>

            <path
              data-trazo-cha="3"
              d={RUTA_VICTORIA}
              fill="none"
              stroke="var(--oro-claro)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <g data-capa-cha="3">
              <HitoChacabuco {...ILU_CHACABUCO.santiago} color="var(--oro-claro)" lado="arriba" />
            </g>
          </BaseMapaChacabuco>
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
          <ControlesEtapasInline
            etapas={etapas}
            vhPorEtapa={120}
            contenedorRef={envoltorio}
          />
        </div>
      </div>
    </div>
    </>
  );
}
