"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function CamporaPresidente() {
  return (
    <PanelImagenComparador
      imagenId="campora-retrato"
      pie="Héctor Cámpora: el dentista que abrió la puerta al retorno"
    />
  );
}

export function Campora1973() {
  return (
    <PanelImagenComparador
      imagenId="campora-1973"
      pie="11 de marzo de 1973: Cámpora al gobierno, Perón a la presidencia"
    />
  );
}
