import { NextResponse } from "next/server";
import { sesionAdminValida } from "@/lib/admin-auth";
import {
  engineFetch,
  esRuntimeServerless,
  videoEngineUrlConfigurada,
} from "@/lib/video/engine-client";

export async function requireAdminEngine(): Promise<NextResponse | null> {
  if (!(await sesionAdminValida())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (esRuntimeServerless() && !videoEngineUrlConfigurada()) {
    return NextResponse.json(
      { error: "Falta VIDEO_ENGINE_URL del worker" },
      { status: 501 },
    );
  }
  return null;
}

export async function proxyEngine(
  path: string,
  init?: RequestInit,
): Promise<NextResponse> {
  try {
    const res = await engineFetch(path, init);
    const data = await res.json().catch(() => ({ error: "Invalid response" }));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? `Engine offline: ${err.message}`
            : "Engine offline",
      },
      { status: 502 },
    );
  }
}
