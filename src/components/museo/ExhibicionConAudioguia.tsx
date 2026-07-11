"use client";

import { useState, type ReactNode } from "react";
import { CapituloIndexProvider } from "@/lib/audioguia/capitulo-index";
import { AudioguiaScrollSync } from "@/components/museo/AudioguiaScrollSync";
import { ReproductorAudioguia } from "@/components/museo/ReproductorAudioguia";
import type { AudioguiaExhibicion } from "@/data/audioguias-salas";

type Props = {
  children: ReactNode;
  audioguia?: AudioguiaExhibicion;
};

export function ExhibicionConAudioguia({ children, audioguia }: Props) {
  const [capituloActivo, setCapituloActivo] = useState(0);

  return (
    <CapituloIndexProvider>
      {audioguia && (
        <div className="mx-auto max-w-4xl px-5 pt-8">
          <ReproductorAudioguia
            titulo={audioguia.titulo}
            segmentos={audioguia.segmentos}
            estacionActiva={capituloActivo}
            audioUrl={audioguia.audioUrl}
            contexto="exhibicion"
          />
        </div>
      )}
      <AudioguiaScrollSync
        enabled={Boolean(audioguia)}
        onCapitulo={setCapituloActivo}
      />
      {children}
    </CapituloIndexProvider>
  );
}
