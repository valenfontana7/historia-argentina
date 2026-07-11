import type { Epoca } from "@/components/ui/Retrato";
import { cronicas } from "@/content/cronicas/registro";
import { periodos } from "@/data/periodos";
import { ORDEN_EPOCAS } from "@/lib/cronicas/indice";
import { notificarCambioStorage } from "@/lib/engagement/storage-events";
import { obtenerRecientes } from "@/lib/engagement/storage";

const CLAVE_SALAS = "argent:visita-salas";

export type ProgresoSala = {
  epoca: Epoca;
  nombre: string;
  vistas: number;
  total: number;
};

function leerSalas(): Record<Epoca, Set<string>> {
  if (typeof window === "undefined") {
    return {} as Record<Epoca, Set<string>>;
  }
  try {
    const raw = localStorage.getItem(CLAVE_SALAS);
    if (!raw) return {} as Record<Epoca, Set<string>>;
    const parsed = JSON.parse(raw) as Record<string, string[]>;
    const result = {} as Record<Epoca, Set<string>>;
    for (const [epoca, slugs] of Object.entries(parsed)) {
      result[epoca as Epoca] = new Set(slugs);
    }
    return result;
  } catch {
    return {} as Record<Epoca, Set<string>>;
  }
}

function escribirSalas(mapa: Record<Epoca, Set<string>>): void {
  if (typeof window === "undefined") return;
  try {
    const serializado: Record<string, string[]> = {};
    for (const [epoca, slugs] of Object.entries(mapa)) {
      serializado[epoca] = [...slugs];
    }
    localStorage.setItem(CLAVE_SALAS, JSON.stringify(serializado));
    notificarCambioStorage();
  } catch {
    // ignorar
  }
}

/** Registra que el visitante vio una exhibición (para progreso por sala). */
export function registrarExhibicionVista(slug: string, epoca: Epoca): void {
  const mapa = leerSalas();
  const set = mapa[epoca] ?? new Set<string>();
  set.add(slug);
  mapa[epoca] = set;
  escribirSalas(mapa);
}

export function obtenerProgresoSalas(): ProgresoSala[] {
  const mapa = leerSalas();
  const recientes = typeof window !== "undefined" ? obtenerRecientes() : [];

  return ORDEN_EPOCAS.map((epoca) => {
    const periodo = periodos.find((p) => p.slug === epoca);
    const total = cronicas.filter((c) => c.epoca === epoca).length;
    const vistasSet = mapa[epoca] ?? new Set<string>();

    for (const r of recientes) {
      if (r.tipo !== "cronica") continue;
      const slug = r.href.replace("/cronicas/", "");
      const cronica = cronicas.find((c) => c.slug === slug);
      if (cronica?.epoca === epoca) vistasSet.add(slug);
    }

    return {
      epoca,
      nombre: periodo?.nombre ?? epoca,
      vistas: vistasSet.size,
      total,
    };
  }).filter((s) => s.total > 0);
}

export { obtenerRecientes };
