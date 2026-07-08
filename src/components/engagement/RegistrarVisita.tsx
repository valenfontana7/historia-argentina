"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  agregarReciente,
  guardarProgreso,
  type PaginaReciente,
} from "@/lib/engagement/storage";

type Props = {
  titulo: string;
  tipo?: PaginaReciente["tipo"];
  /** Activar tracking de scroll (crónicas) */
  progreso?: boolean;
};

export function RegistrarVisita({ titulo, tipo = "otro", progreso = false }: Props) {
  const pathname = usePathname();

  useEffect(() => {
    agregarReciente({ href: pathname, titulo, tipo });
  }, [pathname, titulo, tipo]);

  useEffect(() => {
    if (!progreso) return;

    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      if (total <= 0) return;
      const pct = Math.round((window.scrollY / total) * 100);
      guardarProgreso(pathname, pct);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname, progreso]);

  return null;
}
