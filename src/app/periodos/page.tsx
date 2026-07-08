import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { periodos } from "@/data/periodos";
import { construirMetadata } from "@/lib/seo/metadata";
import { migajasJsonLd } from "@/lib/seo/jsonld";
import { MigasDePan } from "@/components/seo/MigasDePan";

export const metadata: Metadata = construirMetadata({
  titulo: "Períodos de la historia argentina",
  descripcion:
    "De la colonia a la Argentina contemporánea: cinco épocas para recorrer el relato nacional.",
  ruta: "/periodos",
});

export default function PeriodosPage() {
  const migajas = [
    { nombre: "Inicio", href: "/" },
    { nombre: "Períodos", href: "/periodos" },
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
          <p className="kicker">La línea del tiempo</p>
          <h1 className="titulo-display mt-4 text-5xl font-semibold sm:text-6xl">
            Períodos
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-tinta-suave">
            Argentina no se construyó de un golpe. Recorré las cinco grandes
            épocas que dieron forma al país.
          </p>
        </Reveal>

        <div className="mt-16 space-y-6">
          {periodos.map((periodo, i) => (
            <Reveal key={periodo.slug} delay={i * 0.06}>
              <Link
                href={`/periodos/${periodo.slug}`}
                className="group flex flex-col gap-3 rounded-sm border border-linea bg-fondo-2 p-8 transition-colors hover:border-oro/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="kicker text-oro">
                    {periodo.anioInicio} — {periodo.anioFin ?? "hoy"}
                  </p>
                  <h2 className="titulo-display mt-2 text-3xl font-medium text-tinta transition-colors group-hover:text-oro-claro">
                    {periodo.nombre}
                  </h2>
                  <p className="mt-2 max-w-xl text-sm text-tinta-tenue">
                    {periodo.descripcion}
                  </p>
                </div>
                <span className="shrink-0 text-oro opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                  Explorar →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
