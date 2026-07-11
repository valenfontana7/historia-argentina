"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MapaCompactoNav } from "@/components/scrolly/MapaCompactoNav";
import {
  BaseMapaPavon,
  ETAPAS_PAVON,
  HitoPavon,
  ILU_PAVON,
  RUTA_CONFRONTACION,
  RUTA_HEGEMONIA,
  RUTA_VICTORIA,
} from "@/components/scrolly/MapaPavonIlustrado";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function MapaPavon() {
  const envoltorio = useRef<HTMLDivElement>(null);
  const etapas = ETAPAS_PAVON;

  useGSAP(
    () => {
      const fichas = gsap.utils.toArray<HTMLElement>("[data-ficha-mapa]");
      const trazos = gsap.utils.toArray<SVGPathElement>("[data-trazo-pav]");
      const capas = gsap.utils.toArray<SVGGElement>("[data-capa-pav]");

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

        const capa = capas.find((c) => c.dataset.capaPav === String(i));
        if (capa) tl.to(capa, { autoAlpha: 1, duration: 0.5 }, t + 0.3);

        const trazosEtapa = trazos.filter((tr) => tr.dataset.trazoPav === String(i));
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
          <BaseMapaPavon>
            <g data-capa-pav="0">
              <HitoPavon {...ILU_PAVON.buenosAires} color="var(--oro)" lado="der" />
              <HitoPavon {...ILU_PAVON.confederacion} color="var(--celeste)" lado="arriba" />
              <HitoPavon {...ILU_PAVON.urquiza} color="var(--celeste)" lado="abajo" />
            </g>

            <g data-capa-pav="1">
              <HitoPavon {...ILU_PAVON.pavon} color="var(--oro)" lado="abajo" />
              <HitoPavon {...ILU_PAVON.mitre} color="var(--oro-claro)" lado="der" />
              <text x={420} y={250} fill="#8d8271" fontSize="10" textAnchor="middle">
                puerto vs interior
              </text>
            </g>

            <path
              data-trazo-pav="2"
              d={RUTA_CONFRONTACION}
              fill="none"
              stroke="var(--celeste)"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <path
              data-trazo-pav="2"
              d={RUTA_VICTORIA}
              fill="none"
              stroke="var(--oro)"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#glow-pav-oro)"
            />
            <g data-capa-pav="2">
              <circle cx={420} cy={280} r={28} fill="var(--oro)" opacity="0.12" />
              <text x={420} y={230} fill="var(--oro)" fontSize="12" textAnchor="middle" fontWeight="500">
                16 de abril · Pavón
              </text>
            </g>

            <path
              data-trazo-pav="3"
              d={RUTA_HEGEMONIA}
              fill="none"
              stroke="var(--oro-claro)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <g data-capa-pav="3">
              <HitoPavon {...ILU_PAVON.buenosAires} color="var(--oro-claro)" lado="der" />
            </g>
          </BaseMapaPavon>
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
