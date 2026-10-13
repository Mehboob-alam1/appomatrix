import { revalidatePath } from "next/cache";
import { deleteInquiry, setInquiryStatus } from "@/lib/content";
import { fail, ok, publicError, readJson, requireAdmin } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;
  const { id } = await context.params;
  const body = await readJson(request);
  if (!body || typeof body.status !== "string") return fail("Send a status.", 400);
  try {
    const result = await setInquiryStatus(id, body.status);
    if (!result.ok) return fail(result.error, result.error === "Inquiry not found." ? 404 : 400);
    revalidatePath("/", "layout");
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
    const result = await deleteInquiry(id);
    if (!result.ok) return fail(result.error, 404);
    revalidatePath("/", "layout");
    return ok({ deleted: true });
  } catch (error) {
    return publicError(error);
  }
}
