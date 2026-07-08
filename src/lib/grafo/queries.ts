import { cronicas } from "@/content/cronicas/registro";
import { slugDeCategoria } from "@/data/categorias";
import { efemerides } from "@/data/efemerides";
import { lugares } from "@/data/lugares";
import { periodoPorAnio } from "@/data/periodos";
import { personajes } from "@/data/personajes";
import { construirTodosLosNodos } from "@/lib/grafo/adaptadores";
import type {
  EntidadRef,
  EntidadTipo,
  EstrategiaDescubrir,
  FiltroRelacion,
  NodoEntidad,
} from "@/lib/grafo/tipos";
import { nodoRef, refKey } from "@/lib/grafo/tipos";

const nodosBase = construirTodosLosNodos();
const indice = new Map<string, NodoEntidad>(
  nodosBase.map((n) => [refKey({ tipo: n.tipo, slug: n.slug }), n]),
);

function deduplicarRefs(refs: EntidadRef[]): EntidadRef[] {
  const vistos = new Set<string>();
  return refs.filter((r) => {
    const k = refKey(r);
    if (vistos.has(k)) return false;
    vistos.add(k);
    return true;
  });
}

function enriquecerRelaciones(nodo: NodoEntidad): EntidadRef[] {
  const extras: EntidadRef[] = [...nodo.relaciones];

  if (nodo.tipo === "persona") {
    const personaje = personajes.find((p) => p.slug === nodo.slug);
    if (personaje) {
      for (const ef of efemerides) {
        if (ef.relacionados.includes(personaje.slug)) {
          extras.push({ tipo: "evento", slug: ef.dia });
        }
      }
      for (const c of cronicas) {
        if (c.protagonista.slug === personaje.slug) {
          extras.push({ tipo: "cronica", slug: c.slug });
        }
      }
      for (const p of personajes) {
        if (
          p.slug !== personaje.slug &&
          p.epoca === personaje.epoca &&
          extras.filter((e) => e.tipo === "persona").length < 8
        ) {
          extras.push({ tipo: "persona", slug: p.slug });
        }
      }
    }
  }

  if (nodo.tipo === "evento") {
    const ef = efemerides.find((e) => e.dia === nodo.slug);
    if (ef) {
      const catSlug = slugDeCategoria(ef.categoria);
      if (catSlug) {
        for (const otra of efemerides) {
          if (otra.dia !== ef.dia && otra.categoria === ef.categoria) {
            extras.push({ tipo: "evento", slug: otra.dia });
          }
        }
      }
      if (ef.anio) {
        const per = periodoPorAnio(ef.anio);
        if (per) extras.push({ tipo: "periodo", slug: per.slug });
        for (const otra of efemerides) {
          if (otra.dia !== ef.dia && Math.abs(otra.anio - ef.anio) <= 20) {
            extras.push({ tipo: "evento", slug: otra.dia });
          }
        }
      }
      for (const lugar of lugares) {
        if (lugar.eventos.includes(ef.dia)) {
          extras.push({ tipo: "lugar", slug: lugar.slug });
        }
      }
    }
  }

  if (nodo.tipo === "periodo") {
    for (const p of personajes) {
      if (p.epoca === nodo.slug) {
        extras.push({ tipo: "persona", slug: p.slug });
      }
    }
    for (const ef of efemerides) {
      const per = periodoPorAnio(ef.anio);
      if (per?.slug === nodo.slug) {
        extras.push({ tipo: "evento", slug: ef.dia });
      }
    }
    for (const lugar of lugares) {
      if (lugar.periodo === nodo.slug) {
        extras.push({ tipo: "lugar", slug: lugar.slug });
      }
    }
  }

  if (nodo.tipo === "categoria") {
    for (const ef of efemerides) {
      if (slugDeCategoria(ef.categoria) === nodo.slug) {
        extras.push({ tipo: "evento", slug: ef.dia });
        const per = periodoPorAnio(ef.anio);
        if (per) extras.push({ tipo: "periodo", slug: per.slug });
        for (const p of ef.relacionados) {
          extras.push({ tipo: "persona", slug: p });
        }
      }
    }
  }

  if (nodo.tipo === "lugar") {
    const lugar = lugares.find((l) => l.slug === nodo.slug);
    if (lugar) {
      for (const p of personajes) {
        const enLugar =
          lugar.personajes.includes(p.slug) ||
          lugar.aliases.some(
            (a) =>
              p.nacimiento.lugar.toLowerCase().includes(a.toLowerCase()) ||
              p.muerte?.lugar.toLowerCase().includes(a.toLowerCase()),
          );
        if (enLugar) extras.push({ tipo: "persona", slug: p.slug });
      }
    }
  }

  if (nodo.tipo === "cronica") {
    const cronica = cronicas.find((c) => c.slug === nodo.slug);
    if (cronica) {
      extras.push({ tipo: "persona", slug: cronica.protagonista.slug });
      const prota = personajes.find((p) => p.slug === cronica.protagonista.slug);
      if (prota) {
        extras.push({ tipo: "periodo", slug: prota.epoca });
        for (const ef of efemerides) {
          if (ef.relacionados.includes(prota.slug)) {
            extras.push({ tipo: "evento", slug: ef.dia });
          }
        }
        for (const slug of [...prota.aliados, ...prota.enemigos].slice(0, 4)) {
          extras.push({ tipo: "persona", slug });
        }
      }
      for (const otra of cronicas) {
        if (otra.slug !== cronica.slug) {
          extras.push({ tipo: "cronica", slug: otra.slug });
        }
      }
    }
  }

  return deduplicarRefs(extras).filter((r) => {
    if (r.slug === "") return false;
    const k = refKey(r);
    return k !== refKey({ tipo: nodo.tipo, slug: nodo.slug });
  });
}

