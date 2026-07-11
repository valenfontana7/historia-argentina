"use client";

import { useStorageSnapshot } from "@/lib/engagement/client-storage-sync";
import { obtenerSellos, type SelloVisita } from "@/lib/engagement/sellos";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  compacto?: boolean;
  titulo?: string;
};

const ETIQUETA_TIPO: Record<SelloVisita["tipo"], string> = {
  sala: "Sala",
  recorrido: "Visita guiada",
  exhibicion: "Exhibición",
};

export function SellosVisita({ compacto = false, titulo = "Sellos de visita" }: Props) {
  const sellos = useStorageSnapshot(obtenerSellos, []);

  if (sellos.length === 0) return null;

  if (compacto) {
    return (
      <p className="text-sm text-tinta-suave">
        {sellos.length} {sellos.length === 1 ? "sello" : "sellos"} en tu pasaporte del museo
      </p>
    );
  }

  return (
    <section aria-label="Sellos de visita">
      <Reveal>
        <p className="kicker">Tu pasaporte del museo</p>
        <h2 className="titulo-display mt-3 text-2xl font-medium text-oro">{titulo}</h2>
      </Reveal>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sellos.map((sello, i) => (
          <Reveal key={sello.id} delay={i * 0.04}>
            <li className="relative overflow-hidden rounded-sm border border-oro/35 bg-fondo-2 p-5">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full border border-oro/20"
              />
              <p className="text-[0.6rem] uppercase tracking-[0.2em] text-oro">
                {ETIQUETA_TIPO[sello.tipo]}
              </p>
              <p className="titulo-display mt-2 text-lg font-semibold leading-snug">
                {sello.titulo}
              </p>
              <p className="mt-1 text-sm italic text-tinta-tenue">{sello.subtitulo}</p>
              <p className="mt-4 text-[0.6rem] uppercase tracking-[0.14em] text-tinta-tenue">
                {new Date(sello.obtenidoEn).toLocaleDateString("es-AR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
