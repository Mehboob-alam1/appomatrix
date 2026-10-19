import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Container, Kicker, PageHero, Prose } from "@/components/site/chrome";
import { parseList, parsePairs } from "@/lib/format";
import { JsonLd } from "@/components/site/json-ld";
import { getService, listProjects, listServices } from "@/lib/queries";
import { absoluteUrl, contentMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Service" };
  return contentMetadata({
    title: service.title,
    description: service.shortDescription,
    path: `/services/${service.slug}`,
    image: service.image || undefined,
  });
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();
  const all = await listServices(true);
  const children = all.filter((item) => item.parentId === service.id);
  const parent = service.parentId ? all.find((item) => item.id === service.parentId) : undefined;
  const siblings = parent ? all.filter((item) => item.parentId === parent.id && item.id !== service.id) : [];
  const steps = parsePairs(service.processText);
  const stack = parseList(service.techStack);
  const projects = (await listProjects(true)).slice(0, 2);

  return (
    <>
      <PageHero
        kicker={parent ? parent.title : "Services"}
        title={service.title}
        lead={service.shortDescription}
        path={`/services/${service.slug}`}
        ancestors={
          parent
            ? [
                { href: "/services", label: "Services" },
                { href: `/services/${parent.slug}`, label: parent.title },
              ]
            : [{ href: "/services", label: "Services" }]
        }
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.title,
          description: service.shortDescription,
          url: absoluteUrl(`/services/${service.slug}`),
          provider: { "@type": "Organization", name: "Appo Matrix", url: absoluteUrl("/") },
          areaServed: "Worldwide",
        }}
      />
      <Container className="grid gap-6 py-7 lg:grid-cols-12 lg:gap-6 lg:py-9">
        <div className="space-y-8 lg:col-span-7">
          {service.image ? (
            <div className="media-card">
              <img src={service.image} alt={service.imageAlt || service.title} className="aspect-[16/9] w-full object-cover" loading="lazy" />
            </div>
          ) : null}
          <Prose text={service.fullDescription} />
          {steps.length > 0 ? (
            <div>
              <Kicker>How it runs</Kicker>
              <ol className="mt-4 space-y-3">
                {steps.map((step, index) => (
                  <li key={step.title} className="grid grid-cols-[auto_1fr] gap-3 rounded-xl border border-border bg-card p-4">
                    <span className="text-sm font-semibold text-primary">{String(index + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="block font-semibold">{step.title}</span>
                      <span className="text-sm text-muted-foreground">{step.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>
        <aside className="space-y-4 lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-border bg-surface-dark p-6 text-white">
            <h2 className="text-2xl font-semibold text-white">Plan a project</h2>
            <p className="mt-3 text-sm text-white/65">Tell us the outcome and the date. We reply with a clear next step.</p>
            <Link
              href={`/contact?topic=${encodeURIComponent(service.title)}`}
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-[10px] bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary-600"
            >
              Get a quote <ArrowUpRight className="size-4" />
            </Link>
            {stack.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {stack.map((item) => (
                  <span key={item} className="rounded-full border border-white/15 px-2.5 py-1 text-xs text-white/60">
                    {item}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          {children.length > 0 ? (
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-semibold">Within {service.title}</h2>
              <ul className="mt-3 space-y-2">
                {children.map((child) => (
                  <li key={child.id}>
                    <Link href={`/services/${child.slug}`} className="text-sm text-muted-foreground hover:text-primary">
                      {child.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {siblings.length > 0 ? (
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-semibold">Related services</h2>
              <ul className="mt-3 space-y-2">
                {siblings.map((item) => (
                  <li key={item.id}>
                    <Link href={`/services/${item.slug}`} className="text-sm text-muted-foreground hover:text-primary">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </Container>
      {projects.length > 0 ? (
        <Container className="pb-14">
          <Kicker>Related work</Kicker>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <Link key={project.id} href={`/portfolio/${project.slug}`} className="card-lift rounded-xl border border-border bg-card p-5">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-primary">{project.category}</p>
                <p className="mt-2 text-xl font-semibold">{project.title}</p>
                <Prose text={project.excerpt} className="mt-2 line-clamp-2 text-sm text-muted-foreground" />
              </Link>
            ))}
          </div>
        </Container>
      ) : null}
    </>
  );
}
