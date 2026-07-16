import { execSync } from "node:child_process";

function run(command) {
  execSync(command, { stdio: "inherit" });
}

run("npx prisma generate");

// `vercel pull` + `vercel build` local inyectan VERCEL_ENV desde .vercel/.env.*.
// VERCEL_REGION solo existe en el builder remoto de Vercel (pdx1, iad1, etc.).
const enVercelCloud = Boolean(process.env.VERCEL_REGION);

if (enVercelCloud) {
  run("npx prisma migrate deploy");
} else {
  console.warn(
    "[vercel-build] Build local: se omite prisma migrate deploy (usá npm run db:migrate si hace falta).",
  );
}

run("npx tsx scripts/cronicas-validar.ts");
run("npm run build -w @museoargent/video-contracts");
run("npx next build");
