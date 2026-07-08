import { MapaExploratorio } from "@/components/exploracion/MapaExploratorio";
import { MigasDePan } from "@/components/seo/MigasDePan";
import { Reveal } from "@/components/ui/Reveal";
import { lugares } from "@/data/lugares";
import { construirMetadata } from "@/lib/seo/metadata";
import { migajasJsonLd } from "@/lib/seo/jsonld";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = construirMetadata({
  titulo: "Mapa histórico — lugares de la historia argentina",
  descripcion:
    "Explorá el Cono Sur en un mapa interactivo: ciudades, batallas y escenarios del relato nacional.",
  ruta: "/mapa",
});

export default function MapaPage() {
  const migajas = [
    { nombre: "Inicio", href: "/" },
    { nombre: "Explorar", href: "/explorar" },
    { nombre: "Mapa", href: "/mapa" },
  ];

  return (
    <div className="pb-28 pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(migajasJsonLd(migajas)) }}
      />
      <div className="mx-auto max-w-4xl px-5">
        <MigasDePan migajas={migajas} />
        <Reveal>
          <p className="kicker">Geografía histórica</p>
          <h1 className="titulo-display mt-4 text-5xl font-semibold sm:text-6xl">
            Mapa exploratorio
          </h1>
          <p className="mt-6 max-w-2xl text-tinta-suave">
            Los lugares donde se escribió la historia argentina. Vista previa con los
            puntos esenciales; el mapa completo es para mecenas.
          </p>
        </Reveal>

        <Reveal className="mt-10">
          <MapaExploratorio lugares={lugares} completo={false} />
        </Reveal>

        <p className="mt-8 text-center text-sm">
          <Link href="/lugares" className="text-oro-claro hover:text-oro">
            Ver todas las fichas de lugares →
          </Link>
        </p>
      </div>
    </div>
  );
}
