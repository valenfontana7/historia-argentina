"use client";

import { useCallback, useEffect, useState } from "react";
import type { SegmentoAudioguia } from "@/data/audioguias";

type Props = {
  titulo: string;
  segmentos: SegmentoAudioguia[];
  estacionActiva?: number;
  audioUrl?: string;
  /** Etiqueta de contexto para accesibilidad. */
  contexto?: "visita" | "exhibicion";
};

function segmentoParaEstacion(
  segmentos: SegmentoAudioguia[],
  estacion: number,
): SegmentoAudioguia | undefined {
  const exacto = segmentos.find((s) => s.estacion === estacion);
  if (exacto) return exacto;
  return [...segmentos].reverse().find((s) => s.estacion <= estacion);
}

export function ReproductorAudioguia({
  titulo,
  segmentos,
  estacionActiva = 0,
  audioUrl,
  contexto = "visita",
}: Props) {
  const [indice, setIndice] = useState(0);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [ttsDisponible, setTtsDisponible] = useState(false);

  useEffect(() => {
    setTtsDisponible(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  useEffect(() => {
    const match = segmentos.findIndex((s) => s.estacion === estacionActiva);
    if (match >= 0) setIndice(match);
  }, [estacionActiva, segmentos]);

  const segmento = segmentos[indice] ?? segmentoParaEstacion(segmentos, estacionActiva);

  const detener = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setReproduciendo(false);
  }, []);

  const reproducirSegmento = useCallback(
    (seg: SegmentoAudioguia) => {
      if (audioUrl) {
        setReproduciendo(true);
        return;
      }
      if (!ttsDisponible || typeof window === "undefined") return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(seg.texto);
      utter.lang = "es-AR";
      utter.rate = 0.95;
      utter.onend = () => setReproduciendo(false);
      utter.onerror = () => setReproduciendo(false);
      setReproduciendo(true);
      window.speechSynthesis.speak(utter);
    },
    [audioUrl, ttsDisponible],
  );

  useEffect(() => () => detener(), [detener]);

  if (!segmento) return null;

  return (
    <aside
      className="sticky top-20 z-30 mb-10 rounded-sm border border-oro/30 bg-fondo-2/95 p-4 backdrop-blur-md sm:p-5"
      aria-label={
        contexto === "exhibicion"
          ? "Audioguía de la exhibición"
          : "Audioguía de la visita"
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.22em] text-oro">Audioguía</p>
          <p className="titulo-display mt-1 text-lg font-medium">{titulo}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              if (reproduciendo) {
                detener();
              } else {
                reproducirSegmento(segmento);
              }
            }}
            className="rounded-full border border-oro/50 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-oro-claro transition-colors hover:bg-oro/10"
          >
            {reproduciendo ? "Pausar" : "Escuchar"}
          </button>
          {indice < segmentos.length - 1 && (
            <button
              type="button"
              onClick={() => {
                detener();
                setIndice((i) => Math.min(segmentos.length - 1, i + 1));
              }}
              className="rounded-full border border-linea px-3 py-2 text-xs text-tinta-suave hover:border-oro/40"
              aria-label="Siguiente segmento"
            >
              →
            </button>
          )}
        </div>
      </div>

      <p className="mt-3 text-sm font-medium text-oro-claro">{segmento.titulo}</p>
      <p className="mt-2 text-sm leading-relaxed text-tinta-suave">{segmento.texto}</p>

      {audioUrl && (
        <audio controls className="mt-4 w-full" src={audioUrl}>
          <track kind="captions" />
        </audio>
      )}

      {!audioUrl && !ttsDisponible && (
        <p className="mt-3 text-xs text-tinta-tenue">
          Tu navegador no soporta la reproducción de la audioguía.
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {segmentos.map((s, i) => (
          <button
            key={`${s.estacion}-${s.titulo}`}
            type="button"
            onClick={() => {
              detener();
              setIndice(i);
            }}
            className={`h-1.5 rounded-full transition-all ${
              i === indice ? "w-6 bg-oro" : "w-1.5 bg-linea hover:bg-oro/40"
            }`}
            aria-label={`Segmento: ${s.titulo}`}
          />
        ))}
      </div>
    </aside>
  );
}
