import Link from "next/link";
import type { ItemRiel } from "@/lib/exploracion/rieles-home";
import { RielCarrusel } from "@/components/exploracion/RielCarrusel";
import { Reveal } from "@/components/ui/Reveal";
import { EtiquetaCta } from "@/components/ui/FlechaCta";

type Props = {
  titulo: string;
  subtitulo?: string;
  items: ItemRiel[];
  verMasHref?: string;
  verMasEtiqueta?: string;
};

/** Carrusel horizontal de descubrimiento (estilo feed, no catálogo). */
export function RielDescubrimiento({
  titulo,
  subtitulo,
  items,
  verMasHref,
  verMasEtiqueta = "Ver más",
}: Props) {
  if (items.length === 0) return null;

  return (
    <section className="py-10 sm:py-14" aria-label={titulo}>
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="titulo-display text-2xl font-medium text-oro sm:text-3xl">
                {titulo}
              </h2>
              {subtitulo && (
                <p className="mt-2 max-w-lg text-sm text-tinta-suave">{subtitulo}</p>
              )}
            </div>
            {verMasHref && (
              <Link
                href={verMasHref}
                className="group shrink-0 text-xs uppercase tracking-[0.18em] text-tinta-suave transition-colors hover:text-oro-claro"
              >
                <EtiquetaCta>{verMasEtiqueta}</EtiquetaCta>
              </Link>
            )}
          </div>
        </Reveal>
      </div>

      <div className="mt-6">
        <RielCarrusel items={items} />
      </div>
    </section>
  );
}
