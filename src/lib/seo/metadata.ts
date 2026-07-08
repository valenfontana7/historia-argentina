import type { Metadata } from "next";
import { sitio } from "@/lib/site.config";

export type MetaPagina = {
  titulo: string;
  descripcion: string;
  ruta: string;
  imagen?: string;
  tipo?: "website" | "article";
  noindex?: boolean;
  palabrasClave?: string[];
};

const robotsIndexables: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

/** Rutas con `opengraph-image.tsx` propio en su segmento. */
const RUTAS_OG_PROPIA = new Set([
  "/explorar",
  "/panteon",
  "/cronicas",
  "/timelines",
  "/jugar",
  "/lugares",
  "/mapa",
  "/periodos",
  "/categorias",
]);

function imagenOgPorRuta(ruta: string, imagen?: string): string {
  if (imagen) return imagen;
  if (ruta === "/") return `${sitio.url}/opengraph-image`;
  if (RUTAS_OG_PROPIA.has(ruta)) return `${sitio.url}${ruta}/opengraph-image`;
  return `${sitio.url}/opengraph-image`;
}

function verificacionBusqueda(): Metadata["verification"] | undefined {
  const google = process.env.GOOGLE_SITE_VERIFICATION?.trim();
  if (!google) return undefined;
  return { google };
}

export function urlCanonica(ruta: string): string {
  const path = ruta.startsWith("/") ? ruta : `/${ruta}`;
  return `${sitio.url}${path}`;
}

export function construirMetadata(pagina: MetaPagina): Metadata {
  const canonical = urlCanonica(pagina.ruta);
  const ogImage = imagenOgPorRuta(pagina.ruta, pagina.imagen);
  const keywords = pagina.palabrasClave ?? [...sitio.palabrasClave];

  const title: Metadata["title"] =
    pagina.ruta === "/"
      ? { absolute: pagina.titulo }
      : pagina.titulo;

  return {
    title,
    description: pagina.descripcion,
    keywords,
    applicationName: sitio.nombre,
    alternates: { canonical },
    robots: pagina.noindex ? { index: false, follow: false } : robotsIndexables,
    openGraph: {
      title: pagina.titulo,
      description: pagina.descripcion,
      url: canonical,
      siteName: sitio.nombre,
      locale: "es_AR",
      type: pagina.tipo ?? "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: pagina.titulo }],
    },
    twitter: {
      card: "summary_large_image",
      title: pagina.titulo,
      description: pagina.descripcion,
      images: [ogImage],
    },
  };
}

/** Metadata global del layout (complementa `construirMetadata` por página). */
export const metadataSitio: Metadata = {
  metadataBase: new URL(sitio.url),
  title: {
    default: `${sitio.nombre} — ${sitio.lema}`,
    template: `%s — ${sitio.nombre}`,
  },
  description: sitio.descripcion,
  keywords: [...sitio.palabrasClave],
  applicationName: sitio.nombre,
  creator: sitio.nombre,
  publisher: sitio.nombre,
  category: "education",
  robots: robotsIndexables,
  alternates: {
    canonical: sitio.url,
    languages: { "es-AR": sitio.url },
  },
  openGraph: {
    title: `${sitio.nombre} — ${sitio.lema}`,
    description: sitio.descripcion,
    url: sitio.url,
    siteName: sitio.nombre,
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: `${sitio.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: sitio.lema,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${sitio.nombre} — ${sitio.lema}`,
    description: sitio.descripcion,
    images: [`${sitio.url}/opengraph-image`],
  },
  icons: {
    icon: [{ url: "/icon", type: "image/png", sizes: "48x48" }],
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  ...(verificacionBusqueda() && { verification: verificacionBusqueda() }),
};
