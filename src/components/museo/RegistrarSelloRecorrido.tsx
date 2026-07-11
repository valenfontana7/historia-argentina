"use client";

import { useEffect } from "react";
import { registrarSello, selloDeRecorrido } from "@/lib/engagement/sellos";

type Props = {
  slug: string;
  titulo: string;
};

/** Otorga sello al llegar al final de una visita guiada. */
export function RegistrarSelloRecorrido({ slug, titulo }: Props) {
  useEffect(() => {
    registrarSello(selloDeRecorrido(slug, titulo));
  }, [slug, titulo]);

  return null;
}
