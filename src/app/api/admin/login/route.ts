import { NextResponse } from "next/server";
import { createAdminSession, validateAdminCredentials } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    if (!process.env.ADMIN_SESSION_SECRET || !process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Admin is not configured. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET." },
        { status: 503 },
      );
    }

    const body = (await request.json()) as { username?: string; password?: string };
    const username = body.username?.trim() ?? "";
    const password = body.password ?? "";

    if (!validateAdminCredentials(username, password)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await createAdminSession();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
