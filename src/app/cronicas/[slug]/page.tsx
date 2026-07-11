import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EscenaHero } from "@/components/scrolly/EscenaHero";
import { SalidasDeSala } from "@/components/museo/SalidasDeSala";
import { CtaMecenas } from "@/components/membresia/CtaMecenas";
import { SoftGate } from "@/components/membresia/SoftGate";
import { BarraProgresoLectura } from "@/components/engagement/BarraProgresoLectura";
import { RegistrarVisita } from "@/components/engagement/RegistrarVisita";
import { BotonCompartir } from "@/components/BotonCompartir";
import { MigasDePan } from "@/components/seo/MigasDePan";
import {
  cronicas,
  cargadores,
  obtenerCronica,
  requiereMecenas,
} from "@/content/cronicas/registro";
import { puedeVerContenidoMecenas } from "@/lib/auth";
import { obtenerNodo } from "@/lib/grafo/queries";
import { salidasCuradas } from "@/lib/grafo/salidas-curadas";
import { construirMetadata } from "@/lib/seo/metadata";
import { articuloJsonLd, migajasJsonLd } from "@/lib/seo/jsonld";
import { sitio } from "@/lib/site.config";

type Props = {
  params: Promise<{ slug: string }>;
};

/** Las exclusivas leen cookies; no mezclar con ISR del mismo segmento. */
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return cronicas.filter((c) => c.acceso === "publico").map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cronica = obtenerCronica(slug);
  if (!cronica) return {};
  const exclusiva = requiereMecenas(cronica);
  return construirMetadata({
    titulo: cronica.titulo,
    descripcion: cronica.descripcion,
    ruta: `/cronicas/${slug}`,
    tipo: "article",
    noindex: exclusiva,
    imagen: `${sitio.url}/cronicas/${slug}/opengraph-image`,
  });
}

export default async function CronicaPage({ params }: Props) {
  const { slug } = await params;
  const cronica = obtenerCronica(slug);
  const cargador = cargadores[slug];
  if (!cronica || !cargador) notFound();

  const exclusivas = requiereMecenas(cronica);
  const mecenas = exclusivas ? await puedeVerContenidoMecenas() : true;
  const mostrarContenido = !exclusivas || mecenas;
  const Contenido = mostrarContenido ? (await cargador()).default : null;
  const nodo = obtenerNodo("cronica", slug);
  const salidas = nodo ? salidasCuradas(nodo, 3) : [];
  const rutaCronica = `/cronicas/${cronica.slug}`;
  const kickerHero =
    exclusivas && mecenas
      ? cronica.kicker.replace(/^Exclusiva Mecenas/, "Tu exclusiva")
      : cronica.kicker;

  const migajas = [
    { nombre: "Inicio", href: "/" },
    { nombre: "Exhibiciones", href: "/cronicas" },
    { nombre: cronica.titulo, href: rutaCronica },
  ];

  const jsonLd = [
    articuloJsonLd({
      titulo: cronica.titulo,
      descripcion: cronica.descripcion,
      url: `${sitio.url}${rutaCronica}`,
    }),
    migajasJsonLd(migajas),
  ];

  return (
    <article>
      <RegistrarVisita
        titulo={cronica.titulo}
        tipo="cronica"
        progreso={mostrarContenido}
        epoca={cronica.epoca}
        slugCronica={cronica.slug}
      />
      {mostrarContenido && <BarraProgresoLectura href={rutaCronica} />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EscenaHero
        slug={cronica.slug}
        kicker={kickerHero}
        titulo={cronica.titulo}
        subtitulo={cronica.subtitulo}
        meta={`${cronica.periodo} · ${cronica.duracion}`}
        variante={cronica.visual.varianteHero}
        imagenHero={cronica.visual.imagenHero}
      />

      {mostrarContenido && Contenido ? (
        <>
          <Contenido />
          <div className="mx-auto max-w-2xl px-5 py-10">
            <CtaMecenas />
          </div>
          <SalidasDeSala salidas={salidas} tituloExhibicion={cronica.titulo} />
          <footer className="mx-auto max-w-6xl px-5 pb-28 pt-6">
            <div className="filete mb-10" />
            <MigasDePan migajas={migajas} />
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href={`/panteon/${cronica.protagonista.slug}`}
                className="rounded-full border border-oro/50 px-6 py-3 text-sm text-oro-claro transition-colors hover:bg-oro/10"
              >
                {cronica.protagonista.etiqueta} →
              </Link>
              <BotonCompartir
                titulo={cronica.titulo}
                texto={cronica.subtitulo}
                ruta={rutaCronica}
                utmCampaign="cronica"
              />
              <Link
                href="/cronicas"
                className="rounded-full border border-linea px-6 py-3 text-sm text-tinta-suave transition-colors hover:border-oro/40 hover:text-oro-claro"
              >
                Plano de exhibiciones
              </Link>
              <Link
                href="/explorar"
                className="rounded-full border border-linea px-6 py-3 text-sm text-tinta-suave transition-colors hover:border-oro/40 hover:text-oro-claro"
              >
                Explorar el museo →
              </Link>
            </div>
          </footer>
        </>
      ) : (
        <SoftGate
          titulo={cronica.titulo}
          volverA={`/cronicas/${cronica.slug}`}
          duracion={cronica.duracion}
          teaser={cronica.subtitulo}
          datoTeaser={
            cronica.slug === "las-48-horas-de-mayo"
              ? "48 horas que cambiaron el virreinato"
              : undefined
          }
        />
      )}
    </article>
  );
}
