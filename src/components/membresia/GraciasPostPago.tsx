"use client";

import Link from "next/link";
import { EtiquetaCta } from "@/components/ui/FlechaCta";
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

type Fase =
  | "sin-email"
  | "confirmando"
  | "listo"
  | "pedir-enlace"
  | "esperando-pago"
  | "error";

export function GraciasPostPago({ emailInicial }: Props) {
  const router = useRouter();
  const [fase, setFase] = useState<Fase>(emailInicial ? "confirmando" : "sin-email");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [tieneSesion, setTieneSesion] = useState(false);

  useEffect(() => {
    if (!emailInicial) return;

    let cancelado = false;

    async function sincronizar() {
      setFase("confirmando");
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
          setFase("error");
          setMensaje(data.mensaje ?? "No pudimos confirmar el pago.");
          return;
        }

        if (data.sesion && (data.estado === "activado" || data.estado === "activo")) {
          setTieneSesion(true);
          setFase("listo");
          setMensaje("¡Listo! Te llevamos a tu museo…");
          router.replace("/mecenas");
          return;
        }

        if (data.estado === "activado" || data.estado === "activo") {
          setFase("pedir-enlace");
          setMensaje(
            data.errorEmail
              ? "Tu membresía está activa, pero no llegó el email. Pedí el enlace abajo."
              : "Tu membresía está activa. Pedí un enlace para entrar a tu museo.",
          );
          return;
        }

        if (data.estado === "pendiente") {
          setFase("esperando-pago");
          setMensaje(
            "Todavía estamos confirmando el pago. En unos minutos pedí el enlace con el mismo email.",
          );
          return;
        }

        setFase("esperando-pago");
        setMensaje(
          "Todavía no encontramos el pago. Esperá un momento y pedí el enlace con el mismo email.",
        );
      } catch {
        if (!cancelado) {
          setFase("error");
          setMensaje("No pudimos conectar. Probá de nuevo en unos segundos.");
        }
      }
    }

    void sincronizar();
    return () => {
      cancelado = true;
    };
  }, [emailInicial, router]);

  const mostrarFormulario =
    fase === "sin-email" ||
    fase === "pedir-enlace" ||
    fase === "esperando-pago" ||
    fase === "error";

  return (
    <div className="mt-10 space-y-6">
      {fase === "confirmando" && (
        <div className="rounded-sm border border-oro/30 bg-fondo-2 px-6 py-5" role="status">
          <p className="text-sm font-medium text-oro-claro">Confirmando tu pago…</p>
          <p className="mt-2 text-sm text-tinta-suave">
            Esto suele tardar unos segundos. No cierres esta ventana.
          </p>
        </div>
      )}

      {fase === "listo" && (
        <div className="rounded-sm border border-oro/40 bg-fondo-2 px-6 py-5" role="status">
          <p className="text-sm font-medium text-oro-claro">{mensaje}</p>
        </div>
      )}

      {mensaje && fase !== "listo" && fase !== "confirmando" && (
        <p
          className={`text-sm ${fase === "error" ? "text-carmesi" : "text-oro-claro"}`}
          role="status"
        >
          {mensaje}
        </p>
      )}

      {mostrarFormulario && (
        <div className="rounded-sm border border-linea bg-fondo-2 px-6 py-6">
          <p className="mb-4 text-sm text-tinta-suave">
            {fase === "sin-email"
              ? "Escribí el email con el que pagaste para recibir el enlace de acceso."
              : "Pedí un enlace de acceso a tu email."}
          </p>
          <MagicLinkForm emailInicial={emailInicial} sincronizarAntes />
        </div>
      )}

      {tieneSesion && (
        <Link
          href="/mecenas"
          className="group inline-block text-sm text-oro-claro underline-offset-4 hover:underline"
        >
          <EtiquetaCta>Ir a tu museo</EtiquetaCta>
        </Link>
      )}
    </div>
  );
}
