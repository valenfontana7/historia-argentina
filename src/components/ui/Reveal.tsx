"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";
import { useEsCliente } from "@/lib/engagement/client-storage-sync";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

/**
 * Aparece con un fundido ascendente cuando entra al viewport.
 * Hasta el mount renderiza un `div` estático (igual que el SSR) para
 * evitar React #418; después habilita Framer Motion.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reducido = useReducedMotion();
  const montado = useEsCliente();

  if (!montado || reducido) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
