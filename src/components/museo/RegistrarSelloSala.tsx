"use client";

import { useEffect } from "react";
import type { Epoca } from "@/components/ui/Retrato";
import { useStorageSnapshot } from "@/lib/engagement/client-storage-sync";
import { obtenerProgresoSalas } from "@/lib/engagement/visita";
import { registrarSello, selloDeSala } from "@/lib/engagement/sellos";

type Props = {
  epoca: Epoca;
  nombre: string;
};

/** Otorga sello cuando el visitante completa una sala. */
export function RegistrarSelloSala({ epoca, nombre }: Props) {
  const salas = useStorageSnapshot(obtenerProgresoSalas, []);
  const sala = salas.find((s) => s.epoca === epoca);

  useEffect(() => {
    if (!sala || sala.total === 0 || sala.vistas < sala.total) return;
    registrarSello(selloDeSala(epoca, nombre));
  }, [sala, epoca, nombre]);

  return null;
}
