"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function RodrigazoMinistro() {
  return (
    <PanelImagenComparador
      imagenId="rodrigazo-rodrigo"
      pie="Celestino Rodrigo: el ministro del Rodrigazo de 1975"
    />
  );
}

export function RodrigazoInflacion() {
  return (
    <PanelImagenComparador
      imagenId="rodrigazo-grafico"
      pie="Junio de 1975: la inflación se disparó en pocas semanas"
    />
  );
}
