/**
 * Configuración central de la marca. Cambiar acá actualiza en todo el sitio
 * (header, footer, metadata, OG images, JSON-LD).
 *
 * URL canónica: NEXT_PUBLIC_SITE_URL (producción) o www.museoargent.com.ar.
 * Debe coincidir con el host al que redirige Vercel (apex → www).
 * Una sola fuente para SEO, magic links y MercadoPago.
 *
 * Google Search Console: definir GOOGLE_SITE_VERIFICATION en .env (ver .env.example).
 */
const URL_DEFAULT = "https://www.museoargent.com.ar";

export const sitio = {
  nombre: "Argent",
  lema: "Historia argentina para explorar",
  descripcion:
    "Crónicas para leer con el scroll, fichas de personajes y una historia del día. Un museo digital de historia argentina, gratis y en español.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") || URL_DEFAULT,
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
