import { existsSync } from "node:fs";
import path from "node:path";
import { config as loadDotenv } from "dotenv";

/** Carga `.env` de la raíz del monorepo (idempotente). */
export function loadRepoEnv(fromDir = __dirname): void {
  const candidates = [
    path.resolve(fromDir, "../../../../.env"), // apps/video-engine/src/application → repo
    path.resolve(fromDir, "../../../.env"),
    path.resolve(process.cwd(), ".env"),
  ];
  for (const file of candidates) {
    if (existsSync(file)) {
      loadDotenv({ path: file, override: false });
      return;
    }
  }
}
