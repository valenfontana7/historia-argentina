import { MercadoPagoConfig, Preference, PreApproval, Payment } from "mercadopago";
import { EstadoMecenas, PlanMecenas, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { diasDePlan, planes, type PlanId } from "@/lib/membresia.config";
import {
  PlanNoDisponibleError,
  puedeCheckoutPlan,
  precioCheckout,
} from "@/lib/membresia-settings";
import { enviarConfirmacionMecenas } from "@/lib/email";
import { crearMagicToken } from "@/lib/auth";
import { sitio } from "@/lib/site.config";
import { registrarError, registrarEvento } from "@/lib/observabilidad";

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

  const precio = await precioCheckout(planId, emailNorm);

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
        back_url: `${baseUrl()}/membresia/gracias?email=${encodeURIComponent(emailNorm)}`,
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
        success: `${baseUrl()}/membresia/gracias?email=${encodeURIComponent(emailNorm)}`,
        failure: `${baseUrl()}/membresia?error=pago`,
        pending: `${baseUrl()}/membresia/gracias?email=${encodeURIComponent(emailNorm)}`,
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
  const sep = ref.indexOf(":");
  const plan = ref.slice(0, sep);
  const email = ref.slice(sep + 1);
  if (plan !== "mensual" && plan !== "fundador") return null;
  if (!emailValido(email)) return null;
  return { plan, email: email.toLowerCase() };
}

function normalizarTipoWebhook(tipo: string): string | null {
  const t = tipo.toLowerCase();
  if (t === "payment" || t.startsWith("payment.")) return "payment";
  if (
    t === "preapproval" ||
    t === "subscription" ||
    t === "subscription_preapproval" ||
    t.includes("preapproval") ||
    t.startsWith("subscription.")
  ) {
    return "preapproval";
  }
  return null;
}

function mecenasVigente(estado: EstadoMecenas, periodEnd: Date | null): boolean {
  if (estado !== EstadoMecenas.activo) return false;
  if (!periodEnd) return true;
  return periodEnd.getTime() > Date.now();
}

async function enviarEmailsPostPago(email: string, planNombre: string) {
  try {
    const token = await crearMagicToken(email);
    const confirmacion = await enviarConfirmacionMecenas(email, planNombre, token);
    if (!confirmacion.ok) {
      console.error("[mp] confirmación post-pago falló:", confirmacion.error);
      return { ok: false as const, error: confirmacion.error };
    }
    console.log("[mp] confirmación post-pago enviada a", email);
    return { ok: true as const };
  } catch (error) {
    console.error("[mp] no se pudo enviar confirmación post-pago:", error);
    return { ok: false as const, error: String(error) };
  }
}

