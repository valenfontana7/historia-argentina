"use client";

import { useRef, type ReactNode, type RefObject } from "react";
import { MapaCompactoNav } from "@/components/scrolly/MapaCompactoNav";

export type EtapaScrolly = {
  nombre: string;
  fecha?: string;
  detalle: string;
};

type Props = {
  etapas: EtapaScrolly[];
  vhPorEtapa?: number;
  prefijoEtapa?: string;
  envoltorioRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
  /** Panel de fichas personalizado; si no se pasa, se renderiza el estándar. */
  fichas?: ReactNode;
};

/** Contenedor scrolly común: mapa sticky + panel de fichas + nav compacta mobile. */
export function MapaScrollyShell({
  etapas,
  vhPorEtapa = 120,
  prefijoEtapa = "Etapa",
  envoltorioRef,
  children,
  fichas,
}: Props) {
  return (
    <>
      <div
        ref={envoltorioRef}
        className="relative"
        style={{ height: `${etapas.length * vhPorEtapa}vh` }}
      >
        <div className="sticky top-0 flex h-svh flex-col overflow-hidden bg-[#080b10]">
          <div className="relative min-h-0 flex-1 px-3 pt-3 sm:px-6 sm:pt-5">
            {children}
          </div>

          <div className="relative shrink-0 border-t border-linea-suave bg-fondo/90 px-4 py-5 backdrop-blur-md sm:px-8">
            <div className="relative mx-auto min-h-[7rem] max-h-[40vh] max-w-2xl overflow-y-auto sm:min-h-[9.5rem] sm:max-h-none">
              {fichas ??
                etapas.map((etapa, i) => (
                  <div
                    key={etapa.nombre}
                    data-ficha-mapa={i}
                    className="absolute inset-0 flex flex-col justify-center"
                  >
                    <p className="text-[0.65rem] uppercase tracking-[0.24em] text-tinta-tenue">
                      {prefijoEtapa} {i + 1} de {etapas.length}
                      {etapa.fecha ? ` · ${etapa.fecha}` : ""}
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
        vhPorEtapa={vhPorEtapa}
        contenedorRef={envoltorioRef}
      />
    </>
  );
}

/** Ref interno cuando el mapa no necesita exponer el envoltorio al GSAP. */
export function useMapaScrollyRef() {
  return useRef<HTMLDivElement>(null);
}
