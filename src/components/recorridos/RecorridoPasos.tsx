"use client";

import Image from "next/image";
import { TransicionLink } from "@/components/navigation/TransicionLink";
import type { PasoRecorrido } from "@/data/recorridos";
import { etiquetasTipo, rutaDeNodo } from "@/lib/grafo/rutas";
import type { NodoEntidad } from "@/lib/grafo/tipos";
import { Reveal } from "@/components/ui/Reveal";

type PasoResuelto = {
  paso: PasoRecorrido;
  nodo: NodoEntidad;
};

type Props = {
  pasos: PasoResuelto[];
  tituloRecorrido: string;
};

export function RecorridoPasos({ pasos, tituloRecorrido }: Props) {
  return (
    <div className="relative">
      {/* Espina narrativa: desktop */}
      <div
        aria-hidden
        className="absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-oro/60 via-oro/20 to-transparent sm:left-6 lg:block"
      />

      <ol className="space-y-0">
        {pasos.map(({ paso, nodo }, i) => (
          <li key={`${nodo.tipo}-${nodo.slug}-${i}`} className="relative">
            {/* Marcador en la espina */}
            <div
              aria-hidden
              className="absolute left-2.5 top-8 hidden h-3 w-3 rounded-full border-2 border-oro bg-fondo lg:block"
              style={{ left: "1.125rem" }}
            />

            <Reveal delay={i * 0.06}>
              <article className="lg:ml-16 lg:pb-16">
                {paso.puente && i > 0 && (
                  <p className="mb-4 max-w-xl text-sm italic leading-relaxed text-tinta-tenue lg:ml-0">
                    {paso.puente}
                  </p>
                )}

                <div className="overflow-hidden rounded-sm border border-linea bg-fondo-2 transition-colors hover:border-oro/35">
                  {nodo.imagen && (
                    <div className="relative aspect-[21/9] bg-fondo-3">
                      <Image
                        src={nodo.imagen}
                        alt=""
                        fill
                        unoptimized
                        sizes="800px"
                        className="object-cover opacity-45 sepia-[0.25]"
                        aria-hidden
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-fondo-2 via-fondo/40 to-transparent" />
                    </div>
                  )}

                  <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <p className="text-[0.6rem] uppercase tracking-[0.24em] text-oro">
                        Estación {i + 1} · {etiquetasTipo[nodo.tipo]}
                      </p>
                      {nodo.anio && (
                        <p className="text-xs text-tinta-tenue">{nodo.anio}</p>
                      )}
                    </div>
                    <h3 className="titulo-display mt-3 text-2xl font-semibold leading-snug sm:text-3xl">
                      {nodo.titulo}
                    </h3>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-tinta-suave sm:text-base">
                      {nodo.resumen}
                    </p>
                    <TransicionLink
                      href={rutaDeNodo(nodo)}
                      className="mt-6 inline-block rounded-full border border-oro/50 px-6 py-3 text-sm text-oro-claro transition-colors hover:bg-oro/10"
                    >
                      Entrar →
                    </TransicionLink>
                  </div>
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>

      <Reveal className="mt-8 lg:ml-16">
        <div className="rounded-sm border border-oro/30 bg-oro/5 px-6 py-8 text-center">
          <p className="kicker">Visita completada</p>
          <p className="titulo-display mt-3 text-xl font-medium text-oro">
            Recorriste «{tituloRecorrido}»
          </p>
          <p className="mt-2 text-sm text-tinta-suave">
            {pasos.length} estaciones · ¿Qué sala querés recorrer ahora?
          </p>
        </div>
      </Reveal>
    </div>
  );
}
