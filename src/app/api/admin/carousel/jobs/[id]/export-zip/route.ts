import {
  proxyCarouselBinary,
  requireAdminCarousel,
} from "@/lib/carousel/engine-proxy-helpers";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const denied = await requireAdminCarousel();
  if (denied) return denied;
  const { id } = await ctx.params;
  return proxyCarouselBinary(`/jobs/${id}/export-zip`, {
    contentType: "application/zip",
    filename: `${id}.zip`,
  });
}
