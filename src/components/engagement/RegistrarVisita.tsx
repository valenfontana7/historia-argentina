"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  agregarReciente,
  guardarProgreso,
  marcarVisitaOnboarding,
  type PaginaReciente,
} from "@/lib/engagement/storage";
import { registrarExhibicionVista } from "@/lib/engagement/visita";
import type { Epoca } from "@/components/ui/Retrato";

type Props = {
  titulo: string;
  tipo?: PaginaReciente["tipo"];
  /** Activar tracking de scroll (crónicas) */
  progreso?: boolean;
  epoca?: Epoca;
  slugCronica?: string;
};

export function RegistrarVisita({
  titulo,
  tipo = "otro",
  progreso = false,
  epoca,
  slugCronica,
}: Props) {
  const pathname = usePathname();

  useEffect(() => {
    agregarReciente({ href: pathname, titulo, tipo });
    if (epoca && slugCronica) {
      registrarExhibicionVista(slugCronica, epoca);
    }
  }, [pathname, titulo, tipo, epoca, slugCronica]);

  useEffect(() => {
    if (!progreso) return;

    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      if (total <= 0) return;
      const pct = Math.round((window.scrollY / total) * 100);
      guardarProgreso(pathname, pct);
      if (pct >= 50) marcarVisitaOnboarding();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname, progreso]);

  return null;
}
