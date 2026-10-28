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
    () => ["All", ...Array.from(new Set(projects.map((project) => project.category).filter(Boolean)))],
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
              "inline-flex min-h-10 items-center rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              category === item
                ? "border-primary bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(115,92,255,0.35)]"
                : "border-border bg-card/50 text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {item}
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="mt-8 text-muted-foreground">No projects in this category yet.</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {visible.map((project) => (
            <Link
              key={project.id}
              href={`/portfolio/${project.slug}`}
              className="card-lift group overflow-hidden rounded-2xl border border-border bg-card/50"
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
              <div className="p-5">
                {project.category ? (
                  <Chip className="bg-primary/10 text-primary-300">{project.category}</Chip>
                ) : null}
                <h2 className="mt-3 text-xl font-semibold group-hover:text-primary-300">{project.title}</h2>
                {project.clientName ? <p className="mt-1 text-xs text-muted-foreground">{project.clientName}</p> : null}
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{richTextPlain(project.excerpt)}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-400">
                  View case study <ArrowUpRight className="size-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
