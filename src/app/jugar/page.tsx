import type { Metadata } from "next";
import Link from "next/link";
import { QuizEfemeride } from "@/components/juego/QuizEfemeride";
import { MigasDePan } from "@/components/seo/MigasDePan";
import { Reveal } from "@/components/ui/Reveal";
import { hoyEnArgentina } from "@/lib/fechas";
import { generarQuiz } from "@/lib/juego/quiz-efemeride";
import { construirMetadata } from "@/lib/seo/metadata";
import { migajasJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = construirMetadata({
  titulo: "¿Qué pasó un…? — Quiz diario de historia argentina",
  descripcion:
    "Probá cuánto sabés de la historia argentina. Una pregunta por día basada en efemérides reales.",
  ruta: "/jugar",
});

export default function JugarPage() {
  const { mes, dia } = hoyEnArgentina();
  const fecha = new Date(new Date().getFullYear(), mes - 1, dia);
  const fechaIso = fecha.toISOString().slice(0, 10);
  const quiz = generarQuiz(fecha);

  const migajas = [
    { nombre: "Inicio", href: "/" },
    { nombre: "Jugar", href: "/jugar" },
  ];

  return (
    <div className="pb-28 pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(migajasJsonLd(migajas)) }}
      />
      <div className="mx-auto max-w-3xl px-5">
        <MigasDePan migajas={migajas} />
        <Reveal>
          <p className="kicker">Juego diario</p>
          <h1 className="titulo-display mt-4 text-5xl font-semibold sm:text-6xl">
            ¿Qué pasó un…?
          </h1>
          <p className="mt-6 text-lg text-tinta-suave">
            Una pregunta por día. Misma pregunta para todos — compartila y compará
            resultados.
          </p>
        </Reveal>

        <Reveal className="mt-12">
          <QuizEfemeride quiz={quiz} fechaIso={fechaIso} />
        </Reveal>

        <p className="mt-10 text-center text-sm text-tinta-tenue">
          <Link href="/explorar" className="text-oro-claro hover:text-oro">
            Explorar más →
          </Link>
          {" · "}
          <Link href="/timelines" className="text-oro-claro hover:text-oro">
            Timeline
          </Link>
        </p>
      </div>
    </div>
  );
}
