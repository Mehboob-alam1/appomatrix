import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHero } from "@/components/site/chrome";
import { formatDate } from "@/lib/format";
import { listPosts } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description: "Notes on product, engineering, and how Appo Matrix works.",
  path: "/blog",
});

export default function BlogPage() {
  const posts = listPosts(true);
  return (
    <>
      <PageHero
        kicker="Blog"
        title="Notes from the work"
        lead="Product, engineering, and studio writing. New posts are published from the admin studio."
      />
      <Container className="grid gap-x-8 gap-y-12 py-16 md:grid-cols-2">
        {posts.length === 0 ? <p className="text-muted-foreground">No posts yet.</p> : null}
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group">
            {post.featuredImage ? (
              <div className="media-card">
                <img src={post.featuredImage} alt={post.featuredImageAlt || post.title} className="aspect-[16/10] w-full object-cover" />
              </div>
            ) : null}
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-black/45">
              {post.category} · {formatDate(post.publishedAt)} · {post.readingTimeMinutes} min
            </p>
            <h2 className="font-display mt-2 text-3xl group-hover:text-brand">{post.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-black/60">{post.excerpt}</p>
          </Link>
        ))}
      </Container>
    </>
  );
}
