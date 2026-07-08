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
  updatedAt: Date;
};

const SETTINGS_ID = "default";

export async function getMembresiaSettings(): Promise<MembresiaSettingsData> {
  const row = await prisma.membresiaSettings.upsert({
    where: { id: SETTINGS_ID },
    create: {
      id: SETTINGS_ID,
      mensualHabilitado: false,
      fundadorHabilitado: false,
    },
    update: {},
  });

  return {
    mensualHabilitado: row.mensualHabilitado,
    fundadorHabilitado: row.fundadorHabilitado,
    updatedAt: row.updatedAt,
  };
}

export async function updateMembresiaSettings(input: {
  mensualHabilitado?: boolean;
  fundadorHabilitado?: boolean;
}): Promise<MembresiaSettingsData> {
  await getMembresiaSettings();

  const row = await prisma.membresiaSettings.update({
    where: { id: SETTINGS_ID },
    data: {
      mensualHabilitado: input.mensualHabilitado,
      fundadorHabilitado: input.fundadorHabilitado,
    },
  });

  return {
    mensualHabilitado: row.mensualHabilitado,
    fundadorHabilitado: row.fundadorHabilitado,
    updatedAt: row.updatedAt,
  };
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
  if (settings.mensualHabilitado) visible.push(planes.mensual);
  if (settings.fundadorHabilitado) visible.push(planes.fundador);
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

export function precioCheckout(planId: PlanId, email: string): number {
  if (esEmailCreador(email)) return precioCreador();
  return planes[planId].precio;
}

export async function puedeCheckoutPlan(planId: PlanId, email: string): Promise<boolean> {
  if (esEmailCreador(email)) return true;
  return planHabilitadoParaPublico(planId);
}
