"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type DatoGiganteProps = {
  valor: number;
  prefijo?: string;
  sufijo?: string;
  etiqueta: string;
};

/** Años calendarios del relato: sin separador de miles. Cantidades sí (es-AR). */
function esAnioCalendario(valor: number): boolean {
  return Number.isInteger(valor) && valor >= 1400 && valor <= 2100;
}

function formatearCifra(n: number, comoAnio: boolean): string {
  const entero = Math.round(n);
  if (comoAnio) return String(entero);
  return entero.toLocaleString("es-AR");
}

/** Cifra enorme que cuenta desde cero cuando entra al viewport. */
export function DatoGigante({ valor, prefijo = "", sufijo = "", etiqueta }: DatoGiganteProps) {
  const contenedor = useRef<HTMLDivElement>(null);
  const numero = useRef<HTMLSpanElement>(null);
  const comoAnio = esAnioCalendario(valor);

  useGSAP(
    () => {
      const objetivo = { n: 0 };
      gsap.to(objetivo, {
        n: valor,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: { trigger: contenedor.current, start: "top 80%" },
        onUpdate: () => {
          if (numero.current) {
            numero.current.textContent = formatearCifra(objetivo.n, comoAnio);
          }
        },
      });
    },
    { scope: contenedor, dependencies: [valor, comoAnio] },
  );

  return (
    <div ref={contenedor} className="text-center">
      <p className="titulo-display text-6xl font-semibold text-oro sm:text-7xl">
        {prefijo}
        <span ref={numero}>0</span>
        {sufijo}
      </p>
      <p className="mx-auto mt-3 max-w-[16rem] text-sm uppercase tracking-[0.18em] text-tinta-suave">
        {etiqueta}
      </p>
    </div>
  );
}

/** Grilla para mostrar varios datos gigantes en fila. */
export function FilaDeDatos({ children }: { children: ReactNode }) {
  return (
    <section className="textura-mapa relative bg-fondo-3 py-24">
      <div className="relative mx-auto grid max-w-5xl grid-cols-1 gap-16 px-5 sm:grid-cols-3">
        {children}
      </div>
    </section>
  );
}
