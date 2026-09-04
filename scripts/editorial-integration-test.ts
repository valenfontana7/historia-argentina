import { execFileSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

const testUrl = process.env.EDITORIAL_TEST_DATABASE_URL?.trim();
const productionUrl = process.env.DATABASE_URL?.trim();

if (!testUrl) {
  console.log("EDITORIAL_TEST_DATABASE_URL no está configurada; integración Prisma omitida de forma segura.");
  process.exit(0);
}
if (testUrl === productionUrl) throw new Error("EDITORIAL_TEST_DATABASE_URL no puede ser igual a DATABASE_URL.");

async function main() {
  const childEnv = { ...process.env, DATABASE_URL: testUrl };
  execFileSync(process.platform === "win32" ? "npx.cmd" : "npx", ["prisma", "migrate", "deploy"], { stdio: "inherit", env: childEnv });
  const prisma = new PrismaClient({ datasourceUrl: testUrl });
  try {
    await prisma.$queryRaw`SELECT 1`;
    const result = await prisma.$queryRaw<Array<{ exists: boolean }>>`SELECT to_regclass('public."EditorialStory"') IS NOT NULL AS exists`;
    if (!result[0]?.exists) throw new Error("La migración editorial no creó EditorialStory.");
    console.log("Integración Prisma editorial OK sobre la base descartable configurada.");
  } finally {
    await prisma.$disconnect();
  }
}

void main();
