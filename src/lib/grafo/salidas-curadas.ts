import type { EntidadRef, EntidadTipo, NodoEntidad } from "@/lib/grafo/tipos";
import { descubrir, obtenerNodo } from "@/lib/grafo/queries";
import { etiquetasTipo } from "@/lib/grafo/rutas";

export type SalidaCurada = {
  nodo: NodoEntidad;
  puente: string;
  tipoDestino: string;
};

/** Puentes narrativos editoriales opcionales por crónica → destino. */
const PUENTES_EDITORIALES: Record<string, Record<string, string>> = {
  "el-cruce-de-los-andes": {
    chacabuco: "Después del cruce, la primera gran victoria en suelo chileno",
    "jose-de-san-martin": "El retrato del Libertador que cruzó imposibles",
    "san-martin-continental": "Recorré toda la campaña continental",
  },
  chacabuco: {
    maipu: "La batalla que selló la independencia de Chile",
    "manuel-belgrano": "Mientras San Martín avanzaba por el sur, Belgrano sostenía el norte",
    guayaquil: "El encuentro que definió el destino de América",
  },
  "las-48-horas-de-mayo": {
    "jose-de-san-martin": "El joven coronel que observaba desde lejos",
    "las-invasiones-inglesas": "Tres años antes, la ciudad ya había resistido invasores",
    independencia: "La sala donde empieza la Argentina moderna",
  },
  peron: {
    "eva-peron": "La compañera que transformó la política argentina",
    "juan-domingo-peron": "Su retrato en el Panteón",
    "el-17-de-octubre": "El día que Perón volvió a la plaza",
  },
  "el-proceso": {
    "las-madres": "Las madres que caminaron cuando el silencio era ley",
    conadep: "La verdad que el país necesitaba escuchar",
    "raul-alfonsin": "Quien devolvió la democracia",
  },
};

function clavePuente(origenSlug: string, destino: NodoEntidad): string {
  return `${origenSlug}:${destino.tipo}:${destino.slug}`;
}

function puenteAutomatico(origen: NodoEntidad, destino: NodoEntidad): string {
  const tipo = etiquetasTipo[destino.tipo];
  switch (destino.tipo) {
    case "cronica":
      return `Otra exhibición de la misma época: ${destino.titulo}`;
    case "persona":
      return `Un retrato del Panteón: ${destino.titulo}`;
    case "evento":
      return `Un acontecimiento relacionado: ${destino.titulo}`;
    case "lugar":
      return `Un lugar de la historia: ${destino.titulo}`;
    case "periodo":
      return `La sala de ${destino.titulo}`;
    case "categoria":
      return `Colección temática: ${destino.titulo}`;
    case "pieza":
      return `Pieza de la colección: ${destino.titulo}`;
    default: {
      const _exhaustive: never = destino.tipo;
      return `${tipo}: ${destino.titulo}`;
    }
  }
}

function etiquetaTipoDestino(tipo: EntidadTipo): string {
  switch (tipo) {
    case "cronica":
      return "Exhibición";
    case "persona":
      return "Retrato";
    case "evento":
      return "Acontecimiento";
    case "lugar":
      return "Lugar";
    case "periodo":
      return "Sala";
    case "categoria":
      return "Colección";
    case "pieza":
      return "Pieza";
    default: {
      const _exhaustive: never = tipo;
      return _exhaustive;
    }
  }
}

function resolverPuente(
  origenSlug: string,
  destino: NodoEntidad,
  origen: NodoEntidad,
): string {
  const editoriales = PUENTES_EDITORIALES[origenSlug];
  if (editoriales?.[destino.slug]) return editoriales[destino.slug];
  if (editoriales?.[destino.tipo === "periodo" ? destino.slug : ""]) {
    return editoriales[destino.slug];
  }
  return puenteAutomatico(origen, destino);
}

/** Devuelve 2–3 salidas curadas desde un nodo (regla de las tres puertas). */
export function salidasCuradas(
  origen: NodoEntidad | EntidadRef,
  limite = 3,
): SalidaCurada[] {
  const nodo =
    "relaciones" in origen
      ? origen
      : obtenerNodo(origen.tipo, origen.slug);
  if (!nodo) return [];

  const candidatos = descubrir(nodo, "relacionados", limite * 3);
  const vistos = new Set<string>();
  const salidas: SalidaCurada[] = [];

  for (const destino of candidatos) {
    const key = `${destino.tipo}:${destino.slug}`;
    if (vistos.has(key)) continue;
    vistos.add(key);
    salidas.push({
      nodo: destino,
      puente: resolverPuente(nodo.slug, destino, nodo),
      tipoDestino: etiquetaTipoDestino(destino.tipo),
    });
    if (salidas.length >= limite) break;
  }

  return salidas;
}
