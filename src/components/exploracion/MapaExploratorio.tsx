"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  BaseMapaConoSur,
  BrújulaDecorativa,
  MarcadorCiudad,
} from "@/components/scrolly/MapaConoSurIlustrado";
import type { Epoca } from "@/components/ui/Retrato";
import { nombresEpocas } from "@/data/personajes";
import type { Lugar } from "@/data/lugares";
import { posicionLugarEnMapa, etiquetaEnMapa, nombreEnMapa } from "@/lib/cono-sur-ilustrado";

const PREVIEW_SLUGS = [
  "buenos-aires",
  "tucuman",
  "rosario",
  "cordoba",
  "yapeyu",
  "san-lorenzo",
  "caseros",
] as const;

type Props = {
  lugares: Lugar[];
  completo?: boolean;
};

const EPOCAS: Epoca[] = [
  "colonia",
  "independencia",
  "organizacion",
  "moderna",
  "contemporanea",
];

type PuntoMapa = {
  lugar: Lugar;
  x: number;
  y: number;
  etiqueta: "izq" | "der" | "arriba" | "abajo";
  etiquetaX?: number;
  etiquetaY?: number;
  nombreMapa: string;
  bloqueado: boolean;
};

export function MapaExploratorio({ lugares, completo = false }: Props) {
  const router = useRouter();
  const [periodoFiltro, setPeriodoFiltro] = useState<Epoca | "">("");
  const [hover, setHover] = useState<string | null>(null);

  const conCoords = useMemo(
    () => lugares.filter((l) => l.lat !== undefined && l.lon !== undefined),
    [lugares],
  );

  const visibles = useMemo(() => {
    let lista = conCoords;
    if (!completo) {
      lista = lista.filter((l) =>
        (PREVIEW_SLUGS as readonly string[]).includes(l.slug),
      );
    }
    if (periodoFiltro) {
      lista = lista.filter((l) => l.periodo === periodoFiltro);
    }
    return lista;
  }, [conCoords, completo, periodoFiltro]);

  const bloqueados = useMemo(() => {
    if (completo) return [];
    return conCoords.filter(
      (l) => !(PREVIEW_SLUGS as readonly string[]).includes(l.slug),
    );
  }, [conCoords, completo]);

  const puntos = useMemo(() => {
    const out: PuntoMapa[] = [];
    for (const l of [...visibles, ...bloqueados]) {
      const pos = posicionLugarEnMapa(l.slug, l.lat, l.lon);
      if (!pos) continue;
      out.push({
        lugar: l,
        x: pos.x,
        y: pos.y,
        etiqueta: etiquetaEnMapa(pos),
        etiquetaX: pos.etiquetaX,
        etiquetaY: pos.etiquetaY,
        nombreMapa: nombreEnMapa(l.slug, l.nombre),
        bloqueado: bloqueados.includes(l),
      });
    }
    return out;
  }, [visibles, bloqueados]);

  const rutas = useMemo(() => {
    if (!completo || visibles.length < 2) return [];
    const lineas: { x1: number; y1: number; x2: number; y2: number }[] = [];
    const activos = puntos.filter((p) => !p.bloqueado);
    for (const origen of activos.slice(0, 5)) {
      for (const slug of origen.lugar.personajes.slice(0, 1)) {
        const destino = activos.find(
          (p) =>
            p.lugar.slug !== origen.lugar.slug &&
            p.lugar.personajes.includes(slug),
        );
        if (!destino) continue;
        if (lineas.length < 3) {
          lineas.push({
            x1: origen.x,
            y1: origen.y,
            x2: destino.x,
            y2: destino.y,
          });
        }
      }
    }
    return lineas;
  }, [completo, visibles.length, puntos]);

  return (
    <div className="relative overflow-hidden rounded-sm border border-linea bg-[#060910]">
      {completo && (
        <div className="flex flex-wrap gap-2 border-b border-linea bg-fondo-2 p-4">
          <button
            type="button"
            onClick={() => setPeriodoFiltro("")}
            className={`rounded-full px-4 py-1.5 text-xs transition-colors ${
              periodoFiltro === ""
                ? "border border-oro/50 bg-oro/10 text-oro-claro"
                : "border border-linea text-tinta-suave hover:border-oro/30"
            }`}
          >
            Todos
          </button>
          {EPOCAS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setPeriodoFiltro(e)}
              className={`rounded-full px-4 py-1.5 text-xs transition-colors ${
                periodoFiltro === e
                  ? "border border-oro/50 bg-oro/10 text-oro-claro"
                  : "border border-linea text-tinta-suave hover:border-oro/30"
              }`}
            >
              {nombresEpocas[e]}
            </button>
          ))}
        </div>
      )}

      <div className="aspect-[720/440] w-full">
        <BaseMapaConoSur>
          <BrújulaDecorativa />
          {rutas.map((r, i) => (
            <line
              key={i}
              x1={r.x1}
              y1={r.y1}
              x2={r.x2}
              y2={r.y2}
              stroke="#c6a15b"
              strokeOpacity={0.25}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          ))}
          {puntos.map((p) => {
            const activo = hover === p.lugar.slug;
            const clickable = completo && !p.bloqueado;
            const color = p.bloqueado ? "#5a6478" : "#c6a15b";
            const mostrarEtiqueta = activo || (!completo && !p.bloqueado);

            return (
              <g
                key={p.lugar.slug}
                opacity={p.bloqueado ? 0.35 : 1}
                style={{ cursor: clickable ? "pointer" : "default" }}
                onMouseEnter={() => setHover(p.lugar.slug)}
                onMouseLeave={() => setHover(null)}
                onClick={() => {
                  if (clickable) router.push(`/lugares/${p.lugar.slug}`);
                }}
                onKeyDown={(e) => {
                  if (clickable && (e.key === "Enter" || e.key === " ")) {
                    router.push(`/lugares/${p.lugar.slug}`);
                  }
                }}
                role={clickable ? "link" : undefined}
                tabIndex={clickable ? 0 : undefined}
              >
                {mostrarEtiqueta ? (
                  <MarcadorCiudad
                    x={p.x}
                    y={p.y}
                    nombre={p.nombreMapa}
                    color={color}
                    etiqueta={p.etiqueta}
                    etiquetaX={p.etiquetaX}
                    etiquetaY={p.etiquetaY}
                  />
                ) : (
                  <>
                    <circle cx={p.x} cy={p.y} r={10} fill={color} opacity={0.08} />
                    <circle cx={p.x} cy={p.y} r={5} fill="#0a0d14" stroke={color} strokeWidth={1.5} />
                    <circle cx={p.x} cy={p.y} r={2} fill={color} />
                  </>
                )}
                <title>{p.lugar.nombre}</title>
              </g>
            );
          })}
        </BaseMapaConoSur>
      </div>

      <ul className="grid gap-2 border-t border-linea bg-fondo-2 p-4 sm:grid-cols-2">
        {visibles.map((l) => (
          <li key={l.slug}>
            <Link
              href={`/lugares/${l.slug}`}
              className="block text-sm transition-colors hover:text-oro"
            >
              <span className="font-medium text-oro-claro">{l.nombre}</span>
              <span className="ml-2 text-tinta-tenue">{l.region}</span>
            </Link>
          </li>
        ))}
      </ul>

      {!completo && bloqueados.length > 0 && (
        <p className="border-t border-linea bg-fondo-3 px-4 py-3 text-center text-xs text-tinta-tenue">
          +{bloqueados.length} lugares más en el mapa completo →{" "}
          <Link href="/membresia" className="text-oro-claro hover:text-oro">
            Hacete mecenas
          </Link>
        </p>
      )}
    </div>
  );
}
