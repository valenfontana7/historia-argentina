import type { Metadata } from "next";
import Link from "next/link";
import { TimelineExplorer } from "@/components/exploracion/TimelineExplorer";
import { TimelinePremium } from "@/components/mecenas/TimelinePremium";
import { MigasDePan } from "@/components/seo/MigasDePan";
import { Reveal } from "@/components/ui/Reveal";
import { aniosConEventos } from "@/lib/grafo/queries";
import { obtenerSesion } from "@/lib/auth";
import { construirMetadata } from "@/lib/seo/metadata";
import { migajasJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = construirMetadata({
  titulo: "Línea del tiempo — historia argentina",
  descripcion:
    "Explorá la historia argentina año por año: eventos, personajes y períodos en un timeline interactivo.",
  ruta: "/timelines",
});

export default async function TimelinesPage() {
  const sesion = await obtenerSesion();
  const anios = aniosConEventos();
  const migajas = [
    { nombre: "Inicio", href: "/" },
    { nombre: "Explorar", href: "/explorar" },
    { nombre: "Timeline", href: "/timelines" },
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
          <p className="kicker">Línea del tiempo</p>
          <h1 className="titulo-display mt-4 text-5xl font-semibold sm:text-6xl">
            Argentina en el tiempo
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-tinta-suave">
            Deslizá por cinco siglos de historia. Cada año conecta con efemérides,
            personajes y períodos del museo.
          </p>
        </Reveal>

        <Reveal className="mt-12">
          <TimelineExplorer anioInicial={1810} />
        </Reveal>

        <TimelinePremium esMecenas={Boolean(sesion)} />

        <Reveal className="mt-16">
          <p className="kicker">Años con eventos indexados</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {anios.map((a) => (
              <Link
                key={a}
                href={`/timelines/${a}`}
                className="rounded-full border border-linea px-4 py-2 text-xs text-tinta-suave transition-colors hover:border-oro/50 hover:text-oro-claro"
              >
                {a}
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
