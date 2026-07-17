import { createHash } from "node:crypto";
import type { SlideIr } from "@museoargent/carousel-contracts";

export function hashSlideIr(ir: SlideIr): string {
  const json = JSON.stringify(ir);
  return createHash("sha256").update(json).digest("hex").slice(0, 16);
}
