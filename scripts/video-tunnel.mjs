#!/usr/bin/env node
/**
 * Arranca cloudflared hacia el video-engine local.
 * Busca el binario en PATH o en la ruta típica de Windows.
 */
import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function readPort() {
  const fromEnv = process.env.VIDEO_ENGINE_PORT?.trim();
  if (fromEnv) return fromEnv;
  for (const rel of ["apps/video-engine/.env", ".env"]) {
    const file = path.join(root, rel);
    if (!existsSync(file)) continue;
    const m = /^VIDEO_ENGINE_PORT=(.+)$/m.exec(readFileSync(file, "utf8"));
    if (m?.[1]?.trim()) return m[1].trim().replace(/^["']|["']$/g, "");
  }
  // 4100 suele estar excluido por Hyper-V en Windows.
  return "4110";
}

function isOnPath(cmd) {
  const which = process.platform === "win32" ? "where" : "which";
  const r = spawnSync(which, [cmd], { encoding: "utf8", shell: true });
  return r.status === 0 && Boolean(r.stdout?.trim());
}

const pathCandidates = [
  process.env.CLOUDFLARED_PATH,
  "C:\\Program Files (x86)\\cloudflared\\cloudflared.exe",
  "C:\\Program Files\\cloudflared\\cloudflared.exe",
].filter(Boolean);

function resolveBin() {
  for (const c of pathCandidates) {
    if (existsSync(c)) return c;
  }
  if (isOnPath("cloudflared")) return "cloudflared";
  return null;
}

const bin = resolveBin();
if (!bin) {
  console.error(
    "No encontré cloudflared. Instalalo con:\n  winget install Cloudflare.cloudflared\nO definí CLOUDFLARED_PATH.",
  );
  process.exit(1);
}

const port = readPort();
const target = `http://127.0.0.1:${port}`;
console.log(`Usando: ${bin}`);
console.log(`Túnel → ${target}`);

const child = spawn(bin, ["tunnel", "--url", target], {
  stdio: "inherit",
  // No shell: evita que Windows busque "cloudflared" en PATH cuando ya tenemos .exe
  windowsHide: true,
});
child.on("error", (err) => {
  console.error(err.message);
  process.exit(1);
});
child.on("exit", (code) => process.exit(code ?? 1));
