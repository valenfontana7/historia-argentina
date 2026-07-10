"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function TucumanRetirada() {
  return (
    <PanelImagenComparador
      imagenId="jujuy-exodo"
      pie="La orden era retirarse a Córdoba: abandonar el norte"
    />
  );
}

export function TucumanBatalla() {
  return (
    <PanelImagenComparador
      imagenId="jujuy-tucuman"
      pie="Belgrano elige pelear en Tucumán con lo que tiene"
    />
  );
}
