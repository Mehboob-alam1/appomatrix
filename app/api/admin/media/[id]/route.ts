import { revalidatePath } from "next/cache";
import { updateMediaAlt } from "@/lib/content";
import { deleteUpload } from "@/lib/media";
import { fail, ok, publicError, readJson, requireAdmin } from "@/lib/http";
import { get } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;
  const { id } = await context.params;
  const body = await readJson(request);
  if (!body || typeof body.alt !== "string") return fail("Send alt text.", 400);
  try {
    const result = await updateMediaAlt(id, body.alt);
    if (!result.ok) return fail(result.error, 404);
    return ok({ saved: true });
  } catch (error) {
    return publicError(error);
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;
  const { id } = await context.params;
  try {
    const row = await get("SELECT url FROM media WHERE id = ?", [id]);
    const url = new URL(request.url).searchParams.get("url");
    const target = row ? String(row.url) : url || "";
    if (!target.startsWith("/uploads/")) return fail("File not found.", 404);
    await deleteUpload(target);
    revalidatePath("/", "layout");
    return ok({ deleted: true });
  } catch (error) {
    return publicError(error);
  }
}
