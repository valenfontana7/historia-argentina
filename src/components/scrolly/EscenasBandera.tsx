"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function BelgranoGeneral() {
  return (
    <PanelImagenComparador
      imagenId="andes-chacabuco"
      pie="Belgrano: el general que no quiso ser militar"
    />
  );
}

export function BelgranoBandera() {
  return (
    <PanelImagenComparador
      imagenId="bandera-belgrano"
      pie="Febrero de 1812: la bandera celeste y blanca nace en Rosario"
    />
  );
}
