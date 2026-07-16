# ADR: Media Engine como Copilot Editorial

**Estado:** Aceptado (Fases 1–6 implementadas)  
**Fecha:** 2026-07-16  
**Supersede parcialmente:** [adr-video-engine.md](./adr-video-engine.md) (modelo Autopilot punta a punta)

## Contexto

El motor generaba un MP4 de extremo a extremo. Eso optimiza autonomía, no calidad editorial: imágenes inadecuadas, typos en narración y decisiones creativas sin revisión humana.

Queremos un **Copilot de Producción Audiovisual**: la IA propone; el curador decide; cada etapa produce una propuesta editable con ciclo generar → previsualizar → editar → aprobar → continuar.

## Decisión

Evolucionar el Job del video-engine hacia un flujo **multi-gate** con artefactos separados por etapa, sin romper el modo Autopilot (`interactive: false`) usado en CI/CLI.

### Principios

1. La IA nunca asume aprobación implícita.
2. Cada etapa importante pausa en `awaiting_*` hasta `approve-*`.
3. Regeneración acotada: un PATCH no re-ejecuta LLM de etapas ya aprobadas.
4. Volver atrás = reencolar una fase previa sin borrar el resto (invalidación explícita en fases futuras).
5. Memoria editorial es lateral (disco por `exhibitionId`); no introduce un nuevo gate.

### Estados de producción (Fases 1–3)

| Estado job | Significado |
|------------|-------------|
| `queued` / `running` | Worker ejecutando una fase |
| `awaiting_script` | Script generado; curador edita/aprueba / regen LLM |
| `awaiting_storyboard` | Storyboard generado; curador edita/aprueba / regen LLM |
| `awaiting_assets` | Bindings propuestos; curador elige/aprueba |
| `awaiting_voice` | Voces TTS generadas; curador escucha/regenera |
| `awaiting_preview` | Clips por escena listos; lock / regenerate / checklist / approve |
| `succeeded` / `failed` / `cancelled` | Terminal |
| `awaiting_review` | Legacy → tratar como `awaiting_assets` |

`resumePhase`: `script` → `storyboard` → `assets` → `voice` → `preview` → `render`.

No hay `awaiting_checklist`: el checklist vive en UI + hard-fail en `approve-preview`.

### Artefactos en disco (`jobs/<id>/`)

| Archivo | Etapa |
|---------|-------|
| `exhibition.json` | Input |
| `script.json` | Tras script |
| `storyboard.json` | Tras storyboard |
| `bindings.json` | Tras assets (+ catalog) |
| `draft.json` | Legacy (storyboard+bindings); se sigue escribiendo por compat |
| `voices.json` + `voice/scene-N.mp3` | Tras voice |
| `preview.json` + `preview/scene-N.mp4` | Tras preview (clips silenciosos) |
| `manifest.json`, `subs/`, `output.mp4` | Tras preview / render final |
| `versions/manifest.json` + `versions/<n>-<phase>/` | Snapshots al aprobar cada gate |

Memoria lateral (raíz de storage, no por job): `memory/<safeExhibitionId>.json`.

### Pipeline interactivo

```
Exhibition → Script → [approve] → Storyboard → [approve] → Assets → [approve]
  → Voice → [approve] → Preview → [checklist] → [approve] → Stitch/Render
```

Autopilot (`interactive: false`): mismas etapas sin pausas ni checklist UI.

### Checklist pre-render (Fase 4)

`GET /jobs/:id/checklist` evalúa:

- storyboard con escenas (error)
- narración no vacía (error)
- bindings completos (error)
- voces + archivos (error)
- clips preview no dirty (error)
- duración vs target ±40% (warn)

`approve-preview` rechaza si `canApprove === false`.

### Versionado liviano (Fase 4)

Al aprobar cada gate se copia el JSON relevante a `versions/<n>-<phase>/`.  
`GET /jobs/:id/versions` lista entradas (sin restore UI en este MVP).

### Memoria editorial + regen LLM (Fase 5)

Contrato `EditorialMemory`: `notes`, `bannedWords`, `preferredTone?`, `preferredAssetIds`, `lastJobId?`.

- `GET/PATCH /jobs/:id/memory` (resuelve `exhibitionId` del job).
- Al generar/regenerar script o storyboard se inyecta `EDITORIAL_MEMORY_JSON` en el user prompt.
- Merge automático de `preferredAssetIds` + `lastJobId` al aprobar assets y al completar job.
- Regen parcial (solo en el gate actual; sin snapshot hasta `approve-*`):
  - `POST /jobs/:id/script/regenerate` → `awaiting_script`
  - `POST /jobs/:id/storyboard/regenerate` → `awaiting_storyboard`
  - `POST /jobs/:id/storyboard/:scene/regenerate` → reescribe una escena
- Body opcional: `{ hint?: string }` → `CURATOR_HINT` una sola vez.

`PIPELINE_VERSION` = `1.6.0`.

### UI mobile del Copilot (Fase 6)

Sin API nueva. El admin en phone prioriza el viewport de revisión:

- En `awaiting_*`, el bloque Generar va colapsado (`<details>`).
- Sticky inferior: “Ir al paso de revisión” (scroll al wizard), no Generar disabled.
- Acciones secundarias del wizard con `min-h-11` (regen, memoria, lock, elegir imagen).
- Inputs `text-base` en mobile (anti-zoom iOS); steps con scroll horizontal.
- Memoria editable también en Storyboard (colapsada).
- Preview: video/audio a ancho completo; grid de assets `2` cols en xs.

Post-MVP (siguen fuera): rewind entre gates, restore de `versions/`.

### API

- Gates: script / storyboard / assets / voice / preview (+ legacy draft)
- Memoria: `GET/PATCH /jobs/:id/memory`
- Regen LLM: script / storyboard / storyboard/:scene
- `GET /jobs/:id/checklist`
- `GET /jobs/:id/versions`
- Media: `.../media`, `.../media/voice/:scene`, `.../media/preview/:scene`

### Compatibilidad

- Admin: `interactive: true`
- Tests/CLI: `interactive: false`
- Cola: cualquier `awaiting_*` bloquea un segundo job (409)
- Desktop: memoria + disco; Prisma solo si `VIDEO_DATABASE_URL`

## Alternativas descartadas (ahora)

- Autopilot con post-edición del MP4 (demasiado tarde)
- Un solo gate eterno (insuficiente para script vs assets)
- Regenerar todo el pipeline ante cualquier edit
- Nuevo estado `awaiting_checklist` (redundante con preview)
- Nuevo gate `awaiting_memory` (la memoria es lateral)
- Memoria en Postgres (MVP solo disco del engine)
- Regen LLM desde gates posteriores sin volver atrás

## Roadmap

| Fase | Entrega |
|------|---------|
| **1** | Multi-gate script / storyboard / assets + UI wizard |
| **2** | Voice review por escena |
| **3** | Preview por escena + render incremental |
| **4** | Versionado + checklist pre-render |
| **5** | Memoria editorial + regen parcial LLM |
| **6** (esta) | UI mobile del Copilot (host + wizard) |

## Criterios de done (Fase 6)

1. En `awaiting_*`, sticky mobile ofrece scroll al wizard (no Generar disabled).
2. Bloque Generar colapsado en revisión; no ocupa el primer viewport.
3. Acciones secundarias del wizard con `min-h-11` usables con el pulgar.
4. Videos/audio de preview a ancho completo en mobile.
5. Memoria editable desde Storyboard (colapsada).
6. Sin cambios de API / pipeline; rewind y restore siguen post-MVP.
