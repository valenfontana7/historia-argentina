"use client";

import { useState } from "react";

export function AdminLoginForm() {
  const [secreto, setSecreto] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pendiente, setPendiente] = useState(false);

  async function ingresar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPendiente(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secreto }),
      });
      const data = (await res.json()) as { ok: boolean; mensaje?: string };
      if (!data.ok) {
        setError(data.mensaje ?? "No pudimos iniciar sesión.");
        return;
      }
      window.location.reload();
    } catch {
      setError("Error de red. Probá de nuevo.");
    } finally {
      setPendiente(false);
    }
  }

  return (
    <form onSubmit={ingresar} className="mx-auto max-w-sm space-y-4">
      <label className="block text-left text-xs uppercase tracking-[0.18em] text-tinta-tenue">
        Secreto de admin
        <input
          type="password"
          required
          value={secreto}
          onChange={(e) => setSecreto(e.target.value)}
          className="mt-2 w-full rounded-full border border-linea bg-fondo px-5 py-3 text-sm normal-case tracking-normal text-tinta focus:border-oro/60 focus:outline-none"
        />
      </label>
      <button
        type="submit"
        disabled={pendiente}
        className="w-full rounded-full bg-oro px-6 py-3 text-sm font-semibold text-fondo transition-colors hover:bg-oro-claro disabled:opacity-60"
      >
        {pendiente ? "Verificando…" : "Entrar"}
      </button>
      {error && (
        <p className="text-sm text-carmesi" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
