"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function DesiertoFrontera() {
  return (
    <PanelImagenComparador
      imagenId="roca-retrato"
      pie="Roca: ministro de Guerra y arquitecto de la campaña del sur"
    />
  );
}

export function DesiertoCampana() {
  return (
    <PanelImagenComparador
      imagenId="desierto-ejercito"
      pie="El ejército de Roca avanza por la Patagonia"
    />
  );
}
