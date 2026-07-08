import { ImageResponse } from "next/og";
import { MarcaArgentIcono } from "@/lib/seo/icono-marca";

export const size = { width: 96, height: 96 };
export const contentType = "image/png";

/** Favicon 96×96 — Google recomienda >48px (cuadrado, estable, crawlable). */
export default function Icon() {
  return new ImageResponse(<MarcaArgentIcono tamano={96} />, size);
}
