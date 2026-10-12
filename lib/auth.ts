import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "am_session";

function secret() {
  return process.env.AUTH_SECRET || "appomatrix-local-auth-secret";
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const next = scryptSync(password, salt, 32);
  const prev = Buffer.from(hash, "hex");
  if (next.length !== prev.length) return false;
  return timingSafeEqual(next, prev);
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
