"use client";

import { useEffect, useState } from "react";
import { MagicLinkForm } from "@/components/membresia/MagicLinkForm";

type Props = {
  emailInicial?: string;
};

type ResultadoSync = {
  ok: boolean;
  estado?: string;
  emailEnviado?: boolean;
  errorEmail?: string;
  mensaje?: string;
};

export function GraciasPostPago({ emailInicial }: Props) {
  const [estado, setEstado] = useState<
    "idle" | "sincronizando" | "activado" | "activo" | "pendiente" | "error"
  >("idle");
  const [mensajeSync, setMensajeSync] = useState<string | null>(null);

  useEffect(() => {
    if (!emailInicial) return;

    let cancelado = false;

    async function sincronizar() {
      setEstado("sincronizando");
      try {
        const res = await fetch("/api/mp/sincronizar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailInicial, reenviarEmail: true }),
        });
        const data = (await res.json()) as ResultadoSync;

        if (cancelado) return;

        if (!data.ok) {
          setEstado("error");
          setMensajeSync(data.mensaje ?? "No pudimos verificar el pago.");
          return;
        }

        if (data.errorEmail) {
          setEstado("error");
          setMensajeSync(
            `Tu membresía está activa pero el email falló: ${data.errorEmail}`,
          );
          return;
        }

        switch (data.estado) {
          case "activado":
            setEstado("activado");
            setMensajeSync(
              data.emailEnviado
                ? "¡Listo! Te mandamos un email de confirmación con tu enlace de acceso."
                : "Membresía activada. Pedí el enlace abajo si no llegó el email.",
            );
            break;
          case "activo":
            setEstado("activo");
            setMensajeSync(
              data.emailEnviado
                ? "Te reenviamos el email de confirmación con tu enlace de acceso."
                : "Tu membresía ya está activa. Pedí el enlace abajo si no llegó el email.",
            );
            break;
          case "pendiente":
            setEstado("pendiente");
            setMensajeSync(
              "MercadoPago todavía está procesando el pago. Revisá tu casilla en unos minutos o pedí el enlace abajo.",
            );
            break;
          default:
            setEstado("pendiente");
            setMensajeSync(
              "No encontramos tu pago todavía. Probá de nuevo en unos minutos o pedí el enlace con el mismo email.",
            );
        }
      } catch {
        if (!cancelado) {
          setEstado("error");
          setMensajeSync("Error de red al verificar el pago.");
        }
      }
    }

    void sincronizar();
    return () => {
      cancelado = true;
    };
  }, [emailInicial]);

  return (
    <div className="mt-10 space-y-4">
      {emailInicial && estado === "sincronizando" && (
        <p className="text-sm text-tinta-suave" role="status">
          Verificando tu pago con MercadoPago…
        </p>
      )}
      {mensajeSync && (
        <p
          className={`text-sm ${estado === "error" ? "text-carmesi" : "text-oro-claro"}`}
          role="status"
        >
          {mensajeSync}
        </p>
      )}
      <MagicLinkForm emailInicial={emailInicial} sincronizarAntes />
    </div>
  );
}
