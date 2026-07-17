import Image from "next/image";
import Link from "next/link";
import { EtiquetaCta } from "@/components/ui/FlechaCta";
import { Reveal } from "@/components/ui/Reveal";
import { TransicionLink } from "@/components/navigation/TransicionLink";
import {
  ETIQUETAS_TIPO_PIEZA,
  piezasDeExhibicion,
  type Pieza,
} from "@/lib/piezas/indice";

type Props = {
  slug: string;
  /** @deprecated Ya no se usa en el título; se conserva por callers legacy. */
  tituloExhibicion?: string;
};

export function PiezasDeSala({ slug }: Props) {
  const piezas = piezasDeExhibicion(slug);
  if (piezas.length === 0) return null;

  return (
    <section
      className="mx-auto max-w-6xl px-5 py-6 sm:py-8"
      aria-label="Objetos de esta historia"
    >
      <Reveal>
        <p className="kicker">Objetos</p>
      </Reveal>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {piezas.map((pieza, i) => (
          <Reveal key={pieza.id} delay={i * 0.04}>
            <PiezaMiniCard pieza={pieza} />
          </Reveal>
        ))}
      </ul>
      <Reveal className="mt-4">
        <Link
          href="/piezas"
          className="group text-xs text-tinta-tenue transition-colors hover:text-oro-claro"
        >
          <EtiquetaCta>Ver más objetos</EtiquetaCta>
        </Link>
      </Reveal>
    </section>
  );
}

function PiezaMiniCard({ pieza }: { pieza: Pieza }) {
  return (
    <TransicionLink
      href={`/piezas/${pieza.id}`}
      className="group flex gap-3 overflow-hidden rounded-sm border border-linea/80 bg-fondo-2/80 p-2.5 transition-colors hover:border-oro/35"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm bg-fondo-3">
        <Image
          src={pieza.url}
          alt=""
          fill
          unoptimized
          sizes="56px"
          className="object-cover sepia-[0.3] transition-transform duration-500 group-hover:scale-105"
          aria-hidden
        />
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <p className="text-[0.55rem] uppercase tracking-[0.16em] text-oro">
          {ETIQUETAS_TIPO_PIEZA[pieza.tipo]}
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-tinta-suave transition-colors group-hover:text-oro-claro">
          {pieza.alt}
        </p>
      </div>
    </TransicionLink>
  );
}
