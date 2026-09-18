"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/types/content";
import { ProjectCard } from "@/components/cards/project-card";
import { cn } from "@/lib/cn";

export function WorkGrid({
  projects,
  categories,
}: {
  projects: Project[];
  categories: string[];
}) {
  const [category, setCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    if (category === "All") return projects;
    return projects.filter((p) => p.category === category);
  }, [category, projects]);

  return (
    <div>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:thin] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm transition sm:shrink",
              category === cat
                ? "bg-accent text-white"
                : "border border-border text-muted hover:text-foreground",
            )}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  );
}
