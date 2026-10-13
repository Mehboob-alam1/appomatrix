import { ok, publicError, requireAdmin } from "@/lib/http";
import { listMedia } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;
  try {
    return ok(await listMedia());
  } catch (error) {
    return publicError(error);
  }
}
