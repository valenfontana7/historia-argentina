import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContinuarExplorando } from "@/components/exploracion/ContinuarExplorando";
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
import { construirMetadata } from "@/lib/seo/metadata";
import { migajasJsonLd } from "@/lib/seo/jsonld";

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
    { nombre: "Recorridos", href: "/recorridos" },
    { nombre: recorrido.titulo, href: `/recorridos/${slug}` },
  ];

  const ultimoNodo = pasos[pasos.length - 1]?.nodo;

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
            {recorrido.duracion} · {pasos.length} pasos
            {premium && " · Exclusivo mecenas"}
          </p>
          <h1 className="titulo-display mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            {recorrido.titulo}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-tinta-suave">
            {recorrido.subtitulo}
          </p>
        </Reveal>

        {desbloqueado ? (
          <>
            <div className="mt-16">
              <RecorridoPasos pasos={pasos} />
            </div>
            {ultimoNodo && (
              <div className="mt-20">
                <ContinuarExplorando origen={ultimoNodo} estrategia="relacionados" />
              </div>
            )}
          </>
        ) : (
          <div className="mt-16">
            {pasos[0] && (
              <Reveal>
                <p className="text-xs uppercase tracking-[0.25em] text-oro">Vista previa · Paso 1</p>
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
            ← Ver todos los recorridos
          </Link>
        </Reveal>
      </div>
    </article>
  );
}
