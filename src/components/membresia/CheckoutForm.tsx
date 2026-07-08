"use client";

import { useState } from "react";
import { ACCESO_EMAIL } from "@/lib/copy";
import type { PlanId } from "@/lib/membresia.config";

type Props = {
  plan: PlanId;
  etiqueta: string;
  destacado?: boolean;
};

export function CheckoutForm({ plan, etiqueta, destacado = false }: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pendiente, setPendiente] = useState(false);

  async function pagar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPendiente(true);
    try {
      const res = await fetch("/api/mp/crear-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, email }),
      });
      const data = (await res.json()) as { ok: boolean; initPoint?: string; mensaje?: string };
      if (!data.ok || !data.initPoint) {
        setError(data.mensaje ?? "No pudimos iniciar el pago.");
        return;
      }
      window.location.href = data.initPoint;
    } catch {
      setError("Error de red. Probá de nuevo.");
    } finally {
      setPendiente(false);
    }
  }

  return (
    <form onSubmit={pagar} className="mt-6 space-y-3">
      <label className="block text-left text-xs uppercase tracking-[0.18em] text-tinta-tenue">
        Tu email
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          className="mt-2 w-full rounded-full border border-linea bg-fondo px-5 py-3 text-sm normal-case tracking-normal text-tinta placeholder:text-tinta-tenue focus:border-oro/60 focus:outline-none"
        />
      </label>
      <p className="text-left text-xs leading-relaxed text-tinta-tenue">
        Usá el mismo email para entrar después del pago. {ACCESO_EMAIL}
      </p>
      <button
        type="submit"
        disabled={pendiente}
        className={`w-full rounded-full px-6 py-3 text-sm font-semibold transition-colors disabled:opacity-60 ${
          destacado
            ? "bg-oro text-fondo hover:bg-oro-claro"
            : "border border-oro/50 text-oro-claro hover:bg-oro/10"
        }`}
      >
        {pendiente ? "Un momento…" : etiqueta}
      </button>
      {error && (
        <p className="text-sm text-carmesi" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
