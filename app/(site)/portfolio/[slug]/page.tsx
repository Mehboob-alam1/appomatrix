import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Gallery } from "@/components/site/gallery";
import { Breadcrumbs, Container, Kicker, Prose } from "@/components/site/chrome";
import { JsonLd } from "@/components/site/json-ld";
import { parseList, parseStats } from "@/lib/format";
import { getProject, listProjects } from "@/lib/queries";
import { absoluteUrl, breadcrumbJsonLd, contentMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Portfolio" };
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
    { href: "/portfolio", label: "Portfolio" },
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
      <Container className="pt-8 pb-10">
        <Breadcrumbs items={crumbs} />
        <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary">
          {project.category} · {project.clientName}
        </p>
        <h1 className="font-display mt-3 max-w-4xl">{project.title}</h1>
        <Prose text={project.excerpt} className="mt-5 max-w-2xl text-lg text-muted-foreground" />
        {project.externalLink ? (
          <a
            href={project.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-[10px] bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary-600"
          >
            Visit live product <ArrowUpRight className="size-4" />
          </a>
        ) : null}
      </Container>
      {project.coverImage ? (
        <img
          src={project.coverImage}
          alt={project.coverImageAlt || project.title}
          className="aspect-[16/8] w-full object-cover"
        />
      ) : null}
      {metrics.length > 0 ? (
        <Container className="grid border-y border-black/10 sm:grid-cols-3">
          {metrics.map((metric, index) => (
            <div key={metric.label} className={`py-8 ${index > 0 ? "border-t border-black/10 sm:border-t-0 sm:border-l sm:pl-6" : ""}`}>
              <p className="font-display text-5xl">{metric.value}</p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-black/45">{metric.label}</p>
            </div>
          ))}
        </Container>
      ) : null}
      <Container className="grid gap-5 py-8 md:grid-cols-3">
        {[
          ["Problem", project.problem],
          ["Solution", project.solution],
          ["Result", project.result],
        ].map(([label, body]) => (
          <section key={label}>
            <Kicker>{label}</Kicker>
            <Prose text={body} className="mt-3 text-base" />
          </section>
        ))}
      </Container>
      {project.gallery.length > 0 ? (
        <Container className="pb-12">
          <h2 className="font-display text-3xl tracking-tight">Gallery</h2>
          <p className="mt-2 mb-5 max-w-2xl text-muted-foreground">
            Screens and scenes from the build. Open any frame for a closer look.
          </p>
          <Gallery images={project.gallery} />
        </Container>
      ) : null}
      {stack.length > 0 ? (
        <Container className="flex flex-wrap gap-x-4 gap-y-2 pb-12">
          {stack.map((item) => (
            <span key={item} className="font-mono text-[11px] uppercase tracking-[0.16em] text-black/50">{item}</span>
          ))}
        </Container>
      ) : null}
      {project.externalLink ? (
        <Container className="pb-12">
          <a href={project.externalLink} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary">
            Backlink · {project.externalLink}
          </a>
        </Container>
      ) : null}
      {more.length > 0 ? (
        <Container className="border-t border-border py-12">
          <h2 className="font-display text-2xl">More work</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {more.map((item) => (
              <Link key={item.id} href={`/portfolio/${item.slug}`} className="border-t border-black/10 py-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand">{item.category}</p>
                <p className="font-display mt-1 text-2xl">{item.title}</p>
              </Link>
            ))}
          </div>
        </Container>
      ) : null}
    </article>
  );
}
