import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { CSRF_COOKIE } from "@/lib/csrf";

export { CSRF_COOKIE };

const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const recent = (buckets.get(key) || []).filter((stamp) => now - stamp < windowMs);
  if (recent.length >= limit) {
    buckets.set(key, recent);
    return false;
  }
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 5000) {
    for (const [bucket, stamps] of buckets) {
      if (stamps.every((stamp) => now - stamp >= windowMs)) buckets.delete(bucket);
    }
  }
  return true;
}

export function clientIpFrom(header: (name: string) => string | null) {
  const forwarded = header("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return header("x-real-ip") || "unknown";
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export async function validCsrf(token: string | null | undefined) {
  const expected = (await cookies()).get(CSRF_COOKIE)?.value || "";
  if (!expected || !token) return false;
  return safeEqual(expected, token);
}
