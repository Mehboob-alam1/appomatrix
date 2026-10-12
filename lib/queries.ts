import { all, get } from "@/lib/db";
import { defaultSettings } from "@/lib/defaults";
import type {
  Career,
  GalleryImage,
  Inquiry,
  Post,
  Project,
  Scholarship,
  Service,
  ServiceNode,
  Settings,
  TeamMember,
  Testimonial,
} from "@/lib/types";
import type { Row } from "@/lib/db";

function str(row: Row, key: string) {
  const value = row[key];
  return value == null ? "" : String(value);
}

function num(row: Row, key: string) {
  return Number(row[key] ?? 0);
}

function flag(row: Row, key: string) {
  return Number(row[key] ?? 0) === 1;
}

function gallery(value: string): GalleryImage[] {
  try {
    const parsed = JSON.parse(value) as GalleryImage[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item.url === "string" && item.url.trim())
      .map((item) => ({
        url: item.url,
        alt: item.alt || "",
        caption: item.caption || "",
      }));
  } catch {
    return [];
  }
}

function mapService(row: Row): Service {
  return {
    id: str(row, "id"),
    slug: str(row, "slug"),
    title: str(row, "title"),
    parentId: row.parent_id ? str(row, "parent_id") : null,
    shortDescription: str(row, "short_description"),
    fullDescription: str(row, "full_description"),
    icon: str(row, "icon") || "globe",
    image: str(row, "image"),
    imageAlt: str(row, "image_alt"),
    processText: str(row, "process_text"),
    techStack: str(row, "tech_stack"),
    sortOrder: num(row, "sort_order"),
    published: flag(row, "published"),
  };
}

function mapProject(row: Row): Project {
  return {
    id: str(row, "id"),
    slug: str(row, "slug"),
    title: str(row, "title"),
    clientName: str(row, "client_name"),
    category: str(row, "category"),
    excerpt: str(row, "excerpt"),
    coverImage: str(row, "cover_image"),
    coverImageAlt: str(row, "cover_image_alt"),
    gallery: gallery(str(row, "gallery")),
    problem: str(row, "problem"),
    solution: str(row, "solution"),
    result: str(row, "result"),
    metricsText: str(row, "metrics_text"),
    techStack: str(row, "tech_stack"),
    externalLink: str(row, "external_link"),
    featured: flag(row, "featured"),
    sortOrder: num(row, "sort_order"),
    published: flag(row, "published"),
    createdAt: str(row, "created_at"),
  };
}

function mapPost(row: Row): Post {
  return {
    id: str(row, "id"),
    slug: str(row, "slug"),
    title: str(row, "title"),
    excerpt: str(row, "excerpt"),
    content: str(row, "content"),
    featuredImage: str(row, "featured_image"),
    featuredImageAlt: str(row, "featured_image_alt"),
    author: str(row, "author"),
    category: str(row, "category"),
    publishedAt: str(row, "published_at"),
    readingTimeMinutes: num(row, "reading_time_minutes") || 1,
    published: flag(row, "published"),
  };
}

function mapTeam(row: Row): TeamMember {
  return {
    id: str(row, "id"),
    name: str(row, "name"),
    role: str(row, "role"),
    photo: str(row, "photo"),
    photoAlt: str(row, "photo_alt"),
    bio: str(row, "bio"),
    linkedin: str(row, "linkedin"),
    sortOrder: num(row, "sort_order"),
    published: flag(row, "published"),
  };
}

function mapQuote(row: Row): Testimonial {
  return {
    id: str(row, "id"),
    clientName: str(row, "client_name"),
    role: str(row, "role"),
    company: str(row, "company"),
    quote: str(row, "quote"),
    rating: num(row, "rating") || 5,
    sortOrder: num(row, "sort_order"),
    published: flag(row, "published"),
  };
}

function mapCareer(row: Row): Career {
  return {
    id: str(row, "id"),
    slug: str(row, "slug"),
    title: str(row, "title"),
    kind: str(row, "kind"),
    location: str(row, "location"),
    department: str(row, "department"),
    summary: str(row, "summary"),
    description: str(row, "description"),
    requirements: str(row, "requirements"),
    deadline: str(row, "deadline"),
    sortOrder: num(row, "sort_order"),
    published: flag(row, "published"),
  };
}

function mapScholarship(row: Row): Scholarship {
  return {
    id: str(row, "id"),
    slug: str(row, "slug"),
    title: str(row, "title"),
    award: str(row, "award"),
    eligibility: str(row, "eligibility"),
    deadline: str(row, "deadline"),
    summary: str(row, "summary"),
    description: str(row, "description"),
    coverImage: str(row, "cover_image"),
    applicationUrl: str(row, "application_url"),
    sortOrder: num(row, "sort_order"),
    published: flag(row, "published"),
  };
}

function mapInquiry(row: Row): Inquiry {
  return {
    id: str(row, "id"),
    name: str(row, "name"),
    email: str(row, "email"),
    phone: str(row, "phone"),
    company: str(row, "company"),
    topic: str(row, "topic"),
    budget: str(row, "budget"),
    message: str(row, "message"),
    status: str(row, "status") || "new",
    submittedAt: str(row, "submitted_at"),
  };
}

const published = (only: boolean) => (only ? "WHERE published = 1" : "");

