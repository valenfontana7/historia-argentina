/** Fecha actual en la zona horaria argentina, como { mes, dia }. */
export function hoyEnArgentina(): { mes: number; dia: number } {
  const partes = new Intl.DateTimeFormat("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date());

  const mes = Number(partes.find((p) => p.type === "month")?.value ?? 1);
  const dia = Number(partes.find((p) => p.type === "day")?.value ?? 1);
  return { mes, dia };
}
