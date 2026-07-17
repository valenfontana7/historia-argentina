# Video-engine en PC de escritorio (sin Docker) + Cloudflare Tunnel

Generás reels en tu máquina (32 GB RAM, craft completo) y Vercel solo hace de bridge al admin.

```
Admin (Vercel)  --HTTPS-->  Cloudflare Tunnel  -->  localhost:4100 (Node en tu PC)
```

## Requisitos

- Node 22+
- FFmpeg + ffprobe en PATH (`winget install Gyan.FFmpeg`)
- `cloudflared` (`winget install Cloudflare.cloudflared`)
- Claves: `OPENAI_API_KEY`, `VIDEO_ENGINE_API_KEY` (misma que en Vercel)

## 1. Configurar env del engine

Creá `apps/video-engine/.env` (no se commitea):

```bash
cp apps/video-engine/.env.desktop.example apps/video-engine/.env
```

Completá al menos:

- `OPENAI_API_KEY` (la misma que usás para TTS/LLM)
- `VIDEO_ENGINE_API_KEY` — generá una clave larga y **poné exactamente la misma** en Vercel

Valores importantes para escritorio:

| Variable | Valor sugerido |
|----------|----------------|
| `VIDEO_RENDER_FAST` | `0` (craft completo: gblur, zoompan, noise, vignette) |
| `VIDEO_X264_PRESET` | `medium` |
| `VIDEO_X264_CRF` | `18` |
| `NODE_OPTIONS` | `--max-old-space-size=2048` |
| `VIDEO_STORAGE_ROOT` | ruta absoluta Windows, ej. `C:/Users/…/historia-argentina/data/video-engine` |
| `VIDEO_ENGINE_PORT` | `4110` (evitar `4100`: Hyper-V en Windows lo reserva) |

El loader carga primero el `.env` de la raíz del monorepo y después `apps/video-engine/.env` (este gana en claves de video).

**Importante:** el engine **no** usa `DATABASE_URL` del sitio. En escritorio la cola es memoria + `job.json` en disco. Solo si definís `VIDEO_DATABASE_URL` (Postgres con schema del engine) usa Prisma.

## 2. Arrancar el engine (terminal 1)

Desde la raíz del repo:

```bash
npm run video:contracts:build
npm run video:prisma:generate
npm run video:engine:desktop
```

Smoke:

```bash
curl -s http://127.0.0.1:4110/health
# → {"ok":true,"service":"video-engine"}
```

Dejá esa terminal abierta mientras generás.

## 3. Túnel Cloudflare (terminal 2)

### Opción rápida (URL temporal, ideal para probar)

```bash
npm run video:tunnel
# lee VIDEO_ENGINE_PORT del .env (4110)
```

`cloudflared` imprime una URL tipo `https://xxxx.trycloudflare.com`.  
Esa URL cambia cada vez que reiniciás el túnel.

### Opción estable (recomendada para prod)

