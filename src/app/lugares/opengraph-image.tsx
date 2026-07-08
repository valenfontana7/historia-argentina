import { ImageResponse } from "next/og";
import { sitio } from "@/lib/site.config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "linear-gradient(160deg, #05070d 0%, #0b0e18 55%, #12180f 100%)",
          color: "#ece4d4",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: "#c6a15b",
          }}
        >
          Geografía del relato
        </div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 72, fontWeight: 700 }}>
          Lugares históricos
        </div>
        <div style={{ display: "flex", marginTop: 20, fontSize: 28, color: "#a59a86" }}>
          {sitio.nombre} · Mapa de la historia argentina
        </div>
      </div>
    ),
    size,
  );
}
