import { existsSync } from "node:fs";
import { config as loadDotenv } from "dotenv";
import path from "node:path";

/**
 * Carga env del monorepo y del engine.
 * Orden: raíz → video-engine (API key media compartida) → carousel-engine (override).
 */
export function loadRepoEnv(fromDir = __dirname): void {
  const repoRootEnv = path.resolve(fromDir, "../../../../.env");
  const carouselEnv = path.resolve(fromDir, "../../.env");
  const videoEnv = path.resolve(fromDir, "../../../video-engine/.env");
  const cwdEnv = path.resolve(process.cwd(), ".env");
  const cwdCarouselEnv = path.resolve(
    process.cwd(),
    "apps/carousel-engine/.env",
  );
  const cwdVideoEnv = path.resolve(process.cwd(), "apps/video-engine/.env");

  if (existsSync(repoRootEnv)) {
    loadDotenv({ path: repoRootEnv, override: false });
  }
  if (existsSync(cwdEnv) && cwdEnv !== repoRootEnv) {
    loadDotenv({ path: cwdEnv, override: false });
  }
  if (existsSync(videoEnv)) {
    loadDotenv({ path: videoEnv, override: true });
  }
  if (existsSync(cwdVideoEnv) && cwdVideoEnv !== videoEnv) {
    loadDotenv({ path: cwdVideoEnv, override: true });
  }
  if (existsSync(carouselEnv)) {
    loadDotenv({ path: carouselEnv, override: true });
  }
  if (existsSync(cwdCarouselEnv) && cwdCarouselEnv !== carouselEnv) {
    loadDotenv({ path: cwdCarouselEnv, override: true });
  }
}
