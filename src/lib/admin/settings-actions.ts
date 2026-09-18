"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { siteSettings } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/auth";

export async function saveSiteSettings(formData: FormData) {
  if (!(await isAdminAuthenticated())) throw new Error("Unauthorized");

  const payload = {
    headHtml: String(formData.get("headHtml") ?? ""),
    bodyStartHtml: String(formData.get("bodyStartHtml") ?? ""),
    bodyEndHtml: String(formData.get("bodyEndHtml") ?? ""),
    announcementHtml: String(formData.get("announcementHtml") ?? ""),
    blogSidebarHtml: String(formData.get("blogSidebarHtml") ?? ""),
    blogInArticleHtml: String(formData.get("blogInArticleHtml") ?? ""),
    globalSeoExtra: String(formData.get("globalSeoExtra") ?? ""),
    calendlyUrl: String(formData.get("calendlyUrl") ?? "").trim(),
    updatedAt: new Date().toISOString(),
  };

  const db = getDb();
  const existing = db.select().from(siteSettings).where(eq(siteSettings.id, "global")).get();
  if (existing) {
    db.update(siteSettings).set(payload).where(eq(siteSettings.id, "global")).run();
  } else {
    db.insert(siteSettings).values({ id: "global", ...payload }).run();
  }

  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}
