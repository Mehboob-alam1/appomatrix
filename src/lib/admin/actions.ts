"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import * as schema from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/auth";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function linesToJsonArray(value: FormDataEntryValue | null): string {
  const raw = String(value ?? "");
  const items = raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  return JSON.stringify(items);
}

function metricsFromForm(value: FormDataEntryValue | null): string {
  const raw = String(value ?? "");
  const metrics = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, val] = line.split("|").map((s) => s.trim());
      return { label: label ?? "", value: val ?? "" };
    })
    .filter((m) => m.label && m.value);
  return JSON.stringify(metrics);
}

export async function saveProject(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  const id = String(formData.get("id") || crypto.randomUUID());
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") || title));
  const payload = {
    id,
    slug,
    title,
    clientName: String(formData.get("clientName") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    coverImage: String(formData.get("coverImage") ?? "").trim() || null,
    coverImageAlt: String(formData.get("coverImageAlt") ?? "").trim() || null,
    problem: String(formData.get("problem") ?? "").trim(),
    solution: String(formData.get("solution") ?? "").trim(),
    result: String(formData.get("result") ?? "").trim(),
    metrics: metricsFromForm(formData.get("metrics")),
    techStack: linesToJsonArray(formData.get("techStack")),
    externalLink: String(formData.get("externalLink") ?? "").trim() || null,
    featured: formData.get("featured") === "on",
    seoTitle: String(formData.get("seoTitle") ?? "").trim() || null,
    seoDescription: String(formData.get("seoDescription") ?? "").trim() || null,
    createdAt: new Date().toISOString(),
  };

  const existing = db.select().from(schema.projects).where(eq(schema.projects.id, id)).get();
  if (existing) {
    const { createdAt: _ignored, ...updates } = payload;
    db.update(schema.projects).set(updates).where(eq(schema.projects.id, id)).run();
  } else {
    db.insert(schema.projects).values(payload).run();
  }

  revalidatePath("/");
  revalidatePath("/work");
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  getDb().delete(schema.projects).where(eq(schema.projects.id, id)).run();
  revalidatePath("/work");
  redirect("/admin/projects");
}

export async function savePost(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  const id = String(formData.get("id") || crypto.randomUUID());
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") || title));
  const payload = {
    id,
    slug,
    title,
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    content: String(formData.get("content") ?? "").trim(),
    featuredImage: String(formData.get("featuredImage") ?? "").trim() || null,
    featuredImageAlt: String(formData.get("featuredImageAlt") ?? "").trim() || null,
    author: String(formData.get("author") ?? "").trim() || null,
    category: String(formData.get("category") ?? "").trim(),
    publishedAt: String(formData.get("publishedAt") ?? new Date().toISOString()),
    readingTimeMinutes: Number(formData.get("readingTimeMinutes") || 5),
    seoTitle: String(formData.get("seoTitle") ?? "").trim() || null,
    seoDescription: String(formData.get("seoDescription") ?? "").trim() || null,
  };

  const existing = db.select().from(schema.posts).where(eq(schema.posts.id, id)).get();
  if (existing) {
    db.update(schema.posts).set(payload).where(eq(schema.posts.id, id)).run();
  } else {
    db.insert(schema.posts).values(payload).run();
  }

  revalidatePath("/blog");
  redirect("/admin/posts");
}

export async function deletePost(id: string) {
  await requireAdmin();
  getDb().delete(schema.posts).where(eq(schema.posts.id, id)).run();
  revalidatePath("/blog");
  redirect("/admin/posts");
}

export async function saveTestimonial(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  const id = String(formData.get("id") || crypto.randomUUID());
  const payload = {
    id,
    clientName: String(formData.get("clientName") ?? "").trim(),
    role: String(formData.get("role") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    quote: String(formData.get("quote") ?? "").trim(),
    photo: String(formData.get("photo") ?? "").trim() || null,
    photoAlt: String(formData.get("photoAlt") ?? "").trim() || null,
    rating: Number(formData.get("rating") || 5),
  };

  const existing = db.select().from(schema.testimonials).where(eq(schema.testimonials.id, id)).get();
  if (existing) {
    db.update(schema.testimonials).set(payload).where(eq(schema.testimonials.id, id)).run();
  } else {
    db.insert(schema.testimonials).values(payload).run();
  }

  revalidatePath("/");
  revalidatePath("/testimonials");
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  getDb().delete(schema.testimonials).where(eq(schema.testimonials.id, id)).run();
  redirect("/admin/testimonials");
}

export async function saveService(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  const id = String(formData.get("id") || crypto.randomUUID());
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") || title));
  const payload = {
    id,
    slug,
    title,
    shortDescription: String(formData.get("shortDescription") ?? "").trim(),
    fullDescription: String(formData.get("fullDescription") ?? "").trim(),
    icon: String(formData.get("icon") ?? "").trim() || null,
    image: String(formData.get("image") ?? "").trim() || null,
    imageAlt: String(formData.get("imageAlt") ?? "").trim() || null,
    processSteps: JSON.stringify(
      String(formData.get("processSteps") ?? "")
        .split("\n\n")
        .map((block) => block.trim())
        .filter(Boolean)
        .map((block) => {
          const [titleLine, ...rest] = block.split("\n");
          return { title: titleLine?.trim() ?? "", description: rest.join("\n").trim() };
        }),
    ),
    techStack: linesToJsonArray(formData.get("techStack")),
    seoTitle: String(formData.get("seoTitle") ?? "").trim() || null,
    seoDescription: String(formData.get("seoDescription") ?? "").trim() || null,
  };

  const existing = db.select().from(schema.services).where(eq(schema.services.id, id)).get();
  if (existing) {
    db.update(schema.services).set(payload).where(eq(schema.services.id, id)).run();
  } else {
    db.insert(schema.services).values(payload).run();
  }

  revalidatePath("/services");
  redirect("/admin/services");
}

export async function deleteService(id: string) {
  await requireAdmin();
  getDb().delete(schema.services).where(eq(schema.services.id, id)).run();
  redirect("/admin/services");
}

export async function saveTeamMember(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  const id = String(formData.get("id") || crypto.randomUUID());
  const payload = {
    id,
    name: String(formData.get("name") ?? "").trim(),
    role: String(formData.get("role") ?? "").trim(),
    photo: String(formData.get("photo") ?? "").trim() || null,
    photoAlt: String(formData.get("photoAlt") ?? "").trim() || null,
    bio: String(formData.get("bio") ?? "").trim() || null,
    social: JSON.stringify([]),
  };

  const existing = db.select().from(schema.teamMembers).where(eq(schema.teamMembers.id, id)).get();
  if (existing) {
    db.update(schema.teamMembers).set(payload).where(eq(schema.teamMembers.id, id)).run();
  } else {
    db.insert(schema.teamMembers).values(payload).run();
  }

  revalidatePath("/about");
  redirect("/admin/team");
}

export async function deleteTeamMember(id: string) {
  await requireAdmin();
  getDb().delete(schema.teamMembers).where(eq(schema.teamMembers.id, id)).run();
  redirect("/admin/team");
}
