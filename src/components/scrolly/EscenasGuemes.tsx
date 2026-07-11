"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function GuemesCaudillo() {
  return (
    <PanelImagenComparador
      imagenId="gaucha-guemes"
      pie="Güemes: el caudillo gaucho que defendió Salta con montoneras"
    />
  );
}

export function GuemesFrontera() {
  return (
    <PanelImagenComparador
      imagenId="jujuy-quebrada"
      pie="La frontera norte: geografía convertida en arma"
    />
  );
}
