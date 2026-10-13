import { CSRF_COOKIE } from "@/lib/csrf";

export function csrfTokenFromDocument() {
  if (typeof document === "undefined") return "";
  const row = document.cookie.split("; ").find((part) => part.startsWith(`${CSRF_COOKIE}=`));
  return row ? decodeURIComponent(row.slice(CSRF_COOKIE.length + 1)) : "";
}
