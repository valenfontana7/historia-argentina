import type { MetadataRoute } from "next";
import { categorias } from "@/data/categorias";
import { lugares } from "@/data/lugares";
import { periodos } from "@/data/periodos";
import { aniosConEventos } from "@/lib/grafo/queries";
import { personajes } from "@/data/personajes";
import { efemerides } from "@/data/efemerides";
import { cronicasPublicas } from "@/content/cronicas/registro";
import { recorridos } from "@/data/recorridos";
import { sitio } from "@/lib/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const fijas: MetadataRoute.Sitemap = [
    { url: sitio.url, changeFrequency: "daily", priority: 1 },
    { url: `${sitio.url}/explorar`, changeFrequency: "weekly", priority: 0.95 },
    { url: `${sitio.url}/recorridos`, changeFrequency: "weekly", priority: 0.92 },
    { url: `${sitio.url}/timelines`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${sitio.url}/mapa`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${sitio.url}/cronicas`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${sitio.url}/panteon`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${sitio.url}/hoy`, changeFrequency: "daily", priority: 0.9 },
    { url: `${sitio.url}/lugares`, changeFrequency: "weekly", priority: 0.85 },
    { url: `${sitio.url}/periodos`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${sitio.url}/categorias`, changeFrequency: "weekly", priority: 0.85 },
    { url: `${sitio.url}/membresia`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const deCronicas: MetadataRoute.Sitemap = cronicasPublicas().map((c) => ({
    url: `${sitio.url}/cronicas/${c.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const dePersonajes: MetadataRoute.Sitemap = personajes.map((p) => ({
    url: `${sitio.url}/panteon/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const deEfemerides: MetadataRoute.Sitemap = efemerides.map((e) => ({
    url: `${sitio.url}/hoy/${e.dia}`,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const deLugares: MetadataRoute.Sitemap = lugares.map((l) => ({
    url: `${sitio.url}/lugares/${l.slug}`,
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  const dePeriodos: MetadataRoute.Sitemap = periodos.map((p) => ({
    url: `${sitio.url}/periodos/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  const deCategorias: MetadataRoute.Sitemap = categorias.map((c) => ({
    url: `${sitio.url}/categorias/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const deTimelines: MetadataRoute.Sitemap = aniosConEventos().map((anio) => ({
    url: `${sitio.url}/timelines/${anio}`,
    changeFrequency: "yearly",
    priority: 0.55,
  }));

  const deRecorridos: MetadataRoute.Sitemap = recorridos.map((r) => ({
    url: `${sitio.url}/recorridos/${r.slug}`,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [
    ...fijas,
    ...deCronicas,
    ...deRecorridos,
    ...dePersonajes,
    ...deEfemerides,
    ...deLugares,
    ...dePeriodos,
    ...deCategorias,
    ...deTimelines,
  ];
}
