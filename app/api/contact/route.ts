import { revalidatePath } from "next/cache";
import { createInquiry } from "@/lib/content";
import { fail, ok, publicError, readJson } from "@/lib/http";
import { clientIpFrom, rateLimit, validCsrf } from "@/lib/security";

export const dynamic = "force-dynamic";

function formFrom(body: Record<string, unknown>) {
  const form = new FormData();
  for (const [key, value] of Object.entries(body)) {
    if (value == null || typeof value === "object") continue;
    form.set(key, String(value));
  }
  return form;
}

export async function POST(request: Request) {
  try {
    if (!(await validCsrf(request.headers.get("x-csrf-token")))) return fail("Invalid CSRF token.", 403);
    const address = clientIpFrom((name) => request.headers.get(name));
    if (!rateLimit(`contact:${address}`, 5, 10 * 60 * 1000)) {
      return fail("Too many messages. Try again in a few minutes.", 429);
    }
    const type = request.headers.get("content-type") || "";
    let form: FormData;
    if (type.includes("application/json")) {
      const body = await readJson(request);
      if (!body) return fail("Send a JSON object.", 400);
      form = formFrom(body);
    } else {
      form = await request.formData();
    }
    const result = await createInquiry(form);
    if (!result.ok) return fail(result.error, 400);
    revalidatePath("/", "layout");
    return ok({ received: true }, 201);
  } catch (error) {
    return publicError(error);
  }
}
