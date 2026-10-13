export function bodyToForm(body: Record<string, unknown>, base: Record<string, string> = {}) {
  const form = new FormData();
  for (const [key, value] of Object.entries(base)) form.set(key, value);
  for (const [key, value] of Object.entries(body)) {
    if (key === "id" || key === "csrf") continue;
    if (value == null) continue;
    if (typeof value === "boolean") form.set(key, value ? "1" : "");
    else if (typeof value === "object") form.set(key, JSON.stringify(value));
    else form.set(key, String(value));
  }
  return form;
}
