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
  cronicaDestacadaSlug: string;
};

function rutaPorDefecto(esMecenas: boolean, cronicaDestacadaSlug: string): Ruta {
  if (esMecenas) {
    return {
      href: "/mecenas",
      kicker: "Tu museo",
      titulo: "Seguí donde lo dejaste",
      descripcion:
        "Tus salas privadas, visitas guiadas especiales y tu pasaporte de mecenas te esperan.",
      cta: "Ir a tu museo →",
    };
  }
  return {
    href: `/cronicas/${cronicaDestacadaSlug}`,
    kicker: "Empezá acá",
    titulo: "Entrá a una exhibición inmersiva",
    descripcion:
      "La forma más simple de conocer Argent: una sala con mapas, piezas y relato, como un documental que se camina.",
    cta: "Comenzar la visita →",
  };
}

export function RutaRecomendada({ cronicaDestacadaSlug }: Props) {
  const [esMecenas, setEsMecenas] = useState(false);
  const [ruta, setRuta] = useState<Ruta>(() =>
    rutaPorDefecto(false, cronicaDestacadaSlug),
  );

  useEffect(() => {
    let cancelado = false;

    async function resolver() {
      let mecenas = false;
      try {
        const res = await fetch("/api/auth/estado");
        const data = (await res.json()) as { mecenas?: boolean };
        mecenas = Boolean(data.mecenas);
      } catch {
        mecenas = false;
      }
      if (cancelado) return;

      setEsMecenas(mecenas);
      if (mecenas) {
        setRuta(rutaPorDefecto(true, cronicaDestacadaSlug));
        return;
      }
      if (tieneVisitaOnboarding()) {
        setRuta({
          href: "/hoy",
          kicker: "Volvé por acá",
          titulo: "La pieza del día",
          descripcion:
            "Cada día el museo abre una vitrina: un día de la historia argentina. Si hoy aún no tiene la nuestra, te mostramos otra parecida.",
          cta: "Ver la pieza del día →",
        });
        return;
      }
      setRuta(rutaPorDefecto(false, cronicaDestacadaSlug));
    }

    void resolver();
    return () => {
      cancelado = true;
    };
  }, [cronicaDestacadaSlug]);

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
