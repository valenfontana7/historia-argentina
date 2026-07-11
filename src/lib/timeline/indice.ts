import { slugDeCategoria } from "@/data/categorias";
import { efemerides } from "@/data/efemerides";
import { personajes } from "@/data/personajes";
import { periodoPorAnio } from "@/data/periodos";
import type { Periodo } from "@/data/periodos";
import { cronicasEnAnio } from "@/lib/cronicas/indice";

export type EventoPreview = {
  slug: string;
  titulo: string;
  anio: number;
  categoria: string;
};

export type PersonajePreview = {
  slug: string;
  nombre: string;
};

export type CronicaPreview = {
  slug: string;
  titulo: string;
  anioInicio: number;
};

export type PreviewAnio = {
  anio: number;
  periodo: Periodo | undefined;
  eventos: EventoPreview[];
  personajes: PersonajePreview[];
  cronicas: CronicaPreview[];
};

export type StatsSiglo = {
  siglo: number;
  label: string;
  eventos: number;
  personajes: number;
  aniosConEventos: number;
};

export const HITOS_TIMELINE = [
  { anio: 1810, label: "Mayo" },
  { anio: 1816, label: "Independencia" },
  { anio: 1853, label: "Constitución" },
  { anio: 1880, label: "Federalización" },
  { anio: 1946, label: "Peronismo" },
  { anio: 1983, label: "Democracia" },
  { anio: 2001, label: "Crisis" },
] as const;

export const ANIO_MIN = 1516;
export const ANIO_MAX = new Date().getFullYear();

export function previewAnio(anio: number): PreviewAnio {
  const eventos = efemerides
    .filter((e) => e.anio === anio)
    .map((e) => ({
      slug: e.dia,
      titulo: e.titulo,
      anio: e.anio,
      categoria: e.categoria,
    }));

  const personajesActivos = personajes
    .filter((p) => {
      const fin = p.muerte?.anio ?? ANIO_MAX;
      return p.nacimiento.anio <= anio && fin >= anio;
    })
    .map((p) => ({ slug: p.slug, nombre: p.nombre }));

  return {
    anio,
    periodo: periodoPorAnio(anio),
    eventos,
    personajes: personajesActivos,
    cronicas: cronicasEnAnio(anio).map((c) => ({
      slug: c.slug,
      titulo: c.titulo,
      anioInicio: c.anioInicio,
    })),
  };
}

export function eventosEnRango(
  desde: number,
  hasta: number,
  categoriaSlug?: string,
): EventoPreview[] {
  return efemerides
    .filter((e) => {
      if (e.anio < desde || e.anio > hasta) return false;
      if (categoriaSlug && slugDeCategoria(e.categoria) !== categoriaSlug) return false;
      return true;
    })
    .sort((a, b) => a.anio - b.anio)
    .map((e) => ({
      slug: e.dia,
      titulo: e.titulo,
      anio: e.anio,
      categoria: e.categoria,
    }));
}

export function statsSiglo(sigloBase: number): StatsSiglo {
  const desde = sigloBase;
  const hasta = sigloBase + 99;
  const eventos = efemerides.filter((e) => e.anio >= desde && e.anio <= hasta);
  const aniosSet = new Set(eventos.map((e) => e.anio));

  let personajesCount = 0;
  for (let anio = desde; anio <= hasta; anio++) {
    personajesCount += previewAnio(anio).personajes.length;
  }

  const sigloNum = Math.floor(sigloBase / 100) + 1;
  return {
    siglo: sigloBase,
    label: `Siglo ${sigloNum === 21 ? "XXI" : sigloNum === 20 ? "XX" : sigloNum === 19 ? "XIX" : "XVIII"}`,
    eventos: eventos.length,
    personajes: personajesCount,
    aniosConEventos: aniosSet.size,
  };
}

export const SIGLOS_COMPARAR = [1810, 1910, 2010] as const;
