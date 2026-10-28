import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Gallery } from "@/components/site/gallery";
import { Breadcrumbs, Container, Kicker, Prose } from "@/components/site/chrome";
import { JsonLd } from "@/components/site/json-ld";
import { BackgroundGlow, Chip, CtaBand, GradientText, SiteLinkButton, StatItem } from "@/components/site/ui";
import { parseList, parseStats } from "@/lib/format";
import { getProject, listProjects } from "@/lib/queries";
import { absoluteUrl, breadcrumbJsonLd, contentMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Work" };
  return contentMetadata({
    title: project.title,
    description: project.excerpt,
    path: `/portfolio/${project.slug}`,
    image: project.coverImage || undefined,
  });
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();
  const metrics = parseStats(project.metricsText);
  const stack = parseList(project.techStack);
  const more = (await listProjects(true)).filter((item) => item.id !== project.id).slice(0, 3);

  const crumbs = [
    { href: "/", label: "Home" },
    { href: "/portfolio", label: "Work" },
    { href: `/portfolio/${project.slug}`, label: project.title },
  ];

  return (
    <article>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.title,
          description: project.excerpt,
          url: absoluteUrl(`/portfolio/${project.slug}`),
          image: project.coverImage || undefined,
          creator: { "@type": "Organization", name: "Appo Matrix", url: absoluteUrl("/") },
        }}
      />
      <section className="relative overflow-hidden border-b border-border">
        <BackgroundGlow className="opacity-40" />
        <Container className="relative pt-10 pb-12">
          <Breadcrumbs items={crumbs} />
          <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-400">
            {[project.category, project.clientName].filter(Boolean).join(" · ")}
          </p>
          <h1 className="font-display mt-3 max-w-4xl text-balance">{project.title}</h1>
          <Prose text={project.excerpt} className="mt-5 max-w-2xl text-lg text-muted-foreground" />
          {project.externalLink ? (
            <SiteLinkButton href={project.externalLink} className="mt-7">
              Visit live product <ArrowUpRight className="size-4" />
            </SiteLinkButton>
          ) : null}
        </Container>
      </section>
      {project.coverImage ? (
        <div className="border-b border-border bg-secondary/40">
          <Container className="py-8 md:py-10">
            <div className="media-card glass-card overflow-hidden rounded-2xl p-1.5">
              <img
                src={project.coverImage}
                alt={project.coverImageAlt || project.title}
                className="aspect-[16/8] w-full rounded-[0.9rem] object-cover"
              />
            </div>
          </Container>
        </div>
      ) : null}
      {metrics.length > 0 ? (
        <Container className="grid border-b border-border sm:grid-cols-3">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className={`py-8 ${index > 0 ? "border-t border-border sm:border-t-0 sm:border-l sm:pl-6" : ""}`}
            >
              <StatItem value={metric.value} label={metric.label} />
            </div>
          ))}
        </Container>
      ) : null}
      <Container className="grid gap-6 py-12 md:grid-cols-3">
        {[
          ["The Challenge", project.problem],
          ["Our Solution", project.solution],
          ["The Result", project.result],
        ].map(([label, body]) => (
          <section key={label} className="glass-card rounded-2xl p-5">
            <Kicker>{label}</Kicker>
            <Prose text={body} className="mt-3 text-base text-muted-foreground" />
          </section>
        ))}
      </Container>
      {project.gallery.length > 0 ? (
        <Container className="pb-14">
          <h2 className="font-display text-3xl tracking-tight">
            Product <GradientText>gallery</GradientText>
          </h2>
          <p className="mt-2 mb-6 max-w-2xl text-muted-foreground">
            Screens and scenes from the build. Open any frame for a closer look.
          </p>
          <Gallery images={project.gallery} />
        </Container>
      ) : null}
      {stack.length > 0 ? (
        <Container className="pb-14">
          <Kicker>Technologies used</Kicker>
          <div className="mt-4 flex flex-wrap gap-2">
            {stack.map((item) => (
              <Chip key={item} className="bg-primary/10 text-primary-300">
                {item}
              </Chip>
            ))}
          </div>
        </Container>
      ) : null}
      {more.length > 0 ? (
        <Container className="border-t border-border py-14">
          <h2 className="font-display text-2xl">
            More <GradientText>work</GradientText>
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {more.map((item) => (
              <Link key={item.id} href={`/portfolio/${item.slug}`} className="card-lift glass-card rounded-2xl p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-400">{item.category}</p>
                <p className="mt-2 text-xl font-semibold">{item.title}</p>
              </Link>
            ))}
          </div>
        </Container>
      ) : null}
      <CtaBand
        title={
          <>
            Want results like <GradientText>this?</GradientText>
          </>
        }
        description="Tell us what you're building. We'll help you turn the idea into a modern digital product."
        primaryHref="/contact"
        primaryLabel="Start Your Project"
        secondaryHref="/portfolio"
        secondaryLabel="Back to Work"
      />
    </article>
  );
}
