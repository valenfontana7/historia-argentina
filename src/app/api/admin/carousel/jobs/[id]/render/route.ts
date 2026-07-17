import {
  proxyCarouselJson,
  requireAdminCarousel,
} from "@/lib/carousel/engine-proxy-helpers";

export const runtime = "nodejs";
export const maxDuration = 120;

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, ctx: Ctx) {
  const denied = await requireAdminCarousel();
  if (denied) return denied;
  const { id } = await ctx.params;
  const body = await request.text();
  return proxyCarouselJson(`/jobs/${id}/render`, {
    method: "POST",
    body: body || "{}",
  });
}
