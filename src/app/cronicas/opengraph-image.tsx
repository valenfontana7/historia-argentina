import { ImageResponse } from "next/og";
import { cronicas } from "@/content/cronicas/registro";
import { sitio } from "@/lib/site.config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const destacada = cronicas[0];

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
          background: "linear-gradient(160deg, #05070d 0%, #0a1020 55%, #0c0a08 100%)",
          color: "#ece4d4",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 10, textTransform: "uppercase", color: "#c6a15b" }}>
            Crónicas
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#6e6455" }}>{sitio.nombre}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 700, lineHeight: 1.05 }}>
            Historias que se viven con el scroll
          </div>
          <div style={{ display: "flex", marginTop: 22, fontSize: 28, color: "#a59a86", maxWidth: 900 }}>
            Mapas animados, cifras vivas y relatos cinematográficos de la historia argentina.
          </div>
          {destacada && (
            <div style={{ display: "flex", marginTop: 18, fontSize: 22, color: "#c6a15b" }}>
              {destacada.titulo}
            </div>
          )}
        </div>
      </div>
    ),
    size,
  );
}
