"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { EtiquetaCta } from "@/components/ui/FlechaCta";

type Props = {
  compacto?: boolean;
};

/** Bloque de conversión: se oculta solo si hay sesión mecenas (check en cliente). */
export function CtaMecenas({ compacto = false }: Props) {
  const [oculto, setOculto] = useState(false);

  useEffect(() => {
    let cancelado = false;
    fetch("/api/auth/estado")
      .then((r) => r.json())
      .then((data: { mecenas?: boolean }) => {
        if (!cancelado && data.mecenas) setOculto(true);
      })
      .catch(() => {});
    return () => {
      cancelado = true;
    };
  }, []);

  if (oculto) return null;

  if (compacto) {
    return (
      <aside className="text-center">
        <p className="text-sm text-tinta-suave">
          ¿Querés más historias exclusivas?{" "}
          <Link
            href="/membresia"
            className="group text-oro-claro underline-offset-4 transition-colors hover:text-oro hover:underline"
          >
            <EtiquetaCta>Conocé Mecenas</EtiquetaCta>
          </Link>
        </p>
      </aside>
    );
  }

  return (
    <aside className="mx-auto max-w-2xl rounded-sm border border-oro/30 bg-gradient-to-br from-[#16120c] to-fondo-2 px-8 py-12 text-center">
      <p className="kicker">Mecenas</p>
      <h3 className="titulo-display mt-3 text-2xl font-semibold sm:text-3xl">
        Más historias exclusivas
      </h3>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-tinta-suave">
        Argent es gratis para empezar. Mecenas abre crónicas exclusivas, el mapa
        completo y recorridos especiales.
      </p>
      <Link
        href="/membresia"
        className="group mt-6 inline-flex rounded-full bg-oro px-6 py-3 text-sm font-semibold text-fondo transition-colors hover:bg-oro-claro"
      >
        <EtiquetaCta>Ver planes</EtiquetaCta>
      </Link>
    </aside>
  );
}
