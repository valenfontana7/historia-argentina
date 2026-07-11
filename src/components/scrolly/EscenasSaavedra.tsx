"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function SaavedraMilicias() {
  return (
    <PanelImagenComparador
      imagenId="saavedra-retrato"
      pie="Cornelio Saavedra: jefe de las milicias y primer presidente de la Junta"
    />
  );
}

export function SaavedraJunta() {
  return (
    <PanelImagenComparador
      imagenId="mayo-junta"
      pie="La Primera Junta: Saavedra al frente del poder revolucionario"
    />
  );
}
