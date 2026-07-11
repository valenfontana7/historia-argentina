"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function FacundoBarbarie() {
  return (
    <PanelImagenComparador
      imagenId="facundo-2"
      pie="La barbarie: caudillos, caballos y poder personal en el interior"
    />
  );
}

export function FacundoCivilizacion() {
  return (
    <PanelImagenComparador
      imagenId="sarmiento-retrato"
      pie="La civilización: Sarmiento, el libro y la escuela como proyecto de país"
    />
  );
}
