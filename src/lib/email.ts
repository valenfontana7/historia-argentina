import { createHash } from "crypto";
import { Resend } from "resend";
import { renderEmailPlantilla } from "@/lib/email-template";
import { sitio } from "@/lib/site.config";

function clienteResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function remitente() {
  return process.env.RESEND_FROM ?? "Argent <onboarding@resend.dev>";
}

/** Traduce errores comunes de Resend a un mensaje accionable. */
export function mensajeErrorEmail(error: string): string {
  const e = error.toLowerCase();
  if (e.includes("not verified") || e.includes("domain")) {
    return "El remitente no está verificado en Resend. Verificá museoargent.com.ar en resend.com/domains y actualizá RESEND_FROM.";
  }
  if (e.includes("testing") || e.includes("onboarding@resend.dev")) {
    return "Con onboarding@resend.dev solo podés enviar al email que verificaste en Resend, o cambiá RESEND_FROM a un dominio verificado.";
  }
  if (e.includes("invalid") && e.includes("from")) {
    return "RESEND_FROM tiene un formato inválido. Usá: Argent <hola@museoargent.com.ar>";
  }
  if (e.includes("api key") || e.includes("unauthorized")) {
    return "RESEND_API_KEY inválida o ausente en las variables de entorno.";
  }
  if (e.includes("idempotency")) {
    return "Reintentá pedir el enlace en unos segundos.";
  }
  if (process.env.NODE_ENV === "development") {
    return `Resend: ${error}`;
  }
  return "No pudimos enviar el email. Probá en unos minutos.";
}

function baseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? sitio.url;
}

/** Clave única por token (no usar slice del JWT: el header es igual en todos). */
function idempotencyDesdeToken(prefijo: string, email: string, token: string) {
  const hash = createHash("sha256").update(token).digest("hex").slice(0, 24);
  return `${prefijo}/${email}/${hash}`;
}

/**
 * Envía el magic link. Si no hay RESEND_API_KEY, lo imprime en consola
 * (útil en desarrollo) y no falla.
 */
export async function enviarMagicLink(email: string, token: string, next?: string) {
  const destino = next && next.startsWith("/") && !next.startsWith("//") ? next : "/mecenas";
  const url = `${baseUrl()}/api/auth/verificar?token=${encodeURIComponent(token)}&next=${encodeURIComponent(destino)}`;
  const html = renderEmailPlantilla({
    preheader: "Tu enlace de acceso al área de mecenas vence en 15 minutos.",
    titulo: "Tu acceso de mecenas",
    cuerpo: `
      <p style="margin: 0 0 16px;">Tocá el botón para entrar al área exclusiva de mecenas.</p>
      <p style="margin: 0;">El enlace es de un solo uso y vence en <strong style="color: #ece4d4;">15 minutos</strong>.</p>
    `,
    cta: { url, texto: "Entrar a Argent" },
    pie: `Si el botón no funciona, copiá este enlace en el navegador:<br /><a href="${url}" style="color: #c6a15b; text-decoration: none;">${url}</a>`,
  });

  const resend = clienteResend();
  if (!resend) {
    console.log(`[email:dev] magic link para ${email}: ${url}`);
    return { ok: true as const, modo: "dev" as const };
  }

  const { data, error } = await resend.emails.send(
    {
      from: remitente(),
      to: [email],
      subject: "Tu acceso de mecenas — Argent",
      html,
    },
    { idempotencyKey: idempotencyDesdeToken("magic", email, token) },
  );

  if (error) {
    console.error("[email] magic link falló:", error.message);
    return { ok: false as const, error: error.message };
  }
  return { ok: true as const, id: data?.id, modo: "resend" as const };
}