function nodoEnriquecido(nodo: NodoEntidad): NodoEntidad {
  return { ...nodo, relaciones: enriquecerRelaciones(nodo) };
}

export function obtenerNodo(tipo: EntidadTipo, slug: string): NodoEntidad | undefined {
  const base = indice.get(refKey({ tipo, slug }));
  return base ? nodoEnriquecido(base) : undefined;
}

export function todosLosNodos(): NodoEntidad[] {
  return nodosBase.map(nodoEnriquecido);
}

export function resolverNodo(ref: EntidadRef): NodoEntidad | undefined {
  return obtenerNodo(ref.tipo, ref.slug);
}

export function relacionados(
  nodo: NodoEntidad | EntidadRef,
  filtros: FiltroRelacion = {},
): NodoEntidad[] {
  const completo =
    "relaciones" in nodo ? nodoEnriquecido(nodo) : obtenerNodo(nodo.tipo, nodo.slug);
  if (!completo) return [];

  const excluir = new Set(
    (filtros.excluir ?? []).map(refKey).concat(refKey(nodoRef(completo))),
  );

  let refs = completo.relaciones.filter((r) => !excluir.has(refKey(r)));
  if (filtros.tipo) refs = refs.filter((r) => r.tipo === filtros.tipo);
  if (filtros.limite) refs = refs.slice(0, filtros.limite);

  return refs
    .map((r) => obtenerNodo(r.tipo, r.slug))
    .filter((n): n is NodoEntidad => n !== undefined);
}

