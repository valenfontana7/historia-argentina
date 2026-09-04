import { prisma } from "@/lib/db";
import { authorizeEditorialRequest } from "../_auth";
import { EditorialBrandSchema, VariantStatusSchema } from "@/lib/editorial/contracts";
import { editorialVariantDto } from "@/lib/editorial/dto";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const denied = authorizeEditorialRequest(request);
  if (denied) return denied;
  const url = new URL(request.url);
  const brandRaw = url.searchParams.get("brand");
  const statusRaw = url.searchParams.get("status") || "approved";
  const brand = brandRaw ? EditorialBrandSchema.safeParse(brandRaw) : null;
  const status = VariantStatusSchema.safeParse(statusRaw);
  if (brandRaw && !brand?.success) return Response.json({ error: "invalid_brand" }, { status: 400 });
  if (!status.success) return Response.json({ error: "invalid_status" }, { status: 400 });
  const variants = await prisma.contentVariant.findMany({ where: { status: status.data, ...(brand?.success ? { angle: { brand: brand.data } } : {}) }, include: { angle: { include: { story: true } }, mediaOutputs: true }, orderBy: { updatedAt: "desc" } });
  return Response.json({ variants: variants.map(editorialVariantDto) });
}
