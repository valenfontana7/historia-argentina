"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "argent-admin-pwa-dismissed";
const DISMISS_MS = 30 * 24 * 60 * 60 * 1000;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function subscribeNoop(): () => void {
  return () => {};
}

function esStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const matchStandalone = window.matchMedia("(display-mode: standalone)").matches;
  const iosStandalone =
    "standalone" in navigator &&
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
  return matchStandalone || iosStandalone;
}

function esIos(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}

function dismissedReciente(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const t = Number(raw);
    if (!Number.isFinite(t)) return false;
    return Date.now() - t < DISMISS_MS;
  } catch {
    return false;
  }
}

/**
 * Aviso de instalación de la PWA admin.
 * Chromium: beforeinstallprompt. iOS: instrucciones Share → Agregar a inicio.
 */
export function AdminInstallPrompt() {
  const standalone = useSyncExternalStore(
    subscribeNoop,
    esStandalone,
    () => false,
  );
  const ios = useSyncExternalStore(subscribeNoop, esIos, () => false);
  const dismissedGuardado = useSyncExternalStore(
    subscribeNoop,
    dismissedReciente,
    () => false,
  );

  const [dismissedLocal, setDismissedLocal] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );

  useEffect(() => {
    if (standalone || dismissedGuardado || ios) return;

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [standalone, dismissedGuardado, ios]);

  const oculto =
    standalone || dismissedGuardado || dismissedLocal;
  const modo = ios ? "ios" : deferred ? "chromium" : null;
  const visible = !oculto && modo !== null;

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // localStorage puede fallar en modo privado
    }
    setDismissedLocal(true);
  }

  async function instalar() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  }

  if (!visible || !modo) return null;

  return (
    <aside
      className="border-b border-linea bg-fondo-2 px-5 py-3"
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-tinta">
            Instalá Argent Admin en tu dispositivo
          </p>
          {modo === "chromium" ? (
            <p className="mt-0.5 text-xs text-tinta-suave">
              Acceso rápido al panel, sin la barra del navegador.
            </p>
          ) : (
            <p className="mt-0.5 text-xs text-tinta-suave">
              En Safari: tocá{" "}
              <span className="font-medium text-tinta">Compartir</span> y después{" "}
              <span className="font-medium text-tinta">Agregar a inicio</span>.
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={dismiss}
            className="rounded-full px-4 py-2 text-sm text-tinta-tenue transition-colors hover:text-tinta-suave"
          >
            Ahora no
          </button>
          {modo === "chromium" ? (
            <button
              type="button"
              onClick={instalar}
              className="rounded-full bg-oro/15 px-4 py-2 text-sm font-medium text-oro-claro transition-colors hover:bg-oro/25"
            >
              Instalar
            </button>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
