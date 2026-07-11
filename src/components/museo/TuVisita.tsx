"use client";

import Link from "next/link";
import { useStorageSnapshot } from "@/lib/engagement/client-storage-sync";
import {
  obtenerProgresoSalas,
  obtenerRecientes,
  type ProgresoSala,
} from "@/lib/engagement/visita";
import { Reveal } from "@/components/ui/Reveal";
import { TransicionLink } from "@/components/navigation/TransicionLink";

type Props = {
  compacto?: boolean;
};

export function TuVisita({ compacto = false }: Props) {
  const salas = useStorageSnapshot(obtenerProgresoSalas, []);
  const recientes = useStorageSnapshot(obtenerRecientes, []);

  const enCurso = recientes.find(
    (r) => r.tipo === "cronica" && r.href.startsWith("/cronicas/"),
  );
  const salaActiva = salas.find((s) => s.vistas < s.total && s.vistas > 0);

  if (salas.length === 0 && !enCurso) return null;

  if (compacto) {
    return (
      <div className="rounded-sm border border-linea bg-fondo-2 px-4 py-3">
        {enCurso && (
          <TransicionLink
            href={enCurso.href}
            className="block text-sm text-oro-claro hover:text-oro"
          >
            Continuar: {enCurso.titulo} →
          </TransicionLink>
        )}
        {salaActiva && !enCurso && (
          <Link
            href={`/periodos/${salaActiva.epoca}`}
            className="block text-sm text-tinta-suave hover:text-oro-claro"
          >
            Sala {salaActiva.nombre}: {salaActiva.vistas}/{salaActiva.total} →
          </Link>
        )}
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <Reveal>
        <p className="kicker">Tu visita</p>
        <h2 className="titulo-display mt-3 text-2xl font-medium text-oro">
          Seguí recorriendo el museo
        </h2>
      </Reveal>

      {enCurso && (
        <Reveal delay={0.05} className="mt-6">
          <TransicionLink
            href={enCurso.href}
            className="group flex items-center justify-between rounded-sm border border-oro/30 bg-oro/5 px-5 py-4 transition-colors hover:border-oro/50"
          >
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.2em] text-oro">
                Exhibición en curso
              </p>
              <p className="titulo-display mt-1 text-lg font-medium group-hover:text-oro-claro">
                {enCurso.titulo}
              </p>
            </div>
            <span className="text-oro">→</span>
          </TransicionLink>
        </Reveal>
      )}

      {salas.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {salas.map((sala: ProgresoSala, i) => (
            <Reveal key={sala.epoca} delay={i * 0.04}>
              <Link
                href={`/periodos/${sala.epoca}`}
                className="block rounded-sm border border-linea bg-fondo-2 p-4 transition-colors hover:border-oro/40"
              >
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-tinta-tenue">
                  Sala
                </p>
                <p className="titulo-display mt-1 font-medium">{sala.nombre}</p>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-linea">
                  <div
                    className="h-full bg-oro transition-all"
                    style={{
                      width: `${sala.total > 0 ? (sala.vistas / sala.total) * 100 : 0}%`,
                    }}
                  />
                </div>
                <p className="mt-2 text-xs text-tinta-tenue">
                  {sala.vistas} de {sala.total} exhibiciones
                  {sala.vistas >= sala.total ? " · Completada" : ""}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
