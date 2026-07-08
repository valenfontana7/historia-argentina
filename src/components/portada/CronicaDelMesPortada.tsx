"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { tieneVisitaOnboarding } from "@/lib/engagement/storage";
import type { CronicaMeta } from "@/content/cronicas/registro";

type Props = {
  cronica: CronicaMeta;
};

export function CronicaDelMesPortada({ cronica }: Props) {
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    setMostrar(tieneVisitaOnboarding());
  }, []);

  if (!mostrar) {
    return (
      <section className="mx-auto max-w-6xl px-5 py-12">
        <p className="text-center text-sm text-tinta-tenue">
          <Link
            href={`/cronicas/${cronica.slug}`}
            className="text-oro-claro underline-offset-4 hover:underline"
          >
            También podés empezar por{" "}
            <Link
              href={`/cronicas/${cronica.slug}`}
              className="text-oro-claro underline-offset-4 hover:underline"
            >
              esta crónica del mes
            </Link>
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
            style={{
              background:
                "linear-gradient(180deg, #05070d 0%, #0a1020 50%, #16202f 100%)",
            }}
          >
            <svg
              aria-hidden
              className="absolute bottom-0 left-0 w-full opacity-80 transition-transform duration-700 group-hover:scale-[1.03]"
              viewBox="0 0 1200 240"
              preserveAspectRatio="none"
            >
              <path
                d="M0 240 L0 170 L140 90 L280 160 L420 60 L580 165 L720 75 L880 170 L1030 100 L1200 175 L1200 240 Z"
                fill="#121826"
              />
              <path
                d="M0 240 L0 205 L180 140 L360 205 L540 120 L740 210 L920 140 L1100 215 L1200 180 L1200 240 Z"
                fill="#080a10"
              />
            </svg>
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
