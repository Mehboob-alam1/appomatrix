import { publicCollection } from "@/lib/catalog";
import { fail, ok, publicError } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ resource: string }> }) {
  const { resource } = await context.params;
  const category = new URL(request.url).searchParams.get("category") || "";
  try {
    const data = await publicCollection(resource, category);
    if (data === undefined) return fail("Unknown resource.", 404);
    return ok(data);
  } catch (error) {
    return publicError(error);
  }
}
