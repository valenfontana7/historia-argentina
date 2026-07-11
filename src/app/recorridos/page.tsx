import type { Metadata } from "next";
import Link from "next/link";
import { MigasDePan } from "@/components/seo/MigasDePan";
import { Reveal } from "@/components/ui/Reveal";
import { TransicionLink } from "@/components/navigation/TransicionLink";
import { recorridos, esRecorridoMecenas } from "@/data/recorridos";
import { recorridosConAudioguia } from "@/data/audioguias";
import { contarCronicasEnRecorrido } from "@/lib/cronicas/indice";
import { construirMetadata } from "@/lib/seo/metadata";
import { migajasJsonLd } from "@/lib/seo/jsonld";
import {
  CTA_INICIAR_VISITA,
  DESCRIPCION_VISITAS_GUIADAS,
  etiquetaEstacionesVisita,
  etiquetaExhibicionesVisita,
  KICKER_VISITAS_GUIADAS,
  METADATA_VISITAS_GUIADAS,
  MIGA_VISITAS_GUIADAS,
  TITULO_VISITAS_GUIADAS,
} from "@/lib/copy";

export const metadata: Metadata = construirMetadata({
  titulo: METADATA_VISITAS_GUIADAS.titulo,
  descripcion: METADATA_VISITAS_GUIADAS.descripcion,
  ruta: "/recorridos",
});

export default function RecorridosPage() {
  const slugsAudioguia = new Set(recorridosConAudioguia());
  const migajas = [
    { nombre: "Inicio", href: "/" },
    { nombre: MIGA_VISITAS_GUIADAS, href: "/recorridos" },
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
          <p className="kicker">{KICKER_VISITAS_GUIADAS}</p>
          <h1 className="titulo-display mt-4 text-5xl font-semibold sm:text-6xl">
            {TITULO_VISITAS_GUIADAS}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-tinta-suave">
            {DESCRIPCION_VISITAS_GUIADAS}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {recorridos.map((recorrido, i) => {
            const numCronicas = contarCronicasEnRecorrido(recorrido.slug);
            return (
            <Reveal key={recorrido.slug} delay={i * 0.05}>
              <TransicionLink
                href={`/recorridos/${recorrido.slug}`}
                className="group block h-full rounded-sm border border-linea bg-fondo-2 p-8 transition-colors hover:border-oro/40"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-tinta-tenue">
                  {recorrido.duracion} · {etiquetaEstacionesVisita(recorrido.pasos.length)}
                  {numCronicas > 0 && (
                    <span>
                      {" "}
                      · {etiquetaExhibicionesVisita(numCronicas)}
                    </span>
                  )}
                  {esRecorridoMecenas(recorrido) && (
                    <span className="ml-2 text-oro">· Mecenas</span>
                  )}
                  {slugsAudioguia.has(recorrido.slug) && (
                    <span className="ml-2 text-oro">· Audioguía</span>
                  )}
                </p>
                <h2 className="titulo-display mt-3 text-2xl font-semibold transition-colors group-hover:text-oro-claro">
                  {recorrido.titulo}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-tinta-suave">
                  {recorrido.subtitulo}
                </p>
                <p className="mt-6 text-xs uppercase tracking-[0.2em] text-oro transition-transform duration-300 group-hover:translate-x-1.5">
                  {CTA_INICIAR_VISITA}
                </p>
              </TransicionLink>
            </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
