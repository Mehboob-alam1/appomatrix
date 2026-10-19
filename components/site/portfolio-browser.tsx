"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Chip } from "@/components/site/ui";
import { richTextPlain } from "@/lib/rich-text";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PortfolioBrowser({ projects }: { projects: Project[] }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((project) => project.category)))],
    [projects],
  );
  const [category, setCategory] = useState("All");
  const visible = category === "All" ? projects : projects.filter((project) => project.category === category);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={cn(
              "inline-flex min-h-10 items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              category === item
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {item}
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="mt-8 text-muted-foreground">No projects in this category yet.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <Link
              key={project.id}
              href={`/portfolio/${project.slug}`}
              className="card-lift group overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="media-card rounded-none border-0">
                {project.coverImage ? (
                  <img
                    src={project.coverImage}
                    alt={project.coverImageAlt || `${project.title} cover`}
                    className="aspect-[16/10] w-full object-cover"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="grid aspect-[16/10] place-items-center bg-muted text-3xl font-semibold text-muted-foreground">
                    {project.title.slice(0, 1)}
                  </div>
                )}
              </div>
              <div className="p-4">
                <Chip className="bg-primary-50 text-primary">{project.category}</Chip>
                <h2 className="mt-3 text-lg font-semibold group-hover:text-primary">{project.title}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{project.clientName}</p>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{richTextPlain(project.excerpt)}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  View case <ArrowUpRight className="size-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
