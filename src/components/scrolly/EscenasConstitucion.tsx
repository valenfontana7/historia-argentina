"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function ConstitucionBA() {
  return (
    <PanelImagenComparador
      imagenId="caseros-rosas"
      pie="Buenos Aires separada: la provincia más rica fuera del Congreso"
    />
  );
}

export function ConstitucionConfed() {
  return (
    <PanelImagenComparador
      imagenId="constitucion-1853"
      pie="1 de mayo de 1853: la Constitución Nacional promulgada en Santa Fe"
    />
  );
}
