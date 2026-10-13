import { revalidatePath } from "next/cache";
import { deleteRecord, saveRecord, setPublished } from "@/lib/content";
import { bodyToForm } from "@/lib/form-body";
import { fail, ok, publicError, readJson, requireAdmin } from "@/lib/http";
import { getRecord, isSection, recordToForm } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ section: string; id: string }> }) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;
  const { section, id } = await context.params;
  if (!isSection(section) || section === "inquiries") return fail("Unknown section.", 404);
  try {
    const record = await getRecord(section, id);
    if (!record) return fail("Not found.", 404);
    return ok(record);
  } catch (error) {
    return publicError(error);
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ section: string; id: string }> }) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;
  const { section, id } = await context.params;
  if (!isSection(section) || section === "inquiries") return fail("Unknown section.", 404);
  const body = await readJson(request);
  if (!body) return fail("Send a JSON object.", 400);
  try {
    if (Object.keys(body).length === 1 && typeof body.published === "boolean") {
      const result = await setPublished(section, id, body.published);
      if (!result.ok) return fail(result.error, result.error === "Record not found." ? 404 : 400);
      revalidatePath("/", "layout");
      return ok({ saved: true });
    }
    const current = await getRecord(section, id);
    if (!current) return fail("Not found.", 404);
    const form = bodyToForm(body, recordToForm(section, current));
    form.set("id", id);
    const result = await saveRecord(section, form);
    if (!result.ok) return fail(result.error, 400);
    revalidatePath("/", "layout");
    return ok(await getRecord(section, id));
  } catch (error) {
    return publicError(error);
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ section: string; id: string }> }) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;
  const { section, id } = await context.params;
  if (!isSection(section) || section === "inquiries") return fail("Unknown section.", 404);
  try {
    const result = await deleteRecord(section, id);
    if (!result.ok) return fail(result.error, result.error === "Record not found." ? 404 : 400);
    revalidatePath("/", "layout");
    return ok({ deleted: true });
  } catch (error) {
    return publicError(error);
  }
}
