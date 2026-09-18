import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  clientName: text("client_name").notNull(),
  category: text("category").notNull(),
  excerpt: text("excerpt"),
  coverImage: text("cover_image"),
  coverImageAlt: text("cover_image_alt"),
  gallery: text("gallery"),
  problem: text("problem"),
  solution: text("solution"),
  result: text("result"),
  metrics: text("metrics"),
  techStack: text("tech_stack"),
  externalLink: text("external_link"),
  featured: integer("featured", { mode: "boolean" }).default(false),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  createdAt: text("created_at").notNull(),
});

export const posts = sqliteTable("posts", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  locale: text("locale").default("en"),
  excerpt: text("excerpt").notNull(),
  content: text("content"),
  featuredImage: text("featured_image"),
  featuredImageAlt: text("featured_image_alt"),
  author: text("author"),
  category: text("category").notNull(),
  publishedAt: text("published_at").notNull(),
  readingTimeMinutes: integer("reading_time_minutes"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
});

export const testimonials = sqliteTable("testimonials", {
  id: text("id").primaryKey(),
  clientName: text("client_name").notNull(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  quote: text("quote").notNull(),
  photo: text("photo"),
  photoAlt: text("photo_alt"),
  rating: integer("rating"),
});

export const services = sqliteTable("services", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description"),
  icon: text("icon"),
  image: text("image"),
  imageAlt: text("image_alt"),
  processSteps: text("process_steps"),
  techStack: text("tech_stack"),
  relatedProjectIds: text("related_project_ids"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
});

export const teamMembers = sqliteTable("team_members", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  photo: text("photo"),
  photoAlt: text("photo_alt"),
  bio: text("bio"),
  social: text("social"),
});

export const formSubmissions = sqliteTable("form_submissions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  projectType: text("project_type").notNull(),
  budget: text("budget").notNull(),
  timeline: text("timeline").notNull(),
  details: text("details").notNull(),
  source: text("source"),
  submittedAt: text("submitted_at").notNull(),
});

export const siteSettings = sqliteTable("site_settings", {
  id: text("id").primaryKey(),
  headHtml: text("head_html"),
  bodyStartHtml: text("body_start_html"),
  bodyEndHtml: text("body_end_html"),
  announcementHtml: text("announcement_html"),
  blogSidebarHtml: text("blog_sidebar_html"),
  blogInArticleHtml: text("blog_in_article_html"),
  globalSeoExtra: text("global_seo_extra"),
  calendlyUrl: text("calendly_url"),
  updatedAt: text("updated_at"),
});
