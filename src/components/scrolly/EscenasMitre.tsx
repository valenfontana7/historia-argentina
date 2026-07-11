"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function MitreHistoriador() {
  return (
    <PanelImagenComparador
      imagenId="mitre-retrato"
      pie="Bartolomé Mitre: historiador, general y primer presidente unitario"
    />
  );
}

export function MitreGuerra() {
  return (
    <PanelImagenComparador
      imagenId="paraguay-piribebuy"
      pie="La guerra del Paraguay: la campaña más sangrienta de la historia argentina"
    />
  );
}
