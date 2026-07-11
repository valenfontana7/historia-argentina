"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function CelmanPresidente() {
  return (
    <PanelImagenComparador
      imagenId="celman-retrato"
      pie="Miguel Juárez Celman: la Generación del Ochenta en el poder"
    />
  );
}

export function CelmanCrisis() {
  return (
    <PanelImagenComparador
      imagenId="revolucion-parque"
      pie="1890: la ciudad se levantó contra el régimen de Celman"
    />
  );
}
