import { randomBytes } from "crypto";
import { hashPassword, verifyPassword } from "@/lib/password";
import { all, get, run } from "@/lib/db";
import { defaultSettings } from "@/lib/defaults";
import { readingMinutes, slugify } from "@/lib/format";
import { getSettings, getUser, isSection, SECTION_TABLE, type SectionKey } from "@/lib/queries";
import { richTextPlain, sanitizeRichText } from "@/lib/rich-text";
import type { ActionResult, GalleryImage, Settings } from "@/lib/types";

const DUMMY_HASH = `${"0".repeat(32)}:${"0".repeat(64)}`;
const STATUSES = ["new", "reviewed", "replied", "archived"];
const NAV_LOCATIONS = ["header", "footer", "header_cta"];

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function checked(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "1" || formData.get(key) === "true";
}

function integer(formData: FormData, key: string) {
  const value = Number(text(formData, key));
  return Number.isFinite(value) ? Math.round(value) : 0;
}

function requiredRich(value: string, label: string) {
  const html = sanitizeRichText(value);
  if (!richTextPlain(html)) throw new Error(`${label} is required.`);
  return html;
}

function clip(value: string, max: number) {
  return value.slice(0, max);
}

function required(value: string, label: string) {
  if (!value) throw new Error(`${label} is required.`);
  return value;
}

function uid() {
  return randomBytes(8).toString("hex");
}

function dbMessage(error: unknown) {
  if (error && typeof error === "object" && "code" in error && error.code === "ER_DUP_ENTRY") {
    return "A record with that slug or path already exists.";
  }
  return error instanceof Error ? error.message : "Could not save.";
}

