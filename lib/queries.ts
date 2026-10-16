import { all, get, type Row } from "@/lib/db";
import { defaultSettings } from "@/lib/defaults";
import type {
  Career,
  GalleryImage,
  HomeSection,
  Inquiry,
  MediaAsset,
  NavItem,
  PageMeta,
  Post,
  PostCategory,
  Project,
  Scholarship,
  Service,
  ServiceNode,
  Settings,
  SocialLink,
  TeamMember,
  Testimonial,
} from "@/lib/types";

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

function gallery(value: unknown): GalleryImage[] {
  try {
    const parsed = (typeof value === "string" ? JSON.parse(value) : value) as GalleryImage[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item.url === "string" && item.url.trim())
      .map((item) => ({ url: item.url, alt: item.alt || "", caption: item.caption || "" }));
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
    gallery: gallery(row.gallery),
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
    coverImageAlt: str(row, "cover_image_alt"),
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

function mapCategory(row: Row): PostCategory {
  return {
    id: str(row, "id"),
    slug: str(row, "slug"),
    name: str(row, "name"),
    description: str(row, "description"),
    sortOrder: num(row, "sort_order"),
    published: flag(row, "published"),
  };
}

function mapNav(row: Row): NavItem {
  return {
    id: str(row, "id"),
    location: str(row, "location"),
    label: str(row, "label"),
    href: str(row, "href"),
    sortOrder: num(row, "sort_order"),
    published: flag(row, "published"),
  };
}

function mapSocial(row: Row): SocialLink {
  return {
    id: str(row, "id"),
    label: str(row, "label"),
    url: str(row, "url"),
    sortOrder: num(row, "sort_order"),
    published: flag(row, "published"),
  };
}

function mapSection(row: Row): HomeSection {
  return {
    id: str(row, "id"),
    sectionKey: str(row, "section_key"),
    kicker: str(row, "kicker"),
    title: str(row, "title"),
    body: str(row, "body"),
    image: str(row, "image"),
    imageAlt: str(row, "image_alt"),
    ctaLabel: str(row, "cta_label"),
    ctaHref: str(row, "cta_href"),
    sortOrder: num(row, "sort_order"),
    published: flag(row, "published"),
  };
}

function mapPage(row: Row): PageMeta {
  return {
    id: str(row, "id"),
    path: str(row, "path"),
    title: str(row, "title"),
    description: str(row, "description"),
    kicker: str(row, "kicker"),
    heading: str(row, "heading"),
    lead: str(row, "lead"),
    body: str(row, "body"),
    secondaryTitle: str(row, "secondary_title"),
    image: str(row, "image"),
    imageAlt: str(row, "image_alt"),
    sortOrder: num(row, "sort_order"),
    published: flag(row, "published"),
  };
}

function mapMedia(row: Row): MediaAsset {
  return {
    id: str(row, "id"),
    filename: str(row, "filename"),
    originalName: str(row, "original_name"),
    mime: str(row, "mime"),
    sizeBytes: num(row, "size_bytes"),
    alt: str(row, "alt"),
    url: str(row, "url"),
    createdAt: str(row, "created_at"),
  };
}

const published = (only: boolean) => (only ? "WHERE published = 1" : "");

export async function getSettings(): Promise<Settings> {
  const row = await get("SELECT value FROM settings WHERE `key` = 'site'");
  if (!row) return defaultSettings;
  try {
    const settings = { ...defaultSettings, ...(JSON.parse(str(row, "value")) as Partial<Settings>) };
    if (!settings.logoUrl.trim()) settings.logoUrl = defaultSettings.logoUrl;
    if (!settings.logoAlt.trim()) settings.logoAlt = defaultSettings.logoAlt;
    if (!settings.faviconUrl.trim()) settings.faviconUrl = defaultSettings.faviconUrl;
    if (!settings.email.trim()) settings.email = defaultSettings.email;
    return settings;
  } catch {
    return defaultSettings;
  }
}

export async function listServices(publishedOnly = false) {
  return (await all(`SELECT * FROM services ${published(publishedOnly)} ORDER BY sort_order ASC, title ASC`)).map(mapService);
}

export async function serviceTree(publishedOnly = true): Promise<ServiceNode[]> {
  const services = await listServices(publishedOnly);
  const childrenOf = (id: string) => services.filter((service) => service.parentId === id);
  return services
    .filter((service) => !service.parentId)
    .map((service) => ({ ...service, children: childrenOf(service.id) }));
}

export async function getService(slug: string, publishedOnly = true) {
  const row = await get(
    `SELECT * FROM services WHERE slug = ? ${publishedOnly ? "AND published = 1" : ""}`,
    [slug],
  );
  return row ? mapService(row) : undefined;
}

export async function listProjects(publishedOnly = false) {
  return (await all(`SELECT * FROM projects ${published(publishedOnly)} ORDER BY sort_order ASC, created_at DESC`)).map(mapProject);
}

export async function getProject(slug: string) {
  const row = await get("SELECT * FROM projects WHERE slug = ? AND published = 1", [slug]);
  return row ? mapProject(row) : undefined;
}

export async function listPosts(publishedOnly = false, categorySlug = "") {
  if (categorySlug) {
    const clause = publishedOnly ? "p.published = 1 AND" : "";
    return (
      await all(
        `SELECT p.* FROM posts p
         LEFT JOIN post_categories c ON c.id = p.category_id
         WHERE ${clause} (c.slug = ? OR p.category = ?)
         ORDER BY p.published_at DESC`,
        [categorySlug, categorySlug],
      )
    ).map(mapPost);
  }
  return (await all(`SELECT * FROM posts ${published(publishedOnly)} ORDER BY published_at DESC`)).map(mapPost);
}

export async function getPost(slug: string) {
  const row = await get("SELECT * FROM posts WHERE slug = ? AND published = 1", [slug]);
  return row ? mapPost(row) : undefined;
}

export async function listCategories(publishedOnly = false) {
  return (await all(`SELECT * FROM post_categories ${published(publishedOnly)} ORDER BY sort_order ASC, name ASC`)).map(mapCategory);
}

export async function getCategory(slug: string) {
  const row = await get("SELECT * FROM post_categories WHERE slug = ? AND published = 1", [slug]);
  return row ? mapCategory(row) : undefined;
}

export async function listTeam(publishedOnly = false) {
  return (await all(`SELECT * FROM team_members ${published(publishedOnly)} ORDER BY sort_order ASC, name ASC`)).map(mapTeam);
}

export async function listTestimonials(publishedOnly = false) {
  return (await all(`SELECT * FROM testimonials ${published(publishedOnly)} ORDER BY sort_order ASC`)).map(mapQuote);
}

export async function listCareers(publishedOnly = false) {
  return (await all(`SELECT * FROM careers ${published(publishedOnly)} ORDER BY sort_order ASC, title ASC`)).map(mapCareer);
}

export async function getCareer(slug: string) {
  const row = await get("SELECT * FROM careers WHERE slug = ? AND published = 1", [slug]);
  return row ? mapCareer(row) : undefined;
}

export async function listScholarships(publishedOnly = false) {
  return (await all(`SELECT * FROM scholarships ${published(publishedOnly)} ORDER BY sort_order ASC, title ASC`)).map(mapScholarship);
}

export async function getScholarship(slug: string) {
  const row = await get("SELECT * FROM scholarships WHERE slug = ? AND published = 1", [slug]);
  return row ? mapScholarship(row) : undefined;
}

export async function listNavigation(publishedOnly = false, location = "") {
  if (location) {
    const clause = publishedOnly ? "AND published = 1" : "";
    return (await all(`SELECT * FROM nav_items WHERE location = ? ${clause} ORDER BY sort_order ASC, label ASC`, [location])).map(mapNav);
  }
  return (await all(`SELECT * FROM nav_items ${published(publishedOnly)} ORDER BY location ASC, sort_order ASC`)).map(mapNav);
}

export async function listSocial(publishedOnly = false) {
  return (await all(`SELECT * FROM social_links ${published(publishedOnly)} ORDER BY sort_order ASC, label ASC`)).map(mapSocial);
}

export async function listSections(publishedOnly = false) {
  return (await all(`SELECT * FROM homepage_sections ${published(publishedOnly)} ORDER BY sort_order ASC, title ASC`)).map(mapSection);
}

export async function getSection(key: string, publishedOnly = true) {
  const row = await get(
    `SELECT * FROM homepage_sections WHERE section_key = ? ${publishedOnly ? "AND published = 1" : ""}`,
    [key],
  );
  return row ? mapSection(row) : undefined;
}

export async function listPageMeta(publishedOnly = false) {
  return (await all(`SELECT * FROM page_meta ${published(publishedOnly)} ORDER BY sort_order ASC, path ASC`)).map(mapPage);
}

export async function getPageMeta(pathname: string) {
  const row = await get("SELECT * FROM page_meta WHERE path = ? AND published = 1", [pathname]);
  return row ? mapPage(row) : undefined;
}

export async function listInquiries() {
  return (await all("SELECT * FROM inquiries ORDER BY submitted_at DESC")).map(mapInquiry);
}

export async function listMedia() {
  return (await all("SELECT * FROM media ORDER BY created_at DESC")).map(mapMedia);
}

export async function getUser(username: string) {
  const row = await get("SELECT id, username, password_hash FROM users WHERE username = ?", [username]);
  if (!row) return undefined;
  return { id: str(row, "id"), username: str(row, "username"), passwordHash: str(row, "password_hash") };
}

export async function dashboardCounts() {
  const count = async (table: string) => num((await get(`SELECT COUNT(*) AS c FROM ${table}`)) || {}, "c");
  const [
    services,
    projects,
    posts,
    categories,
    team,
    testimonials,
    careers,
    scholarships,
    inquiries,
    navigation,
    social,
    sections,
    pages,
    media,
    newInquiries,
  ] = await Promise.all([
    count("services"),
    count("projects"),
    count("posts"),
    count("post_categories"),
    count("team_members"),
    count("testimonials"),
    count("careers"),
    count("scholarships"),
    count("inquiries"),
    count("nav_items"),
    count("social_links"),
    count("homepage_sections"),
    count("page_meta"),
    count("media"),
    num((await get("SELECT COUNT(*) AS c FROM inquiries WHERE status = 'new'")) || {}, "c"),
  ]);
  return {
    services,
    projects,
    posts,
    categories,
    team,
    testimonials,
    careers,
    scholarships,
    inquiries,
    navigation,
    social,
    sections,
    pages,
    media,
    newInquiries,
  };
}

export const SECTION_TABLE = {
  services: "services",
  portfolio: "projects",
  blog: "posts",
  categories: "post_categories",
  team: "team_members",
  testimonials: "testimonials",
  careers: "careers",
  scholarships: "scholarships",
  inquiries: "inquiries",
  navigation: "nav_items",
  social: "social_links",
  sections: "homepage_sections",
  pages: "page_meta",
} as const;

export type SectionKey = keyof typeof SECTION_TABLE;

export function isSection(value: string): value is SectionKey {
  return value in SECTION_TABLE;
}

export async function getRecord(section: SectionKey, id: string) {
  const row = await get(`SELECT * FROM ${SECTION_TABLE[section]} WHERE id = ?`, [id]);
  if (!row) return undefined;
  if (section === "services") return mapService(row);
  if (section === "portfolio") return mapProject(row);
  if (section === "blog") return { ...mapPost(row), categoryId: str(row, "category_id") };
  if (section === "categories") return mapCategory(row);
  if (section === "team") return mapTeam(row);
  if (section === "testimonials") return mapQuote(row);
  if (section === "careers") return mapCareer(row);
  if (section === "scholarships") return mapScholarship(row);
  if (section === "navigation") return mapNav(row);
  if (section === "social") return mapSocial(row);
  if (section === "sections") return mapSection(row);
  if (section === "pages") return mapPage(row);
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
