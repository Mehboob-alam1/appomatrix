import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHero, Prose } from "@/components/site/chrome";
import { formatDate } from "@/lib/format";
import { SafeImage } from "@/components/site/safe-image";
import { pageIntro, pageSeed } from "@/lib/page-copy";
import { getPageMeta, listCategories, listPosts } from "@/lib/queries";
import { metadataFor } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFor("/blog", {
    title: "Blog",
    description: "Notes on product, engineering, and how Appo Matrix works.",
  });
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const [posts, categories, page] = await Promise.all([listPosts(true, category || ""), listCategories(true), getPageMeta("/blog")]);
  const seed = pageSeed("/blog");
  const copy = pageIntro(page, {
    kicker: seed?.kicker || "Blog",
    heading: seed?.heading || "Notes from the work",
    lead: seed?.lead || "",
    body: seed?.body || "",
  });
  return (
    <>
      <PageHero kicker={copy.kicker} title={copy.heading} lead={copy.lead} image={copy.image} imageAlt={copy.imageAlt} />
      {categories.length > 0 ? (
        <Container className="flex flex-wrap gap-2 pt-10">
          <Link href="/blog" className={`border px-3 py-1 text-sm ${!category ? "border-black bg-black text-white" : "border-black/15"}`}>All</Link>
          {categories.map((item) => (
            <Link key={item.id} href={`/blog?category=${item.slug}`} className={`border px-3 py-1 text-sm ${category === item.slug ? "border-black bg-black text-white" : "border-black/15"}`}>
              {item.name}
            </Link>
          ))}
        </Container>
      ) : null}
      {copy.body ? (
        <Container className="pt-10">
          <Prose text={copy.body} className="max-w-2xl" />
        </Container>
      ) : null}
      <Container className="grid gap-x-8 gap-y-12 py-16 md:grid-cols-2">
        {posts.length === 0 ? <p className="text-muted-foreground">No posts yet.</p> : null}
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group">
            {post.featuredImage ? (
              <div className="media-card">
                <SafeImage src={post.featuredImage} alt={post.featuredImageAlt || post.title} className="aspect-[16/10] w-full object-cover" />
              </div>
            ) : null}
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-black/45">
              {post.category} · {formatDate(post.publishedAt)} · {post.readingTimeMinutes} min
            </p>
            <h2 className="font-display mt-2 text-3xl group-hover:text-brand">{post.title}</h2>
            <Prose text={post.excerpt} className="mt-2 text-sm text-black/60" />
          </Link>
        ))}
      </Container>
    </>
  );
}
