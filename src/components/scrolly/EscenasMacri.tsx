"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function MacriPresidente() {
  return (
    <PanelImagenComparador
      imagenId="macri-retrato"
      pie="Mauricio Macri: el cambio que terminó doce años de kirchnerismo"
    />
  );
}

export function MacriCambiemos() {
  return (
    <PanelImagenComparador
      imagenId="macri-cambiemos"
      pie="2015: Cambiemos gana el balotaje y redefine la política argentina"
    />
  );
}
