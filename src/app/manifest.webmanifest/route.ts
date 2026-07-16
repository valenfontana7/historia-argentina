import { NextResponse } from "next/server";
import { adminPwaManifest } from "@/lib/admin-pwa-manifest";

/**
 * Sirve el manifest sin usar la convención `app/manifest.ts`,
 * que Next inyectaría en todas las páginas.
 */
export function GET() {
  return NextResponse.json(adminPwaManifest(), {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
