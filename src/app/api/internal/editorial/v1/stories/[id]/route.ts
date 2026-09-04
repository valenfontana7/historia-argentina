import { getEditorialStory } from "@/lib/editorial/repository";
import { editorialStoryDto } from "@/lib/editorial/dto";
import { authorizeEditorialRequest } from "../../_auth";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = authorizeEditorialRequest(request);
  if (denied) return denied;
  const { id } = await params;
  const story = await getEditorialStory(id);
  if (!story) return Response.json({ error: "not_found" }, { status: 404 });
  return Response.json(editorialStoryDto(story));
}
