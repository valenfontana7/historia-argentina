import { NextResponse } from "next/server";
import { procesarWebhook } from "@/lib/mp";

export const runtime = "nodejs";

async function manejar(request: Request) {
  const url = new URL(request.url);
  const topic = url.searchParams.get("topic") ?? url.searchParams.get("type");
  const id = url.searchParams.get("id") ?? url.searchParams.get("data.id");

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

  try {
    await procesarWebhook({ topic, id, type, dataId });
  } catch (error) {
    console.error("[mp/webhook]", error, { topic, id, type, dataId });
    // MercadoPago reintenta si no es 200; devolvemos 200 para errores no retriables de parsing.
  }

  return NextResponse.json({ ok: true });
}

export async function GET(request: Request) {
  return manejar(request);
}

export async function POST(request: Request) {
  return manejar(request);
}
