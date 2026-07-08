"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BotonCompartir } from "@/components/BotonCompartir";
import {
  obtenerQuizStreak,
  registrarQuizCorrecto,
  type QuizStreak,
} from "@/lib/engagement/storage";
import type { QuizRound } from "@/lib/juego/quiz-efemeride";

type Props = {
  quiz: QuizRound;
  fechaIso: string;
};

export function QuizEfemeride({ quiz, fechaIso }: Props) {
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [streak, setStreak] = useState<QuizStreak | null>(null);

  const respondido = seleccion !== null;
  const acerto = useMemo(
    () => quiz.opciones.find((o) => o.id === seleccion)?.correcta ?? false,
    [quiz.opciones, seleccion],
  );

  function elegir(id: string) {
    if (respondido) return;
    setSeleccion(id);
    const opcion = quiz.opciones.find((o) => o.id === id);
    if (opcion?.correcta) {
      const fecha = new Date(fechaIso + "T12:00:00");
      setStreak(registrarQuizCorrecto(fecha));
    } else {
      setStreak(obtenerQuizStreak());
    }
  }

  return (
    <div className="rounded-sm border border-linea bg-fondo-2 p-6 sm:p-8">
      <p className="kicker">Quiz del día</p>
      <h2 className="titulo-display mt-4 text-2xl font-medium sm:text-3xl">
        {quiz.pregunta}
      </h2>

      <ul className="mt-8 space-y-3">
        {quiz.opciones.map((o) => {
          let estilo =
            "border-linea bg-fondo hover:border-oro/40 text-tinta-suave";
          if (respondido) {
            if (o.correcta) estilo = "border-oro bg-oro/10 text-oro-claro";
            else if (o.id === seleccion)
              estilo = "border-red-900/50 bg-red-950/30 text-tinta";
          }
          return (
            <li key={o.id}>
              <button
                type="button"
                disabled={respondido}
                onClick={() => elegir(o.id)}
                className={`w-full rounded-sm border px-5 py-4 text-left text-sm transition-colors ${estilo}`}
              >
                {o.texto}
              </button>
            </li>
          );
        })}
      </ul>

      {respondido && (
        <div className="mt-8 space-y-4 border-t border-linea pt-8">
          <p className={`text-lg ${acerto ? "text-oro-claro" : "text-tinta-suave"}`}>
            {acerto ? "¡Correcto!" : "Casi — la respuesta correcta era otra."}
          </p>
          <p className="text-sm text-tinta-tenue">{quiz.explicacion}</p>
          {streak && streak.racha > 0 && (
            <p className="text-sm text-oro">
              Racha: {streak.racha} día{streak.racha === 1 ? "" : "s"} ·{" "}
              {streak.totalCorrectas} aciertos totales
            </p>
          )}
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/hoy/${quiz.diaSlug}`}
              className="text-sm text-oro-claro hover:text-oro"
            >
              Leer la efeméride completa →
            </Link>
            <BotonCompartir
              titulo={`¿Sabés qué pasó un ${quiz.fecha}?`}
              texto={`Probé el quiz de Argent sobre el ${quiz.fecha}. ${acerto ? "¡Acerté!" : "Me costó."}`}
              ruta="/jugar"
              utmCampaign="quiz"
            />
          </div>
        </div>
      )}
    </div>
  );
}
