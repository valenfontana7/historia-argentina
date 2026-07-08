import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function crearCliente() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? crearCliente();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/** Errores de conexión o schema: degradar UI en lugar de 500. */
export function esErrorDbDegradado(error: unknown): boolean {
  if (error instanceof Error && error.name === "PrismaClientInitializationError") {
    return true;
  }
  if (typeof error !== "object" || error === null || !("code" in error)) return false;
  const code = (error as { code: unknown }).code;
  if (typeof code !== "string") return false;
  return [
    "P1000",
    "P1001",
    "P1002",
    "P1017",
    "P2021",
    "P2022",
    "P2010",
  ].includes(code);
}
