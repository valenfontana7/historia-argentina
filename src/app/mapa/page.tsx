import { redirect } from "next/navigation";

/** /mapa redirige a /lugares: una sola URL para el mapa exploratorio. */
export default function MapaPage() {
  redirect("/lugares");
}
