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
          background: "linear-gradient(160deg, #0c0a08 0%, #1a1410 130%)",
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
          Eras
        </div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 72, fontWeight: 700 }}>
          Períodos de la historia
        </div>
        <div style={{ display: "flex", marginTop: 20, fontSize: 28, color: "#a59a86" }}>
          {sitio.nombre} · De la colonia a la democracia
        </div>
      </div>
    ),
    size,
  );
}
