import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/types/content";
import { resolveImageAlt, resolveImageUrl } from "@/lib/images";

export function BlogCard({ post }: { post: BlogPost }) {
  const image = resolveImageUrl(post.featuredImage, 800);
  const alt = resolveImageAlt(post.featuredImage, post.featuredImageAlt, post.title);
  const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="card-interactive group overflow-hidden rounded-2xl border border-border bg-surface"
    >
      <div className="relative aspect-[16/10] bg-surface-muted">
        {image ? (
          <Image
            src={image}
            alt={alt}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        ) : null}
      </div>
      <div className="p-5">
        <p className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-accent/10 px-2 py-0.5 font-semibold text-accent">
            {post.category}
          </span>
          <span className="text-muted">{date}</span>
        </p>
        <h3 className="mt-2 font-display text-lg font-semibold group-hover:text-accent">
          {post.title}
        </h3>
        <p className="mt-2 text-sm text-muted line-clamp-2">{post.excerpt}</p>
      </div>
    </Link>
  );
}
