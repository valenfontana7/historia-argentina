import { ImageResponse } from "next/og";
import { cronicas, obtenerCronica } from "@/content/cronicas/registro";
import { sitio } from "@/lib/site.config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return cronicas.map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cronica = obtenerCronica(slug);

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
          background: "linear-gradient(180deg, #05070d 0%, #0a1020 55%, #16202f 100%)",
          color: "#ece4d4",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 10,
              textTransform: "uppercase",
              color: "#c6a15b",
            }}
          >
            {cronica?.kicker ?? "Crónicas"}
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#6e6455", letterSpacing: 4 }}>
            {sitio.nombre}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1.05,
              maxWidth: 1000,
            }}
          >
            {cronica?.titulo ?? "Crónicas"}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 30,
              color: "#a59a86",
              maxWidth: 950,
            }}
          >
            {`${cronica?.periodo ?? ""} · Una historia para vivir con el scroll`}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", width: 64, height: 2, background: "#c6a15b" }} />
          <div style={{ display: "flex", fontSize: 24, color: "#a59a86" }}>
            {`Visita: ${cronica?.duracion ?? ""}`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
