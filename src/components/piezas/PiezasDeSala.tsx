import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { TransicionLink } from "@/components/navigation/TransicionLink";
import {
  ETIQUETAS_TIPO_PIEZA,
  piezasDeExhibicion,
  type Pieza,
} from "@/lib/piezas/indice";

type Props = {
  slug: string;
  tituloExhibicion?: string;
};

export function PiezasDeSala({ slug, tituloExhibicion }: Props) {
  const piezas = piezasDeExhibicion(slug);
  if (piezas.length === 0) return null;

  return (
    <section
      className="mx-auto max-w-6xl px-5 py-16"
      aria-label="Piezas de esta sala"
    >
      <Reveal>
        <p className="kicker">Patrimonio visual</p>
        <h2 className="titulo-display mt-4 text-2xl font-medium text-oro sm:text-3xl">
          {tituloExhibicion
            ? `Piezas de «${tituloExhibicion}»`
            : "Piezas de esta sala"}
        </h2>
      </Reveal>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {piezas.map((pieza, i) => (
          <Reveal key={pieza.id} delay={i * 0.05}>
            <PiezaMiniCard pieza={pieza} />
          </Reveal>
        ))}
      </ul>
      <Reveal className="mt-8">
        <Link
          href="/piezas"
          className="text-sm text-oro-claro transition-colors hover:text-oro"
        >
          Ver toda la colección →
        </Link>
      </Reveal>
    </section>
  );
}

function PiezaMiniCard({ pieza }: { pieza: Pieza }) {
  return (
    <TransicionLink
      href={`/piezas/${pieza.id}`}
      className="group flex gap-4 overflow-hidden rounded-sm border border-linea bg-fondo-2 p-3 transition-colors hover:border-oro/40"
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-fondo-3">
        <Image
          src={pieza.url}
          alt=""
          fill
          unoptimized
          sizes="80px"
          className="object-cover sepia-[0.35] transition-transform duration-500 group-hover:scale-105"
          aria-hidden
        />
      </div>
      <div className="min-w-0 flex-1 py-1">
        <p className="text-[0.6rem] uppercase tracking-[0.18em] text-oro">
          {ETIQUETAS_TIPO_PIEZA[pieza.tipo]}
        </p>
        <p className="mt-1 line-clamp-2 text-sm leading-snug text-tinta transition-colors group-hover:text-oro-claro">
          {pieza.alt}
        </p>
      </div>
    </TransicionLink>
  );
}
