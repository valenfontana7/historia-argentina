import { NextResponse } from "next/server";
import { puedeVerContenidoMecenas } from "@/lib/auth";

export const runtime = "nodejs";

/** Estado de sesión mecenas para el shell del cliente (sin dinamizar el layout). */
export async function GET() {
  try {
    const mecenas = await puedeVerContenidoMecenas();
    return NextResponse.json(
      { mecenas },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch {
    return NextResponse.json({ mecenas: false });
  }
}
