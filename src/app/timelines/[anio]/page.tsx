import type { Metadata } from "next";
import Link from "next/link";
import { EtiquetaCta } from "@/components/ui/FlechaCta";
import { notFound } from "next/navigation";
import { SalidasDeSala } from "@/components/museo/SalidasDeSala";
import { FrisoTemporal } from "@/components/timeline/FrisoTemporal";
import { PosicionEnTimeline } from "@/components/exploracion/PosicionEnTimeline";
import { MigasDePan } from "@/components/seo/MigasDePan";
import { Reveal } from "@/components/ui/Reveal";
import { periodoPorAnio } from "@/data/periodos";
import { cronicasEnAnio } from "@/lib/cronicas/indice";
import { puedeVerContenidoMecenas } from "@/lib/auth";
import { FichaExhibicion } from "@/components/cronicas/FichaExhibicion";
import {
  aniosConEventos,
  eventosPorAnio,
  personajesActivosEnAnio,
  obtenerNodo,
} from "@/lib/grafo/queries";
import { salidasCuradas } from "@/lib/grafo/salidas-curadas";
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
  return construirMetadata({
    titulo: `Argentina en ${num}: pasillo del tiempo`,
    descripcion: `Qué pasaba en Argentina en ${num}. Acontecimientos, retratos y exhibiciones de un año en la historia.`,
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
  const esMecenas = await puedeVerContenidoMecenas();
  const cronicasAnio = cronicasEnAnio(num);

  const nodoEvento = eventos[0] ? obtenerNodo("evento", eventos[0].slug) : undefined;
  const salidas = nodoEvento ? salidasCuradas(nodoEvento, 3) : [];

  const migajas = [
    { nombre: "Inicio", href: "/" },
    { nombre: "Pasillo del tiempo", href: "/timelines" },
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
          <p className="kicker">Pasillo del tiempo</p>
          <h1 className="titulo-display mt-4 text-5xl font-semibold text-oro sm:text-6xl lg:text-7xl">
            {num}
          </h1>
          {periodo && (
            <p className="mt-4 text-lg text-tinta-suave">
              Sala: {periodo.nombre} · {periodo.descripcion}
            </p>
          )}
        </Reveal>

        <PosicionEnTimeline anio={num} />

        <FrisoTemporal anio={num} eventos={eventos} personajes={personajes} />

        {cronicasAnio.length > 0 && (
          <section className="mt-16">
            <Reveal>
              <h2 className="titulo-display text-2xl font-medium text-oro">
                Exhibiciones de {num}
              </h2>
            </Reveal>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {cronicasAnio.map((cronica, i) => (
                <Reveal key={cronica.slug} delay={i * 0.04}>
                  <FichaExhibicion cronica={cronica} esMecenas={esMecenas} />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {eventos.length === 0 && personajes.length === 0 && (
          <Reveal className="mt-16 text-tinta-suave">
            <p>Aún no hay acontecimientos indexados para este año. Explorá años cercanos:</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {[num - 20, num - 10, num + 10, num + 20].map((a) => (
                <Link
                  key={a}
                  href={`/timelines/${a}`}
                  className="group text-oro-claro hover:text-oro"
                >
                  <EtiquetaCta>{String(a)}</EtiquetaCta>
                </Link>
              ))}
            </div>
          </Reveal>
        )}
      </div>

      <SalidasDeSala
        salidas={salidas}
        origen={nodoEvento}
        tituloExhibicion={`Argentina en ${num}`}
      />
    </article>
  );
}
