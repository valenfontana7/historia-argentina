import { redirect } from "next/navigation";
import { efemerideParaFecha } from "@/data/efemerides";
import { hoyEnArgentina } from "@/lib/fechas";

// La fecha "de hoy" se resuelve en cada request, no en el build.
export const dynamic = "force-dynamic";

export default function HoyPage() {
  const { mes, dia } = hoyEnArgentina();
  const efemeride = efemerideParaFecha(mes, dia);
  redirect(`/hoy/${efemeride.dia}`);
}
