import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { validCsrf } from "@/lib/security";

export function ok(data: unknown, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

export function fail(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export function publicError(error: unknown) {
  console.error(error);
  const message = error instanceof Error ? error.message : "";
  if (
    message.includes("Missing DB_") ||
    message.includes("Missing AUTH") ||
    message.includes("ECONNREFUSED") ||
    message.includes("ER_ACCESS_DENIED") ||
    message.includes("ER_BAD_DB_ERROR") ||
    message.includes("ENOTFOUND")
  ) {
    return fail("Database is unavailable.", 503);
  }
  return fail("Could not complete that request.", 500);
}

export async function requireAdmin(request: Request) {
  const user = await getSession();
  if (!user) return { user: null, error: fail("Authentication required.", 401) };
  if (request.method !== "GET" && request.method !== "HEAD") {
    const token = request.headers.get("x-csrf-token");
    if (!(await validCsrf(token))) return { user: null, error: fail("Invalid CSRF token.", 403) };
  }
  return { user, error: null };
}

export async function readJson(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    if (!body || typeof body !== "object" || Array.isArray(body)) return {};
    return body as Record<string, unknown>;
  } catch {
    return null;
  }
}
