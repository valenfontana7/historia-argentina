import { ImageResponse } from "next/og";
import { efemerides, obtenerEfemeride } from "@/data/efemerides";
import { sitio } from "@/lib/site.config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return efemerides.map((e) => ({ dia: e.dia }));
}

/** Card compartible de la efeméride: la pieza que viaja por WhatsApp e Instagram. */
export default async function Image({ params }: { params: Promise<{ dia: string }> }) {
  const { dia } = await params;
  const efemeride = obtenerEfemeride(dia);

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
          background: "linear-gradient(160deg, #0c0a08 0%, #141109 55%, #1d1810 100%)",
          color: "#ece4d4",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 10,
              textTransform: "uppercase",
              color: "#c6a15b",
            }}
          >
            {"Un día como hoy"}
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#6e6455" }}>
            {sitio.nombre}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 28 }}>
            <div
              style={{
                display: "flex",
                fontSize: 150,
                fontWeight: 700,
                color: "#c6a15b",
                lineHeight: 1,
              }}
            >
              {String(efemeride?.anio ?? "")}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 30,
                textTransform: "uppercase",
                letterSpacing: 6,
                color: "#a59a86",
              }}
            >
              {efemeride?.fecha ?? ""}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 30,
              fontSize: 54,
              fontWeight: 600,
              lineHeight: 1.15,
              maxWidth: 1000,
            }}
          >
            {efemeride?.titulo ?? "La historia argentina, cada día"}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", width: 64, height: 2, background: "#c6a15b" }} />
          <div style={{ display: "flex", fontSize: 24, color: "#a59a86" }}>
            {"La historia del día, contada en 90 segundos"}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
