"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function PandemiaCuarentena() {
  return (
    <PanelImagenComparador
      imagenId="pandemia-cuarentena"
      pie="Marzo de 2020: la cuarentena más larga del mundo"
    />
  );
}

export function PandemiaGobierno() {
  return (
    <PanelImagenComparador
      imagenId="alberto-fernandez-2020"
      pie="Alberto Fernández gobernó la Argentina en plena pandemia global"
    />
  );
}
