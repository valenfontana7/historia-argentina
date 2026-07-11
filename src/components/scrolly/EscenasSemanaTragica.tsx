"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function SemanaHuelga() {
  return (
    <PanelImagenComparador
      imagenId="semana-tragica-huelga"
      pie="La huelga metalúrgica: obreros y chóferes en las calles de Buenos Aires"
    />
  );
}

export function SemanaRepresion() {
  return (
    <PanelImagenComparador
      imagenId="semana-tragica-velorio"
      pie="La represión: velorios en los sindicatos y sangre en los barrios"
    />
  );
}
