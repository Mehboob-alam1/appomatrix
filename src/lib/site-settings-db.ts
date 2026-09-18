import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { siteSettings } from "@/db/schema";

export type SiteSettingsRecord = {
  headHtml: string;
  bodyStartHtml: string;
  bodyEndHtml: string;
  announcementHtml: string;
  blogSidebarHtml: string;
  blogInArticleHtml: string;
  globalSeoExtra: string;
  calendlyUrl: string;
};

const DEFAULTS: SiteSettingsRecord = {
  headHtml: "",
  bodyStartHtml: "",
  bodyEndHtml: "",
  announcementHtml: "",
  blogSidebarHtml: "",
  blogInArticleHtml: "",
  globalSeoExtra: "",
  calendlyUrl: "",
};

export function getSiteSettings(): SiteSettingsRecord {
  const db = getDb();
  const row = db.select().from(siteSettings).where(eq(siteSettings.id, "global")).get();
  if (!row) return DEFAULTS;
  return {
    headHtml: row.headHtml ?? "",
    bodyStartHtml: row.bodyStartHtml ?? "",
    bodyEndHtml: row.bodyEndHtml ?? "",
    announcementHtml: row.announcementHtml ?? "",
    blogSidebarHtml: row.blogSidebarHtml ?? "",
    blogInArticleHtml: row.blogInArticleHtml ?? "",
    globalSeoExtra: row.globalSeoExtra ?? "",
    calendlyUrl: row.calendlyUrl ?? "",
  };
}
