import Link from "next/link";
import { FlechaCta } from "@/components/ui/FlechaCta";
import {
  BaseMapaConoSur,
  BrújulaDecorativa,
  MarcadorCiudad,
} from "@/components/scrolly/MapaConoSurIlustrado";
import { lugares } from "@/data/lugares";
import {
  posicionLugarEnMapa,
  etiquetaEnMapa,
  nombreEnMapa,
} from "@/lib/cono-sur-ilustrado";

const PUNTOS = lugares
  .map((l) => {
    if (l.lat === undefined || l.lon === undefined) return null;
    const pos = posicionLugarEnMapa(l.slug, l.lat, l.lon);
    if (!pos) return null;
    return {
      lugar: l,
      x: pos.x,
      y: pos.y,
      etiqueta: etiquetaEnMapa(pos),
      etiquetaX: pos.etiquetaX,
      etiquetaY: pos.etiquetaY,
      nombreMapa: nombreEnMapa(l.slug, l.nombre),
    };
  })
  .filter((p): p is NonNullable<typeof p> => p !== null);

type Props = {
  interactivo?: boolean;
  esMecenas?: boolean;
};

export function MapaHistorico({ interactivo = true, esMecenas = false }: Props) {
  return (
    <div className="relative overflow-hidden rounded-sm border border-linea bg-[#060910]">
      <div className="aspect-[720/440] w-full">
        <BaseMapaConoSur>
          <BrújulaDecorativa />
          {PUNTOS.map((p) => {
            const marcador = (
              <MarcadorCiudad
                x={p.x}
                y={p.y}
                nombre={p.nombreMapa}
                color="#c6a15b"
                etiqueta={p.etiqueta}
                etiquetaX={p.etiquetaX}
                etiquetaY={p.etiquetaY}
              />
            );
            return interactivo ? (
              <a key={p.lugar.slug} href={`/lugares/${p.lugar.slug}`}>
                {marcador}
              </a>
            ) : (
              <g key={p.lugar.slug}>{marcador}</g>
            );
          })}
        </BaseMapaConoSur>
      </div>
      <ul className="grid gap-2 border-t border-linea bg-fondo-2 p-4 sm:grid-cols-2">
        {PUNTOS.map((p) => {
          const contenido = (
            <>
              <span className="font-medium text-oro-claro">{p.lugar.nombre}</span>
              <span className="ml-2 text-tinta-tenue">{p.lugar.region}</span>
            </>
          );
          return (
            <li key={p.lugar.slug}>
              {interactivo ? (
                <Link
                  href={`/lugares/${p.lugar.slug}`}
                  className="group inline-flex items-center gap-2 text-sm transition-colors hover:text-oro"
                >
                  {contenido}
                  <FlechaCta className="opacity-75 transition-[transform,opacity] duration-300 ease-out group-hover:translate-x-0.5 group-hover:opacity-100" />
                </Link>
              ) : (
                <span className="block text-sm text-tinta-suave">{contenido}</span>
              )}
            </li>
          );
        })}
      </ul>
      {!interactivo && !esMecenas && (
        <p className="border-t border-linea bg-fondo-3 px-4 py-3 text-center text-xs text-tinta-tenue">
          Mapa completo disponible para mecenas{" "}
          <FlechaCta className="inline-block align-middle opacity-75" />{" "}
          <Link href="/membresia" className="text-oro-claro hover:text-oro">
            Hacete mecenas
          </Link>
        </p>
      )}
    </div>
  );
}
