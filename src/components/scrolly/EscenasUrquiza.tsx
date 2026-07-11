"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function UrquizaEntrerriano() {
  return (
    <PanelImagenComparador
      imagenId="urquiza-retrato"
      pie="Urquiza: caudillo de Entre Ríos y arquitecto de la coalición antirosista"
    />
  );
}

export function UrquizaVictoria() {
  return (
    <PanelImagenComparador
      imagenId="caseros-batalla"
      pie="Caseros 1852: Urquiza quebró el orden rosista"
    />
  );
}
