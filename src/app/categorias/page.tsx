import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { categorias } from "@/data/categorias";
import { construirMetadata } from "@/lib/seo/metadata";
import { migajasJsonLd } from "@/lib/seo/jsonld";
import { MigasDePan } from "@/components/seo/MigasDePan";

export const metadata: Metadata = construirMetadata({
  titulo: "Categorías de la historia argentina",
  descripcion:
    "Batallas, política, cultura, independencia y más: explorá la historia argentina por temas.",
  ruta: "/categorias",
});

export default function CategoriasPage() {
  const migajas = [
    { nombre: "Inicio", href: "/" },
    { nombre: "Categorías", href: "/categorias" },
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
          <p className="kicker">Temas del relato</p>
          <h1 className="titulo-display mt-4 text-5xl font-semibold sm:text-6xl">
            Categorías
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-tinta-suave">
            La historia argentina vista por lentes: batallas, política, cultura y
            los momentos que definieron al país.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categorias.map((cat, i) => (
            <Reveal key={cat.slug} delay={i * 0.04}>
              <Link
                href={`/categorias/${cat.slug}`}
                className="group block rounded-sm border border-linea bg-fondo-2 p-6 transition-colors hover:border-oro/40"
              >
                <h2 className="titulo-display text-xl font-medium text-tinta transition-colors group-hover:text-oro-claro">
                  {cat.nombre}
                </h2>
                <p className="mt-2 text-sm text-tinta-tenue">{cat.descripcion}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
