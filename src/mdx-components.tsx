import type { MDXComponents } from "mdx/types";
import { Capitulo } from "@/components/scrolly/Capitulo";
import { CitaHistorica } from "@/components/scrolly/CitaHistorica";
import { DatoGigante, FilaDeDatos } from "@/components/scrolly/DatoGigante";
import { Comparador } from "@/components/scrolly/Comparador";
import { MapaCruce } from "@/components/scrolly/MapaCruce";
import { MapaDefensa } from "@/components/scrolly/MapaDefensa";
import { PlanNorte, PlanAndes } from "@/components/scrolly/EscenasCruce";
import { InvasionPrimera, Reconquista } from "@/components/scrolly/EscenasInvasiones";
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
    MapaDefensa,
    PlanNorte,
    PlanAndes,
    InvasionPrimera,
    Reconquista,
    Prosa,
    ...components,
  };
}
