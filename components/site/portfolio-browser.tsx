"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Prose } from "@/components/site/prose";
import type { Project } from "@/lib/types";

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
            className={`px-3 py-1.5 text-sm ${category === item ? "bg-black text-white" : "text-black/60 hover:text-black"}`}
          >
            {item}
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="mt-8 text-muted-foreground">No projects in this category yet.</p>
      ) : (
        <div className="mt-6 border-t border-black/10">
          {visible.map((project) => (
            <Link key={project.id} href={`/portfolio/${project.slug}`} className="group grid items-center gap-6 border-b border-black/10 py-6 md:grid-cols-12">
              <div className="media-card md:col-span-5">
                {project.coverImage ? (
                  <img src={project.coverImage} alt={project.coverImageAlt || project.title} className="aspect-[16/10] w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />
                ) : (
                  <div className="grid aspect-[16/10] place-items-center bg-black text-4xl text-white">{project.title.slice(0, 1)}</div>
                )}
              </div>
              <div className="md:col-span-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand">{project.category} · {project.clientName}</p>
                <h2 className="font-display mt-2 text-3xl md:text-4xl">{project.title}</h2>
                <Prose text={project.excerpt} className="mt-2 max-w-lg text-sm text-black/60" />
              </div>
              <ArrowUpRight className="hidden size-5 md:col-span-1 md:block md:justify-self-end group-hover:text-brand" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
