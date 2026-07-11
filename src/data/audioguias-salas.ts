import { GENERADO_INDICE } from "@/data/audioguias-salas-generadas";
import { CURADAS_TIERB_INDICE } from "@/data/audioguias-salas-curadas-tierb";
import { CURADAS_TIERA_INDICE } from "@/data/audioguias-salas-curadas-tiera";
import {
  MANUAL_INDICE,
  type AudioguiaExhibicion,
} from "@/data/audioguias-salas-manual";
import { MANUAL_TIERB_INDICE } from "@/data/audioguias-salas-manual-tierb";
import { MANUAL_TIERC_INDICE } from "@/data/audioguias-salas-manual-tierc";

export type { AudioguiaExhibicion };

/** Prioridad: manual > manual tier B/C > curadas tier B/A > generadas tier C. */
const INDICE: Record<string, AudioguiaExhibicion> = {
  ...GENERADO_INDICE,
  ...CURADAS_TIERA_INDICE,
  ...CURADAS_TIERB_INDICE,
  ...MANUAL_TIERC_INDICE,
  ...MANUAL_TIERB_INDICE,
  ...MANUAL_INDICE,
};

export function obtenerAudioguiaSala(cronicaSlug: string): AudioguiaExhibicion | undefined {
  return INDICE[cronicaSlug];
}

export function exhibicionesConAudioguia(): string[] {
  return Object.keys(INDICE).sort((a, b) => a.localeCompare(b, "es"));
}

export function tieneAudioguia(cronicaSlug: string): boolean {
  return cronicaSlug in INDICE;
}
