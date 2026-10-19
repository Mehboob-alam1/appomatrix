import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs, Container, Prose } from "@/components/site/chrome";
import { JsonLd } from "@/components/site/json-ld";
import { formatDate } from "@/lib/format";
import { getPost } from "@/lib/queries";
import { absoluteUrl, breadcrumbJsonLd, contentMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Blog" };
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
    { href: "/blog", label: "Blog" },
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
      <Container className="max-w-3xl pt-8 pb-12">
        <Breadcrumbs items={crumbs} />
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-brand">
          {post.category} · {formatDate(post.publishedAt)} · {post.readingTimeMinutes} min read
          {post.author ? ` · ${post.author}` : ""}
        </p>
        <h1 className="font-display mt-3 text-5xl md:text-6xl">{post.title}</h1>
        <Prose text={post.excerpt} className="mt-4 text-lg text-black/65" />
      </Container>
      {post.featuredImage ? (
        <Container className="max-w-3xl">
          <div className="media-card">
            <img src={post.featuredImage} alt={post.featuredImageAlt || post.title} className="aspect-[16/9] w-full object-cover" />
          </div>
        </Container>
      ) : null}
      <Container className="max-w-3xl py-7">
        <Prose text={post.content} />
      </Container>
    </article>
  );
}
