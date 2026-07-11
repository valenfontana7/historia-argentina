"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function SufragioFraudulento() {
  return (
    <PanelImagenComparador
      imagenId="golpe-1930-plaza"
      pie="Antes de 1912: elecciones amañadas y el pueblo fuera del poder"
    />
  );
}

export function SufragioSecreto() {
  return (
    <PanelImagenComparador
      imagenId="saenz-pena-elecciones"
      pie="1912: voto secreto y obligatorio — el mapa que cambió la Argentina"
    />
  );
}
