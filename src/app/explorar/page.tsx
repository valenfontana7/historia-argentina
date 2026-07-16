import type { Metadata } from "next";
import { DescubrirAleatorio } from "@/components/exploracion/DescubrirAleatorio";
import { MigasDePan } from "@/components/seo/MigasDePan";
import { Reveal } from "@/components/ui/Reveal";
import { PlanoDelMuseo } from "@/components/museo/PlanoDelMuseo";
import { TuVisita } from "@/components/museo/TuVisita";
import { RecientementeVisitado } from "@/components/engagement/RecientementeVisitado";
import { aniosConEventos, todosLosNodos } from "@/lib/grafo/queries";
import { construirMetadata } from "@/lib/seo/metadata";
import { migajasJsonLd } from "@/lib/seo/jsonld";
import Link from "next/link";

export const metadata: Metadata = construirMetadata({
  titulo: "Plano del museo: explorar la historia argentina",
  descripcion:
    "Salas por época, colecciones temáticas, retratos y piezas del patrimonio. Elegí por dónde empezar tu visita.",
  ruta: "/explorar",
});

export default function ExplorarPage() {
  const nodos = todosLosNodos();
  const anios = aniosConEventos().slice(-8).reverse();
  const migajas = [
    { nombre: "Inicio", href: "/" },
    { nombre: "Plano del museo", href: "/explorar" },
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
          <p className="kicker">Hall de descubrimiento</p>
          <h1 className="titulo-display mt-4 text-5xl font-semibold sm:text-6xl">
            Plano del museo
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-tinta-suave">
            Elegí una sala, una colección o dejate sorprender. Siempre hay otra
            puerta para cruzar.
          </p>
          <div className="mt-8">
            <DescubrirAleatorio nodos={nodos} />
          </div>
        </Reveal>

        <TuVisita />

        <div className="mt-16">
          <PlanoDelMuseo />
        </div>

        <RecientementeVisitado limite={5} />

        <section className="mt-20">
          <Reveal>
            <h2 className="titulo-display text-2xl font-medium text-oro">
              Pasillo del tiempo
            </h2>
            <p className="mt-3 max-w-xl text-sm text-tinta-suave">
              Años clave de la historia argentina.
            </p>
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
              Pasillo completo →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
