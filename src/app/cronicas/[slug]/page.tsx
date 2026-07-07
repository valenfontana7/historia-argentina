import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EscenaHero } from "@/components/scrolly/EscenaHero";
import { cronicas, cargadores, obtenerCronica } from "@/content/cronicas/registro";
import { sitio } from "@/lib/site.config";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return cronicas.map((c) => ({ slug: c.slug }));
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

  const { default: Contenido } = await cargador();

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
      <Contenido />
      <footer className="mx-auto max-w-2xl px-5 pb-28 pt-10 text-center">
        <div className="filete mb-10" />
        <p className="kicker">Seguí explorando</p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/panteon/jose-de-san-martin"
            className="rounded-full border border-oro/50 px-6 py-3 text-sm text-oro-claro transition-colors hover:bg-oro/10"
          >
            La ficha de San Martín →
          </Link>
          <Link
            href="/cronicas"
            className="rounded-full border border-linea px-6 py-3 text-sm text-tinta-suave transition-colors hover:border-oro/40 hover:text-oro-claro"
          >
            Todas las crónicas
          </Link>
        </div>
      </footer>
    </article>
  );
}
