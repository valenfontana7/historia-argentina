import { efemerides } from "@/data/efemerides";
import { todosLosNodos } from "@/lib/grafo/queries";
import { refKey } from "@/lib/grafo/tipos";

export type ProblemaGrafo = {
  tipo: "aislado" | "pocas-relaciones" | "relacionados-vacio";
  entidad: string;
  detalle: string;
};

export type ResultadoValidacion = {
  ok: boolean;
  totalNodos: number;
  problemas: ProblemaGrafo[];
};

const MIN_RELACIONES = 3;

export function validarGrafo(): ResultadoValidacion {
  const problemas: ProblemaGrafo[] = [];
  const nodos = todosLosNodos();

  for (const nodo of nodos) {
    const clave = refKey({ tipo: nodo.tipo, slug: nodo.slug });
    if (nodo.relaciones.length === 0) {
      problemas.push({
        tipo: "aislado",
        entidad: clave,
        detalle: "Sin relaciones en el grafo enriquecido",
      });
    } else if (nodo.relaciones.length < MIN_RELACIONES) {
      problemas.push({
        tipo: "pocas-relaciones",
        entidad: clave,
        detalle: `${nodo.relaciones.length} relaciones (mínimo ${MIN_RELACIONES})`,
      });
    }
  }

  for (const ef of efemerides) {
    if (ef.relacionados.length === 0) {
      problemas.push({
        tipo: "relacionados-vacio",
        entidad: `evento:${ef.dia}`,
        detalle: `Efeméride "${ef.titulo}" sin personajes relacionados`,
      });
    }
  }

  return {
    ok: problemas.length === 0,
    totalNodos: nodos.length,
    problemas,
  };
}
