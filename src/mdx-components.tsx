import type { MDXComponents } from "mdx/types";
import { Capitulo } from "@/components/scrolly/Capitulo";
import { CitaHistorica } from "@/components/scrolly/CitaHistorica";
import { DatoGigante, FilaDeDatos } from "@/components/scrolly/DatoGigante";
import { Comparador } from "@/components/scrolly/Comparador";
import { MapaCruce } from "@/components/scrolly/MapaCruce";
import { PlanNorte, PlanAndes } from "@/components/scrolly/EscenasCruce";
import { Prosa } from "@/components/scrolly/Prosa";

/**
 * Componentes disponibles dentro de cualquier crónica MDX
 * sin necesidad de importarlos en el archivo.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Capitulo,
    CitaHistorica,
    DatoGigante,
    FilaDeDatos,
    Comparador,
    MapaCruce,
    PlanNorte,
    PlanAndes,
    Prosa,
    ...components,
  };
}
