"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  BaseMapaSanLorenzo,
  ETAPAS_SAN_LORENZO,
  HitoSanLorenzo,
  ILU_SAN_LORENZO,
  RUTA_CARGA,
  RUTA_CONVoy,
  RUTA_DESEMBARCO,
  RUTA_VICTORIA,
} from "@/components/scrolly/MapaSanLorenzoIlustrado";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function MapaSanLorenzo() {
  const envoltorio = useRef<HTMLDivElement>(null);
  const etapas = ETAPAS_SAN_LORENZO;

  useGSAP(
    () => {
      const fichas = gsap.utils.toArray<HTMLElement>("[data-ficha-sl]");
      const trazos = gsap.utils.toArray<SVGPathElement>("[data-trazo-sl]");
      const capas = gsap.utils.toArray<SVGGElement>("[data-capa-sl]");

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

        const capa = capas.find((c) => c.dataset.capaSl === String(i));
        if (capa) tl.to(capa, { autoAlpha: 1, duration: 0.5 }, t + 0.3);

        const trazosEtapa = trazos.filter((tr) => tr.dataset.trazoSl === String(i));
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
    <div ref={envoltorio} className="relative" style={{ height: `${etapas.length * 120}vh` }}>
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden bg-[#080b10]">
        <div className="relative min-h-0 flex-1 px-3 pt-3 sm:px-6 sm:pt-5">
          <BaseMapaSanLorenzo>
            <path
              data-trazo-sl="0"
              d={RUTA_CONVoy}
              fill="none"
              stroke="var(--carmesi)"
              strokeWidth="2.4"
              strokeLinecap="round"
              opacity="0.8"
            />
            <g data-capa-sl="0">
              <text x={350} y={190} fill="var(--carmesi)" fontSize="10" textAnchor="middle">
                convoy realista en el Paraná
              </text>
            </g>

            <path
              data-trazo-sl="1"
              d={RUTA_DESEMBARCO}
              fill="none"
              stroke="var(--carmesi)"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <g data-capa-sl="1">
              <HitoSanLorenzo {...ILU_SAN_LORENZO.desembarco} color="var(--carmesi)" lado="izq" />
              <HitoSanLorenzo {...ILU_SAN_LORENZO.convento} color="#8d8271" lado="der" />
            </g>

            <path
              data-trazo-sl="2"
              d={RUTA_CARGA}
              fill="none"
              stroke="var(--celeste)"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#glow-sl-celeste)"
            />
            <g data-capa-sl="2">
              <circle cx={580} cy={292} r={30} fill="var(--celeste)" opacity="0.12" />
              <HitoSanLorenzo {...ILU_SAN_LORENZO.granaderos} color="var(--celeste)" lado="abajo" />
              <text x={580} y={240} fill="var(--celeste)" fontSize="12" textAnchor="middle" fontWeight="500">
                3 de febrero · la carga
              </text>
            </g>

            <path
              data-trazo-sl="3"
              d={RUTA_VICTORIA}
              fill="none"
              stroke="var(--oro)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <g data-capa-sl="3">
              <HitoSanLorenzo {...ILU_SAN_LORENZO.rio} color="var(--oro-claro)" lado="der" />
              <text x={450} y={200} fill="var(--oro-claro)" fontSize="10" textAnchor="middle">
                el pino de San Lorenzo
              </text>
            </g>
          </BaseMapaSanLorenzo>
        </div>

        <div className="relative shrink-0 border-t border-linea-suave bg-fondo/90 px-4 py-5 backdrop-blur-md sm:px-8">
          <div className="relative mx-auto min-h-[7rem] max-h-[40vh] max-w-2xl overflow-y-auto sm:min-h-[9.5rem] sm:max-h-none">
            {etapas.map((etapa, i) => (
              <div
                key={etapa.nombre}
                data-ficha-sl={i}
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
  );
}
