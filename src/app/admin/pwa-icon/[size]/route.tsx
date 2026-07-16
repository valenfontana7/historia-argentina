import { ImageResponse } from "next/og";
import { MarcaArgentIcono } from "@/lib/seo/icono-marca";

const TAMANOS_PERMITIDOS = new Set([192, 512]);

type Params = {
  params: Promise<{ size: string }>;
};

/** Iconos PNG de marca para el manifest de la PWA admin. */
export async function GET(_request: Request, { params }: Params) {
  const { size: sizeRaw } = await params;
  const size = Number(sizeRaw);

  if (!Number.isInteger(size) || !TAMANOS_PERMITIDOS.has(size)) {
    return new Response("Not Found", { status: 404 });
  }

  return new ImageResponse(<MarcaArgentIcono tamano={size} />, {
    width: size,
    height: size,
  });
}
