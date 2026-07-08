import { ImageResponse } from "next/og";
import { hoyEnArgentina } from "@/lib/fechas";
import { efemerideParaFecha } from "@/data/efemerides";
import { sitio } from "@/lib/site.config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const { mes, dia } = hoyEnArgentina();
  const efemeride = efemerideParaFecha(mes, dia);

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
          background: "linear-gradient(160deg, #0c0a08 0%, #1a2838 130%)",
          color: "#ece4d4",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 10, textTransform: "uppercase", color: "#c6a15b" }}>
          Quiz diario
        </div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>
          ¿Sabés qué pasó un {efemeride.fecha}?
        </div>
        <div style={{ display: "flex", marginTop: 20, fontSize: 28, color: "#a59a86" }}>
          {sitio.nombre} · Probá el quiz de hoy
        </div>
      </div>
    ),
    size,
  );
}
