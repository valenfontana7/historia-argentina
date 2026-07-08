"use client";

import { useRouter } from "next/navigation";
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
  sesion?: boolean;
};

export function GraciasPostPago({ emailInicial }: Props) {
  const router = useRouter();
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
          body: JSON.stringify({
            email: emailInicial,
            reenviarEmail: true,
            establecerSesion: true,
          }),
        });
        const data = (await res.json()) as ResultadoSync;

        if (cancelado) return;

        if (!data.ok) {
          setEstado("error");
          setMensajeSync(data.mensaje ?? "No pudimos verificar el pago.");
          return;
        }

        if (data.sesion && (data.estado === "activado" || data.estado === "activo")) {
          setEstado(data.estado === "activado" ? "activado" : "activo");
          setMensajeSync("¡Listo! Te llevamos a tu museo…");
          router.replace("/mecenas");
          return;
        }

        if (data.errorEmail) {
          setEstado("error");
          setMensajeSync(
            `Tu membresía está activa pero el email falló: ${data.errorEmail}. Pedí el enlace abajo.`,
          );
          return;
        }

        switch (data.estado) {
          case "activado":
            setEstado("activado");
            setMensajeSync(
              data.emailEnviado
                ? "Membresía activada. Si no entraste automáticamente, pedí el enlace abajo."
                : "Membresía activada. Pedí el enlace abajo para entrar.",
            );
            break;
          case "activo":
            setEstado("activo");
            setMensajeSync(
              data.emailEnviado
                ? "Tu membresía ya está activa. Pedí el enlace abajo si no entraste solo."
                : "Tu membresía ya está activa. Pedí el enlace abajo.",
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
  }, [emailInicial, router]);

  return (
    <div className="mt-10 space-y-4">
      {emailInicial && estado === "sincronizando" && (
        <p className="text-sm text-tinta-suave" role="status">
          Verificando tu pago y preparando tu acceso…
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
