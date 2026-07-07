import { Resend } from "resend";
import { sitio } from "@/lib/site.config";

function clienteResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function remitente() {
  return process.env.RESEND_FROM ?? "Argenta <onboarding@resend.dev>";
}

function baseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? sitio.url;
}

/**
 * Envía el magic link. Si no hay RESEND_API_KEY, lo imprime en consola
 * (útil en desarrollo) y no falla.
 */
export async function enviarMagicLink(email: string, token: string) {
  const url = `${baseUrl()}/api/auth/verificar?token=${encodeURIComponent(token)}`;
  const html = `
    <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color: #1a1510;">
      <p style="letter-spacing: 0.2em; text-transform: uppercase; font-size: 12px; color: #8a7050;">Argenta</p>
      <h1 style="font-size: 28px; font-weight: 500;">Tu acceso de mecenas</h1>
      <p style="line-height: 1.6; color: #4a4035;">
        Tocá el botón para entrar al área de mecenas. El enlace vence en 15 minutos.
      </p>
      <p style="margin: 28px 0;">
        <a href="${url}" style="background: #c6a15b; color: #0c0a08; text-decoration: none; padding: 12px 22px; border-radius: 999px; font-weight: 600;">
          Entrar a Argenta
        </a>
      </p>
      <p style="font-size: 12px; color: #8a7050; word-break: break-all;">${url}</p>
    </div>
  `;

  const resend = clienteResend();
  if (!resend) {
    console.log(`[email:dev] magic link para ${email}: ${url}`);
    return { ok: true as const, modo: "dev" as const };
  }

  const { data, error } = await resend.emails.send(
    {
      from: remitente(),
      to: [email],
      subject: "Tu acceso de mecenas — Argenta",
      html,
    },
    { idempotencyKey: `magic/${email}/${token.slice(0, 16)}` },
  );

  if (error) {
    console.error("[email] magic link falló:", error.message);
    return { ok: false as const, error: error.message };
  }
  return { ok: true as const, id: data?.id, modo: "resend" as const };
}

export async function enviarBienvenidaMecenas(email: string, plan: string) {
  const url = `${baseUrl()}/mecenas`;
  const html = `
    <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color: #1a1510;">
      <p style="letter-spacing: 0.2em; text-transform: uppercase; font-size: 12px; color: #8a7050;">Argenta</p>
      <h1 style="font-size: 28px; font-weight: 500;">Bienvenido, mecenas</h1>
      <p style="line-height: 1.6; color: #4a4035;">
        Tu plan <strong>${plan}</strong> ya está activo. Gracias por sostener
        el museo digital de historia argentina.
      </p>
      <p style="line-height: 1.6; color: #4a4035;">
        En tu área de mecenas encontrás las exclusivas y el anticipo de nuevas crónicas.
      </p>
      <p style="margin: 28px 0;">
        <a href="${url}" style="background: #c6a15b; color: #0c0a08; text-decoration: none; padding: 12px 22px; border-radius: 999px; font-weight: 600;">
          Ir al área de mecenas
        </a>
      </p>
    </div>
  `;

  const resend = clienteResend();
  if (!resend) {
    console.log(`[email:dev] bienvenida mecenas para ${email} (plan ${plan})`);
    return { ok: true as const, modo: "dev" as const };
  }

  const { error } = await resend.emails.send(
    {
      from: remitente(),
      to: [email],
      subject: "Bienvenido a Mecenas — Argenta",
      html,
    },
    { idempotencyKey: `bienvenida/${email}/${plan}` },
  );

  if (error) {
    console.error("[email] bienvenida falló:", error.message);
    return { ok: false as const, error: error.message };
  }
  return { ok: true as const, modo: "resend" as const };
}
