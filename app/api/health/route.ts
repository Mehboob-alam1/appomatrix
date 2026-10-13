import { get } from "@/lib/db";
import { fail, ok } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await get("SELECT 1 AS ok");
    return ok({ database: "up" });
  } catch (error) {
    console.error(error);
    return fail("Database is unavailable.", 503);
  }
}
