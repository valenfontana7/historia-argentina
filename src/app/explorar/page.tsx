import type { Metadata } from "next";
import Link from "next/link";
import { DescubrirAleatorio } from "@/components/exploracion/DescubrirAleatorio";
import { MigasDePan } from "@/components/seo/MigasDePan";
import { Reveal } from "@/components/ui/Reveal";
import { categorias } from "@/data/categorias";
import { periodos } from "@/data/periodos";
import { aniosConEventos, todosLosNodos } from "@/lib/grafo/queries";
import { construirMetadata } from "@/lib/seo/metadata";
import { migajasJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = construirMetadata({
  titulo: "Explorar la historia argentina",
  descripcion:
    "Personajes, lugares, períodos y eventos. Elegí por dónde empezar o dejate sorprender.",
  ruta: "/explorar",
});

export default function ExplorarPage() {
  const nodos = todosLosNodos();
  const anios = aniosConEventos().slice(-8).reverse();
  const migajas = [
    { nombre: "Inicio", href: "/" },
    { nombre: "Explorar", href: "/explorar" },
  ];

  return (
    <div className="pb-28 pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(migajasJsonLd(migajas)) }}
      />
      <div className="mx-auto max-w-6xl px-5">
        <MigasDePan migajas={migajas} />
        <Reveal>
          <p className="kicker">Por donde quieras</p>
          <h1 className="titulo-display mt-4 text-5xl font-semibold sm:text-6xl">
            Explorar
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-tinta-suave">
            Elegí un camino o tocá «Sorprendeme». Siempre hay algo más para ver.
          </p>
          <div className="mt-8">
            <DescubrirAleatorio nodos={nodos} />
          </div>
        </Reveal>

        <section className="mt-20">
          <Reveal>
            <h2 className="titulo-display text-2xl font-medium text-oro">Por módulo</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/cronicas", titulo: "Crónicas", desc: "Historias cinematográficas" },
              { href: "/panteon", titulo: "El Panteón", desc: "Personajes del relato" },
              { href: "/hoy", titulo: "Hoy", desc: "Efeméride del día" },
              { href: "/lugares", titulo: "Lugares", desc: "Geografía histórica" },
              { href: "/timelines", titulo: "Timeline", desc: "Explorador temporal interactivo" },
              { href: "/recorridos", titulo: "Recorridos", desc: "Rutas curadas con hilo conductor" },
              { href: "/mapa", titulo: "Mapa", desc: "Cono Sur exploratorio" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-sm border border-linea bg-fondo-2 p-6 transition-colors hover:border-oro/40"
              >
                <h3 className="titulo-display text-xl font-medium group-hover:text-oro-claro">
                  {item.titulo}
                </h3>
                <p className="mt-2 text-sm text-tinta-tenue">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <Reveal>
            <h2 className="titulo-display text-2xl font-medium text-oro">Períodos</h2>
          </Reveal>
          <div className="mt-6 flex flex-wrap gap-3">
            {periodos.map((p) => (
              <Link
                key={p.slug}
                href={`/periodos/${p.slug}`}
                className="rounded-full border border-linea px-5 py-2.5 text-sm text-tinta-suave transition-colors hover:border-oro/50 hover:text-oro-claro"
              >
                {p.nombre}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <Reveal>
            <h2 className="titulo-display text-2xl font-medium text-oro">Categorías</h2>
          </Reveal>
          <div className="mt-6 flex flex-wrap gap-3">
            {categorias.map((c) => (
              <Link
                key={c.slug}
                href={`/categorias/${c.slug}`}
                className="rounded-full border border-linea px-5 py-2.5 text-sm text-tinta-suave transition-colors hover:border-oro/50 hover:text-oro-claro"
              >
                {c.nombre}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <Reveal>
            <h2 className="titulo-display text-2xl font-medium text-oro">Años en el timeline</h2>
          </Reveal>
          <div className="mt-6 flex flex-wrap gap-3">
            {anios.map((a) => (
              <Link
                key={a}
                href={`/timelines/${a}`}
                className="rounded-full border border-oro/30 px-5 py-2.5 text-sm text-oro-claro transition-colors hover:bg-oro/10"
              >
                {a}
              </Link>
            ))}
            <Link
              href="/timelines"
              className="rounded-full border border-linea px-5 py-2.5 text-sm text-tinta-suave transition-colors hover:border-oro/50 hover:text-oro-claro"
            >
              Explorador completo →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
