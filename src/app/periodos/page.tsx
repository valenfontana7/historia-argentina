import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { periodos } from "@/data/periodos";
import { construirMetadata } from "@/lib/seo/metadata";
import { migajasJsonLd } from "@/lib/seo/jsonld";
import { MigasDePan } from "@/components/seo/MigasDePan";
import {
  DESCRIPCION_SALAS,
  KICKER_SALAS,
  METADATA_SALAS,
  MIGA_SALAS,
  TITULO_SALAS,
} from "@/lib/copy";

export const metadata: Metadata = construirMetadata({
  titulo: METADATA_SALAS.titulo,
  descripcion: METADATA_SALAS.descripcion,
  ruta: "/periodos",
});

export default function PeriodosPage() {
  const migajas = [
    { nombre: "Inicio", href: "/" },
    { nombre: MIGA_SALAS, href: "/periodos" },
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
          <p className="kicker">{KICKER_SALAS}</p>
          <h1 className="titulo-display mt-4 text-5xl font-semibold sm:text-6xl">
            {TITULO_SALAS}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-tinta-suave">
            {DESCRIPCION_SALAS}
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
                  Entrar a la sala →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
