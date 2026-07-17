import sampleFixture from "@/lib/carousel/sample-fixture.json";
import { carouselFromCronica } from "@/lib/carousel/carousel-from-cronica";
import {
  proxyCarouselJson,
  requireAdminCarousel,
} from "@/lib/carousel/engine-proxy-helpers";

export const runtime = "nodejs";

export async function GET() {
  const denied = await requireAdminCarousel();
  if (denied) return denied;
  return proxyCarouselJson("/jobs");
}

export async function POST(request: Request) {
  const denied = await requireAdminCarousel();
  if (denied) return denied;

  const body = (await request.json().catch(() => ({}))) as {
    useFixture?: boolean;
    slug?: string;
    carousel?: unknown;
    templateId?: string;
    themeId?: string;
    profileId?: string;
  };

  const presentation = {
    templateId: body.templateId ?? "museum_classic",
    themeId: body.themeId ?? "museoargent_classic",
    profileId: body.profileId ?? "instagram_feed",
  };

  let payload: Record<string, unknown>;

  if (body.slug?.trim()) {
    const built = carouselFromCronica(body.slug.trim());
    if (!built) {
      return Response.json(
        {
          ok: false,
          mensaje: `No se encontró la crónica «${body.slug}».`,
          error: "cronica_not_found",
        },
        { status: 404 },
      );
    }
    payload = {
      carousel: built.carousel,
      ...presentation,
    };
  } else if (body.useFixture || !body.carousel) {
    payload = {
      carousel: sampleFixture,
      ...presentation,
    };
  } else {
    payload = { ...body, ...presentation };
  }

  return proxyCarouselJson("/jobs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
