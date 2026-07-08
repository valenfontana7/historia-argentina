import type { Personaje } from "@/data/personajes";

export type MomentoDefinitorio = {
  anio: number;
  linea: string;
  cita?: string;
  contextoCita?: string;
};

/** Deriva el momento definitorio de un personaje a partir de frase e hitos. */
export function momentoDePersonaje(personaje: Personaje): MomentoDefinitorio | null {
  if (personaje.momento) return personaje.momento;

  const hitoClave =
    personaje.hitos.find((h) => h.anio === personaje.muerte?.anio) ??
    personaje.hitos[Math.floor(personaje.hitos.length / 2)] ??
    personaje.hitos[personaje.hitos.length - 1];

  if (!hitoClave) return null;

  if (personaje.frase) {
    return {
      anio: hitoClave.anio,
      linea: hitoClave.texto,
      cita: personaje.frase.texto,
      contextoCita: personaje.frase.contexto,
    };
  }

  return {
    anio: hitoClave.anio,
    linea: hitoClave.texto,
  };
}
