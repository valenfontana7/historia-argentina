import type { MetadataRoute } from "next";
import { personajes } from "@/data/personajes";
import { efemerides } from "@/data/efemerides";
import { cronicas } from "@/content/cronicas/registro";
import { sitio } from "@/lib/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const fijas: MetadataRoute.Sitemap = [
    { url: sitio.url, changeFrequency: "daily", priority: 1 },
    { url: `${sitio.url}/cronicas`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${sitio.url}/panteon`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${sitio.url}/hoy`, changeFrequency: "daily", priority: 0.9 },
  ];

  const deCronicas: MetadataRoute.Sitemap = cronicas.map((c) => ({
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

  return [...fijas, ...deCronicas, ...dePersonajes, ...deEfemerides];
}