function httpUrl(value: string, label: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${label} must be an http(s) URL.`);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`${label} must be an http(s) URL.`);
  }
  return value;
}

function pathOrUrl(value: string, label: string) {
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  return httpUrl(value, label);
}

async function claimSlug(table: string, base: string, id: string) {
  const root = slugify(base) || "item";
  let slug = root;
  let n = 2;
  while (n < 200) {
    const row = await get(`SELECT id FROM ${table} WHERE slug = ?`, [slug]);
    if (!row || String(row.id) === id) return slug;
    slug = `${root}-${n++}`;
  }
  throw new Error("Could not create a unique slug.");
}

function parseGallery(raw: string): GalleryImage[] {
  try {
    const parsed = JSON.parse(raw) as GalleryImage[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item.url === "string" && item.url.trim())
      .map((item) => ({
        url: item.url.trim(),
        alt: (item.alt || "").trim(),
        caption: (item.caption || "").trim(),
      }));
  } catch {
    return [];
  }
}

export async function authenticate(username: string, password: string): Promise<ActionResult & { username?: string }> {
  const user = await getUser(username.trim());
  const hash = user?.passwordHash || DUMMY_HASH;
  const match = verifyPassword(password, hash);
  if (!user || !match) return { ok: false, error: "Those credentials do not match." };
  return { ok: true, username: user.username };
}

export async function createInquiry(formData: FormData): Promise<ActionResult> {
  if (text(formData, "website")) return { ok: true };
  const name = clip(text(formData, "name"), 200);
  const email = clip(text(formData, "email"), 320);
  const message = clip(text(formData, "message"), 8000);
  if (!name || !email || !message) return { ok: false, error: "Name, email, and a short note are required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Enter a valid email address." };
  const id = `inq_${randomBytes(6).toString("hex")}`;
  await run(
    `INSERT INTO inquiries (id, name, email, phone, company, topic, budget, message, status, submitted_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)`,
    [
      id,
      name,
      email,
      clip(text(formData, "phone"), 40),
      clip(text(formData, "company"), 200),
      clip(text(formData, "topic"), 200),
      clip(text(formData, "budget"), 80),
      message,
      new Date().toISOString(),
    ],
  );
  return { ok: true };
}

export async function setInquiryStatus(id: string, status: string): Promise<ActionResult> {
  if (!STATUSES.includes(status)) return { ok: false, error: "Unknown status." };
  const result = await run("UPDATE inquiries SET status = ? WHERE id = ?", [status, id]);
  if (!result.affectedRows) return { ok: false, error: "Inquiry not found." };
  return { ok: true };
}

export async function deleteInquiry(id: string): Promise<ActionResult> {
  const result = await run("DELETE FROM inquiries WHERE id = ?", [id]);
  if (!result.affectedRows) return { ok: false, error: "Inquiry not found." };
  return { ok: true };
}

export async function deleteRecord(section: string, id: string): Promise<ActionResult> {
  if (!isSection(section)) return { ok: false, error: "Unknown section." };
  if (section === "services") {
    await run("UPDATE services SET parent_id = NULL WHERE parent_id = ?", [id]);
  }
  if (section === "categories") {
    await run("UPDATE posts SET category_id = NULL WHERE category_id = ?", [id]);
  }
  const result = await run(`DELETE FROM ${SECTION_TABLE[section]} WHERE id = ?`, [id]);
  if (!result.affectedRows) return { ok: false, error: "Record not found." };
  return { ok: true };
}

export async function moveRecord(section: string, id: string, direction: "up" | "down"): Promise<ActionResult> {
  if (!isSection(section) || section === "inquiries") return { ok: false, error: "This list cannot be reordered." };
  const table = SECTION_TABLE[section];
  const rows = await getOrder(table);
  const index = rows.findIndex((row) => row === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= rows.length) return { ok: true };
  const next = rows.slice();
  const [moved] = next.splice(index, 1);
  next.splice(swapWith, 0, moved);
  for (let i = 0; i < next.length; i += 1) {
    await run(`UPDATE ${table} SET sort_order = ? WHERE id = ?`, [i + 1, next[i]]);
  }
  return { ok: true };
}

async function getOrder(table: string) {
  const rows = await all(`SELECT id FROM ${table} ORDER BY sort_order ASC, id ASC`);
  return rows.map((row) => String(row.id));
}

export async function setPublished(section: string, id: string, published: boolean): Promise<ActionResult> {
  if (!isSection(section) || section === "inquiries") return { ok: false, error: "This record cannot be published." };
  const result = await run(`UPDATE ${SECTION_TABLE[section]} SET published = ? WHERE id = ?`, [published ? 1 : 0, id]);
  if (!result.affectedRows) return { ok: false, error: "Record not found." };
  return { ok: true };
}

export async function saveRecord(section: string, formData: FormData): Promise<ActionResult> {
  if (!isSection(section) || section === "inquiries") return { ok: false, error: "Unknown section." };
  const existingId = text(formData, "id");
  const id = existingId || uid();
  const table = SECTION_TABLE[section];
  try {
    const exists = existingId ? Boolean(await get(`SELECT id FROM ${table} WHERE id = ?`, [existingId])) : false;
    const previousName =
      section === "categories" && exists
        ? String((await get("SELECT name FROM post_categories WHERE id = ?", [id]))?.name || "")
        : "";
    const data = await buildRecord(section, formData, id);
    const keys = Object.keys(data);
    if (exists) {
      const sets = keys.map((key) => `${key} = ?`).join(", ");
      await run(`UPDATE ${table} SET ${sets} WHERE id = ?`, [...keys.map((key) => data[key]), id]);
    } else {
      await run(
        `INSERT INTO ${table} (id, ${keys.join(", ")}) VALUES (?, ${keys.map(() => "?").join(", ")})`,
        [id, ...keys.map((key) => data[key])],
      );
    }
    if (section === "categories" && previousName && previousName !== data.name) {
      await run("UPDATE posts SET category = ? WHERE category_id = ?", [String(data.name), id]);
    }
  } catch (error) {
    return { ok: false, error: dbMessage(error) };
  }
  return { ok: true };
}

async function buildRecord(section: SectionKey, formData: FormData, id: string): Promise<Record<string, string | number | null>> {
  const published = checked(formData, "published") ? 1 : 0;
  const sortOrder = integer(formData, "sortOrder");

  if (section === "services") {
    const title = required(clip(text(formData, "title"), 255), "Title");
    const parentId = text(formData, "parentId");
    if (parentId === id) throw new Error("A service cannot be its own parent.");
    if (parentId && (await get("SELECT id FROM services WHERE parent_id = ?", [id]))) {
      throw new Error("Move its sub-services before placing this service under another.");
    }
    if (parentId && !(await get("SELECT id FROM services WHERE id = ? AND parent_id IS NULL", [parentId]))) {
      throw new Error("Choose a top-level service as the parent.");
    }
    return {
      slug: await claimSlug("services", text(formData, "slug") || title, id),
      title,
      parent_id: parentId || null,
      short_description: requiredRich(text(formData, "shortDescription"), "Short description"),
      full_description: sanitizeRichText(text(formData, "fullDescription")),
      icon: text(formData, "icon") || "globe",
      image: clip(text(formData, "image"), 1000),
      image_alt: clip(text(formData, "imageAlt"), 500),
      process_text: text(formData, "processText"),
      tech_stack: clip(text(formData, "techStack"), 1000),
      sort_order: sortOrder,
      published,
    };
  }

  if (section === "portfolio") {
    const title = required(clip(text(formData, "title"), 255), "Title");
    const link = text(formData, "externalLink");
    return {
      slug: await claimSlug("projects", text(formData, "slug") || title, id),
      title,
      client_name: required(clip(text(formData, "clientName"), 255), "Client"),
      category: required(clip(text(formData, "category"), 191), "Category"),
      excerpt: sanitizeRichText(text(formData, "excerpt")),
      cover_image: clip(text(formData, "coverImage"), 1000),
      cover_image_alt: clip(text(formData, "coverImageAlt"), 500),
      gallery: JSON.stringify(parseGallery(text(formData, "gallery"))),
      problem: sanitizeRichText(text(formData, "problem")),
      solution: sanitizeRichText(text(formData, "solution")),
      result: sanitizeRichText(text(formData, "result")),
      metrics_text: text(formData, "metricsText"),
      tech_stack: clip(text(formData, "techStack"), 1000),
      external_link: link ? httpUrl(link, "Live product link") : "",
      featured: checked(formData, "featured") ? 1 : 0,
      sort_order: sortOrder,
      published,
      created_at: text(formData, "createdAt") || new Date().toISOString(),
    };
  }

  if (section === "blog") {
    const title = required(clip(text(formData, "title"), 255), "Title");
    const content = sanitizeRichText(text(formData, "content"));
    const categoryId = text(formData, "categoryId");
    let categoryName = clip(text(formData, "category"), 191);
    if (categoryId) {
      const category = await get("SELECT id, name FROM post_categories WHERE id = ?", [categoryId]);
      if (!category) throw new Error("Choose a category.");
      categoryName = String(category.name);
    }
    return {
      slug: await claimSlug("posts", text(formData, "slug") || title, id),
      title,
      excerpt: requiredRich(text(formData, "excerpt"), "Excerpt"),
      content,
      featured_image: clip(text(formData, "featuredImage"), 1000),
      featured_image_alt: clip(text(formData, "featuredImageAlt"), 500),
      author: clip(text(formData, "author"), 255),
      category: required(categoryName, "Category"),
      category_id: categoryId || null,
      published_at: text(formData, "publishedAt") || new Date().toISOString().slice(0, 10),
      reading_time_minutes: readingMinutes(content),
      published,
    };
  }

  if (section === "categories") {
    const name = required(clip(text(formData, "name"), 191), "Name");
    return {
      slug: await claimSlug("post_categories", text(formData, "slug") || name, id),
      name,
      description: sanitizeRichText(text(formData, "description")),
      sort_order: sortOrder,
      published,
    };
  }

  if (section === "team") {
    const linkedin = text(formData, "linkedin");
    return {
      name: required(clip(text(formData, "name"), 255), "Name"),
      role: required(clip(text(formData, "role"), 255), "Role"),
      photo: clip(text(formData, "photo"), 1000),
      photo_alt: clip(text(formData, "photoAlt"), 500),
      bio: sanitizeRichText(text(formData, "bio")),
      linkedin: linkedin ? httpUrl(linkedin, "LinkedIn URL") : "",
      sort_order: sortOrder,
      published,
    };
  }

  if (section === "testimonials") {
    return {
      client_name: required(clip(text(formData, "clientName"), 255), "Client name"),
      role: required(clip(text(formData, "role"), 255), "Role"),
      company: required(clip(text(formData, "company"), 255), "Company"),
      quote: requiredRich(text(formData, "quote"), "Quote"),
      rating: Math.min(5, Math.max(1, integer(formData, "rating") || 5)),
      sort_order: sortOrder,
      published,
    };
  }

  if (section === "careers") {
    const title = required(clip(text(formData, "title"), 255), "Title");
    const kind = text(formData, "kind") || "Role";
    if (!["Role", "Internship", "Program"].includes(kind)) throw new Error("Unknown kind.");
    return {
      slug: await claimSlug("careers", text(formData, "slug") || title, id),
      title,
      kind,
      location: clip(text(formData, "location"), 255),
      department: clip(text(formData, "department"), 255),
      summary: requiredRich(text(formData, "summary"), "Summary"),
      description: sanitizeRichText(text(formData, "description")),
      requirements: sanitizeRichText(text(formData, "requirements")),
      deadline: clip(text(formData, "deadline"), 40),
      sort_order: sortOrder,
      published,
    };
  }

  if (section === "scholarships") {
    const title = required(clip(text(formData, "title"), 255), "Title");
    const application = text(formData, "applicationUrl");
    return {
      slug: await claimSlug("scholarships", text(formData, "slug") || title, id),
      title,
      award: clip(text(formData, "award"), 500),
      eligibility: sanitizeRichText(text(formData, "eligibility")),
      deadline: clip(text(formData, "deadline"), 40),
      summary: requiredRich(text(formData, "summary"), "Summary"),
      description: sanitizeRichText(text(formData, "description")),
      cover_image: clip(text(formData, "coverImage"), 1000),
      cover_image_alt: clip(text(formData, "coverImageAlt"), 500),
      application_url: application ? pathOrUrl(application, "Application URL") : "",
      sort_order: sortOrder,
      published,
    };
  }

  if (section === "navigation") {
    const location = text(formData, "location") || "header";
    if (!NAV_LOCATIONS.includes(location)) throw new Error("Choose header, footer, or header button.");
    return {
      location,
      label: required(clip(text(formData, "label"), 255), "Label"),
      href: pathOrUrl(required(text(formData, "href"), "Link"), "Link"),
      sort_order: sortOrder,
      published,
    };
  }

  if (section === "social") {
    return {
      label: required(clip(text(formData, "label"), 100), "Label"),
      url: httpUrl(required(text(formData, "url"), "URL"), "URL"),
      sort_order: sortOrder,
      published,
    };
  }

  if (section === "sections") {
    const key = slugify(text(formData, "sectionKey") || text(formData, "title")) || "section";
    const existing = await get("SELECT id FROM homepage_sections WHERE section_key = ?", [key]);
    if (existing && String(existing.id) !== id) throw new Error("That section key is already used.");
    const href = text(formData, "ctaHref");
    return {
      section_key: key,
      kicker: clip(text(formData, "kicker"), 255),
      title: clip(text(formData, "title"), 500),
      body: sanitizeRichText(text(formData, "body")),
      image: clip(text(formData, "image"), 1000),
      image_alt: clip(text(formData, "imageAlt"), 500),
      cta_label: clip(text(formData, "ctaLabel"), 255),
      cta_href: href ? pathOrUrl(href, "Button link") : "",
      sort_order: sortOrder,
      published,
    };
  }

  const pathname = text(formData, "path");
  if (!pathname.startsWith("/") || pathname.startsWith("//")) throw new Error("Path must start with /.");
  const taken = await get("SELECT id FROM page_meta WHERE path = ?", [pathname]);
  if (taken && String(taken.id) !== id) throw new Error("Another page already uses that path.");
  return {
    path: clip(pathname, 191),
    title: required(clip(text(formData, "title"), 255), "Title"),
    description: required(clip(text(formData, "description"), 500), "Description"),
    kicker: clip(text(formData, "kicker"), 255),
    heading: clip(text(formData, "heading"), 500),
    lead: sanitizeRichText(text(formData, "lead")),
    body: sanitizeRichText(text(formData, "body")),
    secondary_title: clip(text(formData, "secondaryTitle"), 255),
    image: clip(text(formData, "image"), 1000),
    image_alt: clip(text(formData, "imageAlt"), 500),
    sort_order: sortOrder,
    published,
  };
}

export async function saveSettings(username: string, formData: FormData): Promise<ActionResult> {
  const password = text(formData, "newPassword");
  const confirm = text(formData, "confirmPassword");
  if (password || confirm) {
    if (password.length < 8) return { ok: false, error: "Use at least 8 characters for the new password." };
    if (password !== confirm) return { ok: false, error: "The new passwords do not match." };
  }
  const current = await getSettings();
  const next: Settings = { ...current };
  (Object.keys(defaultSettings) as (keyof Settings)[]).forEach((key) => {
    if (formData.has(key)) next[key] = text(formData, key);
  });
  for (const key of ["aboutBody", "tagline", "footerNote", "heroLead", "aboutSecondary"] as const) {
    if (formData.has(key)) next[key] = sanitizeRichText(next[key]);
  }
  if (!next.siteName) return { ok: false, error: "Site name is required." };
  if (next.linkedinUrl) {
    try {
      httpUrl(next.linkedinUrl, "LinkedIn URL");
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : "Invalid LinkedIn URL." };
    }
  }
  if (next.calendlyUrl) {
    try {
      httpUrl(next.calendlyUrl, "Booking URL");
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : "Invalid booking URL." };
    }
  }
  for (const key of ["ctaPrimaryHref", "ctaSecondaryHref"] as const) {
    if (next[key]) {
      try {
        pathOrUrl(next[key], "Button link");
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : "Invalid button link." };
      }
    }
  }
  await run(
    `INSERT INTO settings (\`key\`, value) VALUES ('site', ?)
     ON DUPLICATE KEY UPDATE value = VALUES(value)`,
    [JSON.stringify(next)],
  );
  if (password) {
    await run("UPDATE users SET password_hash = ? WHERE username = ?", [hashPassword(password), username]);
  }
  return { ok: true };
}

export async function updateMediaAlt(id: string, alt: string): Promise<ActionResult> {
  const result = await run("UPDATE media SET alt = ? WHERE id = ?", [clip(alt, 500), id]);
  if (!result.affectedRows) return { ok: false, error: "File not found." };
  return { ok: true };
}
