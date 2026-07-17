"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useProfundidadPuntero } from "@/components/motion/useProfundidadPuntero";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Card con perspectiva + tilt sutil (desktop) y lift al entrar en vista.
 * Lift (Framer) y tilt (CSS vars) viven en nodos distintos para no pelear transform.
 */
export function PuertaTilt({ children, className }: Props) {
  const tiltRef = useProfundidadPuntero<HTMLDivElement>({
    maxDeg: 2.5,
    maxPx: 0,
  });
  const reducido = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reducido ? false : { opacity: 0.92, y: 12 }}
      whileInView={reducido ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      whileHover={
        reducido
          ? undefined
          : {
              y: -4,
              boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
            }
      }
    >
      <div ref={tiltRef} data-tilt-root data-tilt-layer="card" className="h-full">
        {children}
      </div>
    </motion.div>
  );
}
