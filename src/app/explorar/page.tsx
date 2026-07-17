import { redirect } from "next/navigation";
import { todosLosNodos } from "@/lib/grafo/queries";
import { rutaDeNodo } from "@/lib/grafo/rutas";

export const dynamic = "force-dynamic";

/**
 * Acción, no pantalla: un hit a /explorar te tira a un nodo al azar.
 * Conserva Descubrir (home) y Mostrame otra (este redirect + botones Sorpresa).
 */
export default function ExplorarPage() {
  const nodos = todosLosNodos().filter(
    (n) =>
      n.tipo === "cronica" ||
      n.tipo === "persona" ||
      n.tipo === "evento" ||
      n.tipo === "lugar",
  );

  if (nodos.length === 0) redirect("/");

  const nodo = nodos[Math.floor(Math.random() * nodos.length)]!;
  redirect(rutaDeNodo(nodo));
}
