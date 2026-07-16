"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MapaScrollyShell } from "@/components/scrolly/MapaScrollyShell";
import {
  BaseMapaMayo,
  ETAPAS_MAYO,
  HitoMayo,
  ILU_MAYO,
  RUTA_FUERTE,
  RUTA_RUMOR,
  RUTAS_MILICIAS,
} from "@/components/scrolly/MapaMayoIlustrado";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Scrolly de las 48 horas de Mayo: del rumor del 18 al Fuerte el 25,
 * con milicias convergiendo sobre la Plaza.
 */
export function MapaMayo() {
  const envoltorio = useRef<HTMLDivElement>(null);
  const etapas = ETAPAS_MAYO;

  useGSAP(
    () => {
      const fichas = gsap.utils.toArray<HTMLElement>("[data-ficha-mapa]");
      const trazos = gsap.utils.toArray<SVGPathElement>("[data-trazo-mayo]");
      const capas = gsap.utils.toArray<SVGGElement>("[data-capa-mayo]");

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

        const capa = capas.find((c) => c.dataset.capaMayo === String(i));
        if (capa) tl.to(capa, { autoAlpha: 1, duration: 0.5 }, t + 0.3);

        const trazosEtapa = trazos.filter((tr) => tr.dataset.trazoMayo === String(i));
        trazosEtapa.forEach((tr, j) => {
          tl.to(tr, { strokeDashoffset: 0, duration: 1.6 }, t + 0.4 + j * 0.12);
        });

        if (i < etapas.length - 1) {
          tl.to(fichas[i], { autoAlpha: 0, y: -16, duration: 0.5 }, t + 2.6);
        }
      });
    },
    { scope: envoltorio },
  );

  return (
    <MapaScrollyShell
      etapas={etapas}
      prefijoEtapa="Hora"
      envoltorioRef={envoltorio}
    >
      <BaseMapaMayo>
            {/* Etapa 0: rumor desde tertulias */}
            <path
              data-trazo-mayo="0"
              d={RUTA_RUMOR}
              fill="none"
              stroke="#8d8271"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="6 4"
              opacity="0.85"
            />
            <g data-capa-mayo="0">
              <HitoMayo {...ILU_MAYO.jaboneria} color="#8d8271" lado="abajo" />
              <HitoMayo {...ILU_MAYO.anonima} color="#8d8271" lado="izq" />
              <text x={468} y={340} fill="#8d8271" fontSize="10" textAnchor="middle" opacity="0.9">
                pasquines y tertulias
              </text>
            </g>

            {/* Etapa 1: cabildo abierto */}
            <g data-capa-mayo="1">
              <HitoMayo {...ILU_MAYO.cabildo} color="var(--celeste)" lado="abajo" />
              <circle cx={648} cy={318} r={18} fill="var(--celeste)" opacity="0.1" />
              <text x={648} y={358} fill="var(--celeste)" fontSize="10" textAnchor="middle">
                ~200 vecinos con voz
              </text>
            </g>

            {/* Etapas 2–4: milicias convergen */}
            {RUTAS_MILICIAS.map((ruta, j) => (
              <path
                key={j}
                data-trazo-mayo={ruta.etapa}
                d={ruta.d}
                fill="none"
                stroke="var(--celeste)"
                strokeWidth="2.4"
                strokeLinecap="round"
                opacity="0.9"
              />
            ))}
            <g data-capa-mayo="2">
              <HitoMayo {...ILU_MAYO.patricios} color="var(--celeste)" lado="arriba" />
              <HitoMayo {...ILU_MAYO.arribeños} color="var(--celeste)" lado="izq" />
            </g>
            <g data-capa-mayo="3">
              <circle cx={684} cy={278} r={28} fill="var(--celeste)" opacity="0.08" />
              <text x={684} y={248} fill="var(--celeste)" fontSize="10" textAnchor="middle">
                la Plaza se llena
              </text>
            </g>
            <g data-capa-mayo="4">
              <text x={684} y={232} fill="var(--carmesi)" fontSize="11" textAnchor="middle" fontWeight="500">
                Junta con Cisneros rechazada
              </text>
            </g>

            {/* Etapa 5: Primera Junta en el Fuerte */}
            <path
              data-trazo-mayo="5"
              d={RUTA_FUERTE}
              fill="none"
              stroke="var(--oro)"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#glow-mayo-oro)"
            />
            <g data-capa-mayo="5">
              <circle cx={712} cy={278} r={22} fill="var(--oro)" opacity="0.14" />
              <circle
                cx={712}
                cy={278}
                r={12}
                fill="none"
                stroke="var(--oro)"
                strokeWidth="1.5"
                filter="url(#glow-mayo-oro)"
              />
              <text x={712} y={248} fill="var(--oro-claro)" fontSize="11" textAnchor="middle" fontWeight="500">
                Primera Junta
              </text>
            </g>

            <HitoMayo {...ILU_MAYO.fuerte} color="#aab4c8" lado="der" />
            <HitoMayo {...ILU_MAYO.plaza} color="#8a94a8" lado="arriba" />
          </BaseMapaMayo>
    </MapaScrollyShell>
  );
}
