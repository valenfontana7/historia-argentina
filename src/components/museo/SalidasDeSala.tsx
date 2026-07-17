import { PuertasDelUniverso } from "@/components/exploracion/PuertasDelUniverso";
import type { SalidaCurada } from "@/lib/grafo/salidas-curadas";
import type { EntidadRef, NodoEntidad } from "@/lib/grafo/tipos";

type Props = {
  salidas?: SalidaCurada[];
  origen?: NodoEntidad | EntidadRef;
  tituloExhibicion?: string;
};

/** @deprecated Preferir PuertasDelUniverso — se mantiene por compatibilidad. */
export function SalidasDeSala({ salidas, origen, tituloExhibicion }: Props) {
  return (
    <PuertasDelUniverso
      salidas={salidas}
      origen={origen}
      tituloOrigen={tituloExhibicion}
    />
  );
}
