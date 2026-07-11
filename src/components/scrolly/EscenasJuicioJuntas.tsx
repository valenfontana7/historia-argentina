"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function JuicioJuntasBanquillo() {
  return (
    <PanelImagenComparador
      imagenId="juicio-juntas"
      pie="1985: los comandantes de la dictadura en el banquillo civil"
    />
  );
}

export function JuicioJuntasSala() {
  return (
    <PanelImagenComparador
      imagenId="juicio-juntas-sala"
      pie="Por primera vez en América Latina, tribunales civiles juzgaron a sus dictadores"
    />
  );
}
