"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function AmiaMarcha() {
  return (
    <PanelImagenComparador
      imagenId="amia-marcha"
      pie="18 de julio de 1994: el atentado que sacudió la democracia"
    />
  );
}

export function AmiaMemoria() {
  return (
    <PanelImagenComparador
      imagenId="amia-memoria"
      pie="Treinta años después, la AMIA sigue pidiendo justicia"
    />
  );
}
