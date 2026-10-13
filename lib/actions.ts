"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearSession, getSession, setSession } from "@/lib/auth";
import {
  authenticate,
  createInquiry,
  deleteInquiry,
  deleteRecord,
  moveRecord,
  saveRecord,
  saveSettings,
  setInquiryStatus,
  setPublished,
} from "@/lib/content";
import { clientIpFrom, rateLimit, validCsrf } from "@/lib/security";
import type { ActionResult } from "@/lib/types";

async function requireUser() {
  const username = await getSession();
  if (!username) redirect("/admin/login");
  return username;
}

async function csrfError(token: string): Promise<ActionResult | null> {
  if (await validCsrf(token)) return null;
  return { ok: false, error: "The form expired. Refresh the page and try again." };
}

function refresh() {
  revalidatePath("/", "layout");
}

async function limit(kind: "login" | "contact") {
  const source = await headers();
  const address = clientIpFrom((name) => source.get(name));
  if (kind === "login") return rateLimit(`login:${address}`, 8, 15 * 60 * 1000);
  return rateLimit(`contact:${address}`, 5, 10 * 60 * 1000);
}

export async function login(username: string, password: string, csrf: string): Promise<ActionResult> {
  const blocked = await csrfError(csrf);
  if (blocked) return blocked;
  if (!(await limit("login"))) return { ok: false, error: "Too many sign-in attempts. Try again in a few minutes." };
  const result = await authenticate(username, password);
  if (!result.ok || !result.username) return { ok: false, error: result.ok ? "Those credentials do not match." : result.error };
  await setSession(result.username);
  return { ok: true };
}

export async function logout(csrf: string) {
  if (!(await validCsrf(csrf))) redirect("/admin/login");
  await clearSession();
  redirect("/admin/login");
}

export async function submitInquiry(formData: FormData): Promise<ActionResult> {
  const blocked = await csrfError(String(formData.get("csrf") || ""));
  if (blocked) return blocked;
  if (!(await limit("contact"))) return { ok: false, error: "Too many messages. Try again in a few minutes." };
  const result = await createInquiry(formData);
  if (result.ok) refresh();
  return result;
}

export async function setInquiryStatusAction(id: string, status: string, csrf: string): Promise<ActionResult> {
  await requireUser();
  const blocked = await csrfError(csrf);
  if (blocked) return blocked;
  const result = await setInquiryStatus(id, status);
  if (result.ok) refresh();
  return result;
}

export async function deleteInquiryAction(id: string, csrf: string): Promise<ActionResult> {
  await requireUser();
  const blocked = await csrfError(csrf);
  if (blocked) return blocked;
  const result = await deleteInquiry(id);
  if (result.ok) refresh();
  return result;
}

export async function deleteContent(section: string, id: string, csrf: string): Promise<ActionResult> {
  await requireUser();
  const blocked = await csrfError(csrf);
  if (blocked) return blocked;
  const result = await deleteRecord(section, id);
  if (result.ok) refresh();
  return result;
}

export async function moveContent(section: string, id: string, direction: "up" | "down", csrf: string): Promise<ActionResult> {
  await requireUser();
  const blocked = await csrfError(csrf);
  if (blocked) return blocked;
  const result = await moveRecord(section, id, direction);
  if (result.ok) refresh();
  return result;
}

export async function publishContent(section: string, id: string, published: boolean, csrf: string): Promise<ActionResult> {
  await requireUser();
  const blocked = await csrfError(csrf);
  if (blocked) return blocked;
  const result = await setPublished(section, id, published);
  if (result.ok) refresh();
  return result;
}

export async function saveContent(section: string, formData: FormData): Promise<ActionResult> {
  await requireUser();
  const blocked = await csrfError(String(formData.get("csrf") || ""));
  if (blocked) return blocked;
  const result = await saveRecord(section, formData);
  if (result.ok) refresh();
  return result;
}

export async function saveSettingsAction(formData: FormData): Promise<ActionResult> {
  const username = await requireUser();
  const blocked = await csrfError(String(formData.get("csrf") || ""));
  if (blocked) return blocked;
  const result = await saveSettings(username, formData);
  if (result.ok) refresh();
  return result;
}
