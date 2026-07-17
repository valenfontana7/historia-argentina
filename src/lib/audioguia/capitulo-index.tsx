"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
} from "react";

type CapituloIndexApi = () => number;

const CapituloIndexContext = createContext<CapituloIndexApi | null>(null);

/** Numera capítulos MDX en orden para sincronizar la audioguía con el scroll. */
export function CapituloIndexProvider({ children }: { children: ReactNode }) {
  const counterRef = useRef(0);
  const getNext = useCallback(() => {
    const index = counterRef.current;
    counterRef.current += 1;
    return index;
  }, []);

  return (
    <CapituloIndexContext.Provider value={getNext}>{children}</CapituloIndexContext.Provider>
  );
}

export function useCapituloIndex(): number | null {
  const getNext = useContext(CapituloIndexContext);
  // Cachear por instancia: getNext muta un contador; en Strict Mode
  // React re-renderiza sin desmontar y un segundo getNext rompería la hidratación.
  const indexRef = useRef<number | null>(null);
  if (!getNext) return null;
  if (indexRef.current === null) {
    indexRef.current = getNext();
  }
  return indexRef.current;
}
