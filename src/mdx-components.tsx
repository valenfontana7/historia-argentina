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
import { ChacabucoRealista, ChacabucoVictoria } from "@/components/scrolly/EscenasChacabuco";
import { MaipuRealista, MaipuAbrazo } from "@/components/scrolly/EscenasMaipu";
import { PavonUrquiza, PavonMitre } from "@/components/scrolly/EscenasPavon";
import { LibertadoraPeronismo, LibertadoraGolpe } from "@/components/scrolly/EscenasRevolucionLibertadora";
import { CordobazoCalle, CordobazoRepresion } from "@/components/scrolly/EscenasCordobazo";
import { GuayaquilLibertador, GuayaquilEntrevista } from "@/components/scrolly/EscenasGuayaquil";
import { FacundoBarbarie, FacundoCivilizacion } from "@/components/scrolly/EscenasFacundo";
import { MalvinasCiudad, MalvinasFrente } from "@/components/scrolly/EscenasMalvinasCiudad";
import { DesiertoFrontera, DesiertoCampana } from "@/components/scrolly/EscenasDesierto";
import { RivadaviaProyecto, RivadaviaRetrato } from "@/components/scrolly/EscenasRivadavia";
import { JuninCaballeria, JuninBatalla } from "@/components/scrolly/EscenasJunin";
import { MorenoVirreinato, MorenoPrensa } from "@/components/scrolly/EscenasMoreno";
import { SemanaHuelga, SemanaRepresion } from "@/components/scrolly/EscenasSemanaTragica";
import { FederalProvincia, FederalCapital } from "@/components/scrolly/EscenasFederalizacion";
import { CrisisCalle, CrisisDiagrama } from "@/components/scrolly/Escenas2001";
import { AyacuchoJunin, AyacuchoVictoria } from "@/components/scrolly/EscenasAyacucho";
import { DorregoGobernador, DorregoFusilamiento } from "@/components/scrolly/EscenasDorrego";
import { RosasRetrato, RosasPoder } from "@/components/scrolly/EscenasRosas";
import { MitreHistoriador, MitreGuerra } from "@/components/scrolly/EscenasMitre";
import { SufragioFraudulento, SufragioSecreto } from "@/components/scrolly/EscenasSaenzPena";
import { AlberdiExilio, AlberdiBases } from "@/components/scrolly/EscenasAlberdi";
import { PatagoniaHuelga, PatagoniaRepresion } from "@/components/scrolly/EscenasPatagoniaRebelde";
import { ItuzaingoBatalla, ItuzaingoBrandsen } from "@/components/scrolly/EscenasItuzaingo";
import { TransicionDictadura, TransicionDemocracia } from "@/components/scrolly/EscenasTransicion";
import { UrquizaEntrerriano, UrquizaVictoria } from "@/components/scrolly/EscenasUrquiza";
import { CastelliRetrato, CastelliRevolution } from "@/components/scrolly/EscenasCastelli";
import { GuemesCaudillo, GuemesFrontera } from "@/components/scrolly/EscenasGuemes";
import { BelgranoGeneral, BelgranoBandera } from "@/components/scrolly/EscenasBandera";
import { SaavedraMilicias, SaavedraJunta } from "@/components/scrolly/EscenasSaavedra";
import { ConvertibilidadPeron, ConvertibilidadColapso } from "@/components/scrolly/EscenasConvertibilidad";
import { MariquitaSalon, MariquitaMayo } from "@/components/scrolly/EscenasMariquita";
import { LiniersHeroe, LiniersMilicias } from "@/components/scrolly/EscenasLiniers";
import { SarmientoMaestro, SarmientoFacundo } from "@/components/scrolly/EscenasSarmiento";
import { YrigoyenPueblo, YrigoyenRadical } from "@/components/scrolly/EscenasYrigoyen";
import { ParaguayCampo, ParaguayMapa } from "@/components/scrolly/EscenasParaguay";
import { RocaRetrato, RocaEstado } from "@/components/scrolly/EscenasRoca";
import { BelgranoRetrato, BelgranoLegado } from "@/components/scrolly/EscenasBelgrano";
import { HuaquiAltiplano, HuaquiDerrota } from "@/components/scrolly/EscenasHuaqui";
import { PeronPreso, PeronPlaza } from "@/components/scrolly/EscenasPeron";
import { AlfonsinDemocracia, AlfonsinMemoria } from "@/components/scrolly/EscenasAlfonsin";
import { CuarentaTresGolpe, CuarentaTresTrabajo } from "@/components/scrolly/Escenas43";
import { VotoMujeres, VotoEvita } from "@/components/scrolly/EscenasVotoFemenino";
import { MenemAsume, MenemDecada } from "@/components/scrolly/EscenasMenem";
import { OnganiaGolpe, OnganiaRevolucion } from "@/components/scrolly/EscenasOngania";
import { HiperinflacionGrafico, HiperinflacionAlfonsin } from "@/components/scrolly/EscenasHiperinflacion";
import { RetornoPeron, RetornoMultitud } from "@/components/scrolly/EscenasRetorno";
import { MadresPlaza, MadresFundadora } from "@/components/scrolly/EscenasMadres";
import { KirchnerPresidente, KirchnerCrisis } from "@/components/scrolly/EscenasKirchner";
import { ProcesoGolpe, ProcesoTerror } from "@/components/scrolly/EscenasProceso";
import { MontonerosGuerrilla, MontonerosViolencia } from "@/components/scrolly/EscenasMontoneros";
import { FrondiziPresidente, FrondiziEconomia } from "@/components/scrolly/EscenasFrondizi";
import { IlliaPresidente, IlliaObra } from "@/components/scrolly/EscenasIllia";
import { CristinaPresidenta, CristinaLegado } from "@/components/scrolly/EscenasCristina";
import { TripleARega, TripleAViolencia } from "@/components/scrolly/EscenasTripleA";
import { IsabelPresidenta, IsabelAsuncion } from "@/components/scrolly/EscenasIsabel";
import { MacriPresidente, MacriCambiemos } from "@/components/scrolly/EscenasMacri";
import { Elecciones83Campana, Elecciones83Urna } from "@/components/scrolly/EscenasElecciones83";
import { DeLaRuaPresidente, DeLaRuaCrisis } from "@/components/scrolly/EscenasDeLaRua";
import { JuicioJuntasBanquillo, JuicioJuntasSala } from "@/components/scrolly/EscenasJuicioJuntas";
import { GaltieriDictador, GaltieriMalvinas } from "@/components/scrolly/EscenasGaltieri";
import { AlbertoFernandezPresidente, AlbertoFernandezAsume } from "@/components/scrolly/EscenasAlbertoFernandez";
import { MileiPresidente, MileiEleccion } from "@/components/scrolly/EscenasMilei";
import { PiqueterosMarcha, PiqueterosCalle } from "@/components/scrolly/EscenasPiqueteros";
import { ConadepSabato, ConadepMemoria } from "@/components/scrolly/EscenasConadep";
import { AmiaMarcha, AmiaMemoria } from "@/components/scrolly/EscenasAmia";
import { FabricasRecuperadasCooperativa, FabricasRecuperadasTrabajo } from "@/components/scrolly/EscenasFabricasRecuperadas";
import { PandemiaCuarentena, PandemiaGobierno } from "@/components/scrolly/EscenasPandemia";
import { RodrigazoMinistro, RodrigazoInflacion } from "@/components/scrolly/EscenasRodrigazo";
import { WalshEscritor, WalshCarta } from "@/components/scrolly/EscenasWalsh";
import { EmbajadaMemoria, EmbajadaCeremonia } from "@/components/scrolly/EscenasEmbajada";
import { LanussePresidente, LanusseElecciones } from "@/components/scrolly/EscenasLanusse";
import { DefaultCalle, DefaultDeuda } from "@/components/scrolly/EscenasDefault";
import { RevolucionParqueCalle, RevolucionParqueLegado } from "@/components/scrolly/EscenasRevolucionParque";
import { ErpGuerrilla, ErpMontoneros } from "@/components/scrolly/EscenasErp";
import { EsmaMemorial, EsmaClandestino } from "@/components/scrolly/EscenasEsma";
import { LevingstonPresidente, LevingstonRevolucion } from "@/components/scrolly/EscenasLevingston";
import { CamporaPresidente, Campora1973 } from "@/components/scrolly/EscenasCampora";
import { CelmanPresidente, CelmanCrisis } from "@/components/scrolly/EscenasCelman";
import { VidelaDictador, VidelaGolpe } from "@/components/scrolly/EscenasVidela";
import { MasseraAlmirante, MasseraJunta } from "@/components/scrolly/EscenasMassera";
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
    MapaChacabuco,
    MapaMaipu,
    MapaPavon,
    MapaGuayaquil,
    MapaDesierto,
    MapaJunin,
    MapaAyacucho,
    MapaItuzaingo,
    MapaCastelli,
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
    ChacabucoRealista,
    ChacabucoVictoria,
    MaipuRealista,
    MaipuAbrazo,
    PavonUrquiza,
    PavonMitre,
    LibertadoraPeronismo,
    LibertadoraGolpe,
    CordobazoCalle,
    CordobazoRepresion,
    GuayaquilLibertador,
    GuayaquilEntrevista,
    FacundoBarbarie,
    FacundoCivilizacion,
    MalvinasCiudad,
    MalvinasFrente,
    DesiertoFrontera,
    DesiertoCampana,
    RivadaviaProyecto,
    RivadaviaRetrato,
    JuninCaballeria,
    JuninBatalla,
    MorenoVirreinato,
    MorenoPrensa,
    SemanaHuelga,
    SemanaRepresion,
    FederalProvincia,
    FederalCapital,
    CrisisCalle,
    CrisisDiagrama,
    AyacuchoJunin,
    AyacuchoVictoria,
    DorregoGobernador,
    DorregoFusilamiento,
    RosasRetrato,
    RosasPoder,
    MitreHistoriador,
    MitreGuerra,
    SufragioFraudulento,
    SufragioSecreto,
    AlberdiExilio,
    AlberdiBases,
    PatagoniaHuelga,
    PatagoniaRepresion,
    ItuzaingoBatalla,
    ItuzaingoBrandsen,
    TransicionDictadura,
    TransicionDemocracia,
    UrquizaEntrerriano,
    UrquizaVictoria,
    CastelliRetrato,
    CastelliRevolution,
    GuemesCaudillo,
    GuemesFrontera,
    BelgranoGeneral,
    BelgranoBandera,
    SaavedraMilicias,
    SaavedraJunta,
    ConvertibilidadPeron,
    ConvertibilidadColapso,
    MariquitaSalon,
    MariquitaMayo,
    LiniersHeroe,
    LiniersMilicias,
    SarmientoMaestro,
    SarmientoFacundo,
    YrigoyenPueblo,
    YrigoyenRadical,
    ParaguayCampo,
    ParaguayMapa,
    RocaRetrato,
    RocaEstado,
    BelgranoRetrato,
    BelgranoLegado,
    HuaquiAltiplano,
    HuaquiDerrota,
    PeronPreso,
    PeronPlaza,
    AlfonsinDemocracia,
    AlfonsinMemoria,
    CuarentaTresGolpe,
    CuarentaTresTrabajo,
    VotoMujeres,
    VotoEvita,
    MenemAsume,
    MenemDecada,
    OnganiaGolpe,
    OnganiaRevolucion,
    HiperinflacionGrafico,
    HiperinflacionAlfonsin,
    RetornoPeron,
    RetornoMultitud,
    MadresPlaza,
    MadresFundadora,
    KirchnerPresidente,
    KirchnerCrisis,
    ProcesoGolpe,
    ProcesoTerror,
    MontonerosGuerrilla,
    MontonerosViolencia,
    FrondiziPresidente,
    FrondiziEconomia,
    IlliaPresidente,
    IlliaObra,
    CristinaPresidenta,
    CristinaLegado,
    TripleARega,
    TripleAViolencia,
    IsabelPresidenta,
    IsabelAsuncion,
    MacriPresidente,
    MacriCambiemos,
    Elecciones83Campana,
    Elecciones83Urna,
    DeLaRuaPresidente,
    DeLaRuaCrisis,
    JuicioJuntasBanquillo,
    JuicioJuntasSala,
    GaltieriDictador,
    GaltieriMalvinas,
    AlbertoFernandezPresidente,
    AlbertoFernandezAsume,
    MileiPresidente,
    MileiEleccion,
    PiqueterosMarcha,
    PiqueterosCalle,
    ConadepSabato,
    ConadepMemoria,
    AmiaMarcha,
    AmiaMemoria,
    FabricasRecuperadasCooperativa,
    FabricasRecuperadasTrabajo,
    PandemiaCuarentena,
    PandemiaGobierno,
    RodrigazoMinistro,
    RodrigazoInflacion,
    WalshEscritor,
    WalshCarta,
    EmbajadaMemoria,
    EmbajadaCeremonia,
    LanussePresidente,
    LanusseElecciones,
    DefaultCalle,
    DefaultDeuda,
    RevolucionParqueCalle,
    RevolucionParqueLegado,
    ErpGuerrilla,
    ErpMontoneros,
    EsmaMemorial,
    EsmaClandestino,
    LevingstonPresidente,
    LevingstonRevolucion,
    CamporaPresidente,
    Campora1973,
    CelmanPresidente,
    CelmanCrisis,
    VidelaDictador,
    VidelaGolpe,
    MasseraAlmirante,
    MasseraJunta,
    Prosa,
    ...components,
  };
}
