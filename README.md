# Argent — Museo digital de historia argentina

La historia argentina contada como nunca: crónicas cinematográficas que se
navegan con el scroll, un panteón interactivo de personajes, exploración por
grafo y mecánicas de engagement diarias.

**Sitio:** https://museoargent.com.ar (dominio en trámite)  
**Preview:** https://historia-argentina-woad.vercel.app

## Módulos

| Módulo       | Ruta                    | Qué es                                                                                |
| ------------ | ----------------------- | ------------------------------------------------------------------------------------- |
| Explorar     | `/explorar`             | Hub de descubrimiento: personajes, lugares, períodos, categorías y timeline           |
| Crónicas     | `/cronicas/[slug]`      | Historias scrollytelling (MDX + GSAP): mapas animados, cifras vivas, comparadores     |
| El Panteón   | `/panteon/[slug]`       | Fichas de personajes: biografía, línea de vida, aliados y enemigos con links cruzados |
| Hoy          | `/hoy/[dia]`            | Efeméride diaria con card Open Graph compartible y captura de email                   |
| Lugares      | `/lugares/[slug]`       | Geografía histórica con personajes y eventos vinculados                               |
| Períodos     | `/periodos/[slug]`      | Cinco épocas del relato nacional con eventos destacados                               |
| Categorías   | `/categorias/[slug]`    | Taxonomía editorial de efemérides y entidades relacionadas                            |
| Timeline     | `/timelines`, `/timelines/[anio]` | Explorador temporal interactivo; comparador de siglos; premium Mecenas      |
| Jugar        | `/jugar`                | Quiz diario «¿Qué pasó un…?» con streak en localStorage y OG shareable                |
| Mapa         | `/mapa`                 | Mapa exploratorio del Cono Sur (preview público; completo para mecenas)               |
| Mecenas      | `/membresia`            | Membresía de apoyo: Checkout Pro (anual) y Suscripciones MP (mensual)                 |
| Área privada | `/mecenas`              | Exclusivas, mapa completo, timeline premium y créditos (magic link)                 |

## Stack

- **Next.js 16** (App Router)
- **Tailwind CSS 4** (tokens en `src/app/globals.css`)
- **GSAP + ScrollTrigger** — scrollytelling
- **MDX** — crónicas
- **Prisma + Postgres** — suscriptores del boletín y mecenas
- **MercadoPago** — pagos (Checkout Pro + PreApproval)
- **Resend** — magic links y bienvenida
- **Vercel** — hosting y deploy

## Desarrollo

```bash
cp .env.example .env   # completar variables
npm install
npm run dev            # http://localhost:3000
npm run build          # prisma generate + migrate + next build
npm run grafo:validar  # validar integridad del grafo editorial (≥120 nodos)
```

## Documentación operativa

- **[Membresía, MercadoPago, dominio y deploy](docs/MEMBRESIA-Y-OPERACIONES.md)** — guía completa de pagos, auth, env vars y checklist de lanzamiento

## Dónde vive el contenido

- `src/data/personajes.ts` — El Panteón
- `src/data/efemerides.ts` — efemérides de "Hoy"
- `src/data/lugares.ts` — lugares con coordenadas y relaciones
- `src/data/periodos.ts`, `src/data/categorias.ts` — taxonomía editorial
- `src/lib/grafo/` — grafo unificado, queries y validación
- `src/content/cronicas/*.mdx` — crónicas (`registro.ts` + flag `acceso`)
- `src/lib/site.config.ts` — marca **Argent** y URL canónica
- `src/lib/membresia.config.ts` — precios y planes Mecenas
- `prisma/schema.prisma` — suscriptores y mecenas

## Cómo agregar contenido

- **Nueva efeméride:** entrada en `src/data/efemerides.ts` con `relacionados[]` ≥1 personaje; luego `npm run grafo:validar`
- **Nuevo personaje:** entrada en `src/data/personajes.ts`
- **Nuevo lugar:** entrada en `src/data/lugares.ts` con `lat`/`lon`, `personajes[]` y `eventos[]`
- **Nueva crónica:** `.mdx` en `src/content/cronicas/`, registrar en `registro.ts` con `acceso: "publico" | "mecenas" | "anticipo"`
- **Componentes scrolly:** `Capitulo`, `Prosa`, `CitaHistorica`, `DatoGigante`, `Comparador`, `MapaDefensa`, etc. en `src/mdx-components.tsx`

## CI

El workflow `.github/workflows/grafo.yml` ejecuta `npm run grafo:validar` en PRs que tocan datos o el grafo.
