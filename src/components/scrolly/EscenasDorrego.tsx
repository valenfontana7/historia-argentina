"use client";

import { PanelImagenComparador } from "@/components/scrolly/PanelImagenComparador";

export function DorregoGobernador() {
  return (
    <PanelImagenComparador
      imagenId="dorrego-retrato"
      pie="Manuel Dorrego: federalismo, provincia y oposición al centralismo"
    />
  );
}

export function DorregoFusilamiento() {
  return (
    <PanelImagenComparador
      imagenId="dorrego-fusilamiento"
      pie="Diciembre de 1828: el martirio federal que abrió la era rosista"
    />
  );
}
