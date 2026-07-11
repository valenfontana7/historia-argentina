"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function MorenoVirreinato() {
  return (
    <PanelImagenComparador
      imagenId="mayo-cabildo"
      pie="El virreinato: censura, privilegio y un mundo que ya no encajaba"
    />
  );
}

export function MorenoPrensa() {
  return (
    <PanelImagenComparador
      imagenId="moreno-retrato"
      pie="Moreno: la pluma, la Gazeta y la revolución de las ideas"
    />
  );
}
