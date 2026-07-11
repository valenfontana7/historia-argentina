import type { Metadata } from "next";
import Link from "next/link";
import { MigasDePan } from "@/components/seo/MigasDePan";
import { Reveal } from "@/components/ui/Reveal";
import { recorridos, esRecorridoMecenas } from "@/data/recorridos";
import { contarCronicasEnRecorrido } from "@/lib/cronicas/indice";
import { construirMetadata } from "@/lib/seo/metadata";
import { migajasJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = construirMetadata({
  titulo: "Recorridos — rutas por la historia argentina",
  descripcion:
    "Historias con un hilo conductor: vas de un paso al siguiente sin perderte.",
  ruta: "/recorridos",
});

export default function RecorridosPage() {
  const migajas = [
    { nombre: "Inicio", href: "/" },
    { nombre: "Recorridos", href: "/recorridos" },
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
          <p className="kicker">Paso a paso</p>
          <h1 className="titulo-display mt-4 text-5xl font-semibold sm:text-6xl">
            Recorridos
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-tinta-suave">
            Caminá la historia en orden: cada paso te lleva al siguiente. Hay
            recorridos gratis y dos especiales solo para mecenas.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {recorridos.map((recorrido, i) => {
            const numCronicas = contarCronicasEnRecorrido(recorrido.slug);
            return (
            <Reveal key={recorrido.slug} delay={i * 0.05}>
              <Link
                href={`/recorridos/${recorrido.slug}`}
                className="group block h-full rounded-sm border border-linea bg-fondo-2 p-8 transition-colors hover:border-oro/40"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-tinta-tenue">
                  {recorrido.duracion} · {recorrido.pasos.length} pasos
                  {numCronicas > 0 && (
                    <span>
                      {" "}
                      · {numCronicas} {numCronicas === 1 ? "crónica" : "crónicas"}
                    </span>
                  )}
                  {esRecorridoMecenas(recorrido) && (
                    <span className="ml-2 text-oro">· Mecenas</span>
                  )}
                </p>
                <h2 className="titulo-display mt-3 text-2xl font-semibold transition-colors group-hover:text-oro-claro">
                  {recorrido.titulo}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-tinta-suave">
                  {recorrido.subtitulo}
                </p>
                <p className="mt-6 text-xs uppercase tracking-[0.2em] text-oro transition-transform duration-300 group-hover:translate-x-1.5">
                  Empezar recorrido →
                </p>
              </Link>
            </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
