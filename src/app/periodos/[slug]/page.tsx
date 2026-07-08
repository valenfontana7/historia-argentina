import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContinuarExplorando } from "@/components/exploracion/ContinuarExplorando";
import { EnlacesRelacionados } from "@/components/exploracion/EnlacesRelacionados";
import { PersonajeCard } from "@/components/PersonajeCard";
import { MigasDePan } from "@/components/seo/MigasDePan";
import { Reveal } from "@/components/ui/Reveal";
import { personajes } from "@/data/personajes";
import { obtenerPeriodo, periodos } from "@/data/periodos";
import { obtenerNodo } from "@/lib/grafo/queries";
import { construirMetadata } from "@/lib/seo/metadata";
import { migajasJsonLd } from "@/lib/seo/jsonld";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return periodos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const periodo = obtenerPeriodo(slug);
  if (!periodo) return {};
  return construirMetadata({
    titulo: `${periodo.nombre} — historia argentina`,
    descripcion: periodo.descripcion,
    ruta: `/periodos/${slug}`,
    tipo: "article",
  });
}

export default async function PeriodoPage({ params }: Props) {
  const { slug } = await params;
  const periodo = obtenerPeriodo(slug);
  if (!periodo) notFound();

  const nodo = obtenerNodo("periodo", slug);
  const delPeriodo = personajes.filter((p) => p.epoca === periodo.slug);
  const migajas = [
    { nombre: "Inicio", href: "/" },
    { nombre: "Períodos", href: "/periodos" },
    { nombre: periodo.nombre, href: `/periodos/${slug}` },
  ];

  return (
    <article className="pb-28 pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(migajasJsonLd(migajas)) }}
      />
      <div className="mx-auto max-w-6xl px-5">
        <MigasDePan migajas={migajas} />
        <Reveal>
          <p className="kicker">
            {periodo.anioInicio} — {periodo.anioFin ?? "presente"}
          </p>
          <h1 className="titulo-display mt-4 text-5xl font-semibold sm:text-6xl">
            {periodo.nombre}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-tinta-suave">{periodo.descripcion}</p>
        </Reveal>

        <Reveal className="mt-14">
          <div className="prosa max-w-3xl">
            {periodo.narrativa.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-14">
          <p className="kicker">Hitos de la época</p>
          <ul className="mt-5 space-y-2">
            {periodo.eventosDestacados.map((evento) => (
              <li key={evento} className="text-sm text-tinta-suave">
                {evento}
              </li>
            ))}
          </ul>
        </Reveal>

        {delPeriodo.length > 0 && (
          <section className="mt-20">
            <Reveal>
              <h2 className="titulo-display text-2xl font-medium text-oro">
                Personajes de esta época
              </h2>
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4">
              {delPeriodo.slice(0, 8).map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.05}>
                  <PersonajeCard personaje={p} />
                </Reveal>
              ))}
            </div>
            {delPeriodo.length > 8 && (
              <p className="mt-8 text-center">
                <Link href="/panteon" className="text-sm text-oro-claro hover:text-oro">
                  Ver todos en el Panteón →
                </Link>
              </p>
            )}
          </section>
        )}

        {nodo && <EnlacesRelacionados origen={nodo} tipos={["persona", "evento", "lugar"]} />}
        {nodo && <ContinuarExplorando origen={nodo} />}
      </div>
    </article>
  );
}
