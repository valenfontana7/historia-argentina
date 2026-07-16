# Video-engine en VPS (1 GB RAM)

Worker de reels fuera de Vercel: Docker + FFmpeg + volumen local.

## Requisitos de la VPS

- **1 GB RAM** (mínimo; swap de 1 GB muy recomendado)
- **~10 GB disco** (limpiar jobs viejos)
- Docker + Docker Compose
- Puerto **4100** abierto (o reverse proxy TLS → 4100)
- Claves OpenAI y `VIDEO_ENGINE_API_KEY`

## Swap (recomendado)

```bash
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## Deploy

En la VPS (`64.23.232.142` / root):

```bash
# Ya desplegado en /opt/historia-argentina
cd /opt/historia-argentina
cp apps/video-engine/.env.example apps/video-engine/.env   # si falta
# Editá .env: VIDEO_ENGINE_API_KEY, OPENAI_API_KEY, etc.

docker compose -f apps/video-engine/docker-compose.yml up -d --build
curl -s http://127.0.0.1:4100/health
curl -s http://64.23.232.142:4100/health
```

Firewall: SSH + `4100/tcp` (UFW). Swap 1G recomendado.

## Variables en Vercel (solo bridge; OpenAI vive en el VPS)

| Variable | Valor |
|----------|--------|
| `VIDEO_ENGINE_URL` | `http://64.23.232.142:4100` (o HTTPS si agregás Caddy) |
| `VIDEO_ENGINE_API_KEY` | Misma key que en el `.env` del engine |

No hace falta `OPENAI_*` en Vercel: la generación corre solo en el worker.
## Retención de disco

Cron semanal (borra jobs de más de 14 días):

```bash
# Si usás volumen Docker nombrado, el path real está bajo /var/lib/docker/volumes/...
# Con bind mount ./data:/data:
find /ruta/al/data/jobs -mindepth 1 -maxdepth 1 -mtime +14 -exec rm -rf {} +
```

O en compose, montá `./data:/data` y corrê el `find` sobre `./data/jobs`.

## Memoria

- `NODE_OPTIONS=--max-old-space-size=512`
- FFmpeg con `-threads 1`, `-loglevel error` y stderr acotado (evita OOM por progress spam)
- **`VIDEO_RENDER_FAST=1` (default en compose):** sin `gblur`/`zoompan`/`noise` — en 1 GB el craft completo puede llevar ~15 min **por escena**
- **Un solo job** a la vez (HTTP 409 si hay otro en cola/running)
- Encode por defecto en fast: `ultrafast` + CRF 23 (override con `VIDEO_X264_PRESET` / `VIDEO_X264_CRF`). Craft completo: `VIDEO_RENDER_FAST=0`

## Smoke

```bash
curl -s http://127.0.0.1:4100/health
# Con API key: POST /jobs con exhibition de prueba (o Generar desde /admin/video en prod)
```
