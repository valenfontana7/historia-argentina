# Arranque guiado del video-engine en Windows (sin Docker).
# Uso (desde la raíz del repo, PowerShell):
#   powershell -ExecutionPolicy Bypass -File scripts/video-engine-desktop.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host "== Video engine desktop ==" -ForegroundColor Cyan

function Test-Cmd($Name) {
  return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

if (-not (Test-Cmd "node")) {
  Write-Host "Falta Node.js. Instalalo desde https://nodejs.org" -ForegroundColor Red
  exit 1
}

if (-not (Test-Cmd "ffmpeg")) {
  Write-Host "Falta ffmpeg en PATH." -ForegroundColor Yellow
  Write-Host "  winget install Gyan.FFmpeg"
  Write-Host "Despues cerra y abri la terminal."
  exit 1
}

$EngineEnv = Join-Path $Root "apps\video-engine\.env"
$Example = Join-Path $Root "apps\video-engine\.env.desktop.example"
if (-not (Test-Path $EngineEnv)) {
  if (Test-Path $Example) {
    Copy-Item $Example $EngineEnv
    Write-Host "Cree apps/video-engine/.env desde .env.desktop.example" -ForegroundColor Yellow
    Write-Host "Edita OPENAI_API_KEY y VIDEO_ENGINE_API_KEY y volve a correr este script."
    exit 1
  }
  Write-Host "Falta apps/video-engine/.env" -ForegroundColor Red
  exit 1
}

$Storage = Join-Path $Root "data\video-engine"
New-Item -ItemType Directory -Force -Path $Storage | Out-Null

Write-Host "Build contracts + prisma..."
npm run video:contracts:build
npm run video:prisma:generate

Write-Host ""
Write-Host "Engine en http://127.0.0.1:4110" -ForegroundColor Green
Write-Host "En otra terminal: npm run video:tunnel"
Write-Host "Docs: docs/architecture/video-engine-desktop.md"
Write-Host ""

npm run video:engine:desktop
