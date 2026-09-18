import { getDb } from "@/db/client";
import * as schema from "@/db/schema";

export type SeoAuditRow = {
  id: string;
  type: "project" | "post" | "service";
  title: string;
  slug: string;
  editHref: string;
  seoTitle: string | null;
  seoDescription: string | null;
  score: number;
  issues: string[];
};

function auditItem(
  type: SeoAuditRow["type"],
  id: string,
  title: string,
  slug: string,
  seoTitle: string | null | undefined,
  seoDescription: string | null | undefined,
): SeoAuditRow {
  const issues: string[] = [];
  let score = 100;

  if (!seoTitle?.trim()) {
    issues.push("Missing custom meta title");
    score -= 25;
  } else if (seoTitle.length > 70) {
    issues.push("Meta title too long (>70)");
    score -= 15;
  } else if (seoTitle.length < 30) {
    issues.push("Meta title short (<30)");
    score -= 10;
  }

  const desc = seoDescription?.trim() ?? "";
  if (!desc) {
    issues.push("Missing meta description");
    score -= 30;
  } else if (desc.length < 120) {
    issues.push("Description under 120 chars");
    score -= 15;
  } else if (desc.length > 160) {
    issues.push("Description over 160 chars");
    score -= 10;
  }

  if (!slug?.trim()) {
    issues.push("Missing URL slug");
    score -= 20;
  }

  const prefix =
    type === "project" ? "/admin/projects" : type === "post" ? "/admin/posts" : "/admin/services";

  return {
    id,
    type,
    title,
    slug,
    editHref: `${prefix}/${id}`,
    seoTitle: seoTitle ?? null,
    seoDescription: seoDescription ?? null,
    score: Math.max(0, score),
    issues,
  };
}

export function getSeoAuditReport(): SeoAuditRow[] {
  const db = getDb();
  const rows: SeoAuditRow[] = [];

  for (const p of db.select().from(schema.projects).all()) {
    rows.push(
      auditItem("project", p.id, p.title, p.slug, p.seoTitle, p.seoDescription),
    );
  }
  for (const p of db.select().from(schema.posts).all()) {
    rows.push(auditItem("post", p.id, p.title, p.slug, p.seoTitle, p.seoDescription));
  }
  for (const s of db.select().from(schema.services).all()) {
    rows.push(
      auditItem("service", s.id, s.title, s.slug, s.seoTitle, s.seoDescription),
    );
  }

  return rows.sort((a, b) => a.score - b.score);
}
