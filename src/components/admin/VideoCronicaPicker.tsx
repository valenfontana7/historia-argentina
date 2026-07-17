"use client";

import { useMemo, useState } from "react";
import type { CronicaOption } from "./video-admin-utils";

type Props = {
  cronicas: CronicaOption[];
  slug: string;
  onSlugChange: (slug: string) => void;
  force?: boolean;
  onForceChange?: (force: boolean) => void;
  /** Mostrar el toggle de forzar regeneración (reels). Default true. */
  showForce?: boolean;
  disabled?: boolean;
};

export function VideoCronicaPicker({
  cronicas,
  slug,
  onSlugChange,
  force = false,
  onForceChange,
  showForce = true,
  disabled,
}: Props) {
  const [q, setQ] = useState("");
  const [listaAbierta, setListaAbierta] = useState(false);

  const filtradas = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return cronicas;
    return cronicas.filter(
      (c) =>
        c.titulo.toLowerCase().includes(term) ||
        c.slug.toLowerCase().includes(term),
    );
  }, [cronicas, q]);

  const seleccion = cronicas.find((c) => c.slug === slug);

  return (
    <div className="space-y-3">
      <div className="relative">
        <label className="block">
          <span className="text-xs uppercase tracking-[0.16em] text-tinta-tenue">
            Crónica / exhibición
          </span>
          <input
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            placeholder="Buscar por título o slug…"
            value={listaAbierta || q ? q : (seleccion?.titulo ?? "")}
            disabled={disabled}
            onFocus={() => {
              setListaAbierta(true);
              setQ("");
            }}
            onChange={(e) => {
              setQ(e.target.value);
              setListaAbierta(true);
            }}
            className="mt-2 min-h-11 w-full rounded-sm border border-linea bg-fondo px-3 py-2.5 text-base text-tinta focus:border-oro/50 disabled:opacity-50 sm:text-sm"
          />
        </label>

        {listaAbierta && !disabled && (
          <>
            <button
              type="button"
              aria-label="Cerrar lista"
              className="fixed inset-0 z-10 cursor-default"
              onClick={() => {
                setListaAbierta(false);
                setQ("");
              }}
            />
            <ul
              className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-sm border border-linea bg-fondo-2 shadow-lg"
              role="listbox"
            >
              {filtradas.length === 0 ? (
                <li className="px-3 py-3 text-sm text-tinta-tenue">
                  Sin resultados
                </li>
              ) : (
                filtradas.map((c) => (
                  <li key={c.slug}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={c.slug === slug}
                      className={`flex min-h-11 w-full flex-col items-start px-3 py-2.5 text-left text-sm ${
                        c.slug === slug
                          ? "bg-oro/15 text-oro-claro"
                          : "text-tinta hover:bg-fondo"
                      }`}
                      onClick={() => {
                        onSlugChange(c.slug);
                        setListaAbierta(false);
                        setQ("");
                      }}
                    >
                      <span className="font-medium">{c.titulo}</span>
                      <span className="text-xs text-tinta-tenue">{c.slug}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </>
        )}
      </div>

      {showForce && onForceChange ? (
        <button
          type="button"
          disabled={disabled}
          onClick={() => onForceChange(!force)}
          className={`flex min-h-11 w-full items-center gap-3 rounded-sm border px-3 py-2.5 text-left text-sm transition-colors disabled:opacity-50 ${
            force
              ? "border-oro/40 bg-oro/10 text-oro-claro"
              : "border-linea bg-fondo text-tinta-suave"
          }`}
        >
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border ${
              force ? "border-oro bg-oro text-fondo" : "border-linea"
            }`}
            aria-hidden
          >
            {force ? "✓" : ""}
          </span>
          <span>
            <span className="font-medium">Forzar regeneración</span>
            <span className="mt-0.5 block text-xs text-tinta-tenue">
              Ignora jobs previos de la misma crónica
            </span>
          </span>
        </button>
      ) : null}
    </div>
  );
}