async function activarMecenas(opts: {
  email: string;
  plan: PlanId;
  paymentId?: string;
  subscriptionId?: string;
  enviarEmail?: boolean;
}) {
  const email = opts.email.toLowerCase().trim();
  const existente = await prisma.mecenas.findUnique({ where: { email } });
  const yaVigente =
    existente &&
    mecenasVigente(existente.estado, existente.periodEnd);

  const periodEnd = new Date();
  periodEnd.setDate(periodEnd.getDate() + diasDePlan(opts.plan));

  const mecenas = await prisma.mecenas.upsert({
    where: { email },
    create: {
      email,
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

  const debeEnviarEmail = opts.enviarEmail !== false && !yaVigente;
  if (debeEnviarEmail) {
    const planNombre = planes[opts.plan].nombre;
    await enviarEmailsPostPago(email, planNombre);
  } else if (yaVigente) {
    console.log("[mp] mecenas ya vigente, email omitido:", email);
  }

  return mecenas;
}

async function buscarPagoAprobado(reference: string): Promise<string | null> {
  const token = accessToken();
  const url = new URL("https://api.mercadopago.com/v1/payments/search");
  url.searchParams.set("external_reference", reference);
  url.searchParams.set("sort", "date_created");
  url.searchParams.set("criteria", "desc");

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    console.warn("[mp] búsqueda de pago falló:", res.status);
    return null;
  }

  const data = (await res.json()) as {
    results?: Array<{ id?: number | string; status?: string }>;
  };
  const aprobado = data.results?.find((p) => p.status === "approved");
  return aprobado?.id != null ? String(aprobado.id) : null;
}

/**
 * Fallback cuando el webhook tarda o no llega: consulta MP y activa + manda email.
 */
export async function sincronizarMecenasPorEmail(
  email: string,
  opts?: { reenviarEmail?: boolean },
) {
  if (!emailValido(email)) {
    throw new Error("Email inválido.");
  }
  if (!process.env.MP_ACCESS_TOKEN) {
    throw new Error("MercadoPago no configurado.");
  }

  const emailNorm = email.toLowerCase().trim();
  const mecenas = await prisma.mecenas.findUnique({ where: { email: emailNorm } });
  if (!mecenas) {
    return { ok: true as const, estado: "sin_registro" as const, emailEnviado: false as const };
  }

  const plan: PlanId = mecenas.plan === PlanMecenas.fundador ? "fundador" : "mensual";

  if (mecenasVigente(mecenas.estado, mecenas.periodEnd)) {
    if (opts?.reenviarEmail) {
      const envio = await enviarEmailsPostPago(emailNorm, planes[plan].nombre);
      return {
        ok: true as const,
        estado: "activo" as const,
        emailEnviado: envio.ok,
        errorEmail: envio.ok ? undefined : envio.error,
      };
    }
    return { ok: true as const, estado: "activo" as const, emailEnviado: false as const };
  }

  if (mecenas.mpSubscriptionId) {
    const preapproval = new PreApproval(clienteMp());
    const sub = await preapproval.get({ id: mecenas.mpSubscriptionId });
    if (sub.status === "authorized" || sub.status === "active") {
      await activarMecenas({
        email: emailNorm,
        plan,
        subscriptionId: mecenas.mpSubscriptionId,
      });
      return { ok: true as const, estado: "activado" as const, emailEnviado: true as const };
    }

    // Suscripción: a veces el primer cobro aparece como payment antes que preapproval authorized
    const paymentId = await buscarPagoAprobado(`${plan}:${emailNorm}`);
    if (paymentId) {
      await activarMecenas({
        email: emailNorm,
        plan,
        paymentId,
        subscriptionId: mecenas.mpSubscriptionId,
      });
      return { ok: true as const, estado: "activado" as const, emailEnviado: true as const };
    }

    return { ok: true as const, estado: "pendiente" as const, emailEnviado: false as const };
  }

  const reference = `${plan}:${emailNorm}`;
  const paymentId = mecenas.mpPaymentId ?? (await buscarPagoAprobado(reference));
  if (paymentId) {
    await activarMecenas({
      email: emailNorm,
      plan,
      paymentId,
    });
    return { ok: true as const, estado: "activado" as const, emailEnviado: true as const };
  }

  return { ok: true as const, estado: "pendiente" as const, emailEnviado: false as const };
}

async function procesarPago(paymentId: string) {
  const pagoYaProcesado = await prisma.mecenas.findFirst({
    where: { mpPaymentId: String(paymentId) },
    select: { id: true },
  });
  if (pagoYaProcesado) {
    registrarEvento("info", "mp_pago_duplicado", { paymentId });
    return { ok: true, skipped: true as const };
  }

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
  requestId?: string | null;
}) {
  const tipoRaw = input.topic ?? input.type;
  const id = input.id ?? input.dataId;
  if (!tipoRaw || !id) return { ok: true, skipped: true as const };

  const tipo = normalizarTipoWebhook(tipoRaw);
  if (!tipo) {
    console.log("[mp/webhook] topic ignorado:", tipoRaw);
    return { ok: true, skipped: true as const };
  }

  const procesar = () => (tipo === "payment" ? procesarPago(id) : procesarPreapproval(id));
  const requestId = input.requestId;
  if (!requestId) return procesar();

  try {
    await prisma.webhookMercadoPago.create({
      data: { requestId, tipo, recursoId: id },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      registrarEvento("info", "mp_webhook_duplicado", {
        requestId,
        tipo,
        recursoId: id,
      });
      return { ok: true, skipped: true as const };
    }
    throw error;
  }

  try {
    const resultado = await procesar();
    await prisma.webhookMercadoPago.update({
      where: { requestId },
      data: { procesadoEn: new Date() },
    });
    return resultado;
  } catch (error) {
    await prisma.webhookMercadoPago.delete({ where: { requestId } }).catch(
      (errorBorrado) =>
        registrarError("mp_webhook_borrado_fallido", errorBorrado, {
          requestId,
        }),
    );
    throw error;
  }
}