1. Cuenta en [Cloudflare Zero Trust](https://one.dash.cloudflare.com/)
2. `cloudflared tunnel login`
3. `cloudflared tunnel create museoargent-video`
4. Configurá un hostname (ej. `video.tudominio.com`) → servicio `http://127.0.0.1:4110`
5. `cloudflared tunnel run museoargent-video`

URL fija: `https://video.tudominio.com`

## 4. Vercel

En el proyecto → Settings → Environment Variables (Production):

| Variable | Valor |
|----------|--------|
| `VIDEO_ENGINE_URL` | La URL HTTPS del túnel (sin `/` final) |
| `VIDEO_ENGINE_API_KEY` | **Exactamente** la misma que en `apps/video-engine/.env` |

Redeploy del sitio (o “Redeploy” del último deployment) para que tome las vars.

El VPS (`64.23.232.142:4100`) deja de usarse para video: podés apagar el container allí para no gastar RAM.

## 5. Probar desde el admin

1. PC encendida, engine + túnel corriendo  
2. Abrí `/admin/video` en producción  
3. Generá un reel — debería ir a tu PC (craft completo, mucho más rápido que el VPS 1 GB)

## Rutina diaria

1. `npm run video:engine:desktop`  
2. `npm run carousel:engine:start` (necesario para `/admin/carousel`)  
3. `npm run video:tunnel` (o el túnel nombrado) — **un solo túnel** sirve video y carousel  
4. Si usás **quick tunnel**: cada vez que reiniciás, actualizá `VIDEO_ENGINE_URL` en Vercel (sin `/` final). Con túnel nombrado estable no hace falta.

### Checklist rápido

| Check | Qué esperar |
|-------|-------------|
| `GET ${VIDEO_ENGINE_URL}/health` | `ok` (video-engine) |
| `GET ${VIDEO_ENGINE_URL}/carousel/health` | `{ ok, service: "carousel-engine", renderer, chromiumOk, storageRoot }` |
| `renderer` | `"playwright"` en producción local; `"fake"` = PNG placeholder |
| Admin `/admin/carousel` | Sin banner offline; si hay banner “fake”, instalá Chromium |

Si `renderer` es `"fake"` o `chromiumOk: false`:

```bash
cd apps/carousel-engine
npm run playwright:install
# reiniciá carousel-engine
```

### Vars carousel (PC local)

| Variable | Default / notas |
|----------|-----------------|
| `CAROUSEL_ENGINE_PORT` | `4120` |
| `CAROUSEL_ENGINE_API_KEY` | Opcional; si falta, hereda `VIDEO_ENGINE_API_KEY` |
| `CAROUSEL_STORAGE_ROOT` | `data/carousel-engine` |
| `CAROUSEL_USE_FAKE_RENDERER` | `1` / `true` fuerza placeholders (tests) |
| `CAROUSEL_ENGINE_URL` | Solo Next local si querés bypassear el proxy (`http://127.0.0.1:4120`) |
| `CAROUSEL_ENGINE_UPSTREAM` | Solo video-engine: URL del carousel detrás del proxy |

En **Vercel** no hace falta vars nuevas: el admin usa `VIDEO_ENGINE_URL` + `VIDEO_ENGINE_API_KEY` y el path `/carousel/*`.

El video-engine expone `/carousel/*` como proxy a `http://127.0.0.1:4120`. En local, Next puede hablar directo a `:4120`.

Flujo carousel: elegí crónica en `/admin/carousel` → Crear desde crónica → editar texto/focus → re-render slide → Export ZIP → borrar job.

Evitá hibernar Windows a mitad de un render.

## Firewall de Windows

Solo necesitás localhost: el túnel sale hacia Cloudflare. No hace falta abrir el puerto 4100 en el router.

## Troubleshooting

| Síntoma | Qué chequear |
|---------|----------------|
| `501` / engine offline en admin | Túnel caído o `VIDEO_ENGINE_URL` vieja |
| `401` del engine | `VIDEO_ENGINE_API_KEY` distinta entre Vercel y `.env` |
| Carousel `502` / unreachable | Falta `npm run carousel:engine:start` en la PC |
| Banner “túnel inaccesible” | Quick tunnel caído o `VIDEO_ENGINE_URL` desactualizada |
| Banner “carousel no responde” (video OK) | Solo falta el proceso en `:4120` |
| Banner “renderer fake” / PNG placeholder | Falta Chromium: `npm run playwright:install` en `apps/carousel-engine` y reiniciar |
| Carousel `401` | Carousel no heredó la key: revisá `apps/video-engine/.env` |
| `ffmpeg failed` | `ffmpeg -version` en PATH; reinstalar Gyan.FFmpeg |
| Job `running` eterno tras cerrar la PC | Al reiniciar el engine, hydrate marca huérfanos como `failed` |
| OOM | Subí `NODE_OPTIONS=--max-old-space-size=4096` |

## Apagar el VPS video-engine (opcional)

```bash
ssh root@64.23.232.142 'cd /opt/historia-argentina && docker compose -f apps/video-engine/docker-compose.yml stop'
```
