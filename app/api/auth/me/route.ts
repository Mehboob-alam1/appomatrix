import { getSession } from "@/lib/auth";
import { fail, ok, publicError } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const username = await getSession();
    if (!username) return fail("Authentication required.", 401);
    return ok({ username });
  } catch (error) {
    return publicError(error);
  }
}