function hashSimple(texto: string): number {
  let h = 0;
  for (let i = 0; i < texto.length; i++) h = (h * 31 + texto.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function descubrir(
  origen: NodoEntidad | EntidadRef,
  estrategia: EstrategiaDescubrir = "relacionados",
  limite = 6,
): NodoEntidad[] {
  const nodo =
    "relaciones" in origen
      ? nodoEnriquecido(origen)
      : obtenerNodo(origen.tipo, origen.slug);
  if (!nodo) return [];

  const origenRef = nodoRef(nodo);
  let candidatos: NodoEntidad[] = [];

  switch (estrategia) {
    case "relacionados":
      candidatos = relacionados(nodo, { limite: limite * 2 });
      break;
    case "misma-epoca":
      if (nodo.periodo) {
        candidatos = todosLosNodos().filter(
          (n) =>
            n.periodo === nodo.periodo &&
            refKey(nodoRef(n)) !== refKey(origenRef),
        );
      }
      break;
    case "misma-categoria":
      if (nodo.categorias?.length) {
        candidatos = todosLosNodos().filter(
          (n) =>
            n.categorias?.some((c) => nodo.categorias?.includes(c)) &&
            refKey(nodoRef(n)) !== refKey(origenRef),
        );
      }
      break;
    case "mismo-anio":
      if (nodo.anio) {
        candidatos = todosLosNodos().filter(
          (n) => n.anio === nodo.anio && refKey(nodoRef(n)) !== refKey(origenRef),
        );
      }
      break;
    case "anios-cercanos":
      if (nodo.anio) {
        candidatos = todosLosNodos().filter(
          (n) =>
            n.anio !== undefined &&
            Math.abs(n.anio - nodo.anio!) <= 25 &&
            refKey(nodoRef(n)) !== refKey(origenRef),
        );
      }
      break;
    case "sorpresa":
    default:
      candidatos = relacionados(nodo, { limite: 50 });
      break;
  }

  if (candidatos.length === 0) {
    candidatos = todosLosNodos().filter(
      (n) => refKey(nodoRef(n)) !== refKey(origenRef),
    );
  }

  if (estrategia === "relacionados") {
    return candidatos.slice(0, limite);
  }

  const seed = hashSimple(`${nodo.tipo}:${nodo.slug}:${estrategia}`);
  const mezclados = [...candidatos].sort(
    (a, b) =>
      hashSimple(`${seed}:${a.tipo}:${a.slug}`) -
      hashSimple(`${seed}:${b.tipo}:${b.slug}`),
  );

  return mezclados.slice(0, limite);
}

export function nodoAleatorio(excluir?: EntidadRef): NodoEntidad | undefined {
  const todos = todosLosNodos().filter(
    (n) => !excluir || refKey(nodoRef(n)) !== refKey(excluir),
  );
  if (todos.length === 0) return undefined;
  const i = Math.floor(Math.random() * todos.length);
  return todos[i];
}

export function eventosPorAnio(anio: number): NodoEntidad[] {
  return efemerides
    .filter((e) => e.anio === anio)
    .map((e) => obtenerNodo("evento", e.dia))
    .filter((n): n is NodoEntidad => n !== undefined);
}

export function personajesActivosEnAnio(anio: number): NodoEntidad[] {
  return personajes
    .filter((p) => {
      const fin = p.muerte?.anio ?? new Date().getFullYear();
      return p.nacimiento.anio <= anio && fin >= anio;
    })
    .map((p) => obtenerNodo("persona", p.slug))
    .filter((n): n is NodoEntidad => n !== undefined);
}

export function efemeridesDePersonaje(slug: string): NodoEntidad[] {
  return efemerides
    .filter((e) => e.relacionados.includes(slug))
    .map((e) => obtenerNodo("evento", e.dia))
    .filter((n): n is NodoEntidad => n !== undefined);
}

export function cronicasDePersonaje(slug: string): NodoEntidad[] {
  return cronicas
    .filter((c) => c.protagonista.slug === slug)
    .map((c) => obtenerNodo("cronica", c.slug))
    .filter((n): n is NodoEntidad => n !== undefined);
}

export function aniosConEventos(): number[] {
  const anios = new Set(efemerides.map((e) => e.anio));
  return [...anios].sort((a, b) => a - b);
}

export { enriquecerRelaciones };
