import { redirect } from "next/navigation";

/** El mapa mecenas vive en /lugares con unlock in-place. */
export default function MecenasMapaPage() {
  redirect("/lugares");
}
