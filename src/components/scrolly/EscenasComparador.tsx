import type { ComponentType } from "react";
import { ESCENAS_COMPARADOR, type EscenaComparadorDef } from "@/data/escenas-comparador";
import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

function crearEscena(def: EscenaComparadorDef, nombre: string): ComponentType {
  function Escena() {
    return <PanelImagenComparador imagenId={def.imagenId} pie={def.pie} />;
  }
  Escena.displayName = nombre;
  return Escena;
}

/** Componentes MDX generados desde el registro paramétrico. */
export const escenasComparadorMdx = Object.fromEntries(
  Object.entries(ESCENAS_COMPARADOR).map(([nombre, def]) => [
    nombre,
    crearEscena(def, nombre),
  ]),
) as Record<string, ComponentType>;
