import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { BotonCompartir } from "@/components/BotonCompartir";
import { BoletinForm } from "@/components/BoletinForm";
import { efemerides, obtenerEfemeride, vecinas } from "@/data/efemerides";
import { obtenerVarios } from "@/data/personajes";
import { sitio } from "@/lib/site.config";

type Props = {
  params: Promise<{ dia: string }>;
};

export function generateStaticParams() {
  return efemerides.map((e) => ({ dia: e.dia }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dia } = await params;
  const efemeride = obtenerEfemeride(dia);
  if (!efemeride) return {};
  return {
    title: `¿Qué pasó un ${efemeride.fecha} en Argentina? ${efemeride.titulo}`,
    description: `${efemeride.fecha} de ${efemeride.anio}: ${efemeride.titulo}. La historia del día, contada en 90 segundos.`,
    openGraph: {
      title: `${efemeride.fecha} de ${efemeride.anio} — ${efemeride.titulo}`,
      description: efemeride.historia[0],
      type: "article",
    },
  };
}

export default async function EfemeridePage({ params }: Props) {
  const { dia } = await params;
  const efemeride = obtenerEfemeride(dia);
  if (!efemeride) notFound();

  const navegacion = vecinas(dia);
  const personajesRelacionados = obtenerVarios(efemeride.relacionados);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${efemeride.fecha} de ${efemeride.anio}: ${efemeride.titulo}`,
    description: efemeride.historia[0],
    inLanguage: "es",
    author: { "@type": "Organization", name: sitio.nombre },
    publisher: { "@type": "Organization", name: sitio.nombre },
    mainEntityOfPage: `${sitio.url}/hoy/${efemeride.dia}`,
  };

  return (
    <article className="mx-auto max-w-3xl px-5 pb-28 pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Reveal>
        <p className="kicker text-center">Un día como hoy · {efemeride.categoria}</p>
        <p className="titulo-display mt-8 text-center text-[5.5rem] font-semibold leading-none text-oro sm:text-[7rem]">
          {efemeride.anio}
        </p>
        <p className="mt-3 text-center text-sm uppercase tracking-[0.3em] text-tinta-suave">
          {efemeride.fecha}
        </p>
        <div className="filete mx-auto my-10 w-32" />
        <h1 className="titulo-display text-center text-4xl font-semibold leading-tight sm:text-5xl">
          {efemeride.titulo}
        </h1>
      </Reveal>

      <Reveal className="mt-14">
        <div className="prosa capitular">
          {efemeride.historia.map((parrafo, i) => (
            <p key={i}>{parrafo}</p>
          ))}
        </div>
      </Reveal>

      {personajesRelacionados.length > 0 && (
        <Reveal className="mt-14">
          <p className="kicker">Protagonistas</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {personajesRelacionados.map((p) => (
              <Link
                key={p.slug}
                href={`/panteon/${p.slug}`}
                className="rounded-full border border-linea px-5 py-2.5 text-sm text-tinta-suave transition-colors hover:border-oro/50 hover:text-oro-claro"
              >
                {p.nombre} →
              </Link>
            ))}
          </div>
        </Reveal>
      )}

      <Reveal className="mt-14 flex justify-center">
        <BotonCompartir
          titulo={`${efemeride.fecha} de ${efemeride.anio}: ${efemeride.titulo}`}
          texto={`Un día como hoy en la historia argentina: ${efemeride.titulo} (${efemeride.anio}).`}
          ruta={`/hoy/${efemeride.dia}`}
        />
      </Reveal>

      {navegacion && (
        <Reveal className="mt-16">
          <div className="grid grid-cols-2 gap-4 border-t border-linea-suave pt-8">
            <Link href={`/hoy/${navegacion.anterior.dia}`} className="group">
              <p className="text-xs uppercase tracking-[0.2em] text-tinta-tenue">
                ← {navegacion.anterior.fecha}
              </p>
              <p className="mt-2 text-sm leading-snug text-tinta-suave transition-colors group-hover:text-oro-claro">
                {navegacion.anterior.titulo}
              </p>
            </Link>
            <Link href={`/hoy/${navegacion.siguiente.dia}`} className="group text-right">
              <p className="text-xs uppercase tracking-[0.2em] text-tinta-tenue">
                {navegacion.siguiente.fecha} →
              </p>
              <p className="mt-2 text-sm leading-snug text-tinta-suave transition-colors group-hover:text-oro-claro">
                {navegacion.siguiente.titulo}
              </p>
            </Link>
          </div>
        </Reveal>
      )}

      <Reveal className="mt-20 rounded-sm border border-linea bg-fondo-2 p-8 text-center sm:p-10">
        <p className="titulo-display text-2xl font-semibold">
          Una historia argentina cada mañana
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-tinta-suave">
          La efeméride del día, contada en 90 segundos, directo en tu casilla.
          Gratis, sin spam, para siempre.
        </p>
        <div className="mt-6">
          <BoletinForm />
        </div>
      </Reveal>
    </article>
  );
}
