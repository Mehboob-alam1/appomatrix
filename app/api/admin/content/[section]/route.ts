import { revalidatePath } from "next/cache";
import { adminCollection } from "@/lib/catalog";
import { saveRecord } from "@/lib/content";
import { bodyToForm } from "@/lib/form-body";
import { fail, ok, publicError, readJson, requireAdmin } from "@/lib/http";
import { isSection } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ section: string }> }) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;
  const { section } = await context.params;
  if (!isSection(section) || section === "inquiries") return fail("Unknown section.", 404);
  try {
    const data = await adminCollection(section);
    if (data === undefined) return fail("Unknown section.", 404);
    return ok(data);
  } catch (error) {
    return publicError(error);
  }
}

export async function POST(request: Request, context: { params: Promise<{ section: string }> }) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;
  const { section } = await context.params;
  if (!isSection(section) || section === "inquiries") return fail("Unknown section.", 404);
  const body = await readJson(request);
  if (!body) return fail("Send a JSON object.", 400);
  try {
    const result = await saveRecord(section, bodyToForm(body));
    if (!result.ok) return fail(result.error, 400);
    revalidatePath("/", "layout");
    return ok({ saved: true }, 201);
  } catch (error) {
    return publicError(error);
  }
}
