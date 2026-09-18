import { desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/db/client";
import * as schema from "@/db/schema";
import {
  mapPost,
  mapProject,
  mapService,
  mapSubmission,
  mapTeamMember,
  mapTestimonial,
} from "@/db/mappers";
import type {
  BlogPost,
  FormSubmission,
  Project,
  Service,
  TeamMember,
  Testimonial,
} from "@/types/content";

export async function getProjects(): Promise<Project[]> {
  const db = getDb();
  const rows = db.select().from(schema.projects).orderBy(desc(schema.projects.createdAt)).all();
  return rows.map(mapProject);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const db = getDb();
  const rows = db
    .select()
    .from(schema.projects)
    .where(eq(schema.projects.featured, true))
    .orderBy(desc(schema.projects.createdAt))
    .all();
  return rows.map(mapProject);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const db = getDb();
  const row = db.select().from(schema.projects).where(eq(schema.projects.slug, slug)).get();
  return row ? mapProject(row) : null;
}

export async function getPosts(): Promise<BlogPost[]> {
  const db = getDb();
  const rows = db.select().from(schema.posts).orderBy(desc(schema.posts.publishedAt)).all();
  return rows.map(mapPost);
}

export async function getLatestPosts(): Promise<BlogPost[]> {
  const posts = await getPosts();
  return posts.slice(0, 3);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const db = getDb();
  const row = db.select().from(schema.posts).where(eq(schema.posts.slug, slug)).get();
  return row ? mapPost(row) : null;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const db = getDb();
  const rows = db.select().from(schema.testimonials).all();
  return rows.map(mapTestimonial);
}

export async function getServices(): Promise<Service[]> {
  const db = getDb();
  const rows = db.select().from(schema.services).orderBy(schema.services.title).all();
  return rows.map((row) => mapService(row));
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const db = getDb();
  const row = db.select().from(schema.services).where(eq(schema.services.slug, slug)).get();
  if (!row) return null;

  const relatedIds = row.relatedProjectIds ? (JSON.parse(row.relatedProjectIds) as string[]) : [];
  let related: Project[] = [];
  if (relatedIds.length) {
    const relatedRows = db
      .select()
      .from(schema.projects)
      .where(inArray(schema.projects.id, relatedIds))
      .all();
    related = relatedRows.map(mapProject);
  } else {
    related = (await getFeaturedProjects()).slice(0, 2);
  }

  return mapService(row, related);
}

export async function getTeam(): Promise<TeamMember[]> {
  const db = getDb();
  const rows = db.select().from(schema.teamMembers).orderBy(schema.teamMembers.name).all();
  return rows.map(mapTeamMember);
}

export async function getFormSubmissions(): Promise<FormSubmission[]> {
  const db = getDb();
  const rows = db
    .select()
    .from(schema.formSubmissions)
    .orderBy(desc(schema.formSubmissions.submittedAt))
    .all();
  return rows.map(mapSubmission);
}

export function getProjectCategories(projects: Project[]) {
  return Array.from(new Set(projects.map((p) => p.category))).sort();
}

export function getPostCategories(posts: BlogPost[]) {
  return Array.from(new Set(posts.map((p) => p.category))).sort();
}

export async function saveFormSubmission(data: {
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  budget: string;
  timeline: string;
  details: string;
  source?: string;
}) {
  const db = getDb();
  db.insert(schema.formSubmissions)
    .values({
      id: crypto.randomUUID(),
      ...data,
      submittedAt: new Date().toISOString(),
    })
    .run();
}
