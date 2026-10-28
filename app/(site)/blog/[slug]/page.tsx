import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs, Container, Prose } from "@/components/site/chrome";
import { JsonLd } from "@/components/site/json-ld";
import { BackgroundGlow, CtaBand, GradientText } from "@/components/site/ui";
import { formatDate } from "@/lib/format";
import { getPost } from "@/lib/queries";
import { absoluteUrl, breadcrumbJsonLd, contentMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Insights" };
  return contentMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.featuredImage || undefined,
    type: "article",
  });
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const crumbs = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Insights" },
    { href: `/blog/${post.slug}`, label: post.title },
  ];

  return (
    <article>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          author: { "@type": "Person", name: post.author || "Appo Matrix" },
          image: post.featuredImage || undefined,
          mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
          publisher: { "@type": "Organization", name: "Appo Matrix", url: absoluteUrl("/") },
        }}
      />
      <section className="relative overflow-hidden border-b border-border">
        <BackgroundGlow className="opacity-40" />
        <Container className="relative max-w-3xl pt-10 pb-12">
          <Breadcrumbs items={crumbs} />
          <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-400">
            {post.category} · {formatDate(post.publishedAt)} · {post.readingTimeMinutes} min read
            {post.author ? ` · ${post.author}` : ""}
          </p>
          <h1 className="font-display mt-3 text-balance">{post.title}</h1>
          <Prose text={post.excerpt} className="mt-4 text-lg text-muted-foreground" />
        </Container>
      </section>
      {post.featuredImage ? (
        <Container className="max-w-3xl pt-10">
          <div className="media-card glass-card overflow-hidden rounded-2xl p-1.5">
            <img
              src={post.featuredImage}
              alt={post.featuredImageAlt || post.title}
              className="aspect-[16/9] w-full rounded-[0.9rem] object-cover"
            />
          </div>
        </Container>
      ) : null}
      <Container className="max-w-3xl py-10">
        <Prose text={post.content} />
      </Container>
      <CtaBand
        title={
          <>
            Want help shipping the <GradientText>next chapter?</GradientText>
          </>
        }
        primaryHref="/contact"
        primaryLabel="Build My Software"
        secondaryHref="/blog"
        secondaryLabel="More insights"
      />
    </article>
  );
}
