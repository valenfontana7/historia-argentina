import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { COOKIE_SESION } from "@/lib/auth-constants";

async function sesionValida(token: string | undefined): Promise<boolean> {
  if (!token || !process.env.AUTH_SECRET) return false;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.AUTH_SECRET),
    );
    return payload.tipo === "sesion" && typeof payload.email === "string";
  } catch {
    return false;
  }
}

/**
 * Protege el área de mecenas. Las crónicas exclusivas se ablandan
 * en la página (soft-gate), no acá.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/mecenas")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_SESION)?.value;
  const ok = await sesionValida(token);
  if (ok) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/membresia/acceder";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/mecenas/:path*"],
};
