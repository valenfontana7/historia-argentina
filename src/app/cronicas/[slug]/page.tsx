import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EscenaHero } from "@/components/scrolly/EscenaHero";
import { CtaMecenas } from "@/components/membresia/CtaMecenas";
import { SoftGate } from "@/components/membresia/SoftGate";
import { BotonCompartir } from "@/components/BotonCompartir";
import {
  cronicas,
  cargadores,
  obtenerCronica,
  requiereMecenas,
} from "@/content/cronicas/registro";
import { esMecenasActivo } from "@/lib/auth";
import { sitio } from "@/lib/site.config";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  // Las exclusivas consultan cookie + DB: se renderizan on-demand.
  return cronicas.filter((c) => c.acceso === "publico").map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cronica = obtenerCronica(slug);
  if (!cronica) return {};
  return {
    title: cronica.titulo,
    description: cronica.descripcion,
    openGraph: {
      title: cronica.titulo,
      description: cronica.descripcion,
      type: "article",
    },
  };
}

export default async function CronicaPage({ params }: Props) {
  const { slug } = await params;
  const cronica = obtenerCronica(slug);
  const cargador = cargadores[slug];
  if (!cronica || !cargador) notFound();

  const exclusivas = requiereMecenas(cronica);
  const mecenas = exclusivas ? await esMecenasActivo() : true;
  const mostrarContenido = !exclusivas || mecenas;

  const Contenido = mostrarContenido ? (await cargador()).default : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: cronica.titulo,
    description: cronica.descripcion,
    datePublished: cronica.publicada,
    inLanguage: "es",
    author: { "@type": "Organization", name: sitio.nombre },
    publisher: { "@type": "Organization", name: sitio.nombre },
    mainEntityOfPage: `${sitio.url}/cronicas/${cronica.slug}`,
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EscenaHero
        kicker={cronica.kicker}
        titulo={cronica.titulo}
        subtitulo={cronica.subtitulo}
        meta={`${cronica.periodo} · Lectura: ${cronica.duracion}`}
      />

      {mostrarContenido && Contenido ? (
        <>
          <Contenido />
          <div className="mx-auto max-w-2xl px-5 py-10">
            <CtaMecenas />
          </div>
          <footer className="mx-auto max-w-2xl px-5 pb-28 pt-6 text-center">
            <div className="filete mb-10" />
            <p className="kicker">Seguí explorando</p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href={`/panteon/${cronica.protagonista.slug}`}
                className="rounded-full border border-oro/50 px-6 py-3 text-sm text-oro-claro transition-colors hover:bg-oro/10"
              >
                {cronica.protagonista.etiqueta} →
              </Link>
              <BotonCompartir
                titulo={cronica.titulo}
                texto={cronica.subtitulo}
                ruta={`/cronicas/${cronica.slug}`}
              />
              <Link
                href="/cronicas"
                className="rounded-full border border-linea px-6 py-3 text-sm text-tinta-suave transition-colors hover:border-oro/40 hover:text-oro-claro"
              >
                Todas las crónicas
              </Link>
            </div>
          </footer>
        </>
      ) : (
        <SoftGate titulo={cronica.titulo} />
      )}
    </article>
  );
}
