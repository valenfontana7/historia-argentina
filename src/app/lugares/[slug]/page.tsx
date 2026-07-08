import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContinuarExplorando } from "@/components/exploracion/ContinuarExplorando";
import { EnlacesRelacionados } from "@/components/exploracion/EnlacesRelacionados";
import { MigasDePan } from "@/components/seo/MigasDePan";
import { Reveal } from "@/components/ui/Reveal";
import { lugares, obtenerLugar } from "@/data/lugares";
import { obtenerNodo } from "@/lib/grafo/queries";
import { construirMetadata } from "@/lib/seo/metadata";
import { lugarJsonLd, migajasJsonLd } from "@/lib/seo/jsonld";

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
  });
}

export default async function LugarPage({ params }: Props) {
  const { slug } = await params;
  const lugar = obtenerLugar(slug);
  if (!lugar) notFound();

  const nodo = obtenerNodo("lugar", slug);
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
              Ver el período histórico →
            </Link>
          </Reveal>
        )}

        {nodo && <EnlacesRelacionados origen={nodo} />}
        {nodo && <ContinuarExplorando origen={nodo} />}
      </div>
    </article>
  );
}
