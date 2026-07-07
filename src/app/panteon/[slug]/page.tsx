import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Retrato } from "@/components/ui/Retrato";
import { LineaDeVida } from "@/components/ui/LineaDeVida";
import { Reveal } from "@/components/ui/Reveal";
import { PersonajeCard } from "@/components/PersonajeCard";
import {
  personajes,
  obtenerPersonaje,
  obtenerVarios,
  nombresEpocas,
} from "@/data/personajes";
import { obtenerImagenPersonaje } from "@/data/personajes-imagenes";
import { sitio } from "@/lib/site.config";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return personajes.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const personaje = obtenerPersonaje(slug);
  if (!personaje) return {};
  return {
    title: `${personaje.nombre} — biografía, batallas y frases`,
    description: personaje.resumen,
    openGraph: {
      title: `${personaje.nombre} · ${personaje.titulo}`,
      description: personaje.resumen,
    },
  };
}

export default async function PersonajePage({ params }: Props) {
  const { slug } = await params;
  const personaje = obtenerPersonaje(slug);
  if (!personaje) notFound();

  const aliados = obtenerVarios(personaje.aliados);
  const enemigos = obtenerVarios(personaje.enemigos);
  const anios = `${personaje.nacimiento.anio} — ${personaje.muerte?.anio ?? "presente"}`;
  const imagen = obtenerImagenPersonaje(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: personaje.nombre,
    alternateName: personaje.titulo,
    description: personaje.resumen,
    birthDate: String(personaje.nacimiento.anio),
    birthPlace: personaje.nacimiento.lugar,
    ...(personaje.muerte && {
      deathDate: String(personaje.muerte.anio),
      deathPlace: personaje.muerte.lugar,
    }),
    url: `${sitio.url}/panteon/${personaje.slug}`,
    ...(imagen && { image: imagen.url }),
  };

  return (
    <article className="pb-28 pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-6xl px-5">
        {/* Encabezado de la ficha */}
        <div className="grid gap-12 md:grid-cols-[300px_1fr] md:gap-16">
          <Reveal>
            <Retrato
              nombre={personaje.nombre}
              epoca={personaje.epoca}
              anios={anios}
              imagen={imagen}
              className="mx-auto w-full max-w-[300px]"
            />
          </Reveal>
          <div className="flex flex-col justify-center">
            <Reveal>
              <p className="kicker">
                {nombresEpocas[personaje.epoca]} · {personaje.rol}
              </p>
              <h1 className="titulo-display mt-4 text-5xl font-semibold leading-[1.02] sm:text-6xl">
                {personaje.nombre}
              </h1>
              <p className="titulo-display mt-3 text-2xl italic text-oro">
                {personaje.titulo}
              </p>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-tinta-suave">
                {personaje.resumen}
              </p>
              <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-4 text-sm">
                <div>
                  <dt className="text-tinta-tenue">Nace</dt>
                  <dd className="mt-1 text-tinta">
                    {personaje.nacimiento.anio} · {personaje.nacimiento.lugar}
                  </dd>
                </div>
                {personaje.muerte && (
                  <div>
                    <dt className="text-tinta-tenue">Muere</dt>
                    <dd className="mt-1 text-tinta">
                      {personaje.muerte.anio} · {personaje.muerte.lugar}
                    </dd>
                  </div>
                )}
              </dl>
            </Reveal>
          </div>
        </div>

        {/* Frase célebre */}
        {personaje.frase && (
          <Reveal className="mt-24">
            <blockquote className="mx-auto max-w-3xl text-center">
              <p className="titulo-display text-3xl font-medium italic leading-snug text-oro-claro sm:text-4xl">
                “{personaje.frase.texto}”
              </p>
              <cite className="mt-5 block text-sm not-italic text-tinta-tenue">
                {personaje.frase.contexto}
              </cite>
            </blockquote>
          </Reveal>
        )}

        {/* Biografía */}
        <div className="mt-24 grid gap-16 lg:grid-cols-[1fr_360px]">
          <Reveal>
            <h2 className="kicker">Su historia</h2>
            <div className="prosa capitular mt-8">
              {personaje.biografia.map((parrafo, i) => (
                <p key={i}>{parrafo}</p>
              ))}
            </div>
          </Reveal>

          {/* Aliados y enemigos */}
          <aside className="space-y-12">
            {aliados.length > 0 && (
              <Reveal>
                <h2 className="kicker">Aliados</h2>
                <ul className="mt-5 space-y-3">
                  {aliados.map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={`/panteon/${a.slug}`}
                        className="group flex items-baseline justify-between gap-4 border-b border-linea-suave pb-3"
                      >
                        <span className="text-tinta transition-colors group-hover:text-oro-claro">
                          {a.nombre}
                        </span>
                        <span className="shrink-0 text-xs text-tinta-tenue">
                          {a.titulo}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
            {enemigos.length > 0 && (
              <Reveal>
                <h2 className="kicker" style={{ color: "var(--carmesi)" }}>
                  Enemigos
                </h2>
                <ul className="mt-5 space-y-3">
                  {enemigos.map((e) => (
                    <li key={e.slug}>
                      <Link
                        href={`/panteon/${e.slug}`}
                        className="group flex items-baseline justify-between gap-4 border-b border-linea-suave pb-3"
                      >
                        <span className="text-tinta transition-colors group-hover:text-carmesi">
                          {e.nombre}
                        </span>
                        <span className="shrink-0 text-xs text-tinta-tenue">
                          {e.titulo}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </aside>
        </div>

        {/* Línea de vida */}
        <section className="mt-24">
          <Reveal>
            <div className="flex items-center gap-6">
              <h2 className="titulo-display shrink-0 text-2xl font-medium text-oro">
                Línea de vida
              </h2>
              <div className="filete w-full" />
            </div>
          </Reveal>
          <div className="mt-12">
            <LineaDeVida hitos={personaje.hitos} />
          </div>
        </section>

        {/* Otros personajes de la época */}
        <section className="mt-28">
          <Reveal>
            <div className="flex items-center gap-6">
              <h2 className="titulo-display shrink-0 text-2xl font-medium text-oro">
                De la misma época
              </h2>
              <div className="filete w-full" />
            </div>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4">
            {personajes
              .filter((p) => p.epoca === personaje.epoca && p.slug !== personaje.slug)
              .slice(0, 4)
              .map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.07}>
                  <PersonajeCard personaje={p} />
                </Reveal>
              ))}
          </div>
        </section>
      </div>
    </article>
  );
}
