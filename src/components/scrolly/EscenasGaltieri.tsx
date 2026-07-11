"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function GaltieriDictador() {
  return (
    <PanelImagenComparador
      imagenId="galtieri-retrato"
      pie="Leopoldo Galtieri: el último presidente de la dictadura"
    />
  );
}

export function GaltieriMalvinas() {
  return (
    <PanelImagenComparador
      imagenId="malvinas-desembarco"
      pie="2 de abril de 1982: la apuesta desesperada de un régimen acorralado"
    />
  );
}
