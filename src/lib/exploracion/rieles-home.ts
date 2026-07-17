import { cronicas } from "@/content/cronicas/registro";
import { porCategoria, destacadas } from "@/lib/cronicas/indice";
import { obtenerImagenCronica } from "@/data/cronicas-imagenes";
import { efemerides } from "@/data/efemerides";
import { personajes } from "@/data/personajes";
import { recorridos } from "@/data/recorridos";
import { hoyEnArgentina } from "@/lib/fechas";
import { obtenerImagenPersonaje } from "@/data/personajes-imagenes";
import { obtenerNodo } from "@/lib/grafo/queries";
import type { NodoEntidad } from "@/lib/grafo/tipos";
import { rutaDeNodo } from "@/lib/grafo/rutas";
import type { Efemeride } from "@/data/efemerides";
import { imagenDeRecorrido } from "@/lib/recorridos/imagen";

export type ItemRiel = {
  href: string;
  titulo: string;
  teaser: string;
  imagen?: string;
  meta?: string;
  kicker?: string;
};

function imagenDeCronica(slug: string, imagenHero?: string): string | undefined {
  if (imagenHero) {
    const img = obtenerImagenCronica(imagenHero);
    if (img) return img.url;
  }
  const nodo = obtenerNodo("cronica", slug);
  return nodo?.imagen;
}

/** Retrato del primer personaje relacionado, o imagen del nodo evento. */
function imagenDeEfemeride(e: Efemeride): string | undefined {
  for (const slug of e.relacionados) {
    const retrato = obtenerImagenPersonaje(slug);
    if (retrato) return retrato.url;
  }
  const delNodo = obtenerNodo("evento", e.dia)?.imagen;
  if (delNodo) return delNodo;
  // Fallback visual para que el riel nunca quede vacío
  return obtenerImagenCronica("mayo-cabildo")?.url;
}

function itemDesdeNodo(nodo: NodoEntidad, kicker?: string): ItemRiel {
  return {
    href: rutaDeNodo(nodo),
    titulo: nodo.titulo,
    teaser: nodo.resumen,
    imagen: nodo.imagen,
    meta: nodo.anio ? String(nodo.anio) : undefined,
    kicker,
  };
}

/** Historias con categoría tragedias / memoria / que suenan a ficción. */
export function rielPareceFiccion(limite = 8): ItemRiel[] {
  const slugs = new Set<string>();
  const items: ItemRiel[] = [];

  for (const cat of ["tragedias", "memoria", "sociedad"] as const) {
    for (const c of porCategoria(cat)) {
      if (slugs.has(c.slug) || c.acceso === "mecenas") continue;
      slugs.add(c.slug);
      items.push({
        href: `/cronicas/${c.slug}`,
        titulo: c.titulo,
        teaser: c.subtitulo,
        imagen: imagenDeCronica(c.slug, c.visual.imagenHero),
        meta: String(c.anioInicio),
        kicker: "Parece ficción",
      });
      if (items.length >= limite) return items;
    }
  }

  for (const c of destacadas()) {
    if (slugs.has(c.slug) || c.acceso === "mecenas") continue;
    items.push({
      href: `/cronicas/${c.slug}`,
      titulo: c.titulo,
      teaser: c.subtitulo,
      imagen: imagenDeCronica(c.slug, c.visual.imagenHero),
      meta: String(c.anioInicio),
      kicker: "Destacada",
    });
    if (items.length >= limite) break;
  }

  return items;
}

export function rielBatallas(limite = 8): ItemRiel[] {
  return porCategoria("batallas")
    .filter((c) => c.acceso !== "mecenas")
    .slice(0, limite)
    .map((c) => ({
      href: `/cronicas/${c.slug}`,
      titulo: c.titulo,
      teaser: c.subtitulo,
      imagen: imagenDeCronica(c.slug, c.visual.imagenHero),
      meta: String(c.anioInicio),
      kicker: "Épica",
    }));
}

export function rielPersonajes(limite = 8): ItemRiel[] {
  const destacados = [
    "jose-de-san-martin",
    "eva-peron",
    "manuel-belgrano",
    "juana-azurduy",
    "juan-manuel-de-rosas",
    "domingo-faustino-sarmiento",
    "juan-domingo-peron",
    "raul-alfonsin",
  ];

  return destacados
    .map((slug) => personajes.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, limite)
    .map((p) => {
      const nodo = obtenerNodo("persona", p.slug);
      if (nodo) return itemDesdeNodo(nodo, "Personaje");
      return {
        href: `/panteon/${p.slug}`,
        titulo: p.nombre,
        teaser: p.frase?.texto ?? p.resumen,
        kicker: "Personaje",
      };
    });
}

