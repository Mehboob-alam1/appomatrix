import { clearSession } from "@/lib/auth";
import { fail, ok, publicError } from "@/lib/http";
import { validCsrf } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (!(await validCsrf(request.headers.get("x-csrf-token")))) return fail("Invalid CSRF token.", 403);
    await clearSession();
    return ok({ signedOut: true });
  } catch (error) {
    return publicError(error);
  }
}
