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
2. `npm run video:tunnel` (o el túnel nombrado)  
3. Si usás quick tunnel: actualizá `VIDEO_ENGINE_URL` en Vercel cuando cambie la URL (o pasá al túnel estable)

Evitá hibernar Windows a mitad de un render.

## Firewall de Windows

Solo necesitás localhost: el túnel sale hacia Cloudflare. No hace falta abrir el puerto 4100 en el router.

## Troubleshooting

| Síntoma | Qué chequear |
|---------|----------------|
| `501` / engine offline en admin | Túnel caído o `VIDEO_ENGINE_URL` vieja |
| `401` del engine | `VIDEO_ENGINE_API_KEY` distinta entre Vercel y `.env` |
| `ffmpeg failed` | `ffmpeg -version` en PATH; reinstalar Gyan.FFmpeg |
| Job `running` eterno tras cerrar la PC | Al reiniciar el engine, hydrate marca huérfanos como `failed` |
| OOM | Subí `NODE_OPTIONS=--max-old-space-size=4096` |

## Apagar el VPS video-engine (opcional)

```bash
ssh root@64.23.232.142 'cd /opt/historia-argentina && docker compose -f apps/video-engine/docker-compose.yml stop'
```
