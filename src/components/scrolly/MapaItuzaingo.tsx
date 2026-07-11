"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MapaCompactoNav } from "@/components/scrolly/MapaCompactoNav";
import {
  BaseMapaItuzaingo,
  ETAPAS_ITUZAINGO,
  HitoItuzaingo,
  ILU_ITUZAINGO,
  RUTA_BRANDSEN,
  RUTA_BRASIL,
  RUTA_RETORNO,
} from "@/components/scrolly/MapaItuzaingoIlustrado";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function MapaItuzaingo() {
  const envoltorio = useRef<HTMLDivElement>(null);
  const etapas = ETAPAS_ITUZAINGO;

  useGSAP(
    () => {
      const fichas = gsap.utils.toArray<HTMLElement>("[data-ficha-mapa]");
      const trazos = gsap.utils.toArray<SVGPathElement>("[data-trazo-itu]");
      const capas = gsap.utils.toArray<SVGGElement>("[data-capa-itu]");

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

        const capa = capas.find((c) => c.dataset.capaItu === String(i));
        if (capa) tl.to(capa, { autoAlpha: 1, duration: 0.5 }, t + 0.3);

        const trazosEtapa = trazos.filter((tr) => tr.dataset.trazoItu === String(i));
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
          <BaseMapaItuzaingo>
            <g data-capa-itu="0">
              <HitoItuzaingo {...ILU_ITUZAINGO.brasil} color="var(--oro)" lado="izq" />
              <HitoItuzaingo {...ILU_ITUZAINGO.buenosAires} color="var(--celeste)" lado="der" />
            </g>
            <path
              data-trazo-itu="0"
              d={RUTA_BRASIL}
              fill="none"
              stroke="var(--oro)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />

            <g data-capa-itu="1">
              <HitoItuzaingo {...ILU_ITUZAINGO.ituzaingo} color="var(--celeste)" lado="arriba" />
              <circle cx={420} cy={280} r={32} fill="var(--celeste)" opacity="0.1" />
              <text x={420} y={240} fill="var(--celeste)" fontSize="12" textAnchor="middle" fontWeight="500">
                20 de febrero · el choque
              </text>
            </g>

            <g data-capa-itu="2">
              <HitoItuzaingo {...ILU_ITUZAINGO.brandsen} color="#8d8271" lado="abajo" />
            </g>
            <path
              data-trazo-itu="2"
              d={RUTA_BRANDSEN}
              fill="none"
              stroke="#8d8271"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="6 4"
            />

            <g data-capa-itu="3">
              <text x={560} y={300} fill="var(--oro-claro)" fontSize="10" textAnchor="middle">
                hacia el rosismo
              </text>
            </g>
            <path
              data-trazo-itu="3"
              d={RUTA_RETORNO}
              fill="none"
              stroke="var(--celeste)"
              strokeWidth="2.6"
              strokeLinecap="round"
              filter="url(#glow-itu-celeste)"
            />
          </BaseMapaItuzaingo>
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
