import type { MDXComponents } from "mdx/types";
import { Capitulo } from "@/components/scrolly/Capitulo";
import { CitaHistorica } from "@/components/scrolly/CitaHistorica";
import { DatoGigante, FilaDeDatos } from "@/components/scrolly/DatoGigante";
import { Comparador } from "@/components/scrolly/Comparador";
import { IlustracionEscena } from "@/components/scrolly/IlustracionEscena";
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
import { PlanNorte, PlanAndes } from "@/components/scrolly/EscenasCruce";
import { InvasionPrimera, Reconquista } from "@/components/scrolly/EscenasInvasiones";
import { MayoVirreinato, MayoJunta } from "@/components/scrolly/EscenasMayo";
import {
  CongresoAntes,
  CongresoIndependencia,
  CaserosRosas,
  CaserosUrquiza,
} from "@/components/scrolly/EscenasCongresoCaseros";
import {
  GauchaRegular,
  GauchaIrregular,
  AzurduyEjercitos,
  AzurduyGuerrilla,
  OctubrePreso,
  OctubrePlaza,
} from "@/components/scrolly/EscenasNuevasCronicas";
import { TucumanRetirada, TucumanBatalla } from "@/components/scrolly/EscenasTucuman";
import { ObligadoBloqueo, ObligadoDefensa } from "@/components/scrolly/EscenasObligado";
import { EvitaAntes, EvitaPoder } from "@/components/scrolly/EscenasEvita";
import { MalvinasCivil, MalvinasMilitar } from "@/components/scrolly/EscenasMalvinas";
import { MemoriaDictadura, MemoriaDemocracia } from "@/components/scrolly/EscenasMemoria";
import { SaltaTucuman, SaltaVictoria } from "@/components/scrolly/EscenasSalta";
import { SanLorenzoRealista, SanLorenzoGranaderos } from "@/components/scrolly/EscenasSanLorenzo";
import { FacundoVivo, FacundoCaida } from "@/components/scrolly/EscenasBarrancaYaco";
import { ConstitucionBA, ConstitucionConfed } from "@/components/scrolly/EscenasConstitucion";
import { GolpeDemocracia, GolpeMilitar } from "@/components/scrolly/EscenasPrimerGolpe";
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
    GauchaRegular,
    GauchaIrregular,
    AzurduyEjercitos,
    AzurduyGuerrilla,
    OctubrePreso,
    OctubrePlaza,
    TucumanRetirada,
    TucumanBatalla,
    ObligadoBloqueo,
    ObligadoDefensa,
    EvitaAntes,
    EvitaPoder,
    MalvinasCivil,
    MalvinasMilitar,
    MemoriaDictadura,
    MemoriaDemocracia,
    SaltaTucuman,
    SaltaVictoria,
    SanLorenzoRealista,
    SanLorenzoGranaderos,
    FacundoVivo,
    FacundoCaida,
    ConstitucionBA,
    ConstitucionConfed,
    GolpeDemocracia,
    GolpeMilitar,
    Prosa,
    ...components,
  };
}
