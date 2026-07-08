"use client";

import { useState } from "react";
import {
  opcionesProximaCronica,
  type OpcionProximaCronica,
} from "@/data/voto-fundador";

type Props = {
  opcionActual?: string;
};

export function FormularioVotoFundador({ opcionActual }: Props) {
  const [seleccion, setSeleccion] = useState(opcionActual ?? "");
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">("idle");
  const [mensaje, setMensaje] = useState<string | null>(null);

  async function enviar(opcion: OpcionProximaCronica) {
    setSeleccion(opcion.slug);
    setEstado("enviando");
    setMensaje(null);
    try {
      const res = await fetch("/api/mecenas/voto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opcionSlug: opcion.slug }),
      });
      const data = (await res.json()) as { ok: boolean; mensaje?: string };
      if (!data.ok) {
        setEstado("error");
        setMensaje(data.mensaje ?? "No pudimos registrar tu voto.");
        return;
      }
      setEstado("ok");
      setMensaje("Gracias. Registramos tu voto.");
    } catch {
      setEstado("error");
      setMensaje("Error de red al enviar el voto.");
    }
  }

  return (
    <div className="mt-10 space-y-4">
      {opcionesProximaCronica.map((opcion) => {
        const activa = seleccion === opcion.slug;
        return (
          <button
            key={opcion.slug}
            type="button"
            disabled={estado === "enviando"}
            onClick={() => void enviar(opcion)}
            className={`block w-full rounded-sm border p-6 text-left transition-colors ${
              activa
                ? "border-oro/50 bg-oro/5"
                : "border-linea bg-fondo-2 hover:border-oro/30"
            }`}
          >
            <p className="titulo-display text-lg font-medium text-tinta">{opcion.titulo}</p>
            <p className="mt-2 text-sm text-tinta-suave">{opcion.bajada}</p>
            {activa && estado === "ok" && (
              <p className="mt-3 text-xs text-oro-claro">Tu voto actual</p>
            )}
          </button>
        );
      })}
      {mensaje && (
        <p
          className={`text-sm ${estado === "error" ? "text-carmesi" : "text-oro-claro"}`}
          role="status"
        >
          {mensaje}
        </p>
      )}
    </div>
  );
}
