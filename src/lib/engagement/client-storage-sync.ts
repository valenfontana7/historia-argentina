"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import { suscribirCambiosStorage } from "@/lib/engagement/storage-events";

function snapshotsIguales<T>(a: T, b: T): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || a === null || typeof b !== "object" || b === null) {
    return false;
  }
  return JSON.stringify(a) === JSON.stringify(b);
}

/** Lee un snapshot de localStorage en el cliente sin setState en effects. */
export function useStorageSnapshot<T>(
  leer: () => T,
  snapshotServidor: T,
): T {
  const cacheRef = useRef(snapshotServidor);

  const getSnapshot = useCallback(() => {
    const next = leer();
    if (snapshotsIguales(cacheRef.current, next)) {
      return cacheRef.current;
    }
    cacheRef.current = next;
    return next;
  }, [leer]);

  return useSyncExternalStore(
    suscribirCambiosStorage,
    getSnapshot,
    () => snapshotServidor,
  );
}

/** Detecta mount en cliente (evita hydration mismatch sin useEffect). */
export function useEsCliente(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
