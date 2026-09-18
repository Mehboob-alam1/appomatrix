import { count } from "drizzle-orm";
import type { getDb } from "@/db/client";
import * as schema from "@/db/schema";
import {
  mockPosts,
  mockProjects,
  mockServices,
  mockTeam,
  mockTestimonials,
} from "@/lib/mock-data";

type Db = ReturnType<typeof getDb>;

export function seedDatabaseIfEmpty(db: Db) {
  const countRow = db.select({ value: count() }).from(schema.projects).get();
  if ((countRow?.value ?? 0) > 0) return;

  const now = new Date().toISOString();

  for (const p of mockProjects) {
    db.insert(schema.projects).values({
      id: p._id,
      slug: typeof p.slug === "string" ? p.slug : p.slug,
      title: p.title,
      clientName: p.clientName,
      category: p.category,
      excerpt: p.excerpt,
      coverImage: typeof p.coverImage === "string" ? p.coverImage : undefined,
      coverImageAlt: p.title,
      problem: typeof p.problem === "string" ? p.problem : undefined,
      solution: typeof p.solution === "string" ? p.solution : undefined,
      result: typeof p.result === "string" ? p.result : undefined,
      metrics: JSON.stringify(p.metrics ?? []),
      techStack: JSON.stringify(p.techStack ?? []),
      featured: p.featured ?? false,
      createdAt: now,
    }).run();
  }

  for (const post of mockPosts) {
    db.insert(schema.posts).values({
      id: post._id,
      slug: typeof post.slug === "string" ? post.slug : post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: typeof post.content === "string" ? post.content : post.excerpt,
      featuredImage: typeof post.featuredImage === "string" ? post.featuredImage : undefined,
      featuredImageAlt: post.title,
      author: post.author,
      category: post.category,
      publishedAt: post.publishedAt,
      readingTimeMinutes: post.readingTimeMinutes,
    }).run();
  }

  for (const t of mockTestimonials) {
    db.insert(schema.testimonials).values({
      id: t._id,
      clientName: t.clientName,
      role: t.role,
      company: t.company,
      quote: t.quote,
      rating: t.rating,
    }).run();
  }

  for (const s of mockServices) {
    db.insert(schema.services).values({
      id: s._id,
      slug: typeof s.slug === "string" ? s.slug : s.slug,
      title: s.title,
      shortDescription: s.shortDescription,
      fullDescription:
        typeof s.fullDescription === "string" ? s.fullDescription : undefined,
      icon: s.icon,
      processSteps: JSON.stringify(s.processSteps ?? []),
      techStack: JSON.stringify(s.techStack ?? []),
    }).run();
  }

  for (const member of mockTeam) {
    db.insert(schema.teamMembers).values({
      id: member._id,
      name: member.name,
      role: member.role,
      bio: member.bio,
      social: JSON.stringify(member.social ?? []),
    }).run();
  }
}
