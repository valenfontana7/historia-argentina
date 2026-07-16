# Build desde la raíz del monorepo:
#   docker build -f apps/video-engine/Dockerfile -t museoargent-video-engine .
FROM node:22-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends ffmpeg ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/video-contracts/package.json ./packages/video-contracts/
COPY apps/video-engine/package.json ./apps/video-engine/

# Sin postinstall de la app Next (prisma root no está en esta imagen).
RUN npm ci -w @museoargent/video-contracts -w @museoargent/video-engine --ignore-scripts

COPY packages/video-contracts ./packages/video-contracts
COPY apps/video-engine ./apps/video-engine

RUN npm run prisma:generate -w @museoargent/video-engine \
  && npm run build -w @museoargent/video-contracts \
  && npm run build -w @museoargent/video-engine

ENV NODE_ENV=production
ENV VIDEO_ENGINE_PORT=4100
ENV VIDEO_STORAGE_ROOT=/data
ENV NODE_OPTIONS=--max-old-space-size=384
ENV FFMPEG_PATH=ffmpeg
ENV FFPROBE_PATH=ffprobe

VOLUME ["/data"]
EXPOSE 4100

WORKDIR /app/apps/video-engine
CMD ["node", "dist/main.js"]
