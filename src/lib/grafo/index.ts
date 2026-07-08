export type {
  EntidadRef,
  EntidadTipo,
  EstrategiaDescubrir,
  FiltroRelacion,
  NodoEntidad,
} from "@/lib/grafo/tipos";
export { nodoRef, refKey } from "@/lib/grafo/tipos";

export {
  adaptarPersonaje,
  adaptarEvento,
  adaptarCronica,
  adaptarLugar,
  adaptarPeriodo,
  adaptarCategoria,
  construirTodosLosNodos,
} from "@/lib/grafo/adaptadores";

export {
  obtenerNodo,
  todosLosNodos,
  resolverNodo,
  relacionados,
  descubrir,
  nodoAleatorio,
  eventosPorAnio,
  personajesActivosEnAnio,
  efemeridesDePersonaje,
  cronicasDePersonaje,
  aniosConEventos,
  enriquecerRelaciones,
} from "@/lib/grafo/queries";

export { validarGrafo } from "@/lib/grafo/validar";
export type { ProblemaGrafo, ResultadoValidacion } from "@/lib/grafo/validar";
