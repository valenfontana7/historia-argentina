import { sitio } from "@/lib/site.config";

/** Datos del web app manifest de la PWA admin (no se enlaza en páginas públicas). */
export function adminPwaManifest() {
  return {
    id: "/admin",
    name: `${sitio.nombre} Admin`,
    short_name: "Argent Admin",
    description: `Panel de administración de ${sitio.nombre}: mecenas, video y herramientas internas.`,
    start_url: "/admin",
    scope: "/admin",
    display: "standalone",
    background_color: "#0c0a08",
    theme_color: "#c6a15b",
    lang: "es-AR",
    orientation: "portrait-primary",
    categories: ["productivity", "utilities"],
    icons: [
      {
        src: "/admin/pwa-icon/192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/admin/pwa-icon/512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/admin/pwa-icon/192",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/admin/pwa-icon/512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  } as const;
}
