"use client";

import Link from "next/link";
import { useActionState } from "react";
import { suscribir, type EstadoSuscripcion } from "@/app/acciones";

export function BoletinForm() {
  const [estado, accion, pendiente] = useActionState<EstadoSuscripcion | null, FormData>(
    suscribir,
    null,
  );

  return (
    <div>
      <form action={accion} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row sm:gap-2">
        <label htmlFor="boletin-email" className="sr-only">
          Tu email
        </label>
        <input
          id="boletin-email"
          name="email"
          type="email"
          required
          placeholder="tu@email.com"
          className="w-full rounded-full border border-linea bg-fondo-2 px-5 py-3 text-sm text-tinta placeholder:text-tinta-tenue focus:border-oro/60 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pendiente}
          className="w-full shrink-0 rounded-full bg-oro px-6 py-3 text-sm font-semibold text-fondo transition-colors hover:bg-oro-claro disabled:opacity-60 sm:w-auto"
        >
          {pendiente ? "..." : "Suscribirme"}
        </button>
      </form>
      {estado && (
        <div className="mt-3 text-center" role="status">
          <p className={`text-sm ${estado.ok ? "text-oro-claro" : "text-carmesi"}`}>
            {estado.mensaje}
          </p>
          {estado.ok && estado.upsell && (
            <p className="mt-2 text-sm text-tinta-suave">
              ¿Querés el anticipo de nuevas crónicas?{" "}
              <Link href="/membresia" className="text-oro-claro underline-offset-4 hover:underline">
                Conocé Mecenas
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
