import { setSession } from "@/lib/auth";
import { authenticate } from "@/lib/content";
import { fail, ok, publicError, readJson } from "@/lib/http";
import { clientIpFrom, rateLimit, validCsrf } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (!(await validCsrf(request.headers.get("x-csrf-token")))) return fail("Invalid CSRF token.", 403);
    const address = clientIpFrom((name) => request.headers.get(name));
    if (!rateLimit(`login:${address}`, 8, 15 * 60 * 1000)) {
      return fail("Too many sign-in attempts. Try again in a few minutes.", 429);
    }
    const body = await readJson(request);
    if (!body) return fail("Send a JSON object.", 400);
    const result = await authenticate(String(body.username || ""), String(body.password || ""));
    if (!result.ok || !result.username) return fail("Those credentials do not match.", 401);
    await setSession(result.username);
    return ok({ username: result.username });
  } catch (error) {
    return publicError(error);
  }
}
