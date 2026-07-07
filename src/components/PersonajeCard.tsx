import Link from "next/link";
import { Retrato } from "@/components/ui/Retrato";
import type { Personaje } from "@/data/personajes";
import { obtenerImagenPersonaje } from "@/data/personajes-imagenes";

type PersonajeCardProps = {
  personaje: Personaje;
};

export function PersonajeCard({ personaje }: PersonajeCardProps) {
  const anios = `${personaje.nacimiento.anio} — ${personaje.muerte?.anio ?? "presente"}`;
  return (
    <Link
      href={`/panteon/${personaje.slug}`}
      className="group block transition-transform duration-500 ease-out hover:-translate-y-1.5"
    >
      <div className="relative overflow-hidden rounded-sm">
        <Retrato
          nombre={personaje.nombre}
          epoca={personaje.epoca}
          anios={anios}
          imagen={obtenerImagenPersonaje(personaje.slug)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-fondo/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <div className="mt-4">
        <p className="kicker">{personaje.titulo}</p>
        <h3 className="titulo-display mt-1.5 text-xl font-semibold leading-tight text-tinta transition-colors group-hover:text-oro-claro">
          {personaje.nombre}
        </h3>
        <p className="mt-1 text-sm text-tinta-tenue">{personaje.rol}</p>
      </div>
    </Link>
  );
}
