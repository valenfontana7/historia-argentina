import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { MiniSiluetaHero, gradientesHero } from "@/components/scrolly/HeroSiluetas";
import { cronicas } from "@/content/cronicas/registro";
import { puedeVerContenidoMecenas } from "@/lib/auth";
import { construirMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = construirMetadata({
  titulo: "Crónicas — Historias visuales de la historia argentina",
  descripcion:
    "Historias de la historia argentina contadas como experiencias visuales interactivas: mapas animados, datos y relatos que se navegan con el scroll.",
  ruta: "/cronicas",
});

export default async function CronicasPage() {
  const esMecenas = await puedeVerContenidoMecenas();
  return (
    <div className="mx-auto max-w-6xl px-5 pb-28 pt-32">
      <Reveal>
        <p className="kicker">Crónicas</p>
        <h1 className="titulo-display mt-4 max-w-3xl text-5xl font-semibold leading-[1.05] sm:text-6xl">
          Historias que se viven con el scroll.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-tinta-suave">
          Cada crónica es una experiencia: mapas que se dibujan, cifras que
          cobran vida y relatos que avanzan al ritmo de tu dedo. Una nueva
          historia cada mes.
        </p>
      </Reveal>

      <div className="mt-16 space-y-10">
        {cronicas.map((cronica, i) => {
          const exclusiva = cronica.acceso !== "publico";
          const variante = cronica.visual.varianteHero;
          return (
            <Reveal key={cronica.slug} delay={i * 0.08}>
              <Link
                href={`/cronicas/${cronica.slug}`}
                className={`group relative block overflow-hidden rounded-sm border transition-colors ${
                  exclusiva
                    ? "border-oro/35 hover:border-oro/60"
                    : "border-linea hover:border-oro/40"
                }`}
              >
                <div
                  className="relative px-8 py-20 sm:px-14 sm:py-28"
                  style={{ background: gradientesHero[variante] }}
                >
                  <MiniSiluetaHero variante={variante} />
                  <div className="relative">
                    <p className="kicker">{cronica.kicker}</p>
                    <h2 className="titulo-display mt-4 max-w-2xl text-4xl font-semibold leading-tight transition-colors group-hover:text-oro-claro sm:text-5xl">
                      {cronica.titulo}
                    </h2>
                    <p className="mt-5 max-w-2xl leading-relaxed text-tinta-suave">
                      {cronica.subtitulo}
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 text-xs uppercase tracking-[0.2em] text-tinta-tenue">
                      <span>{cronica.periodo}</span>
                      <span>Lectura: {cronica.duracion}</span>
                      <span className="text-oro transition-transform duration-300 group-hover:translate-x-1.5">
                        {exclusiva
                          ? esMecenas
                            ? "Incluida en tu membresía →"
                            : "Exclusiva mecenas →"
                          : "Vivir la historia →"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
