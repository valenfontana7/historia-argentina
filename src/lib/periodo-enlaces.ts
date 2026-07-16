import { efemerides } from "@/data/efemerides";
import { personajes } from "@/data/personajes";

export type EnlaceHito = {
  etiqueta: string;
  href: string;
};

/** Resuelve un hito de período (ej. "1810: Revolución de Mayo") a una URL interna. */
export function enlaceDeHitoPeriodo(texto: string): EnlaceHito | null {
  const matchAnio = texto.match(/^(\d{4})\s*, \s*(.+)$/);
  if (!matchAnio) return null;

  const anio = Number(matchAnio[1]);
  const descripcion = matchAnio[2].toLowerCase();

  const efemeride = efemerides.find((e) => {
    if (e.anio !== anio) return false;
    const titulo = e.titulo.toLowerCase();
    return (
      descripcion.includes("mayo") && titulo.includes("mayo") ||
      descripcion.includes("independencia") && titulo.includes("independencia") ||
      descripcion.includes("cruce") && titulo.includes("andes") ||
      descripcion.includes("caseros") && titulo.includes("caseros") ||
      descripcion.includes("constitución") && titulo.includes("constitución") ||
      descripcion.includes("invasiones") && titulo.includes("invas") ||
      descripcion.includes("federalización") && titulo.includes("federal") ||
      descripcion.includes("golpe") && titulo.includes("golpe") ||
      descripcion.includes("yrigoyen") && titulo.includes("yrigoyen") ||
      descripcion.includes("revolución del '43") && titulo.includes("43") ||
      descripcion.includes("fundación") && (titulo.includes("buenos aires") || titulo.includes("fund"))
    );
  });

  if (efemeride) {
    return { etiqueta: texto, href: `/hoy/${efemeride.dia}` };
  }

  const personaje = personajes.find((p) =>
    descripcion.includes(p.nombre.split(" ").pop()?.toLowerCase() ?? "__"),
  );
  if (personaje) {
    return { etiqueta: texto, href: `/panteon/${personaje.slug}` };
  }

  return { etiqueta: texto, href: `/timelines/${anio}` };
}
