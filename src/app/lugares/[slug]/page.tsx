import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SalidasDeSala } from "@/components/museo/SalidasDeSala";
import { BotonCompartir } from "@/components/BotonCompartir";
import { MigasDePan } from "@/components/seo/MigasDePan";
import { Reveal } from "@/components/ui/Reveal";
import { lugares, obtenerLugar } from "@/data/lugares";
import { obtenerNodo } from "@/lib/grafo/queries";
import { obtenerSalidasPagina } from "@/lib/grafo/obtener-salidas-pagina";
import { construirMetadata } from "@/lib/seo/metadata";
import { sitio } from "@/lib/site.config";
import { lugarJsonLd, migajasJsonLd } from "@/lib/seo/jsonld";
import { CTA_VER_SALA_EPOCA } from "@/lib/copy";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return lugares.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lugar = obtenerLugar(slug);
  if (!lugar) return {};
  return construirMetadata({
    titulo: `${lugar.nombre} — historia y personajes`,
    descripcion: lugar.descripcion,
    ruta: `/lugares/${slug}`,
    tipo: "article",
    imagen: `${sitio.url}/lugares/${slug}/opengraph-image`,
  });
}

export default async function LugarPage({ params }: Props) {
  const { slug } = await params;
  const lugar = obtenerLugar(slug);
  if (!lugar) notFound();

  const nodo = obtenerNodo("lugar", slug);
  const salidas = obtenerSalidasPagina(nodo);
  const migajas = [
    { nombre: "Inicio", href: "/" },
    { nombre: "Lugares", href: "/lugares" },
    { nombre: lugar.nombre, href: `/lugares/${slug}` },
  ];

  const jsonLd = [
    lugarJsonLd({
      nombre: lugar.nombre,
      descripcion: lugar.descripcion,
      slug: lugar.slug,
      region: lugar.region,
    }),
    migajasJsonLd(migajas),
  ];

  return (
    <article className="pb-28 pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-6xl px-5">
        <MigasDePan migajas={migajas} />
        <Reveal>
          <p className="kicker">{lugar.region}</p>
          <h1 className="titulo-display mt-4 text-5xl font-semibold sm:text-6xl">
            {lugar.nombre}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-tinta-suave">{lugar.descripcion}</p>
          <div className="mt-6">
            <BotonCompartir
              titulo={lugar.nombre}
              texto={lugar.descripcion}
              ruta={`/lugares/${slug}`}
              utmCampaign="lugar"
            />
          </div>
        </Reveal>

        <Reveal className="mt-14">
          <div className="prosa capitular max-w-3xl">
            {lugar.narrativa.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Reveal>

        {lugar.periodo && (
          <Reveal className="mt-10">
            <Link
              href={`/periodos/${lugar.periodo}`}
              className="text-sm text-oro-claro underline decoration-oro/30 underline-offset-2 hover:text-oro"
            >
              {CTA_VER_SALA_EPOCA}
            </Link>
          </Reveal>
        )}

        {salidas.length > 0 && (
          <SalidasDeSala salidas={salidas} tituloExhibicion={lugar.nombre} />
        )}
      </div>
    </article>
  );
}
