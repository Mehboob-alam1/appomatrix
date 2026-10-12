import type { MetadataRoute } from "next";
import { listCareers, listPosts, listProjects, listScholarships, listServices } from "@/lib/queries";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    ["/", 1],
    ["/services", 0.9],
    ["/portfolio", 0.9],
    ["/about", 0.7],
    ["/contact", 0.7],
    ["/blog", 0.8],
    ["/team", 0.6],
    ["/career-development", 0.7],
    ["/scholarships", 0.7],
  ] as const;

  const pages: MetadataRoute.Sitemap = staticRoutes.map(([path, priority]) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority,
  }));

  for (const service of listServices(true)) {
    pages.push({
      url: absoluteUrl(`/services/${service.slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: service.parentId ? 0.6 : 0.7,
    });
  }
  for (const project of listProjects(true)) {
    pages.push({
      url: absoluteUrl(`/portfolio/${project.slug}`),
      lastModified: project.createdAt ? new Date(project.createdAt) : now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }
  for (const post of listPosts(true)) {
    pages.push({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }
  for (const career of listCareers(true)) {
    pages.push({
      url: absoluteUrl(`/career-development/${career.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    });
  }
  for (const item of listScholarships(true)) {
    pages.push({
      url: absoluteUrl(`/scholarships/${item.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    });
  }

  return pages;
}
