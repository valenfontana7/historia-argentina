import { existsSync } from "node:fs";
import path from "node:path";
import { config as loadDotenv } from "dotenv";

/**
 * Carga env del monorepo y del engine.
 * Orden: raíz del repo (base) → apps/video-engine/.env (override) → cwd.
 */
export function loadRepoEnv(fromDir = __dirname): void {
  const repoRoot = path.resolve(fromDir, "../../../../.env");
  const engineEnv = path.resolve(fromDir, "../../.env");
  const cwdEnv = path.resolve(process.cwd(), ".env");
  const cwdEngineEnv = path.resolve(process.cwd(), "apps/video-engine/.env");

  if (existsSync(repoRoot)) {
    loadDotenv({ path: repoRoot, override: false });
  }
  if (existsSync(cwdEnv) && cwdEnv !== repoRoot) {
    loadDotenv({ path: cwdEnv, override: false });
  }
  // Claves de video del escritorio / VPS ganan sobre la raíz.
  if (existsSync(engineEnv)) {
    loadDotenv({ path: engineEnv, override: true });
  }
  if (existsSync(cwdEngineEnv) && cwdEngineEnv !== engineEnv) {
    loadDotenv({ path: cwdEngineEnv, override: true });
  }
}
