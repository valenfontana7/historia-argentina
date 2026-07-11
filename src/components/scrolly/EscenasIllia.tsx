"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function IlliaPresidente() {
  return (
    <PanelImagenComparador
      imagenId="illia-retrato"
      pie="Arturo Illia: la democracia radical entre dos golpes"
    />
  );
}

export function IlliaObra() {
  return (
    <PanelImagenComparador
      imagenId="illia-obra"
      pie="Illia gobernó con austeridad y ley de petróleo en un país fracturado"
    />
  );
}
