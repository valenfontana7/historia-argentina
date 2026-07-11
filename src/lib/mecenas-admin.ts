import { EstadoMecenas, PlanMecenas, type Mecenas, type Prisma } from "@prisma/client";
import { crearMagicToken } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { enviarConfirmacionMecenas } from "@/lib/email";
import { diasDePlan, planes, type PlanId } from "@/lib/membresia.config";

const POR_PAGINA = 20;

export type OrigenMecenas = "mercadopago" | "manual";

export type MecenasAdminRow = {
  id: string;
  email: string;
  plan: PlanMecenas;
  estado: EstadoMecenas;
  esFundador: boolean;
  exentoFacturacion: boolean;
  nombrePublico: string | null;
  mostrarCredito: boolean;
  notasAdmin: string | null;
  periodEnd: string | null;
  origen: OrigenMecenas;
  tieneSuscripcionMp: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ListarMecenasFiltros = {
  q?: string;
  estado?: EstadoMecenas;
  plan?: PlanMecenas;
  exento?: boolean;
  pagina?: number;
};

export type CrearMecenasManualInput = {
  email: string;
  plan: PlanId;
  exentoFacturacion: boolean;
  periodEnd?: Date | null;
  sinVencimiento?: boolean;
  esFundador?: boolean;
  nombrePublico?: string;
  notasAdmin?: string;
  enviarEmail?: boolean;
};

export type ActualizarMecenasPatch = {
  estado?: EstadoMecenas;
  exentoFacturacion?: boolean;
  periodEnd?: Date | null;
  sinVencimiento?: boolean;
  plan?: PlanId;
  esFundador?: boolean;
  nombrePublico?: string | null;
  mostrarCredito?: boolean;
  notasAdmin?: string | null;
};

export class MecenasAdminError extends Error {
  constructor(
    message: string,
    readonly codigo: "email_invalido" | "ya_existe" | "no_encontrado" | "validacion" = "validacion",
  ) {
    super(message);
    this.name = "MecenasAdminError";
  }
}

export function emailValidoMecenas(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function normalizarEmail(email: string): string {
  return email.toLowerCase().trim();
}

function origenDeMecenas(mecenas: Pick<Mecenas, "mpPaymentId" | "mpSubscriptionId">): OrigenMecenas {
  if (mecenas.mpPaymentId || mecenas.mpSubscriptionId) return "mercadopago";
  return "manual";
}

function aFilaAdmin(mecenas: Mecenas): MecenasAdminRow {
  return {
    id: mecenas.id,
    email: mecenas.email,
    plan: mecenas.plan,
    estado: mecenas.estado,
    esFundador: mecenas.esFundador,
    exentoFacturacion: mecenas.exentoFacturacion,
    nombrePublico: mecenas.nombrePublico,
    mostrarCredito: mecenas.mostrarCredito,
    notasAdmin: mecenas.notasAdmin,
    periodEnd: mecenas.periodEnd?.toISOString() ?? null,
    origen: origenDeMecenas(mecenas),
    tieneSuscripcionMp: Boolean(mecenas.mpSubscriptionId),
    createdAt: mecenas.createdAt.toISOString(),
    updatedAt: mecenas.updatedAt.toISOString(),
  };
}

function calcularPeriodEndDefault(plan: PlanId): Date {
  const fin = new Date();
  fin.setDate(fin.getDate() + diasDePlan(plan));
  return fin;
}

function resolverPeriodEnd(
  plan: PlanId,
  opts: { periodEnd?: Date | null; sinVencimiento?: boolean },
): Date | null {
  if (opts.sinVencimiento) return null;
  if (opts.periodEnd !== undefined) return opts.periodEnd;
  return calcularPeriodEndDefault(plan);
}

function whereListado(filtros: ListarMecenasFiltros): Prisma.MecenasWhereInput {
  const where: Prisma.MecenasWhereInput = {};

  if (filtros.q?.trim()) {
    where.email = { contains: filtros.q.trim().toLowerCase(), mode: "insensitive" };
  }
  if (filtros.estado) {
    where.estado = filtros.estado;
  }
  if (filtros.plan) {
    where.plan = filtros.plan;
  }
  if (filtros.exento === true) {
    where.exentoFacturacion = true;
  }

  return where;
}

export async function listarMecenas(filtros: ListarMecenasFiltros = {}) {
  const pagina = Math.max(1, filtros.pagina ?? 1);
  const where = whereListado(filtros);

  const [total, registros] = await Promise.all([
    prisma.mecenas.count({ where }),
    prisma.mecenas.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (pagina - 1) * POR_PAGINA,
      take: POR_PAGINA,
    }),
  ]);

  return {
    datos: registros.map(aFilaAdmin),
    total,
    pagina,
    porPagina: POR_PAGINA,
    totalPaginas: Math.max(1, Math.ceil(total / POR_PAGINA)),
  };
}

