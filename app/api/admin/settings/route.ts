import { revalidatePath } from "next/cache";
import { saveSettings } from "@/lib/content";
import { bodyToForm } from "@/lib/form-body";
import { fail, ok, publicError, readJson, requireAdmin } from "@/lib/http";
import { getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;
  try {
    return ok(await getSettings());
  } catch (error) {
    return publicError(error);
  }
}

export async function PUT(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;
  if (!auth.user) return fail("Authentication required.", 401);
  const body = await readJson(request);
  if (!body) return fail("Send a JSON object.", 400);
  try {
    const result = await saveSettings(auth.user, bodyToForm(body));
    if (!result.ok) return fail(result.error, 400);
    revalidatePath("/", "layout");
    return ok(await getSettings());
  } catch (error) {
    return publicError(error);
  }
}
