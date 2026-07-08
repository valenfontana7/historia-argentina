import { prisma } from "@/lib/db";
import { planes, type PlanId, type PlanMembresia } from "@/lib/membresia.config";

export class PlanNoDisponibleError extends Error {
  constructor() {
    super("Plan no disponible.");
    this.name = "PlanNoDisponibleError";
  }
}

export type MembresiaSettingsData = {
  mensualHabilitado: boolean;
  fundadorHabilitado: boolean;
  precioMensual: number;
  precioFundador: number;
  updatedAt: Date;
};

const SETTINGS_ID = "default";

function mapSettings(row: {
  mensualHabilitado: boolean;
  fundadorHabilitado: boolean;
  precioMensual: number;
  precioFundador: number;
  updatedAt: Date;
}): MembresiaSettingsData {
  return {
    mensualHabilitado: row.mensualHabilitado,
    fundadorHabilitado: row.fundadorHabilitado,
    precioMensual: row.precioMensual,
    precioFundador: row.precioFundador,
    updatedAt: row.updatedAt,
  };
}

export function planConPrecio(
  settings: MembresiaSettingsData,
  planId: PlanId,
): PlanMembresia {
  const base = planes[planId];
  const precio =
    planId === "mensual" ? settings.precioMensual : settings.precioFundador;
  return { ...base, precio };
}

export async function getMembresiaSettings(): Promise<MembresiaSettingsData> {
  const row = await prisma.membresiaSettings.upsert({
    where: { id: SETTINGS_ID },
    create: {
      id: SETTINGS_ID,
      mensualHabilitado: false,
      fundadorHabilitado: false,
      precioMensual: planes.mensual.precio,
      precioFundador: planes.fundador.precio,
    },
    update: {},
  });

  return mapSettings(row);
}

export async function updateMembresiaSettings(input: {
  mensualHabilitado?: boolean;
  fundadorHabilitado?: boolean;
  precioMensual?: number;
  precioFundador?: number;
}): Promise<MembresiaSettingsData> {
  await getMembresiaSettings();

  const row = await prisma.membresiaSettings.update({
    where: { id: SETTINGS_ID },
    data: {
      mensualHabilitado: input.mensualHabilitado,
      fundadorHabilitado: input.fundadorHabilitado,
      precioMensual: input.precioMensual,
      precioFundador: input.precioFundador,
    },
  });

  return mapSettings(row);
}

export async function planHabilitadoParaPublico(planId: PlanId): Promise<boolean> {
  const settings = await getMembresiaSettings();
  switch (planId) {
    case "mensual":
      return settings.mensualHabilitado;
    case "fundador":
      return settings.fundadorHabilitado;
    default: {
      const _exhaustive: never = planId;
      return _exhaustive;
    }
  }
}

export async function planesVisiblesPublico(): Promise<PlanMembresia[]> {
  const settings = await getMembresiaSettings();
  const visible: PlanMembresia[] = [];
  if (settings.mensualHabilitado) visible.push(planConPrecio(settings, "mensual"));
  if (settings.fundadorHabilitado) visible.push(planConPrecio(settings, "fundador"));
  return visible;
}

export function emailsCreador(): string[] {
  return (
    process.env.MECENAS_CREATOR_EMAILS?.split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean) ?? []
  );
}

export function esEmailCreador(email: string): boolean {
  const normalizado = email.toLowerCase().trim();
  return emailsCreador().includes(normalizado);
}

export function precioCreador(): number {
  const precio = Number(process.env.MECENAS_CREATOR_PRECIO ?? "1");
  return Number.isFinite(precio) && precio > 0 ? precio : 1;
}

export async function precioCheckout(planId: PlanId, email: string): Promise<number> {
  if (esEmailCreador(email)) return precioCreador();
  const settings = await getMembresiaSettings();
  return planConPrecio(settings, planId).precio;
}

export async function puedeCheckoutPlan(planId: PlanId, email: string): Promise<boolean> {
  if (esEmailCreador(email)) return true;
  return planHabilitadoParaPublico(planId);
}

export function precioValido(precio: unknown): precio is number {
  return typeof precio === "number" && Number.isInteger(precio) && precio >= 100;
}
