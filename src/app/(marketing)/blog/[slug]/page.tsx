import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ArticleContent } from "@/components/blog/article-content";
import { ArticleToc } from "@/components/blog/article-toc";
import { BlogCard } from "@/components/cards/blog-card";
import { JsonLd } from "@/components/blog/json-ld";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { ExitIntentPopup } from "@/components/forms/exit-intent-popup";
import { BlogAdSlot } from "@/components/site/site-injections";
import { Button } from "@/components/ui/button";
import { extractTocFromHtml } from "@/lib/blog-toc";
import { getPostBySlug, getPosts } from "@/lib/data";
import { resolveImageAlt, resolveImageUrl } from "@/lib/images";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    path: `/blog/${slug}`,
    image: resolveImageUrl(post.featuredImage, 1200),
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = await getPosts();
  const related = allPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 3);

  const image = resolveImageUrl(post.featuredImage, 1400);
  const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const isoDate = post.publishedAt;

  const contentHtml = post.content ?? "";
  const toc = extractTocFromHtml(contentHtml);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription ?? post.excerpt,
    image: image ? [image] : undefined,
    datePublished: isoDate,
    dateModified: isoDate,
    author: post.author
      ? { "@type": "Person", name: post.author }
      : { "@type": "Organization", name: siteConfig.name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: `${siteConfig.url}/blog/${slug}`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog` },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${siteConfig.url}/blog/${slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={articleLd} />
      <JsonLd data={breadcrumbLd} />
      <ExitIntentPopup />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <Container className="py-10 sm:py-14">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-accent">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/blog" className="hover:text-accent">
                  Blog
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-foreground">{post.category}</li>
            </ol>
          </nav>

          <header className="mt-6 max-w-3xl">
            <p className="text-sm font-medium text-accent">{post.category}</p>
            <h1
              itemProp="headline"
              className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
            >
              {post.title}
            </h1>
            <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
              <time dateTime={isoDate} itemProp="datePublished">
                {date}
              </time>
              {post.readingTimeMinutes ? <span>{post.readingTimeMinutes} min read</span> : null}
              {post.author ? (
                <span itemProp="author">{post.author}</span>
              ) : (
                <span>{siteConfig.name}</span>
              )}
            </p>
            <p itemProp="description" className="mt-4 text-lg text-muted">
              {post.excerpt}
            </p>
          </header>

          {image ? (
            <div className="relative mt-10 aspect-[16/9] max-w-4xl overflow-hidden rounded-3xl border border-border shadow-lg">
              <Image
                src={image}
                alt={resolveImageAlt(post.featuredImage, post.featuredImageAlt, post.title)}
                fill
                priority
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 896px"
                itemProp="image"
              />
            </div>
          ) : null}

          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
            <aside className="order-1 space-y-6 lg:order-2 lg:sticky lg:top-24 lg:self-start">
              <ArticleToc items={toc} />
              <BlogAdSlot slot="sidebar" />
            </aside>

            <div className="order-2 min-w-0 lg:order-1">
              <BlogAdSlot slot="in-article" />
              <div itemProp="articleBody" className="mt-8 max-w-3xl">
                <ArticleContent html={post.content} fallback={post.excerpt} />
              </div>

              <div className="mt-12 rounded-2xl border border-accent/20 bg-accent/5 p-6 sm:p-8">
                <h2 className="font-display text-xl font-semibold">Ready to build something similar?</h2>
                <p className="mt-2 text-sm text-muted">
                  Book a free consultation—we&apos;ll map scope, timeline, and the fastest path to launch.
                </p>
                <div className="mt-4">
                  <Button href="/contact" analyticsLabel="Blog post CTA" analyticsLocation={`blog-${slug}`}>
                    Book a Free Consultation
                  </Button>
                </div>
              </div>

              <div className="mt-10 rounded-2xl border border-border bg-surface p-6">
                <h2 className="font-display text-lg font-semibold">Newsletter</h2>
                <p className="mt-2 text-sm text-muted">Monthly notes on shipping software—no spam.</p>
                <div className="mt-4">
                  <NewsletterForm />
                </div>
              </div>
            </div>
          </div>
        </Container>

        {related.length ? (
          <section className="border-t border-border bg-surface-muted/30 py-16">
            <Container>
              <h2 className="font-display text-2xl font-semibold">Related articles</h2>
              <p className="mt-1 text-sm text-muted">More in {post.category}</p>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {related.map((p) => (
                  <BlogCard key={p._id} post={p} />
                ))}
              </div>
            </Container>
          </section>
        ) : null}
      </article>
    </>
  );
}
