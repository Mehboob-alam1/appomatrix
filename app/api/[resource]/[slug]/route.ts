import { publicItem } from "@/lib/catalog";
import { fail, ok, publicError } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ resource: string; slug: string }> }) {
  const { resource, slug } = await context.params;
  try {
    const data = await publicItem(resource, decodeURIComponent(slug));
    if (data === undefined) return fail("Not found.", 404);
    return ok(data);
  } catch (error) {
    return publicError(error);
  }
}
