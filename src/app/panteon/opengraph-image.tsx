import { ImageResponse } from "next/og";
import { personajes } from "@/data/personajes";
import { sitio } from "@/lib/site.config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const muestra = personajes.slice(0, 4).map((p) => p.nombre).join(" · ");

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
            El Panteón
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#6e6455" }}>{sitio.nombre}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 80, fontWeight: 700, lineHeight: 1.02 }}>
            La historia es gente
          </div>
          <div style={{ display: "flex", marginTop: 22, fontSize: 28, color: "#a59a86", maxWidth: 900 }}>
            {personajes.length} personajes del relato nacional — fichas interactivas con biografías, aliados y enemigos.
          </div>
          <div style={{ display: "flex", marginTop: 18, fontSize: 22, color: "#c6a15b" }}>{muestra}</div>
        </div>
      </div>
    ),
    size,
  );
}
