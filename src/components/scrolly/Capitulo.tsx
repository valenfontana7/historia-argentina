"use client";

import { Reveal } from "@/components/ui/Reveal";
import { useCapituloIndex } from "@/lib/audioguia/capitulo-index";

type CapituloProps = {
  numero: string;
  titulo: string;
  bajada?: string;
};

/** Portada de capítulo dentro de una crónica. */
export function Capitulo({ numero, titulo, bajada }: CapituloProps) {
  const capituloIndex = useCapituloIndex();

  return (
    <section
      className="textura-papel relative py-24"
      data-audioguia-capitulo={capituloIndex ?? undefined}
    >
      <Reveal className="relative mx-auto max-w-3xl px-5 text-center">
        <p className="kicker">Capítulo {numero}</p>
        <div className="filete mx-auto my-6 w-24" />
        <h2 className="titulo-display text-4xl font-semibold leading-tight sm:text-5xl">
          {titulo}
        </h2>
        {bajada && (
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-tinta-suave">
            {bajada}
          </p>
        )}
      </Reveal>
    </section>
  );
}
