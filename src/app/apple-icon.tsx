import { ImageResponse } from "next/og";
import { MarcaArgentIcono } from "@/lib/seo/icono-marca";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon y PWA. */
export default function AppleIcon() {
  return new ImageResponse(<MarcaArgentIcono tamano={180} radio={36} />, size);
}