async function enviarEmailAcceso(email: string, plan: PlanId) {
  const token = await crearMagicToken(email);
  const planNombre = planes[plan].nombre;
  const envio = await enviarConfirmacionMecenas(email, planNombre, token);
  if (!envio.ok) {
    console.error("[mecenas-admin] email de acceso falló:", envio.error);
  }
  return envio;
}

export async function crearMecenasManual(input: CrearMecenasManualInput) {
  const email = normalizarEmail(input.email);
  if (!emailValidoMecenas(email)) {
    throw new MecenasAdminError("Email inválido.", "email_invalido");
  }

  const existente = await prisma.mecenas.findUnique({ where: { email } });
  if (existente) {
    throw new MecenasAdminError(
      `Ya existe un mecenas con el email ${email}. Editá el registro existente.`,
      "ya_existe",
    );
  }

  const planPrisma = input.plan === "fundador" ? PlanMecenas.fundador : PlanMecenas.mensual;
  const esFundador = input.esFundador ?? input.plan === "fundador";
  const periodEnd = resolverPeriodEnd(input.plan, {
    periodEnd: input.periodEnd,
    sinVencimiento: input.sinVencimiento,
  });

  const mecenas = await prisma.mecenas.create({
    data: {
      email,
      plan: planPrisma,
      estado: EstadoMecenas.activo,
      esFundador,
      exentoFacturacion: input.exentoFacturacion,
      nombrePublico: input.nombrePublico?.trim() || null,
      notasAdmin: input.notasAdmin?.trim() || null,
      periodEnd,
    },
  });

  if (input.enviarEmail !== false) {
    await enviarEmailAcceso(email, input.plan);
  }

  return aFilaAdmin(mecenas);
}

function validarActivacion(periodEnd: Date | null | undefined, estado: EstadoMecenas) {
  if (estado !== EstadoMecenas.activo) return;
  if (periodEnd && periodEnd.getTime() < Date.now()) {
    throw new MecenasAdminError(
      "No podés activar un mecenas con vencimiento en el pasado. Actualizá la fecha de vencimiento.",
      "validacion",
    );
  }
}

export async function actualizarMecenas(id: string, patch: ActualizarMecenasPatch) {
  const existente = await prisma.mecenas.findUnique({ where: { id } });
  if (!existente) {
    throw new MecenasAdminError("Mecenas no encontrado.", "no_encontrado");
  }

  const planId: PlanId =
    patch.plan ?? (existente.plan === PlanMecenas.fundador ? "fundador" : "mensual");

  let periodEnd = existente.periodEnd;
  if (patch.sinVencimiento) {
    periodEnd = null;
  } else if (patch.periodEnd !== undefined) {
    periodEnd = patch.periodEnd;
  }

  const estado = patch.estado ?? existente.estado;
  validarActivacion(periodEnd, estado);

  const data: Prisma.MecenasUpdateInput = {};

  if (patch.estado !== undefined) data.estado = patch.estado;
  if (patch.exentoFacturacion !== undefined) data.exentoFacturacion = patch.exentoFacturacion;
  if (patch.sinVencimiento || patch.periodEnd !== undefined) data.periodEnd = periodEnd;
  if (patch.plan !== undefined) {
    data.plan = patch.plan === "fundador" ? PlanMecenas.fundador : PlanMecenas.mensual;
  }
  if (patch.esFundador !== undefined) data.esFundador = patch.esFundador;
  if (patch.nombrePublico !== undefined) {
    data.nombrePublico = patch.nombrePublico?.trim() || null;
  }
  if (patch.mostrarCredito !== undefined) data.mostrarCredito = patch.mostrarCredito;
  if (patch.notasAdmin !== undefined) {
    data.notasAdmin = patch.notasAdmin?.trim() || null;
  }

  if (Object.keys(data).length === 0) {
    return { mecenas: aFilaAdmin(existente), advertenciaMp: undefined, planId };
  }

  const mecenas = await prisma.mecenas.update({
    where: { id },
    data,
  });

  const advertenciaMp =
    patch.exentoFacturacion === true && mecenas.mpSubscriptionId
      ? "Este mecenas tiene suscripción activa en MercadoPago. Marcá cortesía no cancela el cobro automático."
      : undefined;

  return { mecenas: aFilaAdmin(mecenas), advertenciaMp, planId };
}

export async function contarCortesiasActivas() {
  return prisma.mecenas.count({
    where: {
      exentoFacturacion: true,
      estado: EstadoMecenas.activo,
      OR: [{ periodEnd: null }, { periodEnd: { gt: new Date() } }],
    },
  });
}
