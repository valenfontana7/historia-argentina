"use client";

import { useState } from "react";
import {
  DEFAULT_TTS_INSTRUCTIONS,
  DEFAULT_TTS_VOICE,
} from "@/lib/video/tts-defaults";

export type VideoFormatId =
  | "reel"
  | "short"
  | "historia"
  | "documental"
  | "curiosidad"
  | "efemeride";

export type NarrativePace = "rapido" | "medio" | "pausado";

export type VideoGenerateOptionsValue = {
  formatId: VideoFormatId;
  targetDurationSec: number;
  narrativePace: NarrativePace;
  cta: string;
  tone: string;
  ttsVoice: string;
  ttsInstructions: string;
  llmModel: string;
};

/** Copia de DEFAULT_FORMAT_PROFILES (video-contracts) para presets en cliente. */
const FORMAT_PRESETS: Record<
  VideoFormatId,
  Pick<
    VideoGenerateOptionsValue,
    "targetDurationSec" | "tone" | "cta" | "narrativePace"
  >
> = {
  reel: {
    targetDurationSec: 40,
    tone: "narrativo, claro, museístico, sin sensacionalismo",
    cta: "Seguí explorando · @museoargent",
    narrativePace: "rapido",
  },
  short: {
    targetDurationSec: 45,
    tone: "didáctico y cercano",
    cta: "Más historias · @museoargent",
    narrativePace: "rapido",
  },
  historia: {
    targetDurationSec: 60,
    tone: "épico contenido, preciso",
    cta: "Leé la crónica · @museoargent",
    narrativePace: "medio",
  },
  documental: {
    targetDurationSec: 90,
    tone: "documental, pausado, con contexto",
    cta: "Visitá la exhibición · @museoargent",
    narrativePace: "pausado",
  },
  curiosidad: {
    targetDurationSec: 25,
    tone: "curioso, sorprendente, breve",
    cta: "Más curiosidades · @museoargent",
    narrativePace: "rapido",
  },
  efemeride: {
    targetDurationSec: 30,
    tone: "conmemorativo e informativo",
    cta: "Más efemérides · @museoargent",
    narrativePace: "medio",
  },
};

export function defaultVideoGenerateOptions(): VideoGenerateOptionsValue {
  const reel = FORMAT_PRESETS.reel;
  return {
    formatId: "reel",
    targetDurationSec: reel.targetDurationSec,
    narrativePace: reel.narrativePace,
    cta: reel.cta,
    tone: reel.tone,
    ttsVoice: DEFAULT_TTS_VOICE,
    ttsInstructions: DEFAULT_TTS_INSTRUCTIONS,
    llmModel: "gpt-5.6-terra",
  };
}

const FORMAT_LABELS: Record<VideoFormatId, string> = {
  reel: "Reel",
  short: "Short",
  historia: "Historia",
  documental: "Documental",
  curiosidad: "Curiosidad",
  efemeride: "Efeméride",
};

const VOICES = ["marin", "cedar", "onyx", "nova", "coral", "sage"] as const;
const LLM_MODELS = [
  "gpt-5.6-terra",
  "gpt-5.6-sol",
  "gpt-5.6",
  "gpt-4o",
] as const;

type Props = {
  value: VideoGenerateOptionsValue;
  onChange: (next: VideoGenerateOptionsValue) => void;
  disabled?: boolean;
};

export function VideoGenerateOptions({ value, onChange, disabled }: Props) {
  const [abierto, setAbierto] = useState(false);

  function patch(partial: Partial<VideoGenerateOptionsValue>) {
    onChange({ ...value, ...partial });
  }

  function onFormatChange(formatId: VideoFormatId) {
    const preset = FORMAT_PRESETS[formatId];
    onChange({
      ...value,
      formatId,
      targetDurationSec: preset.targetDurationSec,
      narrativePace: preset.narrativePace,
      cta: preset.cta,
      tone: preset.tone,
    });
  }

  const field =
    "mt-1.5 min-h-10 w-full rounded-sm border border-linea bg-fondo px-3 py-2 text-sm text-tinta focus:border-oro/50 disabled:opacity-50";
  const label = "text-xs uppercase tracking-[0.14em] text-tinta-tenue";

  return (
    <div className="rounded-sm border border-linea/80 bg-fondo/40">
      <button
        type="button"
        disabled={disabled}
        aria-expanded={abierto}
        onClick={() => setAbierto((v) => !v)}
        className="flex min-h-11 w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm text-tinta disabled:opacity-50"
      >
        <span className="font-medium">Opciones avanzadas</span>
        <span className="text-tinta-tenue" aria-hidden>
          {abierto ? "−" : "+"}
        </span>
      </button>

      {abierto && (
        <div className="space-y-4 border-t border-linea/80 px-3 pb-4 pt-3">
          <label className="block">
            <span className={label}>Formato</span>
            <select
              className={field}
              value={value.formatId}
              disabled={disabled}
              onChange={(e) =>
                onFormatChange(e.target.value as VideoFormatId)
              }
            >
              {(Object.keys(FORMAT_LABELS) as VideoFormatId[]).map((id) => (
                <option key={id} value={id}>
                  {FORMAT_LABELS[id]}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={label}>Duración objetivo (s)</span>
              <input
                type="number"
                min={8}
                max={180}
                step={1}
                className={field}
                value={value.targetDurationSec}
                disabled={disabled}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (Number.isFinite(n) && n > 0) {
                    patch({ targetDurationSec: n });
                  }
                }}
              />
            </label>

            <label className="block">
              <span className={label}>Ritmo</span>
              <select
                className={field}
                value={value.narrativePace}
                disabled={disabled}
                onChange={(e) =>
                  patch({ narrativePace: e.target.value as NarrativePace })
                }
              >
                <option value="rapido">Rápido</option>
                <option value="medio">Medio</option>
                <option value="pausado">Pausado</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className={label}>CTA</span>
            <input
              type="text"
              className={field}
              value={value.cta}
              disabled={disabled}
              onChange={(e) => patch({ cta: e.target.value })}
            />
          </label>

          <label className="block">
            <span className={label}>Tono</span>
            <textarea
              rows={2}
              className={`${field} min-h-18 resize-y`}
              value={value.tone}
              disabled={disabled}
              onChange={(e) => patch({ tone: e.target.value })}
            />
          </label>

          <label className="block">
            <span className={label}>Voz TTS</span>
            <select
              className={field}
              value={value.ttsVoice}
              disabled={disabled}
              onChange={(e) => patch({ ttsVoice: e.target.value })}
            >
              {VOICES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className={label}>Instrucciones TTS</span>
            <textarea
              rows={3}
              className={`${field} min-h-22 resize-y`}
              value={value.ttsInstructions}
              disabled={disabled}
              onChange={(e) => patch({ ttsInstructions: e.target.value })}
            />
          </label>

          <label className="block">
            <span className={label}>Modelo LLM</span>
            <select
              className={field}
              value={value.llmModel}
              disabled={disabled}
              onChange={(e) => patch({ llmModel: e.target.value })}
            >
              {LLM_MODELS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </div>
  );
}
