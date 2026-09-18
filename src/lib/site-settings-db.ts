import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { siteSettings } from "@/db/schema";
import { siteConfig } from "@/lib/site-config";

export type SiteSettingsRecord = {
  headHtml: string;
  bodyStartHtml: string;
  bodyEndHtml: string;
  announcementHtml: string;
  blogSidebarHtml: string;
  blogInArticleHtml: string;
  globalSeoExtra: string;
  calendlyUrl: string;
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp: string;
  contactAddress: string;
};

export type SiteContact = {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
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
  contactEmail: "",
  contactPhone: "",
  contactWhatsapp: "",
  contactAddress: "",
};

function mapRow(row: typeof siteSettings.$inferSelect): SiteSettingsRecord {
  return {
    headHtml: row.headHtml ?? "",
    bodyStartHtml: row.bodyStartHtml ?? "",
    bodyEndHtml: row.bodyEndHtml ?? "",
    announcementHtml: row.announcementHtml ?? "",
    blogSidebarHtml: row.blogSidebarHtml ?? "",
    blogInArticleHtml: row.blogInArticleHtml ?? "",
    globalSeoExtra: row.globalSeoExtra ?? "",
    calendlyUrl: row.calendlyUrl ?? "",
    contactEmail: row.contactEmail ?? "",
    contactPhone: row.contactPhone ?? "",
    contactWhatsapp: row.contactWhatsapp ?? "",
    contactAddress: row.contactAddress ?? "",
  };
}

export function getSiteSettings(): SiteSettingsRecord {
  const db = getDb();
  const row = db.select().from(siteSettings).where(eq(siteSettings.id, "global")).get();
  if (!row) return DEFAULTS;
  return mapRow(row);
}

/** Public contact details — admin overrides, then defaults from site-config. */
export function getSiteContact(): SiteContact {
  const s = getSiteSettings();
  const whatsappRaw = s.contactWhatsapp.trim() || siteConfig.contact.whatsapp;
  return {
    email: s.contactEmail.trim() || siteConfig.contact.email,
    phone: s.contactPhone.trim() || siteConfig.contact.phone,
    whatsapp: whatsappRaw.replace(/\D/g, ""),
    address: s.contactAddress.trim() || siteConfig.contact.address,
  };
}
