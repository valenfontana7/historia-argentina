import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

export function authorizeEditorialRequest(request: Request) {
  const configured = process.env.EDITORIAL_INTERNAL_API_KEY;
  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!configured || !provided) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const expected = Buffer.from(configured);
  const actual = Buffer.from(provided);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return null;
}
