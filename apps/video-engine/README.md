# Video Engine — MuseoArgent

Servicio NestJS de generación audiovisual (Exhibition → VideoManifest → FFmpeg → MP4 9:16).

Ver ADR: [`docs/architecture/adr-video-engine.md`](../../docs/architecture/adr-video-engine.md)

## Arranque rápido

```bash
# desde la raíz del monorepo
npm install
npm run video:contracts:build

# (opcional) schema Postgres del engine
# set VIDEO_DATABASE_URL=...
# npm run video:prisma:generate
# npm run prisma:push -w @museoargent/video-engine

# Recomendado: instalar ffmpeg/ffprobe en PATH para renders reales.
# Sin ffmpeg el engine usa FallbackMp4Renderer (CI / demos).

npm run video:engine:start
```

## CLI

```bash
# Un comando: crónica → MP4 (cachea piezas Wikimedia + FFmpeg)
npm run video:generate -- el-cruce-de-los-andes

npm run video:engine:cli -- seed
npm run video:engine:cli -- run --file apps/video-engine/test/fixtures/exhibition-andes.json
npm run video:export-exhibition -- el-cruce-de-los-andes /tmp/ex.json
npm run video:engine:cli -- status --id <jobId>
```

Admin UI: `/admin/video`

## HTTP

- `GET /health` — público
- `POST /jobs` — header `x-api-key` + body `{ exhibition, formatId, force?, useFakeProviders? }`
- `GET /jobs/:id` — estado + métricas

Proxy admin (Next, sesión admin):  
`POST/GET /api/admin/video/jobs` y `/api/admin/video/jobs/:id`

## Variables

Ver `.env.example` (`VIDEO_*`, `OPENAI_*`, `FFMPEG_*`).
