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

En la VPS, cloná el repo (o copiá `apps/video-engine` + `packages/video-contracts` + lockfile) y:

```bash
cd historia-argentina
cp apps/video-engine/.env.example apps/video-engine/.env
# Editá .env: VIDEO_ENGINE_API_KEY, OPENAI_API_KEY, etc.

docker compose -f apps/video-engine/docker-compose.yml up -d --build
curl -s http://127.0.0.1:4100/health
```

Firewall (ejemplo UFW):

```bash
sudo ufw allow OpenSSH
sudo ufw allow 4100/tcp   # o solo 80/443 si usás Caddy/nginx
sudo ufw enable
```

TLS opcional con Caddy reverse_proxy a `localhost:4100`.

## Variables en Vercel

| Variable | Valor |
|----------|--------|
| `VIDEO_ENGINE_URL` | `https://tu-vps.ejemplo.com` (sin barra final) |
| `VIDEO_ENGINE_API_KEY` | Misma key que en el `.env` del engine |

El admin en producción hace `POST /api/admin/reels/generate` → Next arma Exhibition → `POST {VIDEO_ENGINE_URL}/jobs`.

## Retención de disco

Cron semanal (borra jobs de más de 14 días):

```bash
# Si usás volumen Docker nombrado, el path real está bajo /var/lib/docker/volumes/...
# Con bind mount ./data:/data:
find /ruta/al/data/jobs -mindepth 1 -maxdepth 1 -mtime +14 -exec rm -rf {} +
```

O en compose, montá `./data:/data` y corrê el `find` sobre `./data/jobs`.

## Memoria

- `NODE_OPTIONS=--max-old-space-size=384`
- FFmpeg con `-threads 1`
- **Un solo job** a la vez (HTTP 409 si hay otro en cola/running)

## Smoke

```bash
curl -s http://127.0.0.1:4100/health
# Con API key: POST /jobs con exhibition de prueba (o Generar desde /admin/video en prod)
```
