import { imagenesCronicas } from "@/data/cronicas-imagenes";
import { ESCENAS_COMPARADOR } from "@/data/escenas-comparador";

export function validarEscenasComparador(): { ok: boolean; problemas: string[] } {
  const problemas: string[] = [];

  for (const [nombre, { imagenId }] of Object.entries(ESCENAS_COMPARADOR)) {
    if (!(imagenId in imagenesCronicas)) {
      problemas.push(`${nombre}: imagenId "${imagenId}" no existe en cronicas-imagenes.ts`);
    }
  }

  return { ok: problemas.length === 0, problemas };
}
