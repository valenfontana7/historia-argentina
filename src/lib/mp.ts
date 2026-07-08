import { MercadoPagoConfig, Preference, PreApproval, Payment } from "mercadopago";
import { EstadoMecenas, PlanMecenas } from "@prisma/client";
import { prisma } from "@/lib/db";
import { diasDePlan, planes, type PlanId } from "@/lib/membresia.config";
import {
  PlanNoDisponibleError,
  puedeCheckoutPlan,
  precioCheckout,
} from "@/lib/membresia-settings";
import { enviarBienvenidaMecenas, enviarMagicLink } from "@/lib/email";
import { crearMagicToken } from "@/lib/auth";
import { sitio } from "@/lib/site.config";

function accessToken() {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) throw new Error("Falta MP_ACCESS_TOKEN.");
  return token;
}

function clienteMp() {
  return new MercadoPagoConfig({ accessToken: accessToken() });
}

function baseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? sitio.url;
}

function emailValido(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

/**
 * Crea el checkout según el plan:
 * - mensual → PreApproval (suscripción recurrente)
 * - fundador → Preference (pago único anual)
 */
export async function crearCheckout(planId: PlanId, email: string) {
  if (!emailValido(email)) {
    throw new Error("Email inválido.");
  }
  const plan = planes[planId];
  if (!plan) throw new Error("Plan inexistente.");

  const emailNorm = email.toLowerCase().trim();
  const reference = `${planId}:${emailNorm}`;

  if (!(await puedeCheckoutPlan(planId, emailNorm))) {
    throw new PlanNoDisponibleError();
  }

  const precio = precioCheckout(planId, emailNorm);

  await prisma.mecenas.upsert({
    where: { email: emailNorm },
    create: {
      email: emailNorm,
      plan: planId === "fundador" ? PlanMecenas.fundador : PlanMecenas.mensual,
      estado: EstadoMecenas.pendiente,
      esFundador: planId === "fundador",
    },
    update: {
      plan: planId === "fundador" ? PlanMecenas.fundador : PlanMecenas.mensual,
      esFundador: planId === "fundador",
    },
  });

  if (planId === "mensual") {
    const preapproval = new PreApproval(clienteMp());
    const result = await preapproval.create({
      body: {
        reason: `${plan.nombre} — ${sitio.nombre}`,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: precio,
          currency_id: plan.moneda,
        },
        payer_email: emailNorm,
        back_url: `${baseUrl()}/membresia/gracias`,
        status: "pending",
        external_reference: reference,
      },
    });

    const initPoint = result.init_point;
    if (!initPoint) throw new Error("MercadoPago no devolvió init_point.");

    await prisma.mecenas.update({
      where: { email: emailNorm },
      data: { mpSubscriptionId: result.id ? String(result.id) : undefined },
    });

    return { initPoint, id: result.id };
  }

  const preference = new Preference(clienteMp());
  const result = await preference.create({
    body: {
      items: [
        {
          id: plan.id,
          title: `${plan.nombre} — ${sitio.nombre}`,
          description: plan.descripcion,
          quantity: 1,
          unit_price: precio,
          currency_id: plan.moneda,
        },
      ],
      payer: { email: emailNorm },
      external_reference: reference,
      metadata: { plan: planId, email: emailNorm },
      back_urls: {
        success: `${baseUrl()}/membresia/gracias`,
        failure: `${baseUrl()}/membresia?error=pago`,
        pending: `${baseUrl()}/membresia/gracias`,
      },
      auto_return: "approved",
      notification_url: `${baseUrl()}/api/mp/webhook`,
    },
  });

  const initPoint = result.init_point ?? result.sandbox_init_point;
  if (!initPoint) throw new Error("MercadoPago no devolvió init_point.");

  await prisma.mecenas.update({
    where: { email: emailNorm },
    data: { mpPreferenceId: result.id ? String(result.id) : undefined },
  });

  return { initPoint, id: result.id };
}

function parseReference(ref?: string | null): { plan: PlanId; email: string } | null {
  if (!ref || !ref.includes(":")) return null;
  const [plan, email] = ref.split(":");
  if (plan !== "mensual" && plan !== "fundador") return null;
  if (!emailValido(email)) return null;
  return { plan, email: email.toLowerCase() };
}

