import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { CSRF_COOKIE } from "@/lib/csrf";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  if (!request.cookies.get(CSRF_COOKIE)?.value) {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    const token = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
    response.cookies.set(CSRF_COOKIE, token, {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
