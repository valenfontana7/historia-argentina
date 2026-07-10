"use client";

import Link from "next/link";
import { useStorageSnapshot } from "@/lib/engagement/client-storage-sync";
import { tieneVisitaOnboarding } from "@/lib/engagement/storage";
import type { CronicaMeta } from "@/content/cronicas/registro";
import { MiniSiluetaHero, gradientesHero } from "@/components/scrolly/HeroSiluetas";

type Props = {
  cronica: CronicaMeta;
};

export function CronicaDelMesPortada({ cronica }: Props) {
  const mostrar = useStorageSnapshot(tieneVisitaOnboarding, false);
  const variante = cronica.visual.varianteHero;

  if (!mostrar) {
    return (
      <section className="mx-auto max-w-6xl px-5 py-12">
        <p className="text-center text-sm text-tinta-tenue">
          También podés empezar por{" "}
          <Link
            href={`/cronicas/${cronica.slug}`}
            className="text-oro-claro underline-offset-4 hover:underline"
          >
            esta crónica del mes
          </Link>
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-24">
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <h2 className="titulo-display shrink-0 text-2xl font-medium text-oro">
            La crónica del mes
          </h2>
          <div className="filete w-full" />
        </div>
      </div>
      <div className="mt-10">
        <Link
          href={`/cronicas/${cronica.slug}`}
          className="group relative block overflow-hidden rounded-sm border border-linea"
        >
          <div
            className="relative px-8 py-20 sm:px-14 sm:py-28"
            style={{ background: gradientesHero[variante] }}
          >
            <MiniSiluetaHero variante={variante} />
            <div className="relative">
              <p className="kicker">{cronica.kicker}</p>
              <h3 className="titulo-display mt-4 max-w-2xl text-4xl font-semibold leading-tight transition-colors group-hover:text-oro-claro sm:text-6xl">
                {cronica.titulo}
              </h3>
              <p className="mt-5 max-w-xl leading-relaxed text-tinta-suave">
                {cronica.subtitulo}
              </p>
              <p className="mt-8 inline-block rounded-full bg-oro px-7 py-3.5 text-sm font-semibold text-fondo transition-colors group-hover:bg-oro-claro">
                Vivir la historia →
              </p>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
