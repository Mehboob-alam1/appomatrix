"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearSession, getSession, hashPassword, setSession, verifyPassword } from "@/lib/auth";
import { get, run } from "@/lib/db";
import { getUser, isSection, SECTION_TABLE, type SectionKey } from "@/lib/queries";
import { defaultSettings } from "@/lib/defaults";
import { readingMinutes, slugify } from "@/lib/format";
import type { ActionResult, GalleryImage, Settings } from "@/lib/types";

async function requireUser() {
  const username = await getSession();
  if (!username) redirect("/admin/login");
  return username;
}

function refresh() {
  revalidatePath("/", "layout");
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function checked(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "1";
}

function integer(formData: FormData, key: string) {
  const value = Number(text(formData, key));
  return Number.isFinite(value) ? Math.round(value) : 0;
}

function claimSlug(table: string, base: string, id: string) {
  const root = slugify(base) || "item";
  let slug = root;
  let n = 2;
  while (true) {
    const row = get(`SELECT id FROM ${table} WHERE slug = ?`, slug);
    if (!row || String(row.id) === id) return slug;
    slug = `${root}-${n++}`;
  }
}

function uid() {
  return randomBytes(8).toString("hex");
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

export async function login(username: string, password: string): Promise<ActionResult> {
  const user = getUser(username.trim());
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { ok: false, error: "Those credentials do not match." };
  }
  await setSession(user.username);
  return { ok: true };
}

export async function logout() {
  await clearSession();
  redirect("/admin/login");
}

export async function submitInquiry(formData: FormData): Promise<ActionResult> {
  if (text(formData, "website")) return { ok: true };
  const name = text(formData, "name");
  const email = text(formData, "email");
  const message = text(formData, "message");
  if (!name || !email || !message) {
    return { ok: false, error: "Name, email, and a short note are required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  const id = `inq_${randomBytes(6).toString("hex")}`;
  run(
    `INSERT INTO inquiries (id, name, email, phone, company, topic, budget, message, status, submitted_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)`,
    id,
    name,
    email,
    text(formData, "phone"),
    text(formData, "company"),
    text(formData, "topic"),
    text(formData, "budget"),
    message,
    new Date().toISOString(),
  );
  refresh();
  return { ok: true };
}

export async function setInquiryStatus(id: string, status: string): Promise<ActionResult> {
  await requireUser();
  if (!["new", "reviewed", "archived"].includes(status)) {
    return { ok: false, error: "Unknown status." };
  }
  run("UPDATE inquiries SET status = ? WHERE id = ?", status, id);
  refresh();
  return { ok: true };
}

export async function deleteContent(section: string, id: string): Promise<ActionResult> {
  await requireUser();
  if (!isSection(section) || section === "inquiries") {
    return { ok: false, error: "This record cannot be deleted here." };
  }
  if (section === "services") {
    run("UPDATE services SET parent_id = NULL WHERE parent_id = ?", id);
  }
  run(`DELETE FROM ${SECTION_TABLE[section]} WHERE id = ?`, id);
  refresh();
  return { ok: true };
}

export async function saveContent(section: string, formData: FormData): Promise<ActionResult> {
  await requireUser();
  if (!isSection(section) || section === "inquiries") {
    return { ok: false, error: "Unknown section." };
  }
  const existingId = text(formData, "id");
  const id = existingId || uid();
  const table = SECTION_TABLE[section];
  const exists = existingId ? Boolean(get(`SELECT id FROM ${table} WHERE id = ?`, existingId)) : false;

  try {
    const data = buildRecord(section, formData, id);
    const keys = Object.keys(data);
    if (exists) {
      const sets = keys.map((key) => `${key} = ?`).join(", ");
      run(`UPDATE ${table} SET ${sets} WHERE id = ?`, ...keys.map((key) => data[key]), id);
    } else {
      run(
        `INSERT INTO ${table} (id, ${keys.join(", ")}) VALUES (?, ${keys.map(() => "?").join(", ")})`,
        id,
        ...keys.map((key) => data[key]),
      );
    }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Could not save." };
  }

  refresh();
  return { ok: true };
}

function required(value: string, label: string) {
  if (!value) throw new Error(`${label} is required.`);
  return value;
}

function buildRecord(section: SectionKey, formData: FormData, id: string): Record<string, string | number | null> {
  const published = checked(formData, "published") ? 1 : 0;
  const sortOrder = integer(formData, "sortOrder");

  if (section === "services") {
    const title = required(text(formData, "title"), "Title");
    const parentId = text(formData, "parentId");
    if (parentId === id) throw new Error("A service cannot be its own parent.");
    if (parentId && get("SELECT id FROM services WHERE parent_id = ?", id)) {
      throw new Error("Move its sub-services before placing this service under another.");
    }
    return {
      slug: claimSlug("services", text(formData, "slug") || title, id),
      title,
      parent_id: parentId || null,
      short_description: required(text(formData, "shortDescription"), "Short description"),
      full_description: text(formData, "fullDescription"),
      icon: text(formData, "icon") || "globe",
      image: text(formData, "image"),
      image_alt: text(formData, "imageAlt"),
      process_text: text(formData, "processText"),
      tech_stack: text(formData, "techStack"),
      sort_order: sortOrder,
      published,
    };
  }

  if (section === "portfolio") {
    const title = required(text(formData, "title"), "Title");
    return {
      slug: claimSlug("projects", text(formData, "slug") || title, id),
      title,
      client_name: required(text(formData, "clientName"), "Client"),
      category: required(text(formData, "category"), "Category"),
      excerpt: text(formData, "excerpt"),
      cover_image: text(formData, "coverImage"),
      cover_image_alt: text(formData, "coverImageAlt"),
      gallery: JSON.stringify(parseGallery(text(formData, "gallery"))),
      problem: text(formData, "problem"),
      solution: text(formData, "solution"),
      result: text(formData, "result"),
      metrics_text: text(formData, "metricsText"),
      tech_stack: text(formData, "techStack"),
      external_link: text(formData, "externalLink"),
      featured: checked(formData, "featured") ? 1 : 0,
      sort_order: sortOrder,
      published,
      created_at: text(formData, "createdAt") || new Date().toISOString(),
    };
  }

  if (section === "blog") {
    const title = required(text(formData, "title"), "Title");
    const content = text(formData, "content");
    return {
      slug: claimSlug("posts", text(formData, "slug") || title, id),
      title,
      excerpt: required(text(formData, "excerpt"), "Excerpt"),
      content,
      featured_image: text(formData, "featuredImage"),
      featured_image_alt: text(formData, "featuredImageAlt"),
      author: text(formData, "author"),
      category: required(text(formData, "category"), "Category"),
      published_at: text(formData, "publishedAt") || new Date().toISOString().slice(0, 10),
      reading_time_minutes: readingMinutes(content),
      published,
    };
  }

  if (section === "team") {
    return {
      name: required(text(formData, "name"), "Name"),
      role: required(text(formData, "role"), "Role"),
      photo: text(formData, "photo"),
      photo_alt: text(formData, "photoAlt"),
      bio: text(formData, "bio"),
      linkedin: text(formData, "linkedin"),
      sort_order: sortOrder,
      published,
    };
  }

  if (section === "testimonials") {
    const rating = Math.min(5, Math.max(1, integer(formData, "rating") || 5));
    return {
      client_name: required(text(formData, "clientName"), "Client name"),
      role: required(text(formData, "role"), "Role"),
      company: required(text(formData, "company"), "Company"),
      quote: required(text(formData, "quote"), "Quote"),
      rating,
      sort_order: sortOrder,
      published,
    };
  }

  if (section === "careers") {
    const title = required(text(formData, "title"), "Title");
    return {
      slug: claimSlug("careers", text(formData, "slug") || title, id),
      title,
      kind: text(formData, "kind") || "Role",
      location: text(formData, "location"),
      department: text(formData, "department"),
      summary: required(text(formData, "summary"), "Summary"),
      description: text(formData, "description"),
      requirements: text(formData, "requirements"),
      deadline: text(formData, "deadline"),
      sort_order: sortOrder,
      published,
    };
  }

  const title = required(text(formData, "title"), "Title");
  return {
    slug: claimSlug("scholarships", text(formData, "slug") || title, id),
    title,
    award: text(formData, "award"),
    eligibility: text(formData, "eligibility"),
    deadline: text(formData, "deadline"),
    summary: required(text(formData, "summary"), "Summary"),
    description: text(formData, "description"),
    cover_image: text(formData, "coverImage"),
    application_url: text(formData, "applicationUrl"),
    sort_order: sortOrder,
    published,
  };
}

export async function saveSettings(formData: FormData): Promise<ActionResult> {
  const username = await requireUser();
  const password = text(formData, "newPassword");
  const confirm = text(formData, "confirmPassword");
  if (password || confirm) {
    if (password.length < 8) return { ok: false, error: "Use at least 8 characters for the new password." };
    if (password !== confirm) return { ok: false, error: "The new passwords do not match." };
  }
  const next: Settings = { ...defaultSettings };
  (Object.keys(defaultSettings) as (keyof Settings)[]).forEach((key) => {
    next[key] = text(formData, key);
  });
  if (!next.siteName) return { ok: false, error: "Site name is required." };
  run(
    `INSERT INTO settings (key, value) VALUES ('site', ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    JSON.stringify(next),
  );

  if (password) {
    run("UPDATE users SET password_hash = ? WHERE username = ?", hashPassword(password), username);
  }

  refresh();
  return { ok: true };
}
