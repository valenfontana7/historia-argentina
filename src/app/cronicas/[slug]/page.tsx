import type { Metadata } from "next";
import Link from "next/link";
import { EtiquetaCta } from "@/components/ui/FlechaCta";
import { notFound } from "next/navigation";
import { EscenaHero } from "@/components/scrolly/EscenaHero";
import { PuertasDelUniverso } from "@/components/exploracion/PuertasDelUniverso";
import { ExhibicionConAudioguia } from "@/components/museo/ExhibicionConAudioguia";
import { PiezasDeSala } from "@/components/piezas/PiezasDeSala";
import { CtaMecenas } from "@/components/membresia/CtaMecenas";
import { SoftGate } from "@/components/membresia/SoftGate";
import { BarraProgresoLectura } from "@/components/engagement/BarraProgresoLectura";
import { RegistrarVisita } from "@/components/engagement/RegistrarVisita";
import { BotonCompartir } from "@/components/BotonCompartir";
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
import { obtenerAudioguiaSala, tieneAudioguia } from "@/data/audioguias-salas";

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
  const audioguia = obtenerAudioguiaSala(slug);
  const kickerHero =
    exclusivas && mecenas
      ? cronica.kicker.replace(/^Exclusiva Mecenas/, "Tu exclusiva")
      : cronica.kicker;

  const migajas = [
    { nombre: "Inicio", href: "/" },
    { nombre: "Historias", href: "/cronicas" },
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
          <ExhibicionConAudioguia audioguia={audioguia}>
            <Contenido />
          </ExhibicionConAudioguia>

          <PuertasDelUniverso
            salidas={salidas}
            origen={nodo ?? { tipo: "cronica", slug }}
            tituloOrigen={cronica.titulo}
            mostrarSiguiente={false}
          />

          <footer className="mx-auto max-w-6xl px-5 pb-2 pt-2">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
              <Link
                href={`/panteon/${cronica.protagonista.slug}`}
                className="group text-tinta-suave transition-colors hover:text-oro-claro"
              >
                <EtiquetaCta>{cronica.protagonista.etiqueta}</EtiquetaCta>
              </Link>
              <BotonCompartir
                titulo={cronica.titulo}
                texto={cronica.subtitulo}
                ruta={rutaCronica}
                utmCampaign="cronica"
                discreto
              />
            </div>
          </footer>

          <PiezasDeSala slug={cronica.slug} />

          <div className="mx-auto max-w-2xl px-5 py-8 pb-28">
            <CtaMecenas compacto />
          </div>
        </>
      ) : (
        <SoftGate
          titulo={cronica.titulo}
          volverA={`/cronicas/${cronica.slug}`}
          duracion={cronica.duracion}
          teaser={cronica.subtitulo}
          incluyeAudioguia={tieneAudioguia(cronica.slug)}
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
