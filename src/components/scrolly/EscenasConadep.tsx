"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function ConadepSabato() {
  return (
    <PanelImagenComparador
      imagenId="conadep-sabato"
      pie="Ernesto Sábato presidió la Comisión que escribió Nunca Más"
    />
  );
}

export function ConadepMemoria() {
  return (
    <PanelImagenComparador
      imagenId="memoria-alfonsin"
      pie="Alfonsín creó la CONADEP para que la verdad no se borrara"
    />
  );
}
