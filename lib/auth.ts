import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export { hashPassword, verifyPassword } from "@/lib/password";

const COOKIE = "am_session";

function secret() {
  const value = process.env.AUTH_SECRET;
  if (value) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error("Set AUTH_SECRET in the environment before running in production.");
  }
  return "appomatrix-local-auth-secret";
}

function sign(body: string) {
  return createHmac("sha256", secret()).update(body).digest("hex");
}

export function createToken(username: string) {
  const body = Buffer.from(
    JSON.stringify({ u: username, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }),
  ).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function readToken(token: string | undefined | null) {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as {
      u?: string;
      exp?: number;
    };
    if (!payload.u || !payload.exp || payload.exp < Date.now()) return null;
    return payload.u;
  } catch {
    return null;
  }
}

export async function getSession() {
  const jar = await cookies();
  return readToken(jar.get(COOKIE)?.value);
}

export async function setSession(username: string) {
  const jar = await cookies();
  jar.set(COOKIE, createToken(username), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
