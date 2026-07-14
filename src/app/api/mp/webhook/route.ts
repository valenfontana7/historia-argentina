import { NextResponse } from "next/server";
import { InvalidWebhookSignatureError, WebhookSignatureValidator } from "mercadopago";
import { procesarWebhook } from "@/lib/mp";
import { idSolicitud, registrarError, registrarEvento } from "@/lib/observabilidad";

export const runtime = "nodejs";

async function manejar(request: Request) {
  const solicitudId = idSolicitud(request);
  const url = new URL(request.url);
  const topic = url.searchParams.get("topic") ?? url.searchParams.get("type");
  const id = url.searchParams.get("data.id") ?? url.searchParams.get("id");

  let type: string | null = topic;
  let dataId: string | null = id;

  if (request.method === "POST") {
    try {
      const body = (await request.json()) as {
        type?: string;
        action?: string;
        data?: { id?: string | number };
      };
      type = body.type ?? body.action ?? type;
      dataId = body.data?.id != null ? String(body.data.id) : dataId;
    } catch {
      // IPN a veces manda form-urlencoded vacío; usamos query.
    }
  }

  const secretoWebhook = process.env.MP_WEBHOOK_SECRET;
  const esSuscripcion = /preapproval|subscription/.test((type ?? topic ?? "").toLowerCase());
  const tieneFirma = Boolean(request.headers.get("x-signature"));
  if (secretoWebhook && (!esSuscripcion || tieneFirma)) {
    try {
      WebhookSignatureValidator.validate({
        xSignature: request.headers.get("x-signature"),
        xRequestId: request.headers.get("x-request-id"),
        dataId,
        secret: secretoWebhook,
        toleranceSeconds: 5 * 60,
      });
    } catch (error) {
      const motivo =
        error instanceof InvalidWebhookSignatureError ? error.reason : "firma_invalida";
      registrarEvento("warn", "mp_webhook_rechazado", { solicitudId, motivo });
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  } else if (!secretoWebhook) {
    registrarEvento("warn", "mp_webhook_sin_secreto", { solicitudId });
  } else {
    // MercadoPago puede emitir notificaciones de suscripción sin firma.
    // El recurso se consulta de todas formas con MP_ACCESS_TOKEN antes de cambiar el acceso.
    registrarEvento("warn", "mp_webhook_suscripcion_sin_firma", { solicitudId });
  }

  try {
    const resultado = await procesarWebhook({
      topic,
      id,
      type,
      dataId,
      requestId: request.headers.get("x-request-id"),
    });
    registrarEvento("info", "mp_webhook_procesado", {
      solicitudId,
      tipo: type ?? topic ?? "desconocido",
      recursoId: dataId ?? id ?? "desconocido",
      omitido: "skipped" in resultado && Boolean(resultado.skipped),
    });
    if (!resultado.ok) {
      registrarEvento("warn", "mp_webhook_no_procesable", {
        solicitudId,
        tipo: type ?? topic ?? "desconocido",
      });
    }
  } catch (error) {
    registrarError("mp_webhook_error", error, {
      solicitudId,
      tipo: type ?? topic ?? "desconocido",
      recursoId: dataId ?? id ?? "desconocido",
    });
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}

export async function GET(request: Request) {
  return manejar(request);
}

export async function POST(request: Request) {
  return manejar(request);
}
