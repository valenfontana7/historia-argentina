"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  marcarVisitaOnboarding,
  tieneVisitaOnboarding,
} from "@/lib/engagement/storage";

type Ruta = {
  href: string;
  kicker: string;
  titulo: string;
  descripcion: string;
  cta: string;
};

type Props = {
  esMecenas: boolean;
  cronicaDestacadaSlug: string;
};

function rutaPorDefecto(esMecenas: boolean, cronicaDestacadaSlug: string): Ruta {
  if (esMecenas) {
    return {
      href: "/mecenas",
      kicker: "Tu museo",
      titulo: "Retomá donde lo dejaste",
      descripcion:
        "Crónicas exclusivas, recorridos premium y tu área de mecenas te esperan.",
      cta: "Entrar a tu museo →",
    };
  }
  return {
    href: `/cronicas/${cronicaDestacadaSlug}`,
    kicker: "Empezá acá",
    titulo: "Viví una crónica inmersiva",
    descripcion:
      "La mejor forma de conocer Argent: una historia contada con scroll, mapas y citas — como un documental.",
    cta: "Empezar la crónica →",
  };
}

export function RutaRecomendada({ esMecenas, cronicaDestacadaSlug }: Props) {
  const [ruta, setRuta] = useState<Ruta>(() =>
    rutaPorDefecto(esMecenas, cronicaDestacadaSlug),
  );

  useEffect(() => {
    if (esMecenas) {
      setRuta(rutaPorDefecto(true, cronicaDestacadaSlug));
      return;
    }

    if (tieneVisitaOnboarding()) {
      setRuta({
        href: "/hoy",
        kicker: "Volvé por acá",
        titulo: "Una historia del archivo argentino",
        descripcion:
          "La efeméride de hoy — o una rotación honesta del archivo si este día aún no tiene entrada propia.",
        cta: "Leer la historia del día →",
      });
    }
  }, [esMecenas, cronicaDestacadaSlug]);

  const alClic = () => {
    if (!esMecenas) marcarVisitaOnboarding();
  };

  return (
    <section className="border-y border-linea-suave bg-fondo-2">
      <div className="mx-auto max-w-3xl px-5 py-16 text-center">
        <p className="kicker">{ruta.kicker}</p>
        <h2 className="titulo-display mt-4 text-3xl font-semibold sm:text-4xl">
          {ruta.titulo}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-tinta-suave">
          {ruta.descripcion}
        </p>
        <Link
          href={ruta.href}
          onClick={alClic}
          className="mt-8 inline-block rounded-full bg-oro px-8 py-3.5 text-sm font-semibold text-fondo transition-colors hover:bg-oro-claro"
        >
          {ruta.cta}
        </Link>
        <p className="mt-6">
          <Link
            href="/explorar"
            className="text-xs uppercase tracking-[0.2em] text-tinta-tenue transition-colors hover:text-oro-claro"
          >
            O explorá libremente →
          </Link>
        </p>
      </div>
    </section>
  );
}
