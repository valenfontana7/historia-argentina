import type { CronicaMeta } from "@/content/cronicas/registro";
import { cronicas } from "@/content/cronicas/registro";
import { categorias, slugDeCategoria } from "@/data/categorias";
import type { Categoria } from "@/data/categorias";
import { efemerides } from "@/data/efemerides";
import type { Efemeride } from "@/data/efemerides";
import { lugares, slugDeLugarPorTexto } from "@/data/lugares";
import type { Lugar } from "@/data/lugares";
import { periodos } from "@/data/periodos";
import type { Periodo } from "@/data/periodos";
import { personajes } from "@/data/personajes";
import type { Personaje } from "@/data/personajes";
import { obtenerImagenPersonaje } from "@/data/personajes-imagenes";
import { imagenesCronicas } from "@/data/cronicas-imagenes";
import { piezasDeExhibicion, todasLasPiezas } from "@/lib/piezas/indice";
import { sitio } from "@/lib/site.config";
import type { EntidadRef, NodoEntidad } from "@/lib/grafo/tipos";

export function adaptarPersonaje(personaje: Personaje): NodoEntidad {
  const relaciones: EntidadRef[] = [
    ...personaje.aliados.map((slug) => ({ tipo: "persona" as const, slug })),
    ...personaje.enemigos.map((slug) => ({ tipo: "persona" as const, slug })),
    { tipo: "periodo", slug: personaje.epoca },
  ];

  const lugarNac = slugDeLugarPorTexto(personaje.nacimiento.lugar);
  if (lugarNac) relaciones.push({ tipo: "lugar", slug: lugarNac });
  if (personaje.muerte) {
    const lugarMuerte = slugDeLugarPorTexto(personaje.muerte.lugar);
    if (lugarMuerte) relaciones.push({ tipo: "lugar", slug: lugarMuerte });
  }

  const imagen = obtenerImagenPersonaje(personaje.slug);

  return {
    tipo: "persona",
    slug: personaje.slug,
    titulo: personaje.nombre,
    resumen: personaje.resumen,
    url: `${sitio.url}/panteon/${personaje.slug}`,
    imagen: imagen?.url,
    anio: personaje.nacimiento.anio,
    anioFin: personaje.muerte?.anio,
    periodo: personaje.epoca,
    relaciones,
  };
}

export function adaptarEvento(efemeride: Efemeride): NodoEntidad {
  const catSlug = slugDeCategoria(efemeride.categoria);
  const relaciones: EntidadRef[] = [
    ...efemeride.relacionados.map((slug) => ({ tipo: "persona" as const, slug })),
  ];
  if (catSlug) relaciones.push({ tipo: "categoria", slug: catSlug });

  return {
    tipo: "evento",
    slug: efemeride.dia,
    titulo: efemeride.titulo,
    resumen: efemeride.historia[0] ?? "",
    url: `${sitio.url}/hoy/${efemeride.dia}`,
    anio: efemeride.anio,
    categorias: catSlug ? [catSlug] : undefined,
    relaciones,
  };
}

export function adaptarCronica(cronica: CronicaMeta): NodoEntidad {
  const relaciones: EntidadRef[] = [
    { tipo: "persona", slug: cronica.protagonista.slug },
  ];
  if (cronica.visual.imagenHero) {
    relaciones.push({ tipo: "pieza", slug: cronica.visual.imagenHero });
  }
  for (const pieza of piezasDeExhibicion(cronica.slug).slice(0, 3)) {
    relaciones.push({ tipo: "pieza", slug: pieza.id });
  }

  const imagenHero = cronica.visual.imagenHero
    ? imagenesCronicas[cronica.visual.imagenHero]?.url
    : undefined;

  return {
    tipo: "cronica",
    slug: cronica.slug,
    titulo: cronica.titulo,
    resumen: cronica.descripcion,
    url: `${sitio.url}/cronicas/${cronica.slug}`,
    imagen: imagenHero,
    periodo: cronica.epoca,
    categorias: cronica.categorias,
    anio: cronica.anioInicio,
    anioFin: cronica.anioFin,
    relaciones,
  };
}

export function adaptarPieza(pieza: ReturnType<typeof todasLasPiezas>[number]): NodoEntidad {
  const relaciones: EntidadRef[] = pieza.exhibiciones.map((slug) => ({
    tipo: "cronica" as const,
    slug,
  }));

  return {
    tipo: "pieza",
    slug: pieza.id,
    titulo: pieza.alt,
    resumen: pieza.credito,
    url: `${sitio.url}/piezas/${pieza.id}`,
    imagen: pieza.url,
    relaciones,
  };
}

export function adaptarLugar(lugar: Lugar): NodoEntidad {
  const relaciones: EntidadRef[] = [
    ...lugar.personajes.map((slug) => ({ tipo: "persona" as const, slug })),
    ...lugar.eventos.map((slug) => ({ tipo: "evento" as const, slug })),
  ];
  if (lugar.periodo) relaciones.push({ tipo: "periodo", slug: lugar.periodo });

  return {
    tipo: "lugar",
    slug: lugar.slug,
    titulo: lugar.nombre,
    resumen: lugar.descripcion,
    url: `${sitio.url}/lugares/${lugar.slug}`,
    periodo: lugar.periodo,
    relaciones,
  };
}

export function adaptarPeriodo(periodo: Periodo): NodoEntidad {
  return {
    tipo: "periodo",
    slug: periodo.slug,
    titulo: periodo.nombre,
    resumen: periodo.descripcion,
    url: `${sitio.url}/periodos/${periodo.slug}`,
    anio: periodo.anioInicio,
    anioFin: periodo.anioFin ?? undefined,
    periodo: periodo.slug,
    relaciones: [],
  };
}

export function adaptarCategoria(categoria: Categoria): NodoEntidad {
  return {
    tipo: "categoria",
    slug: categoria.slug,
    titulo: categoria.nombre,
    resumen: categoria.descripcion,
    url: `${sitio.url}/categorias/${categoria.slug}`,
    relaciones: [],
  };
}

export function construirTodosLosNodos(): NodoEntidad[] {
  return [
    ...personajes.map(adaptarPersonaje),
    ...efemerides.map(adaptarEvento),
    ...cronicas.map(adaptarCronica),
    ...lugares.map(adaptarLugar),
    ...periodos.map(adaptarPeriodo),
    ...categorias.map(adaptarCategoria),
    ...todasLasPiezas()
      .filter((p) => p.exhibiciones.length > 0)
      .map(adaptarPieza),
  ];
}
