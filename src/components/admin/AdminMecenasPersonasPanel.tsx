"use client";

import { useCallback, useEffect, useState } from "react";
import type { EstadoMecenas, PlanMecenas } from "@prisma/client";
import type { MecenasAdminRow } from "@/lib/mecenas-admin";
import type { PlanId } from "@/lib/membresia.config";
import { planes } from "@/lib/membresia.config";

type Props = {
  initialDatos: MecenasAdminRow[];
  initialTotal: number;
  initialPagina: number;
  initialTotalPaginas: number;
};

type ListadoResponse = {
  ok: boolean;
  datos?: MecenasAdminRow[];
  total?: number;
  pagina?: number;
  totalPaginas?: number;
  mensaje?: string;
};

const ESTADOS: EstadoMecenas[] = ["activo", "pendiente", "cancelado", "vencido"];
const PLANES: PlanMecenas[] = ["mensual", "fundador"];

function formatearFecha(iso: string | null): string {
  if (!iso) return "Indefinido";
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function fechaInputDesdeIso(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function pillEstado(estado: EstadoMecenas): string {
  switch (estado) {
    case "activo":
      return "bg-oro/15 text-oro-claro";
    case "pendiente":
      return "bg-amber-500/15 text-amber-200";
    case "cancelado":
      return "bg-carmesi/15 text-carmesi";
    case "vencido":
      return "bg-tinta-tenue/20 text-tinta-tenue";
    default: {
      const _exhaustive: never = estado;
      return _exhaustive;
    }
  }
}

function labelPlan(plan: PlanMecenas): string {
  return plan === "fundador" ? planes.fundador.nombre : planes.mensual.nombre;
}

export function AdminMecenasPersonasPanel({
  initialDatos,
  initialTotal,
  initialPagina,
  initialTotalPaginas,
}: Props) {
  const [datos, setDatos] = useState(initialDatos);
  const [total, setTotal] = useState(initialTotal);
  const [pagina, setPagina] = useState(initialPagina);
  const [totalPaginas, setTotalPaginas] = useState(initialTotalPaginas);

  const [filtroQ, setFiltroQ] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroPlan, setFiltroPlan] = useState("");
  const [filtroExento, setFiltroExento] = useState("");

  const [mostrarAlta, setMostrarAlta] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [advertencia, setAdvertencia] = useState<string | null>(null);

  const [altaForm, setAltaForm] = useState({
    email: "",
    plan: "mensual" as PlanId,
    exentoFacturacion: true,
    sinVencimiento: false,
    periodEnd: "",
    enviarEmail: true,
    nombrePublico: "",
    notasAdmin: "",
  });

  const [editForm, setEditForm] = useState({
    estado: "activo" as EstadoMecenas,
    plan: "mensual" as PlanId,
    exentoFacturacion: false,
    sinVencimiento: false,
    periodEnd: "",
    esFundador: false,
    nombrePublico: "",
    mostrarCredito: true,
    notasAdmin: "",
    tieneSuscripcionMp: false,
  });

  const cargarListado = useCallback(
    async (paginaTarget: number) => {
      setCargando(true);
      setError(null);
      try {
        const params = new URLSearchParams({ pagina: String(paginaTarget) });
        if (filtroQ.trim()) params.set("q", filtroQ.trim());
        if (filtroEstado) params.set("estado", filtroEstado);
        if (filtroPlan) params.set("plan", filtroPlan);
        if (filtroExento) params.set("exento", filtroExento);

        const res = await fetch(`/api/admin/mecenas/personas?${params}`);
        const data = (await res.json()) as ListadoResponse;
        if (!data.ok || !data.datos) {
          setError(data.mensaje ?? "No pudimos cargar el listado.");
          return;
        }
        setDatos(data.datos);
        setTotal(data.total ?? 0);
        setPagina(data.pagina ?? 1);
        setTotalPaginas(data.totalPaginas ?? 1);
      } catch {
        setError("Error de red al cargar el listado.");
      } finally {
        setCargando(false);
      }
    },
    [filtroQ, filtroEstado, filtroPlan, filtroExento],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      void cargarListado(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [filtroQ, filtroEstado, filtroPlan, filtroExento, cargarListado]);

  function abrirEdicion(row: MecenasAdminRow) {
    setEditandoId(row.id);
    setEditForm({
      estado: row.estado,
      plan: row.plan === "fundador" ? "fundador" : "mensual",
      exentoFacturacion: row.exentoFacturacion,
      sinVencimiento: row.periodEnd === null,
      periodEnd: fechaInputDesdeIso(row.periodEnd),
      esFundador: row.esFundador,
      nombrePublico: row.nombrePublico ?? "",
      mostrarCredito: row.mostrarCredito,
      notasAdmin: row.notasAdmin ?? "",
      tieneSuscripcionMp: row.tieneSuscripcionMp,
    });
    setError(null);
    setMensaje(null);
    setAdvertencia(null);
  }

  async function crearMecenas(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setError(null);
    setMensaje(null);
    setAdvertencia(null);

    try {
      const res = await fetch("/api/admin/mecenas/personas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: altaForm.email,
          plan: altaForm.plan,
          exentoFacturacion: altaForm.exentoFacturacion,
          sinVencimiento: altaForm.sinVencimiento,
          periodEnd: altaForm.sinVencimiento ? null : altaForm.periodEnd || undefined,
          enviarEmail: altaForm.enviarEmail,
          nombrePublico: altaForm.nombrePublico || undefined,
          notasAdmin: altaForm.notasAdmin || undefined,
        }),
      });
      const data = (await res.json()) as { ok: boolean; mensaje?: string };
      if (!data.ok) {
        setError(data.mensaje ?? "No pudimos crear el mecenas.");
        return;
      }

      setMensaje("Mecenas creado correctamente.");
      setMostrarAlta(false);
      setAltaForm({
        email: "",
        plan: "mensual",
        exentoFacturacion: true,
        sinVencimiento: false,
        periodEnd: "",
        enviarEmail: true,
        nombrePublico: "",
        notasAdmin: "",
      });
      await cargarListado(1);
    } catch {
      setError("Error de red al crear el mecenas.");
    } finally {
      setGuardando(false);
    }
  }

  async function guardarEdicion(e: React.FormEvent) {
    e.preventDefault();
    if (!editandoId) return;

    setGuardando(true);
    setError(null);
    setMensaje(null);
    setAdvertencia(null);

    try {
      const res = await fetch(`/api/admin/mecenas/personas/${editandoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estado: editForm.estado,
          plan: editForm.plan,
          exentoFacturacion: editForm.exentoFacturacion,
          sinVencimiento: editForm.sinVencimiento,
          periodEnd: editForm.sinVencimiento ? null : editForm.periodEnd || null,
          esFundador: editForm.esFundador,
          nombrePublico: editForm.nombrePublico || null,
          mostrarCredito: editForm.mostrarCredito,
          notasAdmin: editForm.notasAdmin || null,
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        mensaje?: string;
        advertenciaMp?: string;
      };
      if (!data.ok) {
        setError(data.mensaje ?? "No pudimos guardar los cambios.");
        return;
      }

      setMensaje("Cambios guardados.");
      if (data.advertenciaMp) setAdvertencia(data.advertenciaMp);
      setEditandoId(null);
      await cargarListado(pagina);
    } catch {
      setError("Error de red al guardar.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-tinta-suave">
            {total} mecenas en total
            {cargando ? " · actualizando…" : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMostrarAlta((v) => !v)}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-oro px-5 text-sm font-semibold text-fondo transition-colors hover:bg-oro-claro sm:w-auto"
        >
          {mostrarAlta ? "Ocultar formulario" : "Agregar mecenas"}
        </button>
      </div>

      {mostrarAlta && (
        <form
          onSubmit={crearMecenas}
          className="rounded-sm border border-linea bg-fondo-2 p-6 space-y-4"
        >
          <h2 className="titulo-display text-lg font-semibold">Alta manual</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.16em] text-tinta-tenue">Email</span>
              <input
                type="email"
                required
                value={altaForm.email}
                onChange={(e) => setAltaForm((p) => ({ ...p, email: e.target.value }))}
                className="mt-2 min-h-11 w-full rounded-sm border border-linea bg-fondo px-3 py-2 text-base text-tinta outline-none focus:border-oro/50 sm:text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.16em] text-tinta-tenue">Plan</span>
              <select
                value={altaForm.plan}
                onChange={(e) =>
                  setAltaForm((p) => ({ ...p, plan: e.target.value as PlanId }))
                }
                className="mt-2 min-h-11 w-full rounded-sm border border-linea bg-fondo px-3 py-2 text-base text-tinta outline-none focus:border-oro/50 sm:text-sm"
              >
                <option value="mensual">{planes.mensual.nombre}</option>
                <option value="fundador">{planes.fundador.nombre}</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.16em] text-tinta-tenue">
                Vencimiento
              </span>
              <input
                type="datetime-local"
                disabled={altaForm.sinVencimiento}
                value={altaForm.periodEnd}
                onChange={(e) => setAltaForm((p) => ({ ...p, periodEnd: e.target.value }))}
                className="mt-2 min-h-11 w-full rounded-sm border border-linea bg-fondo px-3 py-2 text-base text-tinta outline-none focus:border-oro/50 disabled:opacity-50 sm:text-sm"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-tinta-suave">
              <input
                type="checkbox"
                checked={altaForm.exentoFacturacion}
                onChange={(e) =>
                  setAltaForm((p) => ({ ...p, exentoFacturacion: e.target.checked }))
                }
              />
              Cortesía (sin cobro)
            </label>
            <label className="flex items-center gap-2 text-sm text-tinta-suave">
              <input
                type="checkbox"
                checked={altaForm.sinVencimiento}
                onChange={(e) =>
                  setAltaForm((p) => ({ ...p, sinVencimiento: e.target.checked }))
                }
              />
              Sin vencimiento
            </label>
            <label className="flex items-center gap-2 text-sm text-tinta-suave sm:col-span-2">
              <input
                type="checkbox"
                checked={altaForm.enviarEmail}
                onChange={(e) =>
                  setAltaForm((p) => ({ ...p, enviarEmail: e.target.checked }))
                }
              />
              Enviar email de acceso
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.16em] text-tinta-tenue">
                Nombre público
              </span>
              <input
                type="text"
                value={altaForm.nombrePublico}
                onChange={(e) =>
                  setAltaForm((p) => ({ ...p, nombrePublico: e.target.value }))
                }
                className="mt-2 min-h-11 w-full rounded-sm border border-linea bg-fondo px-3 py-2 text-base text-tinta outline-none focus:border-oro/50 sm:text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.16em] text-tinta-tenue">
                Notas admin
              </span>
              <input
                type="text"
                value={altaForm.notasAdmin}
                onChange={(e) => setAltaForm((p) => ({ ...p, notasAdmin: e.target.value }))}
                className="mt-2 min-h-11 w-full rounded-sm border border-linea bg-fondo px-3 py-2 text-base text-tinta outline-none focus:border-oro/50 sm:text-sm"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={guardando}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-oro px-5 text-sm font-semibold text-fondo transition-colors hover:bg-oro-claro disabled:opacity-60 sm:w-auto"
          >
            {guardando ? "Creando…" : "Crear mecenas"}
          </button>
        </form>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          <span className="text-xs uppercase tracking-[0.16em] text-tinta-tenue">Buscar email</span>
          <input
            type="search"
            value={filtroQ}
            onChange={(e) => setFiltroQ(e.target.value)}
            placeholder="ejemplo@…"
            className="mt-2 min-h-11 w-full rounded-sm border border-linea bg-fondo px-3 py-2 text-base text-tinta outline-none focus:border-oro/50 sm:text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.16em] text-tinta-tenue">Estado</span>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="mt-2 min-h-11 w-full rounded-sm border border-linea bg-fondo px-3 py-2 text-base text-tinta outline-none focus:border-oro/50 sm:text-sm"
          >
            <option value="">Todos</option>
            {ESTADOS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.16em] text-tinta-tenue">Plan</span>
          <select
            value={filtroPlan}
            onChange={(e) => setFiltroPlan(e.target.value)}
            className="mt-2 min-h-11 w-full rounded-sm border border-linea bg-fondo px-3 py-2 text-base text-tinta outline-none focus:border-oro/50 sm:text-sm"
          >
            <option value="">Todos</option>
            {PLANES.map((p) => (
              <option key={p} value={p}>
                {labelPlan(p)}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.16em] text-tinta-tenue">Cortesía</span>
          <select
            value={filtroExento}
            onChange={(e) => setFiltroExento(e.target.value)}
            className="mt-2 min-h-11 w-full rounded-sm border border-linea bg-fondo px-3 py-2 text-base text-tinta outline-none focus:border-oro/50 sm:text-sm"
          >
            <option value="">Todos</option>
            <option value="true">Solo cortesía</option>
            <option value="false">Solo pagos</option>
          </select>
        </label>
      </div>

      {datos.length === 0 ? (
        <p className="rounded-sm border border-linea px-4 py-8 text-center text-sm text-tinta-suave">
          No hay mecenas con estos filtros.
        </p>
      ) : (
        <>
          <ul className="space-y-3 md:hidden">
            {datos.map((row) => (
              <li
                key={row.id}
                className="rounded-sm border border-linea bg-fondo-2 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="break-all text-sm font-medium text-tinta">
                    {row.email}
                  </span>
                  {row.exentoFacturacion && (
                    <span className="rounded-full bg-oro/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-oro-claro">
                      Cortesía
                    </span>
                  )}
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <dt className="text-xs uppercase tracking-[0.14em] text-tinta-tenue">
                      Plan
                    </dt>
                    <dd className="mt-0.5 text-tinta-suave">{labelPlan(row.plan)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.14em] text-tinta-tenue">
                      Estado
                    </dt>
                    <dd className="mt-0.5">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs uppercase tracking-wider ${pillEstado(row.estado)}`}
                      >
                        {row.estado}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.14em] text-tinta-tenue">
                      Vence
                    </dt>
                    <dd className="mt-0.5 text-tinta-suave">
                      {formatearFecha(row.periodEnd)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.14em] text-tinta-tenue">
                      Origen
                    </dt>
                    <dd className="mt-0.5 text-tinta-suave">
                      {row.origen === "mercadopago" ? "MercadoPago" : "Manual"}
                    </dd>
                  </div>
                </dl>
                <button
                  type="button"
                  onClick={() => abrirEdicion(row)}
                  className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-oro/50 text-sm font-semibold text-oro-claro transition-colors hover:bg-oro/10"
                >
                  Editar
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-x-auto rounded-sm border border-linea md:block">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-linea bg-fondo-2 text-xs uppercase tracking-[0.14em] text-tinta-tenue">
                <tr>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Plan</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Vence</th>
                  <th className="px-4 py-3 font-medium">Origen</th>
                  <th className="px-4 py-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-linea-suave last:border-0"
                  >
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-tinta">{row.email}</span>
                        {row.exentoFacturacion && (
                          <span className="rounded-full bg-oro/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-oro-claro">
                            Cortesía
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-tinta-suave">
                      {labelPlan(row.plan)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs uppercase tracking-wider ${pillEstado(row.estado)}`}
                      >
                        {row.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-tinta-suave">
                      {formatearFecha(row.periodEnd)}
                    </td>
                    <td className="px-4 py-3 text-tinta-suave">
                      {row.origen === "mercadopago" ? "MercadoPago" : "Manual"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => abrirEdicion(row)}
                        className="inline-flex min-h-11 items-center rounded-full border border-oro/50 px-4 text-sm font-semibold text-oro-claro transition-colors hover:bg-oro/10"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={pagina <= 1 || cargando}
            onClick={() => void cargarListado(pagina - 1)}
            className="inline-flex min-h-11 items-center rounded-full border border-linea px-4 text-sm text-tinta-suave disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm text-tinta-tenue">
            Página {pagina} de {totalPaginas}
          </span>
          <button
            type="button"
            disabled={pagina >= totalPaginas || cargando}
            onClick={() => void cargarListado(pagina + 1)}
            className="inline-flex min-h-11 items-center rounded-full border border-linea px-4 text-sm text-tinta-suave disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}

      {editandoId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-fondo/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="editar-mecenas-titulo"
        >
          <form
            onSubmit={guardarEdicion}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-sm border border-linea bg-fondo-2 p-6 space-y-4"
          >
            <h2 id="editar-mecenas-titulo" className="titulo-display text-lg font-semibold">
              Editar mecenas
            </h2>

            {editForm.tieneSuscripcionMp && editForm.exentoFacturacion && (
              <p className="rounded-sm border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
                Este mecenas tiene suscripción activa en MercadoPago. Marcar cortesía no cancela
                el cobro automático.
              </p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs uppercase tracking-[0.16em] text-tinta-tenue">Estado</span>
                <select
                  value={editForm.estado}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, estado: e.target.value as EstadoMecenas }))
                  }
                  className="mt-2 min-h-11 w-full rounded-sm border border-linea bg-fondo px-3 py-2 text-base text-tinta outline-none focus:border-oro/50 sm:text-sm"
                >
                  {ESTADOS.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.16em] text-tinta-tenue">Plan</span>
                <select
                  value={editForm.plan}
                  onChange={(e) =>
                    setEditForm((p) => ({
                      ...p,
                      plan: e.target.value as PlanId,
                      esFundador: e.target.value === "fundador",
                    }))
                  }
                  className="mt-2 min-h-11 w-full rounded-sm border border-linea bg-fondo px-3 py-2 text-base text-tinta outline-none focus:border-oro/50 sm:text-sm"
                >
                  <option value="mensual">{planes.mensual.nombre}</option>
                  <option value="fundador">{planes.fundador.nombre}</option>
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs uppercase tracking-[0.16em] text-tinta-tenue">
                  Vencimiento
                </span>
                <input
                  type="datetime-local"
                  disabled={editForm.sinVencimiento}
                  value={editForm.periodEnd}
                  onChange={(e) => setEditForm((p) => ({ ...p, periodEnd: e.target.value }))}
                  className="mt-2 min-h-11 w-full rounded-sm border border-linea bg-fondo px-3 py-2 text-base text-tinta outline-none focus:border-oro/50 disabled:opacity-50 sm:text-sm"
                />
              </label>
              <label className="flex items-center gap-2 text-sm text-tinta-suave">
                <input
                  type="checkbox"
                  checked={editForm.exentoFacturacion}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, exentoFacturacion: e.target.checked }))
                  }
                />
                Cortesía (sin cobro)
              </label>
              <label className="flex items-center gap-2 text-sm text-tinta-suave">
                <input
                  type="checkbox"
                  checked={editForm.sinVencimiento}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, sinVencimiento: e.target.checked }))
                  }
                />
                Sin vencimiento
              </label>
              <label className="flex items-center gap-2 text-sm text-tinta-suave">
                <input
                  type="checkbox"
                  checked={editForm.mostrarCredito}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, mostrarCredito: e.target.checked }))
                  }
                />
                Mostrar en mural
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs uppercase tracking-[0.16em] text-tinta-tenue">
                  Nombre público
                </span>
                <input
                  type="text"
                  value={editForm.nombrePublico}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, nombrePublico: e.target.value }))
                  }
                  className="mt-2 min-h-11 w-full rounded-sm border border-linea bg-fondo px-3 py-2 text-base text-tinta outline-none focus:border-oro/50 sm:text-sm"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs uppercase tracking-[0.16em] text-tinta-tenue">
                  Notas admin
                </span>
                <textarea
                  rows={2}
                  value={editForm.notasAdmin}
                  onChange={(e) => setEditForm((p) => ({ ...p, notasAdmin: e.target.value }))}
                  className="mt-2 min-h-11 w-full rounded-sm border border-linea bg-fondo px-3 py-2 text-base text-tinta outline-none focus:border-oro/50 sm:text-sm"
                />
              </label>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="submit"
                disabled={guardando}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-oro px-5 text-sm font-semibold text-fondo transition-colors hover:bg-oro-claro disabled:opacity-60 sm:w-auto"
              >
                {guardando ? "Guardando…" : "Guardar"}
              </button>
              <button
                type="button"
                onClick={() => setEditandoId(null)}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-linea px-5 text-sm text-tinta-suave sm:w-auto"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {mensaje && (
        <p className="text-center text-sm text-oro-claro" role="status">
          {mensaje}
        </p>
      )}
      {advertencia && (
        <p className="text-center text-sm text-amber-200" role="status">
          {advertencia}
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
