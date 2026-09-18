"use client";

import type { TocItem } from "@/lib/blog-toc";
import { cn } from "@/lib/cn";

export function ArticleToc({ items }: { items: TocItem[] }) {
  if (items.length < 2) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-accent">On this page</p>
      <ol className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(item.level === 3 && "ml-3", item.level === 4 && "ml-6")}
          >
            <a
              href={`#${item.id}`}
              className="text-muted transition hover:text-accent"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
