import type { CronicaMeta } from "@/content/cronicas/registro";

/** Fecha ISO (YYYY-MM-DD) en la que una exhibición anticipo pasa a ser pública. */
export function fechaPublicacionPublica(cronica: CronicaMeta): Date | null {
  if (!cronica.publicacionPublica) return null;
  const d = new Date(`${cronica.publicacionPublica}T12:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function esExposicionAnticipo(cronica: CronicaMeta): boolean {
  return cronica.acceso === "anticipo";
}

/** La exhibición ya está abierta al público general (no solo mecenas). */
export function exhibicionAbiertaAlPublico(cronica: CronicaMeta, ahora = new Date()): boolean {
  if (cronica.acceso === "publico") return true;
  if (cronica.acceso === "mecenas") return false;
  const fecha = fechaPublicacionPublica(cronica);
  if (!fecha) return false;
  return ahora >= fecha;
}

/** Requiere membresía activa para ver el contenido completo. */
export function requiereAccesoMecenas(cronica: CronicaMeta): boolean {
  if (process.env.NEXT_PUBLIC_SALTAR_MECENAS === "true") return false;
  if (cronica.acceso === "mecenas") return true;
  if (cronica.acceso === "anticipo") return !exhibicionAbiertaAlPublico(cronica);
  return false;
}

export function formatearFechaPublica(fechaIso: string): string {
  const d = new Date(`${fechaIso}T12:00:00`);
  return d.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
