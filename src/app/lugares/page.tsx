import type { Metadata } from "next";
import Link from "next/link";
import { MapaHistorico } from "@/components/mecenas/MapaHistorico";
import { MigasDePan } from "@/components/seo/MigasDePan";
import { Reveal } from "@/components/ui/Reveal";
import { lugares } from "@/data/lugares";
import { puedeVerContenidoMecenas } from "@/lib/auth";
import { construirMetadata } from "@/lib/seo/metadata";
import { migajasJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = construirMetadata({
  titulo: "Lugares históricos de Argentina",
  descripcion:
    "Ciudades, campos de batalla y paisajes que marcaron la historia argentina. Explorá el mapa del relato nacional.",
  ruta: "/lugares",
});

export default async function LugaresPage() {
  const esMecenas = await puedeVerContenidoMecenas();
  const migajas = [
    { nombre: "Inicio", href: "/" },
    { nombre: "Lugares", href: "/lugares" },
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
          <p className="kicker">Geografía del relato</p>
          <h1 className="titulo-display mt-4 text-5xl font-semibold sm:text-6xl">
            Lugares
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-tinta-suave">
            Cada rincón del país guarda un capítulo. Explorá los escenarios donde
            se escribió la historia argentina.
          </p>
          <p className="mt-4">
            <Link href="/mapa" className="text-sm text-oro-claro hover:text-oro">
              Ver mapa exploratorio →
            </Link>
          </p>
          <div className="filete mt-10 w-32" />
        </Reveal>

        <Reveal className="mt-12">
          <MapaHistorico interactivo={esMecenas} esMecenas={esMecenas} />
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lugares.map((lugar, i) => (
            <Reveal key={lugar.slug} delay={i * 0.05}>
              <Link
                href={`/lugares/${lugar.slug}`}
                className="group block rounded-sm border border-linea bg-fondo-2 p-6 transition-colors hover:border-oro/40"
              >
                <p className="kicker text-[0.65rem]">{lugar.region}</p>
                <h2 className="titulo-display mt-2 text-2xl font-medium text-tinta transition-colors group-hover:text-oro-claro">
                  {lugar.nombre}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-tinta-tenue">
                  {lugar.descripcion}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
