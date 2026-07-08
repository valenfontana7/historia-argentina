import { redirect } from "next/navigation";
import { resolverEfemerideParaFecha } from "@/data/efemerides";
import { hoyEnArgentina } from "@/lib/fechas";

export const dynamic = "force-dynamic";

export default function HoyPage() {
  const { mes, dia } = hoyEnArgentina();
  const { efemeride, esExacta } = resolverEfemerideParaFecha(mes, dia);
  const destino = esExacta
    ? `/hoy/${efemeride.dia}`
    : `/hoy/${efemeride.dia}?sugerida=1`;
  redirect(destino);
}
