/** Nombre CSS compartido para transición ficha → hero de exhibición. */
export function nombreTransicionExhibicion(slug: string): string {
  return `exhibicion-${slug.replace(/[^a-z0-9-]/gi, "-")}`;
}

/** Nombre CSS para transición puerta de sala → hub de época. */
export function nombreTransicionSala(epoca: string): string {
  return `sala-${epoca}`;
}
