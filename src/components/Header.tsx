"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { sitio } from "@/lib/site.config";

const enlaces = [
  { href: "/explorar", etiqueta: "Explorar" },
  { href: "/timelines", etiqueta: "Timeline" },
  { href: "/jugar", etiqueta: "Jugar" },
  { href: "/cronicas", etiqueta: "Crónicas" },
  { href: "/panteon", etiqueta: "El Panteón" },
  { href: "/hoy", etiqueta: "Hoy" },
  { href: "/membresia", etiqueta: "Mecenas" },
] as const;

export function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const cerrarMenu = useCallback(() => setMenuAbierto(false), []);

  useEffect(() => {
    document.body.style.overflow = menuAbierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuAbierto]);

  useEffect(() => {
    if (!menuAbierto) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrarMenu();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuAbierto, cerrarMenu]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-linea-suave bg-fondo/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="group flex items-baseline gap-3" onClick={cerrarMenu}>
          <span className="titulo-display text-xl font-semibold tracking-tight text-tinta transition-colors group-hover:text-oro-claro">
            {sitio.nombre}
          </span>
          <span className="hidden text-[0.65rem] uppercase tracking-[0.24em] text-tinta-tenue sm:inline">
            {sitio.lema}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm lg:flex" aria-label="Principal">
          {enlaces.map((enlace) => (
            <Link
              key={enlace.href}
              href={enlace.href}
              className="text-tinta-suave transition-colors hover:text-oro-claro"
            >
              {enlace.etiqueta}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-sm text-tinta-suave transition-colors hover:text-oro-claro lg:hidden"
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuAbierto}
          aria-controls="nav-mobile"
          onClick={() => setMenuAbierto((v) => !v)}
        >
          <span className="sr-only">{menuAbierto ? "Cerrar menú" : "Abrir menú"}</span>
          {menuAbierto ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      {menuAbierto && (
        <>
          <button
            type="button"
            className="fixed inset-0 top-16 z-40 bg-fondo/80 backdrop-blur-sm lg:hidden"
            aria-label="Cerrar menú"
            onClick={cerrarMenu}
          />
          <nav
            id="nav-mobile"
            className="fixed inset-x-0 top-16 z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-linea-suave bg-fondo-2 px-5 py-4 lg:hidden"
            aria-label="Principal"
          >
            <ul className="flex flex-col">
              {enlaces.map((enlace) => (
                <li key={enlace.href}>
                  <Link
                    href={enlace.href}
                    className="flex min-h-11 items-center text-base text-tinta-suave transition-colors hover:text-oro-claro"
                    onClick={cerrarMenu}
                  >
                    {enlace.etiqueta}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </header>
  );
}
