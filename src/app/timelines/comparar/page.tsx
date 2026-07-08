import type { Metadata } from "next";
import Link from "next/link";
import { ComparadorSiglos } from "@/components/exploracion/ComparadorSiglos";
import { MigasDePan } from "@/components/seo/MigasDePan";
import { Reveal } from "@/components/ui/Reveal";
import { construirMetadata } from "@/lib/seo/metadata";
import { migajasJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = construirMetadata({
  titulo: "Comparar siglos — historia argentina",
  descripcion:
    "Compará el siglo XIX, XX y XXI en la historia argentina: eventos, personajes y densidad del relato.",
  ruta: "/timelines/comparar",
});

export default function CompararSiglosPage() {
  const migajas = [
    { nombre: "Inicio", href: "/" },
    { nombre: "Timeline", href: "/timelines" },
    { nombre: "Comparar siglos", href: "/timelines/comparar" },
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
          <p className="kicker">Comparador</p>
          <h1 className="titulo-display mt-4 text-5xl font-semibold sm:text-6xl">
            Tres siglos de Argentina
          </h1>
          <p className="mt-6 max-w-2xl text-tinta-suave">
            ¿Cuánta historia condensamos en cada siglo? Compará la densidad de
            eventos y personajes entre 1810, 1910 y 2010.
          </p>
        </Reveal>

        <Reveal className="mt-12">
          <ComparadorSiglos />
        </Reveal>

        <p className="mt-10">
          <Link href="/timelines" className="text-sm text-oro-claro hover:text-oro">
            ← Volver al explorador temporal
          </Link>
        </p>
      </div>
    </div>
  );
}