async function activarMecenas(opts: {
  email: string;
  plan: PlanId;
  paymentId?: string;
  subscriptionId?: string;
}) {
  const periodEnd = new Date();
  periodEnd.setDate(periodEnd.getDate() + diasDePlan(opts.plan));

  const mecenas = await prisma.mecenas.upsert({
    where: { email: opts.email },
    create: {
      email: opts.email,
      plan: opts.plan === "fundador" ? PlanMecenas.fundador : PlanMecenas.mensual,
      estado: EstadoMecenas.activo,
      esFundador: opts.plan === "fundador",
      mpPaymentId: opts.paymentId,
      mpSubscriptionId: opts.subscriptionId,
      periodEnd,
    },
    update: {
      plan: opts.plan === "fundador" ? PlanMecenas.fundador : PlanMecenas.mensual,
      estado: EstadoMecenas.activo,
      esFundador: opts.plan === "fundador" ? true : undefined,
      mpPaymentId: opts.paymentId ?? undefined,
      mpSubscriptionId: opts.subscriptionId ?? undefined,
      periodEnd,
    },
  });

  const planNombre = planes[opts.plan].nombre;
  await enviarBienvenidaMecenas(opts.email, planNombre);

  try {
    const token = await crearMagicToken(opts.email);
    await enviarMagicLink(opts.email, token);
  } catch (error) {
    console.error("[mp] no se pudo enviar magic link tras el pago:", error);
  }

  return mecenas;
}

async function procesarPago(paymentId: string) {
  const paymentApi = new Payment(clienteMp());
  const pago = await paymentApi.get({ id: paymentId });
  if (pago.status !== "approved") {
    return { ok: true, skipped: true as const };
  }

  const meta = pago.metadata as { plan?: string; email?: string } | undefined;
  const desdeMeta =
    meta?.plan && meta?.email && (meta.plan === "mensual" || meta.plan === "fundador")
      ? { plan: meta.plan as PlanId, email: meta.email.toLowerCase() }
      : null;
  const ref = parseReference(pago.external_reference) ?? desdeMeta;
  if (!ref) {
    console.warn("[mp] pago sin referencia usable:", paymentId);
    return { ok: false, error: "sin referencia" };
  }

  await activarMecenas({
    email: ref.email,
    plan: ref.plan,
    paymentId: String(paymentId),
  });
  return { ok: true };
}

async function procesarPreapproval(preapprovalId: string) {
  const preapproval = new PreApproval(clienteMp());
  const sub = await preapproval.get({ id: preapprovalId });
  const status = sub.status;
  const ref = parseReference(sub.external_reference);
  const email = (sub.payer_email ?? ref?.email)?.toLowerCase();
  const plan = ref?.plan ?? "mensual";

  if (!email) {
    console.warn("[mp] preapproval sin email:", preapprovalId);
    return { ok: false, error: "sin email" };
  }

  if (status === "authorized" || status === "active") {
    await activarMecenas({
      email,
      plan,
      subscriptionId: String(preapprovalId),
    });
    return { ok: true };
  }

  if (status === "cancelled" || status === "paused") {
    await prisma.mecenas.updateMany({
      where: { email },
      data: { estado: EstadoMecenas.cancelado },
    });
  }

  return { ok: true, skipped: true as const };
}

/**
 * Procesa notificaciones IPN / webhooks de MercadoPago.
 * Acepta query (?topic=&id=) o body JSON ({ type, data: { id } }).
 */
export async function procesarWebhook(input: {
  topic?: string | null;
  id?: string | null;
  type?: string | null;
  dataId?: string | null;
}) {
  const tipo = input.topic ?? input.type;
  const id = input.id ?? input.dataId;
  if (!tipo || !id) return { ok: true, skipped: true as const };

  if (tipo === "payment") {
    return procesarPago(id);
  }

  if (
    tipo === "subscription_preapproval" ||
    tipo === "subscription" ||
    tipo === "preapproval"
  ) {
    return procesarPreapproval(id);
  }

  return { ok: true, skipped: true as const };
}