export async function enviarMagicLinkAdmin(email: string, token: string) {
  const url = `${baseUrl()}/api/admin/verificar?token=${encodeURIComponent(token)}&next=${encodeURIComponent("/admin")}`;
  const html = renderEmailPlantilla({
    preheader: "Acceso al panel de administración de Argent.",
    titulo: "Acceso de creador",
    cuerpo: `
      <p style="margin: 0 0 16px;">Tocá el botón para entrar al panel de administración.</p>
      <p style="margin: 0;">Este enlace es personal, de un solo uso, y vence en <strong style="color: #ece4d4;">15 minutos</strong>.</p>
    `,
    cta: { url, texto: "Entrar al admin" },
    pie: `Enlace alternativo:<br /><a href="${url}" style="color: #c6a15b; text-decoration: none;">${url}</a>`,
  });

  const resend = clienteResend();
  if (!resend) {
    console.log(`[email:dev] admin magic link para ${email}: ${url}`);
    return { ok: true as const, modo: "dev" as const };
  }

  const { data, error } = await resend.emails.send(
    {
      from: remitente(),
      to: [email],
      subject: "Acceso de creador — Argent",
      html,
    },
    { idempotencyKey: idempotencyDesdeToken("admin-magic", email, token) },
  );

  if (error) {
    console.error("[email] admin magic link falló:", error.message);
    return { ok: false as const, error: error.message };
  }
  return { ok: true as const, id: data?.id, modo: "resend" as const };
}

export async function enviarConfirmacionMecenas(
  email: string,
  plan: string,
  token: string,
) {
  const url = `${baseUrl()}/api/auth/verificar?token=${encodeURIComponent(token)}`;
  const html = renderEmailPlantilla({
    preheader: `Tu plan ${plan} ya está activo. Gracias por sostener Argent.`,
    titulo: "Tu suscripción está activa",
    cuerpo: `
      <p style="margin: 0 0 16px;">
        Confirmamos tu plan <strong style="color: #e3c98f;">${plan}</strong>.
        Gracias por sostener el museo digital de historia argentina.
      </p>
      <p style="margin: 0;">
        Tocá el botón para entrar al área de mecenas. El enlace vence en
        <strong style="color: #ece4d4;">15 minutos</strong>.
      </p>
    `,
    cta: { url, texto: "Entrar a Argent" },
    pie: `Enlace alternativo:<br /><a href="${url}" style="color: #c6a15b; text-decoration: none;">${url}</a>`,
  });

  const resend = clienteResend();
  if (!resend) {
    console.log(`[email:dev] confirmación mecenas para ${email} (plan ${plan}): ${url}`);
    return { ok: true as const, modo: "dev" as const };
  }

  const { error } = await resend.emails.send(
    {
      from: remitente(),
      to: [email],
      subject: "Confirmación de suscripción — Argent",
      html,
    },
    { idempotencyKey: idempotencyDesdeToken("confirmacion", email, token) },
  );

  if (error) {
    console.error("[email] confirmación mecenas falló:", error.message);
    return { ok: false as const, error: error.message };
  }
  return { ok: true as const, modo: "resend" as const };
}

export async function enviarBienvenidaMecenas(email: string, plan: string) {
  const url = `${baseUrl()}/mecenas`;
  const html = renderEmailPlantilla({
    preheader: "Bienvenido al área exclusiva de mecenas de Argent.",
    titulo: "Bienvenido, mecenas",
    cuerpo: `
      <p style="margin: 0 0 16px;">
        Tu plan <strong style="color: #e3c98f;">${plan}</strong> ya está activo.
        Gracias por sostener el museo digital de historia argentina.
      </p>
      <p style="margin: 0;">
        En tu área de mecenas encontrás las exclusivas, el anticipo de nuevas crónicas
        y la carta mensual del museo.
      </p>
    `,
    cta: { url, texto: "Ir al área de mecenas" },
  });

  const resend = clienteResend();
  if (!resend) {
    console.log(`[email:dev] bienvenida mecenas para ${email} (plan ${plan})`);
    return { ok: true as const, modo: "dev" as const };
  }

  const { error } = await resend.emails.send(
    {
      from: remitente(),
      to: [email],
      subject: "Bienvenido a Mecenas — Argent",
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
