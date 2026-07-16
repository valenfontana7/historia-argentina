import { ImageResponse } from "next/og";
import { sitio } from "@/lib/site.config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** OG por defecto del sitio. */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #05070d 0%, #0b0e18 55%, #0c0a08 100%)",
          color: "#ece4d4",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 12,
            textTransform: "uppercase",
            color: "#c6a15b",
          }}
        >
          {sitio.lema}
        </div>
        <div style={{ display: "flex", fontSize: 130, fontWeight: 700, marginTop: 24 }}>
          {sitio.nombre}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 32,
            color: "#a59a86",
            maxWidth: 900,
            textAlign: "center",
          }}
        >
          {"Exhibiciones, retratos y la pieza del día."}
        </div>
      </div>
    ),
    size,
  );
}
