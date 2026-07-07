"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  BAJAS_DEFENSA,
  BaseMapaDefensa,
  COLUMNAS_DEFENSA,
  ETAPAS_DEFENSA,
  HitoDefensa,
  ILU_DEFENSA,
  RUTA_DESEMBARCO,
} from "@/components/scrolly/MapaDefensaIlustrado";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Scrolly de la Defensa de 1807: el desembarco, Miserere, las trece
 * columnas, la guerra de las azoteas y la capitulación, en seis etapas.
 */
export function MapaDefensa() {
  const envoltorio = useRef<HTMLDivElement>(null);
  const etapas = ETAPAS_DEFENSA;

  useGSAP(
    () => {
      const fichas = gsap.utils.toArray<HTMLElement>("[data-ficha-defensa]");
      const trazos = gsap.utils.toArray<SVGPathElement>("[data-trazo-defensa]");
      const capas = gsap.utils.toArray<SVGGElement>("[data-capa-defensa]");

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

        // Cada etapa enciende su capa; las columnas (etapa 2) además se dibujan.
        const capa = capas.find((c) => c.dataset.capaDefensa === String(i));
        if (capa) tl.to(capa, { autoAlpha: 1, duration: 0.5 }, t + 0.3);

        const trazosEtapa = trazos.filter((tr) => tr.dataset.trazoDefensa === String(i));
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
    <div ref={envoltorio} className="relative" style={{ height: `${etapas.length * 120}vh` }}>
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden bg-[#080b10]">
        <div className="relative min-h-0 flex-1 px-3 pt-3 sm:px-6 sm:pt-5">
          <BaseMapaDefensa>
            {/* Etapa 0 — desembarco y aproximación desde el sur */}
            <path
              data-trazo-defensa="0"
              d={RUTA_DESEMBARCO}
              fill="none"
              stroke="var(--carmesi)"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#glow-defensa-carmesi)"
            />
            <g data-capa-defensa="0">
              <text x={430} y={540} fill="#c07060" fontSize="11" textAnchor="middle">
                Desde Ensenada · ~10.000 hombres
              </text>
            </g>

            {/* Etapa 1 — choque de Miserere */}
            <g data-capa-defensa="1">
              <HitoDefensa {...ILU_DEFENSA.miserere} color="#c8d0e0" lado="abajo" />
              <circle cx={196} cy={318} r={14} fill="var(--carmesi)" opacity="0.14" />
              <text x={196} y={324} fill="var(--carmesi)" fontSize="16" textAnchor="middle" fontWeight="bold">
                ✕
              </text>
            </g>

            {/* Etapa 2 — las columnas entran a la cuadrícula */}
            {COLUMNAS_DEFENSA.map((col, j) => (
              <path
                key={j}
                data-trazo-defensa="2"
                d={col.d}
                fill="none"
                stroke="var(--carmesi)"
                strokeWidth="2.4"
                strokeLinecap="round"
                opacity="0.9"
              />
            ))}
            <g data-capa-defensa="2">
              <text x={252} y={88} fill="#c07060" fontSize="10" letterSpacing="2">
                COLUMNAS BRITÁNICAS →
              </text>
            </g>

            {/* Etapa 3 — la guerra de las azoteas: columnas destrozadas */}
            <g data-capa-defensa="3">
              {BAJAS_DEFENSA.map(([x, y], j) => (
                <g key={j}>
                  <circle cx={x} cy={y} r={12} fill="var(--carmesi)" opacity="0.12" />
                  <text x={x} y={y + 5} fill="var(--carmesi)" fontSize="15" textAnchor="middle" fontWeight="bold">
                    ✕
                  </text>
                </g>
              ))}
              <text x={356} y={200} fill="var(--oro-claro)" fontSize="10" opacity="0.9">
                fuego desde las azoteas
              </text>
            </g>

            {/* Etapa 4 — Santo Domingo */}
            <g data-capa-defensa="4">
              <HitoDefensa {...ILU_DEFENSA.santoDomingo} color="var(--oro-claro)" lado="abajo" />
              <circle
                cx={ILU_DEFENSA.santoDomingo.x}
                cy={ILU_DEFENSA.santoDomingo.y}
                r={16}
                fill="none"
                stroke="var(--oro)"
                strokeWidth="1.5"
                filter="url(#glow-defensa-oro)"
              />
            </g>

            {/* Etapa 5 — capitulación en la Plaza Mayor */}
            <g data-capa-defensa="5">
              <circle
                cx={ILU_DEFENSA.plazaMayor.x}
                cy={ILU_DEFENSA.plazaMayor.y}
                r={20}
                fill="var(--oro)"
                opacity="0.14"
              />
              <circle
                cx={ILU_DEFENSA.plazaMayor.x}
                cy={ILU_DEFENSA.plazaMayor.y}
                r={10}
                fill="none"
                stroke="var(--oro)"
                strokeWidth="1.5"
                filter="url(#glow-defensa-oro)"
              />
              <text
                x={ILU_DEFENSA.plazaMayor.x}
                y={ILU_DEFENSA.plazaMayor.y - 26}
                fill="var(--oro-claro)"
                fontSize="11"
                textAnchor="middle"
                fontWeight="500"
              >
                Rendición
              </text>
            </g>

            {/* Hitos permanentes */}
            <HitoDefensa {...ILU_DEFENSA.plazaMayor} color="#aab4c8" lado="arriba" />
            <HitoDefensa {...ILU_DEFENSA.retiro} color="#8a94a8" lado="izq" />
            <HitoDefensa {...ILU_DEFENSA.residencia} color="#8a94a8" lado="izq" />
          </BaseMapaDefensa>
        </div>

        <div className="relative shrink-0 border-t border-linea-suave bg-fondo/90 px-4 py-5 backdrop-blur-md sm:px-8">
          <div className="relative mx-auto min-h-[9.5rem] max-w-2xl">
            {etapas.map((etapa, i) => (
              <div
                key={etapa.nombre}
                data-ficha-defensa={i}
                className="absolute inset-0 flex flex-col justify-center"
              >
                <p className="text-[0.65rem] uppercase tracking-[0.24em] text-tinta-tenue">
                  Etapa {i + 1} de {etapas.length} · {etapa.fecha}
                </p>
                <h3 className="titulo-display mt-1.5 text-xl font-semibold text-oro sm:text-2xl">
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
