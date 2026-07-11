"use client";

import Link from "next/link";
import { TransicionLink } from "@/components/navigation/TransicionLink";
import type { CronicaMeta } from "@/content/cronicas/registro";
import { formatearFechaPublica } from "@/lib/cronicas/acceso";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  exposiciones: CronicaMeta[];
  esMecenas?: boolean;
};

/** Vitrina de exhibiciones temporales en anticipo para mecenas. */
export function ExposicionesTemporales({ exposiciones, esMecenas = false }: Props) {
  if (exposiciones.length === 0) return null;

  return (
    <section className="mt-16" aria-label="Exposiciones temporales">
      <Reveal>
        <p className="kicker">Exposición temporal</p>
        <h2 className="titulo-display mt-3 text-2xl font-medium text-oro sm:text-3xl">
          {esMecenas
            ? "Anticipo exclusivo para mecenas"
            : "Próximas aperturas al público"}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-tinta-suave">
          {esMecenas
            ? "Entrá antes que nadie a estas salas. El resto del museo las verá cuando abran oficialmente."
            : "Estas exhibiciones abren pronto. Los mecenas ya pueden recorrerlas."}
        </p>
      </Reveal>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {exposiciones.map((c, i) => (
          <Reveal key={c.slug} delay={i * 0.05}>
            <article className="flex h-full flex-col rounded-sm border border-oro/35 bg-fondo-2 p-5 sm:p-6">
              <p className="text-[0.6rem] uppercase tracking-[0.2em] text-oro">
                Anticipo · {c.kicker.replace(/^Crónica N\.º \d+ · /, "")}
              </p>
              <h3 className="titulo-display mt-2 text-xl font-semibold leading-snug">
                {c.titulo}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-tinta-suave">
                {c.subtitulo}
              </p>
              {c.publicacionPublica && (
                <p className="mt-4 text-xs uppercase tracking-[0.16em] text-tinta-tenue">
                  Apertura pública: {formatearFechaPublica(c.publicacionPublica)}
                </p>
              )}
              {esMecenas ? (
                <TransicionLink
                  href={`/cronicas/${c.slug}`}
                  className="mt-5 inline-block text-sm font-medium text-oro-claro transition-colors hover:text-oro"
                >
                  Entrar antes que nadie →
                </TransicionLink>
              ) : (
                <Link
                  href="/membresia"
                  className="mt-5 inline-block text-sm font-medium text-oro-claro transition-colors hover:text-oro"
                >
                  Hacete mecenas para el anticipo →
                </Link>
              )}
            </article>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
