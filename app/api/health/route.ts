import { get } from "@/lib/db";
import { databaseConfigSummary, databaseHint } from "@/lib/db-status";
import { fail, ok } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await get("SELECT 1 AS ok");
    return ok({ database: "up", config: databaseConfigSummary() });
  } catch (error) {
    console.error(error);
    return fail(databaseHint(error), 503, { database: "down", config: databaseConfigSummary() });
  }
}
