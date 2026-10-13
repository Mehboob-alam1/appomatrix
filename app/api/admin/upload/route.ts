import { deleteUpload } from "@/lib/media";
import { saveUpload } from "@/lib/media";
import { fail, ok, publicError, readJson, requireAdmin } from "@/lib/http";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return fail("Choose an image.", 400);
    const saved = await saveUpload(file);
    return ok(saved, 201);
  } catch (error) {
    if (error instanceof Error && /Images must|Use a JPG/.test(error.message)) return fail(error.message, 400);
    return publicError(error);
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;
  const body = await readJson(request);
  const url = body && typeof body.url === "string" ? body.url : "";
  if (!url.startsWith("/uploads/")) return fail("Only uploaded files can be removed.", 400);
  try {
    await deleteUpload(url);
    revalidatePath("/", "layout");
    return ok({ deleted: true });
  } catch (error) {
    return publicError(error);
  }
}
