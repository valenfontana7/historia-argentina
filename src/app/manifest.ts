import type { MetadataRoute } from "next";
import { sitio } from "@/lib/site.config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${sitio.nombre} — ${sitio.lema}`,
    short_name: sitio.nombre,
    description: sitio.descripcion,
    start_url: "/",
    display: "standalone",
    background_color: "#0c0a08",
    theme_color: "#c6a15b",
    lang: "es-AR",
    orientation: "portrait-primary",
    categories: ["education", "history"],
    icons: [
      {
        src: "/icon",
        sizes: "48x48",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
