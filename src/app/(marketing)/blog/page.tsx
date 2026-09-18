import Link from "next/link";
import { Container } from "@/components/ui/container";
import { BlogIndexClient } from "@/components/blog/blog-index-client";
import { JsonLd } from "@/components/blog/json-ld";
import { BlogAdSlot } from "@/components/site/site-injections";
import { FadeIn } from "@/components/motion/fade-in";
import { getPostCategories, getPosts } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";
import { resolveImageUrl } from "@/lib/images";

export const metadata = buildMetadata({
  title: "Blog — Software, Product & Engineering",
  description:
    "Insights on SaaS development, low-bandwidth UX, and shipping software from Appo Matrix in Gilgit-Baltistan for global clients.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getPosts();
  const categories = getPostCategories(posts);
  const featured = posts[0];

  const blogDescription =
    "Insights on SaaS development, low-bandwidth UX, and shipping software from Appo Matrix for global clients.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${siteConfig.name} Blog`,
    description: blogDescription,
    url: `${siteConfig.url}/blog`,
    blogPost: posts.slice(0, 10).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${siteConfig.url}/blog/${p.slug}`,
      datePublished: p.publishedAt,
      author: p.author ? { "@type": "Person", name: p.author } : undefined,
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <section className="relative overflow-hidden border-b border-border bg-surface-muted/30 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--accent)_0%,transparent_55%)] opacity-[0.08]" />
        <Container className="relative">
          <FadeIn>
            <p className="text-sm font-medium text-accent">Insights for founders & product teams</p>
            <h1 className="mt-2 max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Blog
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">
              SEO-friendly articles on building software that performs in the real world—from Gilgit-Baltistan
              to global markets.
            </p>
          </FadeIn>
          {featured ? (
            <FadeIn delay={0.1} className="mt-10">
              <Link
                href={`/blog/${featured.slug}`}
                className="group grid overflow-hidden rounded-3xl border border-border bg-surface shadow-sm transition hover:border-accent/30 hover:shadow-md md:grid-cols-2"
              >
                <div className="relative min-h-[220px] bg-surface-muted">
                  {resolveImageUrl(featured.featuredImage, 900) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={resolveImageUrl(featured.featuredImage, 900)!}
                      alt={featured.featuredImageAlt ?? featured.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    />
                  ) : null}
                </div>
                <div className="flex flex-col justify-center p-8">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                    Featured · {featured.category}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-semibold group-hover:text-accent">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-muted line-clamp-3">{featured.excerpt}</p>
                  <span className="mt-4 text-sm font-medium text-accent">Read article →</span>
                </div>
              </Link>
            </FadeIn>
          ) : null}
        </Container>
      </section>

      <Container className="grid gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <BlogIndexClient posts={posts} categories={categories} skipFirstFeatured />
        </div>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="font-display text-lg font-semibold">Need a product team?</h2>
            <p className="mt-2 text-sm text-muted">
              Turn ideas into revenue-ready software with a free consultation.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex rounded-full bg-accent px-4 py-2 text-sm font-medium text-white"
            >
              Book a call
            </Link>
          </div>
          <BlogAdSlot slot="sidebar" />
        </aside>
      </Container>
    </>
  );
}
