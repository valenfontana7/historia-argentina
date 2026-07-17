"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MarcaSitio } from "@/components/portada/MarcaSitio";

const PRIMARIOS = [
  { href: "/", etiqueta: "Descubrir" },
  { href: "/hoy", etiqueta: "Hoy" },
] as const;

type Props = {
  esMecenas: boolean;
};

export function Header({ esMecenas }: Props) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [portalListo, setPortalListo] = useState(false);
  const botonRef = useRef<HTMLButtonElement>(null);
  const primerLinkRef = useRef<HTMLAnchorElement>(null);
  const navId = useId();

  useEffect(() => {
    setPortalListo(true);
  }, []);

  const cerrarMenu = useCallback(() => {
    setMenuAbierto(false);
    window.setTimeout(() => botonRef.current?.focus(), 0);
  }, []);

  const abrirMenu = useCallback(() => {
    setMenuAbierto(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuAbierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuAbierto]);

  useEffect(() => {
    if (!menuAbierto) return;

    const id = window.setTimeout(() => {
      primerLinkRef.current?.focus();
    }, 0);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cerrarMenu();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuAbierto, cerrarMenu]);

  const mecenasHref = esMecenas ? "/mecenas" : "/membresia";
  const mecenasEtiqueta = esMecenas ? "Tu espacio" : "Mecenas";
  const mecenasAyuda = esMecenas
    ? "Seguí donde lo dejaste"
    : "Apoyá Argent";

  const overflowMobile = [
    {
      href: "/recorridos",
      etiqueta: "Recorrido guiado",
      ayuda: "Te llevamos paso a paso",
    },
    {
      href: "/explorar",
      etiqueta: "Mostrame otra",
      ayuda: "Una historia al azar",
    },
    {
      href: mecenasHref,
      etiqueta: mecenasEtiqueta,
      ayuda: mecenasAyuda,
    },
  ] as const;

  const menuPortal =
    portalListo &&
    menuAbierto &&
    createPortal(
      <div className="lg:hidden" role="presentation">
        {/* Portal a body: evita que backdrop-blur del header atrape el fixed */}
        <button
          type="button"
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl"
          aria-label="Cerrar menú"
          onClick={cerrarMenu}
        />
        <nav
          id={navId}
          className="fixed inset-0 z-[110] flex flex-col bg-fondo px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-20"
          aria-label="Más opciones"
        >
          <p className="kicker text-oro" id={`${navId}-titulo`}>
            Más
          </p>
          <ul
            className="mt-10 flex flex-1 flex-col justify-center gap-2"
            aria-labelledby={`${navId}-titulo`}
          >
            {overflowMobile.map((enlace, i) => (
              <li key={enlace.href}>
                <Link
                  ref={i === 0 ? primerLinkRef : undefined}
                  href={enlace.href}
                  className="group flex min-h-[4.75rem] flex-col justify-center border-b border-linea/50 px-1 py-5 transition-colors last:border-b-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oro focus-visible:ring-offset-4 focus-visible:ring-offset-fondo"
                  onClick={cerrarMenu}
                >
                  <span className="titulo-display text-3xl font-semibold text-tinta transition-colors group-hover:text-oro-claro">
                    {enlace.etiqueta}
                  </span>
                  <span className="mt-2 text-base text-tinta-suave">
                    {enlace.ayuda}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>,
      document.body,
    );

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 border-b border-linea-suave/60 bg-fondo/50 backdrop-blur-md ${
          menuAbierto ? "z-[120]" : "z-50"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <MarcaSitio mostrarLema tamano="md" onClick={cerrarMenu} />

          <nav className="hidden items-center gap-7 text-sm lg:flex" aria-label="Principal">
            {PRIMARIOS.map((enlace) => (
              <Link
                key={enlace.href}
                href={enlace.href}
                className="text-tinta-suave transition-colors hover:text-oro-claro"
              >
                {enlace.etiqueta}
              </Link>
            ))}
            <Link
              href={mecenasHref}
              className="inline-flex items-center gap-1.5 text-tinta-suave transition-colors hover:text-oro-claro"
              aria-label={esMecenas ? "Sesión de mecenas activa" : undefined}
            >
              {esMecenas && (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-celeste" aria-hidden />
              )}
              {mecenasEtiqueta}
            </Link>
          </nav>

          <button
            ref={botonRef}
            type="button"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-sm text-tinta-suave transition-colors hover:text-oro-claro lg:hidden"
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuAbierto}
            aria-controls={navId}
            onClick={() => (menuAbierto ? cerrarMenu() : abrirMenu())}
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
      </header>
      {menuPortal}
    </>
  );
}