export function rielHoy(limite = 6): ItemRiel[] {
  const { mes, dia } = hoyEnArgentina();

  const delMes = efemerides.filter((e) => e.mes === mes);
  const exactas = delMes
    .filter((e) => e.numero === dia)
    .sort((a, b) => a.anio - b.anio);
  const cercanas = delMes
    .filter((e) => e.numero !== dia)
    .sort((a, b) => {
      const distA = Math.abs(a.numero - dia);
      const distB = Math.abs(b.numero - dia);
      if (distA !== distB) return distA - distB;
      if (a.numero !== b.numero) return a.numero - b.numero;
      return a.anio - b.anio;
    });

  const elegidas = [...exactas, ...cercanas].slice(0, limite);

  // Si el mes no alcanza, completar con el mes anterior/siguiente, ordenado por cercanía.
  if (elegidas.length < limite) {
    const vistos = new Set(elegidas.map((e) => e.dia));
    const extras = efemerides
      .filter((e) => e.mes !== mes && !vistos.has(e.dia))
      .map((e) => {
        const distMes = Math.min(
          Math.abs(e.mes - mes),
          12 - Math.abs(e.mes - mes),
        );
        return { e, distMes, distDia: Math.abs(e.numero - dia) };
      })
      .sort((a, b) => {
        if (a.distMes !== b.distMes) return a.distMes - b.distMes;
        if (a.distDia !== b.distDia) return a.distDia - b.distDia;
        if (a.e.mes !== b.e.mes) return a.e.mes - b.e.mes;
        if (a.e.numero !== b.e.numero) return a.e.numero - b.e.numero;
        return a.e.anio - b.e.anio;
      })
      .map(({ e }) => e);

    for (const e of extras) {
      if (elegidas.length >= limite) break;
      elegidas.push(e);
    }
  }

  return elegidas.map((e) => {
    return {
      href: `/hoy/${e.dia}`,
      titulo: e.titulo,
      teaser: e.hook ?? e.historia[0]?.slice(0, 120) ?? e.fecha,
      imagen: imagenDeEfemeride(e),
      meta: String(e.anio),
      kicker: e.fecha,
    };
  });
}

export function rielDestacadas(limite = 8): ItemRiel[] {
  return destacadas()
    .filter((c) => c.acceso !== "mecenas")
    .slice(0, limite)
    .map((c) => ({
      href: `/cronicas/${c.slug}`,
      titulo: c.titulo,
      teaser: c.subtitulo,
      imagen: imagenDeCronica(c.slug, c.visual.imagenHero),
      meta: c.duracion,
      kicker: "Historia",
    }));
}

export function rielRecorridos(limite = 4): ItemRiel[] {
  return recorridos
    .filter((r) => (r.acceso ?? "publico") === "publico")
    .slice(0, limite)
    .map((r) => ({
      href: `/recorridos/${r.slug}`,
      titulo: r.titulo,
      teaser: r.subtitulo,
      imagen: imagenDeRecorrido(r),
      meta: r.duracion,
      kicker: "Recorrido",
    }));
}

export function rielRecientesCronicas(limite = 6): ItemRiel[] {
  return [...cronicas]
    .filter((c) => c.acceso === "publico")
    .sort((a, b) => b.publicada.localeCompare(a.publicada))
    .slice(0, limite)
    .map((c) => ({
      href: `/cronicas/${c.slug}`,
      titulo: c.titulo,
      teaser: c.subtitulo,
      imagen: imagenDeCronica(c.slug, c.visual.imagenHero),
      meta: c.periodo,
      kicker: "Nueva",
    }));
}

export type GanchoPortal = {
  href: string;
  titulo: string;
  misterio: string;
  cta: string;
  imagenId?: string;
  imagenUrl?: string;
  credito?: string;
  kicker: string;
};

export function resolverGanchoPortal(opts: {
  efemerideTitulo: string;
  efemerideHref: string;
  efemerideTeaser: string;
  esExacta: boolean;
  cronicaDestacada: {
    slug: string;
    titulo: string;
    subtitulo: string;
    imagenHero?: string;
  };
}): GanchoPortal {
  if (opts.esExacta) {
    return {
      href: opts.efemerideHref,
      titulo: opts.efemerideTitulo,
      misterio: opts.efemerideTeaser,
      cta: "Entrar a la historia",
      imagenId: "mayo-cabildo",
      kicker: "Hoy en la historia",
    };
  }

  const img = opts.cronicaDestacada.imagenHero
    ? obtenerImagenCronica(opts.cronicaDestacada.imagenHero)
    : obtenerImagenCronica("mayo-cabildo");

  return {
    href: `/cronicas/${opts.cronicaDestacada.slug}`,
    titulo: opts.cronicaDestacada.titulo,
    misterio: opts.cronicaDestacada.subtitulo,
    cta: "Entrar a la historia",
    imagenId: opts.cronicaDestacada.imagenHero ?? "mayo-cabildo",
    imagenUrl: img?.url,
    credito: img?.alt,
    kicker: "Descubrí esto",
  };
}
