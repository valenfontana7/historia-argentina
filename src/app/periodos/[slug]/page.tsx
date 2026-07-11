import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SalidasDeSala } from "@/components/museo/SalidasDeSala";
import { ProgresoSala } from "@/components/museo/ProgresoSala";
import { RegistrarSelloSala } from "@/components/museo/RegistrarSelloSala";
import { GridCronicas } from "@/components/cronicas/GridCronicas";
import { RecientementeVisitado } from "@/components/engagement/RecientementeVisitado";
import { PersonajeCard } from "@/components/PersonajeCard";
import { MigasDePan } from "@/components/seo/MigasDePan";
import { Reveal } from "@/components/ui/Reveal";
import { personajes } from "@/data/personajes";
import { obtenerPeriodo, periodos } from "@/data/periodos";
import { puedeVerContenidoMecenas } from "@/lib/auth";
import { porEpoca } from "@/lib/cronicas/indice";
import { obtenerNodo } from "@/lib/grafo/queries";
import { obtenerSalidasPagina } from "@/lib/grafo/obtener-salidas-pagina";
import { enlaceDeHitoPeriodo } from "@/lib/periodo-enlaces";
import { construirMetadata } from "@/lib/seo/metadata";
import { sitio } from "@/lib/site.config";
import { migajasJsonLd } from "@/lib/seo/jsonld";
import type { Epoca } from "@/components/ui/Retrato";
import {
  MIGA_SALAS,
  TITULO_EXHIBICIONES_SALA,
  TITULO_RETRATOS_RELACIONADOS,
} from "@/lib/copy";

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
    imagen: `${sitio.url}/periodos/${slug}/opengraph-image`,
  });
}

export default async function PeriodoPage({ params }: Props) {
  const { slug } = await params;
  const periodo = obtenerPeriodo(slug);
  if (!periodo) notFound();

  const esMecenas = await puedeVerContenidoMecenas();
  const cronicasEpoca = porEpoca(periodo.slug);
  const nodo = obtenerNodo("periodo", slug);
  const salidas = obtenerSalidasPagina(nodo);
  const delPeriodo = personajes.filter((p) => p.epoca === periodo.slug);
  const migajas = [
    { nombre: "Inicio", href: "/" },
    { nombre: MIGA_SALAS, href: "/periodos" },
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

        <ProgresoSala epoca={periodo.slug as Epoca} />
        <RegistrarSelloSala epoca={periodo.slug as Epoca} nombre={periodo.nombre} />

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
            {periodo.eventosDestacados.map((evento) => {
              const enlace = enlaceDeHitoPeriodo(evento);
              return (
                <li key={evento}>
                  {enlace ? (
                    <Link
                      href={enlace.href}
                      className="text-sm text-tinta-suave transition-colors hover:text-oro-claro"
                    >
                      {enlace.etiqueta} →
                    </Link>
                  ) : (
                    <span className="text-sm text-tinta-suave">{evento}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>

        {cronicasEpoca.length > 0 && (
          <div className="mt-20">
            <GridCronicas
              cronicas={cronicasEpoca}
              titulo={TITULO_EXHIBICIONES_SALA}
              esMecenas={esMecenas}
            />
          </div>
        )}

        <RecientementeVisitado limite={5} />

        {delPeriodo.length > 0 && (
          <section className="mt-20">
            <Reveal>
              <h2 className="titulo-display text-2xl font-medium text-oro">
                {TITULO_RETRATOS_RELACIONADOS}
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

        {salidas.length > 0 && (
          <SalidasDeSala salidas={salidas} tituloExhibicion={periodo.nombre} />
        )}
      </div>
    </article>
  );
}
