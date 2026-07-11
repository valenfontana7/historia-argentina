"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function ParaguayCampo() {
  return (
    <PanelImagenComparador
      imagenId="paraguay-tuyuti"
      pie="Tuyutí: la batalla más sangrienta de la guerra del Paraguay"
    />
  );
}

export function ParaguayMapa() {
  return (
    <PanelImagenComparador
      imagenId="paraguay-mapa"
      pie="1864 — 1870: Argentina, Brasil y Uruguay contra Paraguay"
    />
  );
}
