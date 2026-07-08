import { ImageResponse } from "next/og";
import { categorias } from "@/data/categorias";
import { sitio } from "@/lib/site.config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return categorias.map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categoria = categorias.find((c) => c.slug === slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(160deg, #0c0a08 0%, #2a1810 130%)",
          color: "#ece4d4",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 10, textTransform: "uppercase", color: "#c6a15b" }}>
            Categoría
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#6e6455" }}>{sitio.nombre}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", marginTop: 14, fontSize: 80, fontWeight: 700, lineHeight: 1.02 }}>
            {categoria?.nombre ?? "Categoría"}
          </div>
          <div style={{ display: "flex", marginTop: 22, fontSize: 28, color: "#a59a86", maxWidth: 900 }}>
            {categoria?.descripcion ?? ""}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
