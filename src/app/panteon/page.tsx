import type { Metadata } from "next";
import { PersonajeCard } from "@/components/PersonajeCard";
import { Reveal } from "@/components/ui/Reveal";
import { personajes, nombresEpocas } from "@/data/personajes";
import type { Epoca } from "@/components/ui/Retrato";
import { construirMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = construirMetadata({
  titulo: "El Panteón — Los personajes de la historia argentina",
  descripcion:
    "Los protagonistas de la historia argentina en fichas interactivas: biografías, líneas de vida, aliados, enemigos y frases célebres. De San Martín a Alfonsín.",
  ruta: "/panteon",
});

const ordenEpocas: Epoca[] = [
  "colonia",
  "independencia",
  "organizacion",
  "moderna",
  "contemporanea",
];

export default function PanteonPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-28 pt-32">
      <Reveal>
        <p className="kicker">El Panteón</p>
        <h1 className="titulo-display mt-4 max-w-3xl text-5xl font-semibold leading-[1.05] sm:text-6xl">
          La historia es, antes que nada, gente.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-tinta-suave">
          Héroes, tiranos, visionarios y derrotados. Cada ficha es una vida
          completa: sus batallas, sus aliados, sus enemigos y las frases que
          dejaron clavadas en la memoria del país.
        </p>
      </Reveal>

      {ordenEpocas.map((epoca) => {
        const grupo = personajes.filter((p) => p.epoca === epoca);
        if (grupo.length === 0) return null;
        return (
          <section key={epoca} className="mt-20">
            <Reveal>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                <h2 className="titulo-display shrink-0 text-2xl font-medium text-oro">
                  {nombresEpocas[epoca]}
                </h2>
                <div className="filete w-full" />
              </div>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 min-[400px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {grupo.map((personaje, i) => (
                <Reveal key={personaje.slug} delay={(i % 4) * 0.07}>
                  <PersonajeCard personaje={personaje} />
                </Reveal>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
