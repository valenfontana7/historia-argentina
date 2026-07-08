# Argent — Museo digital de historia argentina

La historia argentina contada como nunca: crónicas cinematográficas que se
navegan con el scroll, un panteón interactivo de personajes y una efeméride
visual cada día.

**Sitio:** https://museoargent.com.ar (dominio en trámite)  
**Preview:** https://historia-argentina-woad.vercel.app

## Módulos

| Módulo     | Ruta               | Qué es                                                                                |
| ---------- | ------------------ | ------------------------------------------------------------------------------------- |
| Crónicas   | `/cronicas/[slug]` | Historias scrollytelling (MDX + GSAP): mapas animados, cifras vivas, comparadores     |
| El Panteón | `/panteon/[slug]`  | Fichas de personajes: biografía, línea de vida, aliados y enemigos con links cruzados |
| Hoy        | `/hoy/[dia]`       | Efeméride diaria con card Open Graph compartible y captura de email                   |
| Mecenas    | `/membresia`       | Membresía de apoyo: Checkout Pro (anual) y Suscripciones MP (mensual)                 |
| Área privada | `/mecenas`       | Exclusivas y créditos para mecenas activos (magic link)                               |

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
```

## Documentación operativa

- **[Membresía, MercadoPago, dominio y deploy](docs/MEMBRESIA-Y-OPERACIONES.md)** — guía completa de pagos, auth, env vars y checklist de lanzamiento

## Dónde vive el contenido

- `src/data/personajes.ts` — El Panteón
- `src/data/efemerides.ts` — efemérides de "Hoy"
- `src/content/cronicas/*.mdx` — crónicas (`registro.ts` + flag `acceso`)
- `src/lib/site.config.ts` — marca **Argent** y URL canónica
- `src/lib/membresia.config.ts` — precios y planes Mecenas
- `prisma/schema.prisma` — suscriptores y mecenas

## Cómo agregar contenido

- **Nueva efeméride:** entrada en `src/data/efemerides.ts`
- **Nuevo personaje:** entrada en `src/data/personajes.ts`
- **Nueva crónica:** `.mdx` en `src/content/cronicas/`, registrar en `registro.ts` con `acceso: "publico" | "mecenas" | "anticipo"`
- **Componentes scrolly:** `Capitulo`, `Prosa`, `CitaHistorica`, `DatoGigante`, `Comparador`, `MapaDefensa`, etc. en `src/mdx-components.tsx`
