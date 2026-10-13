import { revalidatePath } from "next/cache";
import { moveRecord } from "@/lib/content";
import { fail, ok, publicError, readJson, requireAdmin } from "@/lib/http";
import { isSection } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ section: string }> }) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;
  const { section } = await context.params;
  if (!isSection(section) || section === "inquiries") return fail("Unknown section.", 404);
  const body = await readJson(request);
  if (!body) return fail("Send a JSON object.", 400);
  const direction = body.direction === "up" || body.direction === "down" ? body.direction : null;
  const id = typeof body.id === "string" ? body.id : "";
  if (!direction || !id) return fail("Send id and direction (up or down).", 400);
  try {
    const result = await moveRecord(section, id, direction);
    if (!result.ok) return fail(result.error, 400);
    revalidatePath("/", "layout");
    return ok({ moved: true });
  } catch (error) {
    return publicError(error);
  }
}
