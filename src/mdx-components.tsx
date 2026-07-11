import type { MDXComponents } from "mdx/types";
import { Capitulo } from "@/components/scrolly/Capitulo";
import { VitrinaContexto } from "@/components/museo/VitrinaContexto";
import { CitaHistorica } from "@/components/scrolly/CitaHistorica";
import { DatoGigante, FilaDeDatos } from "@/components/scrolly/DatoGigante";
import { Comparador } from "@/components/scrolly/Comparador";
import { IlustracionEscena } from "@/components/scrolly/IlustracionEscena";
import { escenasComparadorMdx } from "@/components/scrolly/EscenasComparador";
import { MapaCruce } from "@/components/scrolly/MapaCruce";
import { MapaDefensa } from "@/components/scrolly/MapaDefensa";
import { MapaMayo } from "@/components/scrolly/MapaMayo";
import { MapaCongreso } from "@/components/scrolly/MapaCongreso";
import { MapaCaseros } from "@/components/scrolly/MapaCaseros";
import { MapaTucuman } from "@/components/scrolly/MapaTucuman";
import { MapaObligado } from "@/components/scrolly/MapaObligado";
import { MapaMalvinas } from "@/components/scrolly/MapaMalvinas";
import { MapaSalta } from "@/components/scrolly/MapaSalta";
import { MapaSanLorenzo } from "@/components/scrolly/MapaSanLorenzo";
import { MapaBarrancaYaco } from "@/components/scrolly/MapaBarrancaYaco";
import { MapaConstitucion } from "@/components/scrolly/MapaConstitucion";
import { MapaChacabuco } from "@/components/scrolly/MapaChacabuco";
import { MapaMaipu } from "@/components/scrolly/MapaMaipu";
import { MapaPavon } from "@/components/scrolly/MapaPavon";
import { MapaGuayaquil } from "@/components/scrolly/MapaGuayaquil";
import { MapaDesierto } from "@/components/scrolly/MapaDesierto";
import { MapaJunin } from "@/components/scrolly/MapaJunin";
import { MapaAyacucho } from "@/components/scrolly/MapaAyacucho";
import { MapaItuzaingo } from "@/components/scrolly/MapaItuzaingo";
import { MapaCastelli } from "@/components/scrolly/MapaCastelli";
import { PlanNorte, PlanAndes } from "@/components/scrolly/EscenasCruce";
import { InvasionPrimera, Reconquista } from "@/components/scrolly/EscenasInvasiones";
import { MayoVirreinato, MayoJunta } from "@/components/scrolly/EscenasMayo";
import {
  CongresoAntes,
  CongresoIndependencia,
  CaserosRosas,
  CaserosUrquiza,
} from "@/components/scrolly/EscenasCongresoCaseros";
import { Prosa } from "@/components/scrolly/Prosa";

/** Escenas con mapas SVG artesanales (tier A). El resto vive en escenasComparadorMdx. */
const escenasMapaIlustrado = {
  PlanNorte,
  PlanAndes,
  InvasionPrimera,
  Reconquista,
  MayoVirreinato,
  MayoJunta,
  CongresoAntes,
  CongresoIndependencia,
  CaserosRosas,
  CaserosUrquiza,
};

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
    IlustracionEscena,
    Comparador,
    MapaCruce,
    MapaDefensa,
    MapaMayo,
    MapaCongreso,
    MapaCaseros,
    MapaTucuman,
    MapaObligado,
    MapaMalvinas,
    MapaSalta,
    MapaSanLorenzo,
    MapaBarrancaYaco,
    MapaConstitucion,
    MapaChacabuco,
    MapaMaipu,
    MapaPavon,
    MapaGuayaquil,
    MapaDesierto,
    MapaJunin,
    MapaAyacucho,
    MapaItuzaingo,
    MapaCastelli,
    ...escenasMapaIlustrado,
    ...escenasComparadorMdx,
    Prosa,
    VitrinaContexto,
    ...components,
  };
}
