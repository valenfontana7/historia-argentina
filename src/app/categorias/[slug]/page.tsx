import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContinuarExplorando } from "@/components/exploracion/ContinuarExplorando";
import { MigasDePan } from "@/components/seo/MigasDePan";
import { Reveal } from "@/components/ui/Reveal";
import { categorias, obtenerCategoria, slugDeCategoria } from "@/data/categorias";
import { efemerides } from "@/data/efemerides";
import { obtenerVarios } from "@/data/personajes";
import { obtenerNodo } from "@/lib/grafo/queries";
import { construirMetadata } from "@/lib/seo/metadata";
import { sitio } from "@/lib/site.config";
import { migajasJsonLd } from "@/lib/seo/jsonld";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return categorias.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = obtenerCategoria(slug);
  if (!cat) return {};
  return construirMetadata({
    titulo: `${cat.nombre} — historia argentina`,
    descripcion: cat.descripcion,
    ruta: `/categorias/${slug}`,
    tipo: "article",
    imagen: `${sitio.url}/categorias/${slug}/opengraph-image`,
  });
}

export default async function CategoriaPage({ params }: Props) {
  const { slug } = await params;
  const cat = obtenerCategoria(slug);
  if (!cat) notFound();

  const eventos = efemerides.filter((e) => slugDeCategoria(e.categoria) === slug);
  const personajeSlugs = new Set<string>();
  for (const e of eventos) {
    for (const p of e.relacionados) personajeSlugs.add(p);
  }
  const personajesRel = obtenerVarios([...personajeSlugs]);
  const nodo = obtenerNodo("categoria", slug);

  const migajas = [
    { nombre: "Inicio", href: "/" },
    { nombre: "Categorías", href: "/categorias" },
    { nombre: cat.nombre, href: `/categorias/${slug}` },
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
          <p className="kicker">Categoría</p>
          <h1 className="titulo-display mt-4 text-5xl font-semibold sm:text-6xl">
            {cat.nombre}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-tinta-suave">{cat.descripcion}</p>
        </Reveal>

        {eventos.length > 0 && (
          <section className="mt-16">
            <Reveal>
              <h2 className="titulo-display text-2xl font-medium text-oro">Eventos</h2>
            </Reveal>
            <ul className="mt-8 space-y-4">
              {eventos.map((e) => (
                <li key={e.dia}>
                  <Link
                    href={`/hoy/${e.dia}`}
                    className="group block border-b border-linea-suave pb-4"
                  >
                    <span className="text-xs text-oro">{e.anio}</span>
                    <p className="mt-1 text-tinta transition-colors group-hover:text-oro-claro">
                      {e.titulo}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {personajesRel.length > 0 && (
          <Reveal className="mt-16">
            <p className="kicker">Personajes vinculados</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {personajesRel.map((p) => (
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

        {nodo && <ContinuarExplorando origen={nodo} estrategia="misma-categoria" titulo="También te puede interesar" />}
      </div>
    </article>
  );
}
