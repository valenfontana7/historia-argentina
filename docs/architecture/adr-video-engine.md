# ADR: Motor de Generación Audiovisual

**Estado:** Aceptado  
**Fecha:** 2026-07-16  
**Contexto:** MuseoArgent (Next.js) necesita generar Reels/Shorts/TikTok desde exhibiciones estructuradas, con control total del pipeline y composición vía FFmpeg.

## Decisión

Servicio NestJS dedicado (`apps/video-engine`) en el mismo monorepo, contratos en `packages/video-contracts`, jobs en PostgreSQL (`SKIP LOCKED`), storage local con puerto S3-ready, IA solo para decisiones creativas, renderer FFmpeg que interpreta un `VideoManifest` declarativo.

## Decisiones de producto

| Tema | Decisión |
|------|----------|
| Topología | NestJS separado; Next dispara/consulta |
| Input | DTO canónico `Exhibition` + adaptador desde crónicas |
| Cola | PostgreSQL + puerto `JobQueue` |
| LLM | `LlmProvider` + OpenAI (structured outputs) |
| TTS | `VoiceProvider` + OpenAI TTS (v1) |
| Composición | FFmpeg interpreta solo `VideoManifest` |
| Aspecto v1 | 1080×1920 (9:16) |

## Decisiones técnicas

- Monorepo suave: Next en la raíz; `apps/video-engine` + `packages/video-contracts`.
- Prisma propio del engine (`VIDEO_DATABASE_URL` o `DATABASE_URL`).
- Storage: `LocalObjectStorage` bajo `data/video-engine/`; stub S3.
- Asset ranking heurístico por metadata; embeddings diferidos.
- Música: IA elige categoría; selector por metadata (nunca al azar).
- Formato E2E v1: `reel`. Otros perfiles como config.
- Auth: `VIDEO_ENGINE_API_KEY`.
- Idempotencia: `(exhibitionId, formatId, promptVersion, pipelineVersion)`.

## Arquitectura

```
Exhibition → Script → Storyboard → Voice → Assets → Subtitles → Music → Composer → FFmpeg → MP4
```

Capas: `domain` / `application` (puertos + stages) / `infrastructure` / `interface` (HTTP + CLI).

## Alternativas descartadas

- Remotion / CapCut / After Effects (pérdida de control)
- Todo en Vercel (timeouts, sin FFmpeg)
- BullMQ día 1 (Redis innecesario; puerto permite migrar)
- Embeddings / generación de imágenes IA día 1
- HTML/MDX como input del pipeline

## Riesgos y mitigaciones

- Licencias Wikimedia → metadata + denylist
- Calidad TTS/guion → prompts versionados + fixtures
- FFmpeg frágil → manifest pequeño + tests
- Costos OpenAI → cache de artifacts por hash

## Escalabilidad

N workers con SKIP LOCKED; swap Local→S3, PostgresQueue→BullMQ, HeuristicRanker→Embeddings sin tocar el orquestador.

## Roadmap

Fases 0–7 en el plan de implementación (skeleton → jobs → pipeline → voice → assets → ffmpeg → adaptador crónicas → API).

## Criterios de done (v1)

1. `POST /jobs` con Exhibition + `reel` → `succeeded`
2. MP4 1080×1920 reproducible desde el mismo manifest
3. Stages reemplazables por DI
4. Test E2E offline (fakes) + test renderer FFmpeg
5. Sitio Next sigue funcionando
