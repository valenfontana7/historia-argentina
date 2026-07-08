import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContinuarExplorando } from "@/components/exploracion/ContinuarExplorando";
import { PosicionEnTimeline } from "@/components/exploracion/PosicionEnTimeline";
import { MigasDePan } from "@/components/seo/MigasDePan";
import { Reveal } from "@/components/ui/Reveal";
import { periodoPorAnio } from "@/data/periodos";
import {
  aniosConEventos,
  eventosPorAnio,
  personajesActivosEnAnio,
} from "@/lib/grafo/queries";
import { rutaDeNodo } from "@/lib/grafo/rutas";
import { construirMetadata } from "@/lib/seo/metadata";
import { migajasJsonLd } from "@/lib/seo/jsonld";

type Props = { params: Promise<{ anio: string }> };

export function generateStaticParams() {
  return aniosConEventos().map((anio) => ({ anio: String(anio) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { anio } = await params;
  const num = parseInt(anio, 10);
  if (Number.isNaN(num)) return {};
  const periodo = periodoPorAnio(num);
  return construirMetadata({
    titulo: `Argentina en ${num} — timeline histórica`,
    descripcion: `Qué pasaba en Argentina en ${num}. Eventos, personajes y contexto de un año en la historia.`,
    ruta: `/timelines/${anio}`,
    tipo: "article",
  });
}

export default async function TimelineAnioPage({ params }: Props) {
  const { anio } = await params;
  const num = parseInt(anio, 10);
  if (Number.isNaN(num) || num < 1500 || num > 2100) notFound();

  const eventos = eventosPorAnio(num);
  const personajes = personajesActivosEnAnio(num);
  const periodo = periodoPorAnio(num);

  const migajas = [
    { nombre: "Inicio", href: "/" },
    { nombre: "Explorar", href: "/explorar" },
    { nombre: String(num), href: `/timelines/${anio}` },
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
          <p className="kicker">Línea del tiempo</p>
          <h1 className="titulo-display mt-4 text-6xl font-semibold text-oro sm:text-7xl">
            {num}
          </h1>
          {periodo && (
            <p className="mt-4 text-lg text-tinta-suave">
              {periodo.nombre} · {periodo.descripcion}
            </p>
          )}
        </Reveal>

        <PosicionEnTimeline anio={num} />

        {eventos.length > 0 && (
          <section className="mt-16">
            <Reveal>
              <h2 className="titulo-display text-2xl font-medium text-oro">
                Eventos de {num}
              </h2>
            </Reveal>
            <ul className="mt-8 space-y-4">
              {eventos.map((e) => (
                <li key={e.slug}>
                  <Link
                    href={rutaDeNodo(e)}
                    className="group block border-b border-linea-suave pb-4"
                  >
                    <p className="text-tinta transition-colors group-hover:text-oro-claro">
                      {e.titulo}
                    </p>
                    <p className="mt-1 text-sm text-tinta-tenue line-clamp-2">{e.resumen}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {personajes.length > 0 && (
          <section className="mt-16">
            <Reveal>
              <h2 className="titulo-display text-2xl font-medium text-oro">
                Personajes activos en {num}
              </h2>
            </Reveal>
            <div className="mt-6 flex flex-wrap gap-3">
              {personajes.slice(0, 12).map((p) => (
                <Link
                  key={p.slug}
                  href={rutaDeNodo(p)}
                  className="rounded-full border border-linea px-5 py-2.5 text-sm text-tinta-suave transition-colors hover:border-oro/50 hover:text-oro-claro"
                >
                  {p.titulo} →
                </Link>
              ))}
            </div>
          </section>
        )}

        {eventos.length === 0 && personajes.length === 0 && (
          <Reveal className="mt-16 text-tinta-suave">
            <p>Aún no hay eventos indexados para este año. Explorá años cercanos:</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {[num - 20, num - 10, num + 10, num + 20].map((a) => (
                <Link
                  key={a}
                  href={`/timelines/${a}`}
                  className="text-oro-claro hover:text-oro"
                >
                  {a} →
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        <ContinuarExplorando
          origen={{ tipo: "evento", slug: eventos[0]?.slug ?? "25-de-mayo" }}
          titulo="Seguí explorando desde aquí"
        />
      </div>
    </article>
  );
}
