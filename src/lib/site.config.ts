/**
 * Configuración central de la marca. Cambiar acá actualiza en todo el sitio
 * (header, footer, metadata, OG images, JSON-LD).
 *
 * Dominio objetivo: museoargent.com.ar (conectar en Vercel cuando esté comprado).
 * Hasta entonces, NEXT_PUBLIC_SITE_URL en Vercel puede seguir apuntando al *.vercel.app
 * para magic links y MercadoPago.
 *
 * Google Search Console: definir GOOGLE_SITE_VERIFICATION en .env (ver .env.example).
 */
export const sitio = {
  nombre: "Argent",
  lema: "Historia argentina para explorar",
  descripcion:
    "Crónicas para leer con el scroll, fichas de personajes y una historia del día. Un museo digital de historia argentina, gratis y en español.",
  url: "https://museoargent.com.ar",
  palabrasClave: [
    "historia argentina",
    "efemérides argentinas",
    "personajes históricos argentinos",
    "crónicas de historia",
    "museo digital",
    "línea del tiempo argentina",
    "educación historia",
  ],
} as const;
