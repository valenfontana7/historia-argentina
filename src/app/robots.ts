import type { MetadataRoute } from "next";
import { sitio } from "@/lib/site.config";

const rutasPrivadas = [
  "/api/",
  "/admin/",
  "/mecenas/",
  "/membresia/acceder",
  "/membresia/gracias",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: rutasPrivadas,
    },
    sitemap: `${sitio.url}/sitemap.xml`,
    host: sitio.url,
  };
}
