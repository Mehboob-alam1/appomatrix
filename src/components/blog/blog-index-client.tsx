"use client";

import { useMemo, useState } from "react";
import type { BlogPost } from "@/types/content";
import { BlogCard } from "@/components/cards/blog-card";
import { cn } from "@/lib/cn";

export function BlogIndexClient({
  posts,
  categories,
  skipFirstFeatured = false,
}: {
  posts: BlogPost[];
  categories: string[];
  skipFirstFeatured?: boolean;
}) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const basePosts = skipFirstFeatured ? posts.slice(1) : posts;

  const filtered = useMemo(() => {
    return basePosts.filter((post) => {
      const matchesCategory = category === "All" || post.category === category;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [basePosts, category, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Search by title, topic, or keyword…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search blog posts"
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 sm:max-w-md"
        />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm transition",
                category === cat
                  ? "bg-accent text-white shadow-sm shadow-accent/25"
                  : "border border-border text-muted hover:border-accent/40 hover:text-foreground",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {filtered.map((post) => (
          <BlogCard key={post._id} post={post} />
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="mt-8 text-sm text-muted">No posts match your filters.</p>
      ) : null}
    </div>
  );
}
