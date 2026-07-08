"use client";

import { useState } from "react";
import type { PlanId } from "@/lib/membresia.config";
import { formatearPrecio, planes } from "@/lib/membresia.config";
import type { MembresiaSettingsData } from "@/lib/membresia-settings";

type Props = {
  initialSettings: MembresiaSettingsData;
  creatorEmails: string[];
  creatorPrecio: number;
};

function precioDePlan(settings: MembresiaSettingsData, plan: PlanId): number {
  return plan === "mensual" ? settings.precioMensual : settings.precioFundador;
}

export function AdminMecenasPanel({
  initialSettings,
  creatorEmails,
  creatorPrecio,
}: Props) {
  const [settings, setSettings] = useState(initialSettings);
  const [preciosEdit, setPreciosEdit] = useState({
    mensual: String(initialSettings.precioMensual),
    fundador: String(initialSettings.precioFundador),
  });
  const [guardando, setGuardando] = useState<PlanId | "precios" | null>(null);
  const [probando, setProbando] = useState<PlanId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const emailPrueba = creatorEmails[0] ?? "";

  async function patchSettings(body: {
    mensualHabilitado?: boolean;
    fundadorHabilitado?: boolean;
    precioMensual?: number;
    precioFundador?: number;
  }) {
    const res = await fetch("/api/admin/mecenas", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as {
      ok: boolean;
      settings?: MembresiaSettingsData;
      mensaje?: string;
    };
    if (!data.ok || !data.settings) {
      setError(data.mensaje ?? "No pudimos guardar los cambios.");
      return null;
    }
    setSettings(data.settings);
    return data.settings;
  }

  async function togglePlan(plan: PlanId, habilitado: boolean) {
    setError(null);
    setMensaje(null);
    setGuardando(plan);
    try {
      const body =
        plan === "mensual"
          ? { mensualHabilitado: habilitado }
          : { fundadorHabilitado: habilitado };

      const updated = await patchSettings(body);
      if (updated) {
        setMensaje(
          `${planes[plan].nombre} ${habilitado ? "habilitado" : "deshabilitado"} para el público.`,
        );
      }
    } catch {
      setError("Error de red. Probá de nuevo.");
    } finally {
      setGuardando(null);
    }
  }

  async function guardarPrecios() {
    setError(null);
    setMensaje(null);
    setGuardando("precios");

    const precioMensual = Number.parseInt(preciosEdit.mensual, 10);
    const precioFundador = Number.parseInt(preciosEdit.fundador, 10);

    if (!Number.isFinite(precioMensual) || precioMensual < 100) {
      setError("El precio mensual debe ser un entero de al menos $100.");
      setGuardando(null);
      return;
    }
    if (!Number.isFinite(precioFundador) || precioFundador < 100) {
      setError("El precio fundador debe ser un entero de al menos $100.");
      setGuardando(null);
      return;
    }

    try {
      const updated = await patchSettings({ precioMensual, precioFundador });
      if (updated) {
        setPreciosEdit({
          mensual: String(updated.precioMensual),
          fundador: String(updated.precioFundador),
        });
        setMensaje("Precios actualizados. El checkout usará los nuevos montos.");
      }
    } catch {
      setError("Error de red. Probá de nuevo.");
    } finally {
      setGuardando(null);
    }
  }

  async function probarCheckout(plan: PlanId) {
    if (!emailPrueba) {
      setError("Configurá MECENAS_CREATOR_EMAILS para probar el checkout.");
      return;
    }

    setError(null);
    setMensaje(null);
    setProbando(plan);
    try {
      const res = await fetch("/api/mp/crear-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, email: emailPrueba }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        initPoint?: string;
        mensaje?: string;
      };
      if (!data.ok || !data.initPoint) {
        setError(data.mensaje ?? "No pudimos iniciar el pago de prueba.");
        return;
      }
      window.location.href = data.initPoint;
    } catch {
      setError("Error de red. Probá de nuevo.");
    } finally {
      setProbando(null);
    }
  }

  const filas: { plan: PlanId; habilitado: boolean }[] = [
    { plan: "mensual", habilitado: settings.mensualHabilitado },
    { plan: "fundador", habilitado: settings.fundadorHabilitado },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="rounded-sm border border-linea bg-fondo-2 p-6 text-sm text-tinta-suave">
        <p className="font-medium text-oro-claro">Checkout de creador</p>
        <p className="mt-2">
          Los emails configurados en{" "}
          <code className="text-tinta">MECENAS_CREATOR_EMAILS</code> pagan{" "}
          <strong className="text-tinta">{formatearPrecio(creatorPrecio)}</strong> en
          MercadoPago, aunque el plan esté apagado para el público.
        </p>
        {creatorEmails.length > 0 ? (
          <ul className="mt-3 list-inside list-disc">
            {creatorEmails.map((email) => (
              <li key={email}>{email}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-carmesi">
            Todavía no hay emails de creador configurados.
          </p>
        )}
      </div>

      <div className="rounded-sm border border-linea bg-fondo-2 p-6">
        <h2 className="titulo-display text-lg font-semibold">Precios públicos</h2>
        <p className="mt-2 text-sm text-tinta-suave">
          Estos montos se muestran en{" "}
          <code className="text-tinta">/membresia</code> y se envían a MercadoPago al
          crear un checkout.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.16em] text-tinta-tenue">
              {planes.mensual.nombre}
            </span>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-tinta-suave">$</span>
              <input
                type="number"
                min={100}
                step={1}
                value={preciosEdit.mensual}
                onChange={(e) =>
                  setPreciosEdit((prev) => ({ ...prev, mensual: e.target.value }))
                }
                className="w-full rounded-sm border border-linea bg-fondo px-3 py-2 text-sm text-tinta outline-none focus:border-oro/50"
              />
              <span className="shrink-0 text-xs text-tinta-tenue">/ mes</span>
            </div>
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-[0.16em] text-tinta-tenue">
              {planes.fundador.nombre}
            </span>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-tinta-suave">$</span>
              <input
                type="number"
                min={100}
                step={1}
                value={preciosEdit.fundador}
                onChange={(e) =>
                  setPreciosEdit((prev) => ({ ...prev, fundador: e.target.value }))
                }
                className="w-full rounded-sm border border-linea bg-fondo px-3 py-2 text-sm text-tinta outline-none focus:border-oro/50"
              />
              <span className="shrink-0 text-xs text-tinta-tenue">/ año</span>
            </div>
          </label>
        </div>
        <button
          type="button"
          disabled={guardando === "precios"}
          onClick={guardarPrecios}
          className="mt-4 rounded-full bg-oro px-5 py-2 text-sm font-semibold text-fondo transition-colors hover:bg-oro-claro disabled:opacity-60"
        >
          {guardando === "precios" ? "Guardando…" : "Guardar precios"}
        </button>
      </div>

      <div className="space-y-4">
        {filas.map(({ plan, habilitado }) => (
          <div
            key={plan}
            className="flex flex-col gap-4 rounded-sm border border-linea bg-fondo-2 p-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2 className="titulo-display text-xl font-semibold">
                {planes[plan].nombre}
              </h2>
              <p className="mt-1 text-sm text-tinta-suave">
                Público: {formatearPrecio(precioDePlan(settings, plan))}{" "}
                {planes[plan].periodo}
              </p>
              <p className="mt-1 text-xs text-tinta-tenue">
                {habilitado ? "Visible en /membresia" : "Oculto para visitantes"}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={guardando === plan}
                onClick={() => togglePlan(plan, !habilitado)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${
                  habilitado
                    ? "border border-carmesi/50 text-carmesi hover:bg-carmesi/10"
                    : "bg-oro text-fondo hover:bg-oro-claro"
                }`}
              >
                {guardando === plan
                  ? "Guardando…"
                  : habilitado
                    ? "Desactivar"
                    : "Activar"}
              </button>
              <button
                type="button"
                disabled={probando === plan || !emailPrueba}
                onClick={() => probarCheckout(plan)}
                className="rounded-full border border-oro/50 px-5 py-2 text-sm font-semibold text-oro-claro transition-colors hover:bg-oro/10 disabled:opacity-60"
              >
                {probando === plan
                  ? "Redirigiendo…"
                  : `Probar checkout (${formatearPrecio(creatorPrecio)})`}
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-tinta-tenue">
        Última actualización:{" "}
        {new Intl.DateTimeFormat("es-AR", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(settings.updatedAt))}
      </p>

      {mensaje && (
        <p className="text-center text-sm text-oro-claro" role="status">
          {mensaje}
        </p>
      )}
      {error && (
        <p className="text-center text-sm text-carmesi" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
