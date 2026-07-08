"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const CLAVE = "argent:mecenas-checklist";

type Item = {
  id: string;
  label: string;
  href: string;
  descripcion: string;
};

const ITEMS: Item[] = [
  {
    id: "cronica",
    label: "Leé tu crónica exclusiva",
    href: "/mecenas",
    descripcion: "Empezá por la crónica destacada de arriba.",
  },
  {
    id: "mapa",
    label: "Abrí el mapa completo",
    href: "/lugares",
    descripcion: "Todos los lugares y filtros por época.",
  },
  {
    id: "recorrido",
    label: "Probá un recorrido especial",
    href: "/recorridos",
    descripcion: "Historias paso a paso solo para mecenas.",
  },
  {
    id: "carta",
    label: "Leé la carta del mes",
    href: "/mecenas/carta",
    descripcion: "Novedades y mensaje del equipo.",
  },
];

function leerHechos(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(CLAVE);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function guardarHechos(hechos: Set<string>) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify([...hechos]));
  } catch {
    // ignorar
  }
}

/** Checklist de primera visita al área mecenas. */
export function OnboardingMecenas({
  cronicaHref,
}: {
  cronicaHref: string;
}) {
  const [hechos, setHechos] = useState<Set<string>>(new Set());
  const [listo, setListo] = useState(false);

  useEffect(() => {
    setHechos(leerHechos());
    setListo(true);
  }, []);

  if (!listo) return null;

  const items = ITEMS.map((item) =>
    item.id === "cronica" ? { ...item, href: cronicaHref } : item,
  );

  const todos = items.every((i) => hechos.has(i.id));
  if (todos) return null;

  const marcar = (id: string) => {
    const next = new Set(hechos);
    next.add(id);
    setHechos(next);
    guardarHechos(next);
  };

  return (
    <section className="mt-14 rounded-sm border border-oro/30 bg-fondo-2 p-6 sm:p-8">
      <p className="kicker text-oro">Tu primera visita</p>
      <h2 className="titulo-display mt-3 text-2xl font-semibold">
        Empezá por acá
      </h2>
      <p className="mt-2 text-sm text-tinta-suave">
        Cuatro pasos para conocer tu museo. Tocá cada uno cuando lo completes.
      </p>
      <ol className="mt-6 space-y-3">
        {items.map((item, i) => {
          const hecho = hechos.has(item.id);
          return (
            <li key={item.id}>
              <div
                className={`flex flex-col gap-2 rounded-sm border px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${
                  hecho
                    ? "border-oro/20 bg-fondo opacity-70"
                    : "border-linea bg-fondo"
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-tinta">
                    <span className="text-oro">{i + 1}.</span> {item.label}
                    {hecho ? " ✓" : ""}
                  </p>
                  <p className="mt-0.5 text-xs text-tinta-tenue">
                    {item.descripcion}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link
                    href={item.href}
                    onClick={() => marcar(item.id)}
                    className="rounded-full border border-oro/40 px-4 py-2 text-xs text-oro-claro transition-colors hover:bg-oro/10"
                  >
                    Ir →
                  </Link>
                  {!hecho && (
                    <button
                      type="button"
                      onClick={() => marcar(item.id)}
                      className="rounded-full border border-linea px-4 py-2 text-xs text-tinta-tenue hover:text-tinta-suave"
                    >
                      Listo
                    </button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
