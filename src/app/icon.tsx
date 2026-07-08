import { ImageResponse } from "next/og";
import { MarcaArgentIcono } from "@/lib/seo/icono-marca";

export const size = { width: 48, height: 48 };
export const contentType = "image/png";

/** Favicon 48×48 — tamaño mínimo recomendado por Google Search. */
export default function Icon() {
  return new ImageResponse(<MarcaArgentIcono tamano={48} />, size);
}
