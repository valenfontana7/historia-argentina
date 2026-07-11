import type { Epoca } from "@/components/ui/Retrato";
import {
  type AccesoCronica,
  type CronicaMeta,
  cronicas,
} from "@/content/cronicas/registro";
import { recorridos } from "@/data/recorridos";
import { periodos } from "@/data/periodos";
import { esExposicionAnticipo, exhibicionAbiertaAlPublico } from "@/lib/cronicas/acceso";

/** Orden editorial de épocas en el catálogo. */
export const ORDEN_EPOCAS: Epoca[] = [
  "independencia",
  "organizacion",
  "moderna",
  "contemporanea",
  "colonia",
];

export type CronicaBusqueda = {
  slug: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  protagonista: string;
  epoca: Epoca;
  acceso: AccesoCronica;
};

function compararCronicas(a: CronicaMeta, b: CronicaMeta): number {
  if (a.orden != null && b.orden != null && a.orden !== b.orden) {
    return a.orden - b.orden;
  }
  if (a.anioInicio !== b.anioInicio) return a.anioInicio - b.anioInicio;
  if (a.numero != null && b.numero != null && a.numero !== b.numero) {
    return a.numero - b.numero;
  }
  return a.titulo.localeCompare(b.titulo, "es");
}

function filtrarYOrdenar(lista: CronicaMeta[]): CronicaMeta[] {
  return [...lista].sort(compararCronicas);
}

export function todasLasCronicas(): CronicaMeta[] {
  return filtrarYOrdenar(cronicas);
}

export function porEpoca(epoca: Epoca): CronicaMeta[] {
  return filtrarYOrdenar(cronicas.filter((c) => c.epoca === epoca));
}

export function porCategoria(categoriaSlug: string): CronicaMeta[] {
  return filtrarYOrdenar(
    cronicas.filter((c) => c.categorias.includes(categoriaSlug)),
  );
}

export function porAcceso(acceso: AccesoCronica): CronicaMeta[] {
  return filtrarYOrdenar(cronicas.filter((c) => c.acceso === acceso));
}

export function porProtagonista(personajeSlug: string): CronicaMeta[] {
  return filtrarYOrdenar(
    cronicas.filter((c) => c.protagonista.slug === personajeSlug),
  );
}

const indiceRecorridos: Map<string, Set<string>> = (() => {
  const mapa = new Map<string, Set<string>>();
  for (const rec of recorridos) {
    for (const paso of rec.pasos) {
      if (paso.tipo !== "cronica") continue;
      const set = mapa.get(paso.slug) ?? new Set<string>();
      set.add(rec.slug);
      mapa.set(paso.slug, set);
    }
  }
  return mapa;
})();

export function porRecorrido(recorridoSlug: string): CronicaMeta[] {
  const slugs = new Set<string>();
  const rec = recorridos.find((r) => r.slug === recorridoSlug);
  if (!rec) return [];
  for (const paso of rec.pasos) {
    if (paso.tipo === "cronica") slugs.add(paso.slug);
  }
  return filtrarYOrdenar(cronicas.filter((c) => slugs.has(c.slug)));
}

export function recorridosDeCronica(cronicaSlug: string): string[] {
  return [...(indiceRecorridos.get(cronicaSlug) ?? [])];
}

export function destacadas(): CronicaMeta[] {
  const marcadas = cronicas.filter((c) => c.destacada);
  if (marcadas.length > 0) return filtrarYOrdenar(marcadas);
  return filtrarYOrdenar(cronicas).slice(0, 3);
}

export function visibleEnGrupoCatalogo(
  cronica: CronicaMeta,
  esMecenas: boolean,
): boolean {
  if (esMecenas) return true;
  if (esExposicionAnticipo(cronica) && !exhibicionAbiertaAlPublico(cronica)) {
    return false;
  }
  return true;
}

export function agrupadasPorEpocaVisibles(esMecenas: boolean) {
  return ORDEN_EPOCAS.map((epoca) => {
    const periodo = periodos.find((p) => p.slug === epoca);
    return {
      epoca,
      nombre: periodo?.nombre ?? epoca,
      cronicas: porEpoca(epoca).filter((c) => visibleEnGrupoCatalogo(c, esMecenas)),
    };
  }).filter((g) => g.cronicas.length > 0);
}

export function agrupadasPorEpoca(): { epoca: Epoca; nombre: string; cronicas: CronicaMeta[] }[] {
  return agrupadasPorEpocaVisibles(true);
}

export function conteoPorEpoca(): Record<Epoca, number> {
  const conteo = Object.fromEntries(ORDEN_EPOCAS.map((e) => [e, 0])) as Record<
    Epoca,
    number
  >;
  for (const c of cronicas) {
    conteo[c.epoca] += 1;
  }
  return conteo;
}

export function cronicasEnAnio(anio: number): CronicaMeta[] {
  return filtrarYOrdenar(
    cronicas.filter((c) => anio >= c.anioInicio && anio <= c.anioFin),
  );
}

export function cronicasEnRango(desde: number, hasta: number): CronicaMeta[] {
  return filtrarYOrdenar(
    cronicas.filter((c) => c.anioFin >= desde && c.anioInicio <= hasta),
  );
}

export function datasetBusqueda(): CronicaBusqueda[] {
  return cronicas.map((c) => ({
    slug: c.slug,
    titulo: c.titulo,
    subtitulo: c.subtitulo,
    descripcion: c.descripcion,
    protagonista: c.protagonista.etiqueta,
    epoca: c.epoca,
    acceso: c.acceso,
  }));
}

export function buscar(texto: string): CronicaMeta[] {
  const q = texto.trim().toLowerCase();
  if (!q) return todasLasCronicas();
  return filtrarYOrdenar(
    cronicas.filter((c) => {
      const blob = [
        c.titulo,
        c.subtitulo,
        c.descripcion,
        c.protagonista.etiqueta,
        c.protagonista.slug,
        c.kicker,
        c.periodo,
        ...c.categorias,
      ]
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    }),
  );
}

export type FiltrosCatalogo = {
  epoca?: Epoca;
  categoria?: string;
  acceso?: AccesoCronica;
};

export function filtrarCatalogo(filtros: FiltrosCatalogo): CronicaMeta[] {
  let lista = [...cronicas];
  if (filtros.epoca) lista = lista.filter((c) => c.epoca === filtros.epoca);
  if (filtros.categoria) {
    lista = lista.filter((c) => c.categorias.includes(filtros.categoria!));
  }
  if (filtros.acceso) lista = lista.filter((c) => c.acceso === filtros.acceso);
  return filtrarYOrdenar(lista);
}

export function contarCronicasEnRecorrido(recorridoSlug: string): number {
  const rec = recorridos.find((r) => r.slug === recorridoSlug);
  if (!rec) return 0;
  return rec.pasos.filter((p) => p.tipo === "cronica").length;
}

/** Exhibiciones en anticipo: mecenas ya, público en fecha futura. */
export function exposicionesAnticipoActivas(): CronicaMeta[] {
  return filtrarYOrdenar(
    cronicas.filter((c) => c.acceso === "anticipo" && !exhibicionAbiertaAlPublico(c)),
  );
}

/** Catálogo visible sin membresía (excluye mecenas y anticipo no publicadas). */
export function exhibicionesPublicasCatalogo(): CronicaMeta[] {
  return filtrarYOrdenar(
    cronicas.filter((c) => c.acceso === "publico" || exhibicionAbiertaAlPublico(c)),
  );
}
