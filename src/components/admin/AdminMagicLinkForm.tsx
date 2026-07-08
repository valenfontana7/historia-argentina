"use client";

import { useState } from "react";

export function AdminMagicLinkForm() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendiente, setPendiente] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setMensaje(null);
    setError(null);
    setPendiente(true);
    try {
      const res = await fetch("/api/admin/magic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { ok: boolean; mensaje?: string };
      if (!data.ok) {
        setError(data.mensaje ?? "No pudimos enviarlo.");
        return;
      }
      setMensaje(data.mensaje ?? "Revisá tu casilla.");
    } catch {
      setError("Error de red. Probá de nuevo.");
    } finally {
      setPendiente(false);
    }
  }

  return (
    <form onSubmit={enviar} className="mx-auto max-w-md space-y-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu email de creador"
        className="w-full rounded-full border border-linea bg-fondo-2 px-5 py-3 text-sm text-tinta placeholder:text-tinta-tenue focus:border-oro/60 focus:outline-none"
      />
      <button
        type="submit"
        disabled={pendiente}
        className="w-full rounded-full bg-oro px-6 py-3 text-sm font-semibold text-fondo transition-colors hover:bg-oro-claro disabled:opacity-60"
      >
        {pendiente ? "Enviando…" : "Recibir enlace de acceso"}
      </button>
      {mensaje && (
        <p className="text-sm text-oro-claro" role="status">
          {mensaje}
        </p>
      )}
      {error && (
        <p className="text-sm text-carmesi" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
