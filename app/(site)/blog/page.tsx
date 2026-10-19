import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHero, Prose } from "@/components/site/chrome";
import { SafeImage } from "@/components/site/safe-image";
import { formatDate } from "@/lib/format";
import { pageIntro, pageSeed } from "@/lib/page-copy";
import { richTextPlain } from "@/lib/rich-text";
import { getPageMeta, listCategories, listPosts } from "@/lib/queries";
import { metadataFor } from "@/lib/seo";
import { cn } from "@/lib/utils";

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
  const [featured, ...rest] = posts;

  return (
    <>
      <PageHero kicker={copy.kicker} title={copy.heading} lead={copy.lead} image={copy.image} imageAlt={copy.imageAlt} />
      {categories.length > 0 ? (
        <Container className="flex flex-wrap gap-2 pt-8">
          <Link
            href="/blog"
            className={cn(
              "inline-flex min-h-10 items-center rounded-full border px-3 py-1.5 text-sm font-medium",
              !category ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground",
            )}
          >
            All
          </Link>
          {categories.map((item) => (
            <Link
              key={item.id}
              href={`/blog?category=${item.slug}`}
              className={cn(
                "inline-flex min-h-10 items-center rounded-full border px-3 py-1.5 text-sm font-medium",
                category === item.slug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
        </Container>
      ) : null}
      {copy.body ? (
        <Container className="pt-6">
          <Prose text={copy.body} className="max-w-2xl text-sm text-muted-foreground" />
        </Container>
      ) : null}
      <Container className="section-pad">
        {posts.length === 0 ? <p className="text-muted-foreground">No posts yet.</p> : null}
        {featured ? (
          <Link href={`/blog/${featured.slug}`} className="card-lift group mb-8 grid gap-5 overflow-hidden rounded-xl border border-border bg-card md:grid-cols-2">
            <div className="media-card rounded-none border-0">
              {featured.featuredImage ? (
                <SafeImage
                  src={featured.featuredImage}
                  alt={featured.featuredImageAlt || featured.title}
                  className="aspect-[16/10] h-full w-full object-cover"
                />
              ) : (
                <div className="aspect-[16/10] bg-muted md:h-full" />
              )}
            </div>
            <div className="flex flex-col justify-center p-5 md:p-6">
              <p className="text-xs font-medium text-muted-foreground">
                {featured.category} · {formatDate(featured.publishedAt)} · {featured.readingTimeMinutes} min
              </p>
              <h2 className="mt-2 text-2xl font-semibold group-hover:text-primary md:text-3xl">{featured.title}</h2>
              <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{richTextPlain(featured.excerpt)}</p>
            </div>
          </Link>
        ) : null}
        <div className="grid gap-4 md:grid-cols-3">
          {rest.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="card-lift group overflow-hidden rounded-xl border border-border bg-card">
              <div className="media-card rounded-none border-0">
                {post.featuredImage ? (
                  <SafeImage src={post.featuredImage} alt={post.featuredImageAlt || post.title} className="aspect-[16/10] w-full object-cover" />
                ) : (
                  <div className="aspect-[16/10] bg-muted" />
                )}
              </div>
              <div className="p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  {post.category} · {formatDate(post.publishedAt)}
                </p>
                <h2 className="mt-2 line-clamp-2 text-lg font-semibold group-hover:text-primary">{post.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{richTextPlain(post.excerpt)}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
