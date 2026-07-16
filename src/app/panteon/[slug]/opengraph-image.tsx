import { ImageResponse } from "next/og";
import { personajes, obtenerPersonaje } from "@/data/personajes";
import { sitio } from "@/lib/site.config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return personajes.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const personaje = obtenerPersonaje(slug);
  const anios = personaje
    ? `${personaje.nacimiento.anio} a ${personaje.muerte?.anio ?? "presente"}`
    : "";

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
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 10,
              textTransform: "uppercase",
              color: "#c6a15b",
            }}
          >
            {"El Panteón"}
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#6e6455", letterSpacing: 4 }}>
            {sitio.nombre}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 34, color: "#c6a15b", fontStyle: "italic" }}>
            {personaje?.titulo ?? ""}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 14,
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1.02,
            }}
          >
            {personaje?.nombre ?? "El Panteón"}
          </div>
          <div style={{ display: "flex", marginTop: 22, fontSize: 30, color: "#a59a86" }}>
            {`${anios} · ${personaje?.rol ?? ""}`}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", width: 64, height: 2, background: "#c6a15b" }} />
          <div style={{ display: "flex", fontSize: 24, color: "#a59a86" }}>
            {"Biografía, batallas, aliados y enemigos"}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
