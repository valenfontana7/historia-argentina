"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  obtenerProgreso,
  obtenerRecientes,
  tieneVisitaOnboarding,
  type PaginaReciente,
} from "@/lib/engagement/storage";

export function PortadaRetorno() {
  const [recientes, setRecientes] = useState<PaginaReciente[]>([]);
  const [progresoCronica, setProgresoCronica] = useState<{
    href: string;
    titulo: string;
    porcentaje: number;
  } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!tieneVisitaOnboarding()) return;

    const paginas = obtenerRecientes().slice(0, 3);
    setRecientes(paginas);
    setVisible(paginas.length > 0);

    const cronica = paginas.find((p) => p.tipo === "cronica");
    if (cronica) {
      const pct = obtenerProgreso(cronica.href);
      if (pct > 0 && pct < 100) {
        setProgresoCronica({
          href: cronica.href,
          titulo: cronica.titulo,
          porcentaje: pct,
        });
      }
    }
  }, []);

  if (!visible) return null;

  return (
    <section className="border-b border-linea-suave bg-fondo">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <p className="kicker">Continuar explorando</p>
        {progresoCronica && (
          <div className="mt-6 rounded-sm border border-linea bg-fondo-2 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-tinta-tenue">
              Crónica en curso · {progresoCronica.porcentaje}% leída
            </p>
            <Link
              href={progresoCronica.href}
              className="titulo-display mt-2 block text-xl font-medium text-oro-claro hover:text-oro"
            >
              {progresoCronica.titulo} →
            </Link>
          </div>
        )}
        <ul className="mt-6 flex flex-wrap gap-3">
          {recientes.map((r) => (
            <li key={r.href}>
              <Link
                href={r.href}
                className="rounded-full border border-linea px-5 py-2.5 text-sm text-tinta-suave transition-colors hover:border-oro/50 hover:text-oro-claro"
              >
                {r.titulo}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