export function getSettings(): Settings {
  const row = get("SELECT value FROM settings WHERE key = 'site'");
  if (!row) return defaultSettings;
  try {
    return { ...defaultSettings, ...(JSON.parse(str(row, "value")) as Partial<Settings>) };
  } catch {
    return defaultSettings;
  }
}

export function listServices(publishedOnly = false) {
  return all(
    `SELECT * FROM services ${published(publishedOnly)} ORDER BY sort_order ASC, title ASC`,
  ).map(mapService);
}

export function serviceTree(publishedOnly = true): ServiceNode[] {
  const services = listServices(publishedOnly);
  const childrenOf = (id: string) => services.filter((service) => service.parentId === id);
  return services
    .filter((service) => !service.parentId)
    .map((service) => ({ ...service, children: childrenOf(service.id) }));
}

export function getService(slug: string, publishedOnly = true) {
  const row = get(
    `SELECT * FROM services WHERE slug = ? ${publishedOnly ? "AND published = 1" : ""}`,
    slug,
  );
  return row ? mapService(row) : undefined;
}

export function listProjects(publishedOnly = false) {
  return all(
    `SELECT * FROM projects ${published(publishedOnly)} ORDER BY sort_order ASC, created_at DESC`,
  ).map(mapProject);
}

export function getProject(slug: string) {
  const row = get("SELECT * FROM projects WHERE slug = ? AND published = 1", slug);
  return row ? mapProject(row) : undefined;
}

export function listPosts(publishedOnly = false) {
  return all(
    `SELECT * FROM posts ${published(publishedOnly)} ORDER BY published_at DESC`,
  ).map(mapPost);
}

export function getPost(slug: string) {
  const row = get("SELECT * FROM posts WHERE slug = ? AND published = 1", slug);
  return row ? mapPost(row) : undefined;
}

export function listTeam(publishedOnly = false) {
  return all(
    `SELECT * FROM team_members ${published(publishedOnly)} ORDER BY sort_order ASC, name ASC`,
  ).map(mapTeam);
}

export function listTestimonials(publishedOnly = false) {
  return all(
    `SELECT * FROM testimonials ${published(publishedOnly)} ORDER BY sort_order ASC`,
  ).map(mapQuote);
}

export function listCareers(publishedOnly = false) {
  return all(
    `SELECT * FROM careers ${published(publishedOnly)} ORDER BY sort_order ASC, title ASC`,
  ).map(mapCareer);
}

export function getCareer(slug: string) {
  const row = get("SELECT * FROM careers WHERE slug = ? AND published = 1", slug);
  return row ? mapCareer(row) : undefined;
}

export function listScholarships(publishedOnly = false) {
  return all(
    `SELECT * FROM scholarships ${published(publishedOnly)} ORDER BY sort_order ASC, title ASC`,
  ).map(mapScholarship);
}

export function getScholarship(slug: string) {
  const row = get("SELECT * FROM scholarships WHERE slug = ? AND published = 1", slug);
  return row ? mapScholarship(row) : undefined;
}

export function listInquiries() {
  return all("SELECT * FROM inquiries ORDER BY submitted_at DESC").map(mapInquiry);
}

export function getUser(username: string) {
  const row = get("SELECT * FROM users WHERE username = ?", username);
  if (!row) return undefined;
  return { id: str(row, "id"), username: str(row, "username"), passwordHash: str(row, "password_hash") };
}

export function dashboardCounts() {
  const count = (table: string) => num(get(`SELECT COUNT(*) AS c FROM ${table}`) || {}, "c");
  return {
    services: count("services"),
    projects: count("projects"),
    posts: count("posts"),
    team: count("team_members"),
    testimonials: count("testimonials"),
    careers: count("careers"),
    scholarships: count("scholarships"),
    inquiries: count("inquiries"),
    newInquiries: num(get("SELECT COUNT(*) AS c FROM inquiries WHERE status = 'new'") || {}, "c"),
  };
}

export const SECTION_TABLE = {
  services: "services",
  portfolio: "projects",
  blog: "posts",
  team: "team_members",
  testimonials: "testimonials",
  careers: "careers",
  scholarships: "scholarships",
  inquiries: "inquiries",
} as const;

export type SectionKey = keyof typeof SECTION_TABLE;

export function isSection(value: string): value is SectionKey {
  return value in SECTION_TABLE;
}

export function getRecord(section: SectionKey, id: string) {
  const row = get(`SELECT * FROM ${SECTION_TABLE[section]} WHERE id = ?`, id);
  if (!row) return undefined;
  if (section === "services") return mapService(row);
  if (section === "portfolio") return mapProject(row);
  if (section === "blog") return mapPost(row);
  if (section === "team") return mapTeam(row);
  if (section === "testimonials") return mapQuote(row);
  if (section === "careers") return mapCareer(row);
  if (section === "scholarships") return mapScholarship(row);
  return mapInquiry(row);
}

export function recordToForm(section: SectionKey, record: unknown): Record<string, string> {
  if (!record || typeof record !== "object") return {};
  const source = record as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(source)) {
    if (key === "gallery") out.gallery = JSON.stringify(value ?? []);
    else if (typeof value === "boolean") out[key] = value ? "1" : "";
    else if (value == null) out[key] = "";
    else out[key] = String(value);
  }
  if (section === "portfolio" && !out.gallery) out.gallery = "[]";
  return out;
}

