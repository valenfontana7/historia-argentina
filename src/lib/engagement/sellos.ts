import { notificarCambioStorage } from "@/lib/engagement/storage-events";

const CLAVE_SELLOS = "argent:sellos-visita";

export type TipoSello = "sala" | "recorrido" | "exhibicion";

export type SelloVisita = {
  id: string;
  titulo: string;
  subtitulo: string;
  tipo: TipoSello;
  obtenidoEn: string;
};

function leerSellos(): SelloVisita[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CLAVE_SELLOS);
    if (!raw) return [];
    return JSON.parse(raw) as SelloVisita[];
  } catch {
    return [];
  }
}

function escribirSellos(sellos: SelloVisita[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CLAVE_SELLOS, JSON.stringify(sellos));
    notificarCambioStorage();
  } catch {
    // ignorar
  }
}

export function obtenerSellos(): SelloVisita[] {
  return leerSellos().sort(
    (a, b) => new Date(b.obtenidoEn).getTime() - new Date(a.obtenidoEn).getTime(),
  );
}

export function registrarSello(sello: Omit<SelloVisita, "obtenidoEn">): boolean {
  const actuales = leerSellos();
  if (actuales.some((s) => s.id === sello.id)) return false;
  actuales.push({ ...sello, obtenidoEn: new Date().toISOString() });
  escribirSellos(actuales);
  return true;
}

export function selloDeSala(epoca: string, nombre: string): Omit<SelloVisita, "obtenidoEn"> {
  return {
    id: `sala-${epoca}`,
    titulo: nombre,
    subtitulo: "Sala completada",
    tipo: "sala",
  };
}

export function selloDeRecorrido(slug: string, titulo: string): Omit<SelloVisita, "obtenidoEn"> {
  return {
    id: `recorrido-${slug}`,
    titulo,
    subtitulo: "Visita guiada completada",
    tipo: "recorrido",
  };
}
