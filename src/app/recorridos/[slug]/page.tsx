import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FichaExhibicion } from "@/components/cronicas/FichaExhibicion";
import { SalidasDeSala } from "@/components/museo/SalidasDeSala";
import { obtenerCronica } from "@/content/cronicas/registro";
import { TarjetaEntidad } from "@/components/exploracion/TarjetaEntidad";
import { SoftGate } from "@/components/membresia/SoftGate";
import { RecorridoPasos } from "@/components/recorridos/RecorridoPasos";
import { MigasDePan } from "@/components/seo/MigasDePan";
import { Reveal } from "@/components/ui/Reveal";
import {
  esRecorridoMecenas,
  obtenerRecorrido,
  recorridos,
} from "@/data/recorridos";
import { puedeVerContenidoMecenas } from "@/lib/auth";
import { resolverNodo } from "@/lib/grafo/queries";
import { obtenerSalidasPagina } from "@/lib/grafo/obtener-salidas-pagina";
import { construirMetadata } from "@/lib/seo/metadata";
import { migajasJsonLd } from "@/lib/seo/jsonld";
import { CTA_VER_TODAS_VISITAS, MIGA_VISITAS_GUIADAS } from "@/lib/copy";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return recorridos.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recorrido = obtenerRecorrido(slug);
  if (!recorrido) return {};
  return construirMetadata({
    titulo: recorrido.titulo,
    descripcion: recorrido.subtitulo,
    ruta: `/recorridos/${slug}`,
    tipo: "article",
  });
}

export default async function RecorridoPage({ params }: Props) {
  const { slug } = await params;
  const recorrido = obtenerRecorrido(slug);
  if (!recorrido) notFound();

  const mecenas = await puedeVerContenidoMecenas();
  const premium = esRecorridoMecenas(recorrido);
  const desbloqueado = !premium || mecenas;

  const pasos = recorrido.pasos
    .map((paso) => {
      const nodo = resolverNodo(paso);
      return nodo ? { paso, nodo } : null;
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  const migajas = [
    { nombre: "Inicio", href: "/" },
    { nombre: MIGA_VISITAS_GUIADAS, href: "/recorridos" },
    { nombre: recorrido.titulo, href: `/recorridos/${slug}` },
  ];

  const ultimoNodo = pasos[pasos.length - 1]?.nodo;
  const salidas = obtenerSalidasPagina(ultimoNodo);

  const previewCronicas = recorrido.pasos
    .filter((p) => p.tipo === "cronica")
    .slice(0, 4)
    .map((p) => obtenerCronica(p.slug))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);

  return (
    <article className="pb-28 pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(migajasJsonLd(migajas)) }}
      />
      <div className="mx-auto max-w-4xl px-5">
        <MigasDePan migajas={migajas} />
        <Reveal>
          <p className="kicker">
            {recorrido.duracion} · {pasos.length} estaciones
            {premium && " · Visita exclusiva mecenas"}
          </p>
          <h1 className="titulo-display mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            {recorrido.titulo}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-tinta-suave">
            {recorrido.subtitulo}
          </p>
        </Reveal>

        {previewCronicas.length > 0 && (
          <section className="mt-12">
            <Reveal>
              <p className="kicker">Exhibiciones de la visita</p>
            </Reveal>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {previewCronicas.map((cronica, i) => (
                <Reveal key={cronica.slug} delay={i * 0.04}>
                  <FichaExhibicion cronica={cronica} esMecenas={mecenas} />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {desbloqueado ? (
          <>
            <div className="mt-16">
              <RecorridoPasos pasos={pasos} tituloRecorrido={recorrido.titulo} />
            </div>
            {salidas.length > 0 && (
              <SalidasDeSala
                salidas={salidas}
                tituloExhibicion={recorrido.titulo}
              />
            )}
          </>
        ) : (
          <div className="mt-16">
            {pasos[0] && (
              <Reveal>
                <p className="text-xs uppercase tracking-[0.25em] text-oro">Probá el primer paso</p>
                {pasos[0].paso.puente && (
                  <p className="mt-2 text-sm italic text-tinta-tenue">
                    {pasos[0].paso.puente}
                  </p>
                )}
                <div className="mt-4">
                  <TarjetaEntidad nodo={pasos[0].nodo} />
                </div>
              </Reveal>
            )}
            <SoftGate
              titulo={recorrido.titulo}
              volverA={`/recorridos/${slug}`}
              duracion={recorrido.duracion}
              teaser={recorrido.subtitulo}
            />
          </div>
        )}

        <Reveal className="mt-16 text-center">
          <Link
            href="/recorridos"
            className="text-sm text-oro-claro transition-colors hover:text-oro"
          >
            {CTA_VER_TODAS_VISITAS}
          </Link>
        </Reveal>
      </div>
    </article>
  );
}
