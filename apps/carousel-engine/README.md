# Carousel Engine

Motor de composición editorial del Media Engine. Renderiza carruseles PNG a partir de contenido estructurado + templates/themes (sin IA de layout).

Ver ADR: [`docs/architecture/adr-carousel-engine.md`](../../docs/architecture/adr-carousel-engine.md).

## Quick start

```bash
# desde la raíz del monorepo
npm install
npm run playwright:install -w @museoargent/carousel-engine
npm run carousel:contracts:build
npm run carousel:engine:start     # http://127.0.0.1:4120

# CLI con fixture
npm run carousel:engine:cli -- render fixtures/sample-carousel.json
# (tests/CI: agregá --fake)
```

Env:

| Variable | Default |
|----------|---------|
| `CAROUSEL_ENGINE_PORT` | `4120` |
| `CAROUSEL_ENGINE_API_KEY` | opcional — si falta, `VIDEO_ENGINE_API_KEY` (clave media) |
| `CAROUSEL_STORAGE_ROOT` | `data/carousel-engine` |
| `CAROUSEL_USE_FAKE_RENDERER` | off (usa Playwright) |

Admin Next: `/admin/carousel`. En local apunta a `http://127.0.0.1:4120`. En Vercel usa `VIDEO_ENGINE_URL/carousel` + `VIDEO_ENGINE_API_KEY` (mismo túnel que video).

### Producción (un túnel + una API key)

El video-engine hace de proxy: `VIDEO_ENGINE_URL/carousel/*` → `localhost:4120`.

1. `npm run video:engine:desktop` (o el start del video)
2. `npm run carousel:engine:start`
3. `npm run video:tunnel` — **un solo** túnel
4. Vercel: solo `VIDEO_ENGINE_URL` + `VIDEO_ENGINE_API_KEY` (sin vars `CAROUSEL_*`)

### Futuro: crónica → carousel

El adaptador `exhibitionFromCronica` del video-engine puede alimentar slides mapeando `imageCatalog[].url` a `CarouselAssetRef.src`. Hoy el fixture usa URLs Wikimedia cacheadas en `data/carousel-engine/cache/`.
