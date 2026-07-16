import { ImageResponse } from "next/og";
import { periodos } from "@/data/periodos";
import { sitio } from "@/lib/site.config";
import { OG_KICKER_SALA } from "@/lib/copy";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return periodos.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const periodo = periodos.find((p) => p.slug === slug);

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
          background: "linear-gradient(160deg, #0c0a08 0%, #1e3a52 130%)",
          color: "#ece4d4",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 10, textTransform: "uppercase", color: "#c6a15b" }}>
            {OG_KICKER_SALA}
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#6e6455" }}>{sitio.nombre}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 34, color: "#c6a15b" }}>
            {periodo?.anioInicio} a {periodo?.anioFin ?? "hoy"}
          </div>
          <div style={{ display: "flex", marginTop: 14, fontSize: 80, fontWeight: 700, lineHeight: 1.02 }}>
            {periodo?.nombre ?? "Sala histórica"}
          </div>
          <div style={{ display: "flex", marginTop: 22, fontSize: 28, color: "#a59a86", maxWidth: 900 }}>
            {periodo?.descripcion ?? ""}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
