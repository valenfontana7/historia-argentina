import type { Metadata } from "next";
import { MigasDePan } from "@/components/seo/MigasDePan";
import { Reveal } from "@/components/ui/Reveal";
import { FichaRecorrido } from "@/components/recorridos/FichaRecorrido";
import { recorridos } from "@/data/recorridos";
import { recorridosConAudioguia } from "@/data/audioguias";
import { construirMetadata } from "@/lib/seo/metadata";
import { migajasJsonLd } from "@/lib/seo/jsonld";
import {
  DESCRIPCION_VISITAS_GUIADAS,
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(migajasJsonLd(migajas)),
        }}
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

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:gap-6">
          {recorridos.map((recorrido, i) => (
            <Reveal key={recorrido.slug} delay={i * 0.05}>
              <FichaRecorrido
                recorrido={recorrido}
                conAudioguia={slugsAudioguia.has(recorrido.slug)}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
