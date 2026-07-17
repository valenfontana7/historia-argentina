import {
  proxyCarouselJson,
  requireAdminCarousel,
} from "@/lib/carousel/engine-proxy-helpers";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const denied = await requireAdminCarousel();
  if (denied) return denied;
  const { id } = await ctx.params;
  return proxyCarouselJson(`/jobs/${id}`);
}

export async function PATCH(request: Request, ctx: Ctx) {
  const denied = await requireAdminCarousel();
  if (denied) return denied;
  const { id } = await ctx.params;
  const body = await request.text();
  return proxyCarouselJson(`/jobs/${id}`, {
    method: "PATCH",
    body,
  });
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const denied = await requireAdminCarousel();
  if (denied) return denied;
  const { id } = await ctx.params;
  return proxyCarouselJson(`/jobs/${id}`, { method: "DELETE" });
}
