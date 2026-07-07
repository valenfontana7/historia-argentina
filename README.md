# Argenta — Museo digital de historia argentina

La historia argentina contada como nunca: crónicas cinematográficas que se
navegan con el scroll, un panteón interactivo de personajes y una efeméride
visual cada día.

**Producción:** https://historia-argentina-woad.vercel.app

## Módulos

| Módulo | Ruta | Qué es |
| --- | --- | --- |
| Crónicas | `/cronicas/[slug]` | Historias scrollytelling (MDX + GSAP): mapas animados, cifras vivas, comparadores |
| El Panteón | `/panteon/[slug]` | Fichas de personajes: biografía, línea de vida, aliados y enemigos con links cruzados |
| Hoy | `/hoy/[dia]` | Efeméride diaria con card Open Graph compartible y captura de email |

## Stack

- **Next.js 16** (App Router, SSG casi total; `/hoy` es dinámica para resolver la fecha del día)
- **Tailwind CSS 4** (tokens propios en `src/app/globals.css`)
- **GSAP + ScrollTrigger** para el scrollytelling de las crónicas
- **Framer Motion** para micro-interacciones
- **MDX** (`@next/mdx`) para el contenido de las crónicas

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
```

## Dónde vive el contenido

Todo el contenido está en el repo, sin base de datos:

- `src/data/personajes.ts` — fichas del Panteón
- `src/data/efemerides.ts` — efemérides de "Hoy" (una entrada por día del año, ampliable)
- `src/content/cronicas/*.mdx` — crónicas; se registran en `src/content/cronicas/registro.ts`
- `src/lib/site.config.ts` — nombre de marca, lema y URL canónica (cambiarlo acá actualiza todo el sitio)

## Cómo agregar contenido

- **Nueva efeméride:** agregar una entrada en `src/data/efemerides.ts`. La página, la card OG y el sitemap se generan solos.
- **Nuevo personaje:** agregar una entrada en `src/data/personajes.ts` (usar los slugs en `aliados`/`enemigos` para los links cruzados).
- **Nueva crónica:** crear el `.mdx` en `src/content/cronicas/`, registrarlo en `registro.ts` y usar los componentes de `src/components/scrolly/` (`Capitulo`, `Prosa`, `CitaHistorica`, `DatoGigante`, `Comparador`, etc.).

## Fase 2 (fuera del MVP)

Atlas del Tiempo, buscador de apellidos inmigrantes, envío real del boletín
(Resend), cuentas de usuario con rachas y CMS.
