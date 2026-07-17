# ADR: Carousel Engine (Media Engine)

**Estado:** Aceptado (implementación v1 en curso)  
**Fecha:** 2026-07-16  
**Relacionado:** [adr-video-engine.md](./adr-video-engine.md), [adr-video-engine-copilot.md](./adr-video-engine-copilot.md)

## Contexto

El Media Engine hoy es un único producto de video (`apps/video-engine` + `@museoargent/video-contracts`) que produce MP4 9:16. Necesitamos generar carruseles de imágenes (Instagram y perfiles futuros) con calidad editorial de museo, sin que la IA decida layouts, tipografías ni composición.

Queremos una **plataforma de composición editorial reutilizable**: contenido estructurado + design system + renderer determinístico → PNG/WebP.

## Decisión

Crear el **Carousel Engine** como app hermana del video-engine:

| Pieza | Path |
|-------|------|
| App | `apps/carousel-engine` (`@museoargent/carousel-engine`) |
| Contratos | `packages/carousel-contracts` (`@museoargent/carousel-contracts`) |
| Storage | `data/carousel-engine/` |
| Admin | `/admin/carousel` + `/api/admin/carousel/*` |

“Media Engine” es la familia de productos; **video** y **carousel** no comparten orquestador ni cola.

### Principios

1. El engine **no genera diseños; renderiza diseños**.
2. Contenido nunca lleva coordenadas, HTML ni estilos.
3. Layout, tipografía, color y componentes vienen de templates, themes y reglas.
4. La IA (futuro) solo puede aportar contenido; nunca composición.
5. Render incremental: si cambia una slide, solo se re-renderiza esa slide.
6. Todo carrusel registra `templateId@version`, `themeId` y `profileId` usados.

### Pipeline determinístico

```
CarouselDocument
  → SlidePlanner          # v1: identidad / validación de orden
  → TemplateResolver
  → ComponentResolver
  → LayoutEngine          # IR de cajas (reglas, no longitud de texto)
  → TypographyEngine      # escalas, recomposición; nunca truncar
  → AssetComposer         # crop/fit; nunca deformar
  → Renderer              # React(IR) → Playwright → PNG/WebP
  → Export
```

Composición interna (enfoque A): **IR declarativo → proyección React → screenshot Chromium**.

### Contratos (capas)

| Capa | Documento | Contiene | No contiene |
|------|-----------|----------|-------------|
| Contenido | `Carousel` + `Slide[]` | tipo, textos, refs de assets | coords, CSS, HTML |
| Resolución | Slide IR | slots, grid, tipografía resuelta, crops | reglas editoriales |
| Presentación | `RenderPlan` | template/theme/profile + hashes | contenido crudo editable |
| Job | `CarouselJob` | status, orden, dirty set, artefactos | — |

### Slide types

**v1 con renderer:** `cover`, `content`, `quote`, `statistic`, `gallery`, `ending_cta`.

**Reservados (schema):** `section`, `timeline`, `comparison`, `map`, `checklist`, `artifact`, `portrait`, `callout`.

### Template / Theme / Profile v1

- Template: `museum_classic@1`
- Theme: `museoargent_classic` (tokens museo nocturno: Fraunces + Inter, oro `#c6a15b`, fondo `#0c0a08`)
- Profiles: `instagram_feed` (1080×1350), `instagram_square` (1080×1080)

### Artefactos (`data/carousel-engine/jobs/<id>/`)

| Archivo | Rol |
|---------|-----|
| `carousel.json` | Documento de contenido |
| `render-plan.json` | Plan + hashes IR por slide |
| `meta.json` | template/theme/profile versions |
| `slides/<slideId>.png` (o `.webp`) | Export por slide |
| `job.json` | Estado del job |

### API (v1)

- `GET /health`
- `POST /jobs` — crear con carousel + template/theme/profile
- `GET /jobs`, `GET /jobs/:id`
- `DELETE /jobs/:id` — borrar job y artefactos
- `PATCH /jobs/:id` — reorder, duplicate, delete slide; cambiar template/theme/profile; reemplazar carousel
- `POST /jobs/:id/render` — full o `slideIds[]`
- `GET /jobs/:id/slides/:slideId` — imagen
- `GET /jobs/:id/export-zip` — ZIP de PNGs renderizados

### Admin

`/admin/carousel`: crear desde crónica (adapter en Next), fixture, editar texto de slide, export ZIP, borrar job. Preview mobile-first.

## Alternativas descartadas

- Meter carousel como stage del `PipelineOrchestrator` de video
- Layout decidido por prompts / LLM
- Truncado automático de texto (overflow → error o recomposición)
- Canvas/Skia como renderer v1 (tipografía editorial más frágil)
- Umbrella `media-engine` con rename inmediato (más refactor que valor hoy)

## Fuera de alcance v1

- Slide Planner con IA
- Templates Museum Editorial/Documentary/Dark/Premium
- Profiles LinkedIn / Pinterest / Instagram Portrait
- Export PDF / SVG
- Cola Postgres / tunnel desktop

## Roadmap

| Fase | Entrega |
|------|---------|
| **0** | ADR + skeleton Nest + scripts |
| **1** | Contratos Zod + fixture |
| **2** | Pipeline hasta IR + tests |
| **3** | Playwright + Museum Classic + MuseoArgent Classic + PNG/WebP |
| **4** | Jobs persistentes, incremental, CLI, admin mínimo |
| **5** | Crónica → carousel + admin UX (editar / ZIP / borrar) + tunnel health |

## Criterios de done (v1)

1. Fixture renderiza a PNG/WebP con `museum_classic@1` + `museoargent_classic`.
2. Job registra versiones de template/theme/profile.
3. Editar/re-render una slide no re-renderiza el resto (hashes IR).
4. Admin mínimo puede preview, reorder y cambiar template/theme/profile.
5. Sin colores literales en componentes React (solo tokens).
6. Sin dependencia del pipeline de video.
