"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function MariquitaSalon() {
  return (
    <PanelImagenComparador
      imagenId="mariquita-retrato"
      pie="Mariquita Sánchez: la anfitriona de la patria"
    />
  );
}

export function MariquitaMayo() {
  return (
    <PanelImagenComparador
      imagenId="mayo-escena"
      pie="En su salón se conspiró, se debatió y se cantó la revolución"
    />
  );
}
