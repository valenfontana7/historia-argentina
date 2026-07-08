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
          setMensajeSync(data.mensaje ?? "No pudimos confirmar el pago.");
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
            `Tu membresía ya está activa, pero no llegó el email. Pedí el enlace abajo.`,
          );
          return;
        }

        switch (data.estado) {
          case "activado":
            setEstado("activado");
            setMensajeSync(
              data.emailEnviado
                ? "¡Gracias! Si no entraste solo, pedí el enlace abajo."
                : "¡Gracias! Pedí el enlace abajo para entrar.",
            );
            break;
          case "activo":
            setEstado("activo");
            setMensajeSync(
              data.emailEnviado
                ? "Tu membresía ya está activa. Pedí el enlace abajo si hace falta."
                : "Tu membresía ya está activa. Pedí el enlace abajo.",
            );
            break;
          case "pendiente":
            setEstado("pendiente");
            setMensajeSync(
              "Todavía estamos confirmando el pago. Revisá tu email en unos minutos o pedí el enlace abajo.",
            );
            break;
          default:
            setEstado("pendiente");
            setMensajeSync(
              "No encontramos el pago todavía. Probá de nuevo en unos minutos con el mismo email.",
            );
        }
      } catch {
        if (!cancelado) {
          setEstado("error");
          setMensajeSync("No pudimos conectar. Probá de nuevo.");
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
          Estamos confirmando tu pago…
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
