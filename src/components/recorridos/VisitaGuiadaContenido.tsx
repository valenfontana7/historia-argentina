"use client";

import { RecorridoPasos } from "@/components/recorridos/RecorridoPasos";
import { ReproductorAudioguia } from "@/components/museo/ReproductorAudioguia";
import { RegistrarSelloRecorrido } from "@/components/museo/RegistrarSelloRecorrido";
import type { AudioguiaRecorrido } from "@/data/audioguias";
import type { PasoRecorrido } from "@/data/recorridos";
import type { NodoEntidad } from "@/lib/grafo/tipos";

type PasoResuelto = {
  paso: PasoRecorrido;
  nodo: NodoEntidad;
};

type Props = {
  pasos: PasoResuelto[];
  tituloRecorrido: string;
  slug: string;
  audioguia?: AudioguiaRecorrido;
};

export function VisitaGuiadaContenido({
  pasos,
  tituloRecorrido,
  slug,
  audioguia,
}: Props) {
  return (
    <>
      {audioguia && (
        <div className="mt-12">
          <ReproductorAudioguia
            titulo={audioguia.titulo}
            segmentos={audioguia.segmentos}
            audioUrl={audioguia.audioUrl}
          />
        </div>
      )}
      <div className="mt-16">
        <RecorridoPasos pasos={pasos} tituloRecorrido={tituloRecorrido} />
      </div>
      <RegistrarSelloRecorrido slug={slug} titulo={tituloRecorrido} />
    </>
  );
}
