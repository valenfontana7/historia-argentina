"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function LiniersHeroe() {
  return (
    <PanelImagenComparador
      imagenId="liniers-retrato"
      pie="Santiago de Liniers: el marino francés que reconquistó Buenos Aires"
    />
  );
}

export function LiniersMilicias() {
  return (
    <PanelImagenComparador
      imagenId="mayo-milicias"
      pie="Las milicias que armó en 1806 serían la fuerza del 25 de Mayo"
    />
  );
}
