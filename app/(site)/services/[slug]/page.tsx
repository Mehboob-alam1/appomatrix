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
      <Container className="grid gap-10 py-14 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-7">
          {service.image ? (
            <div className="media-card">
              <img src={service.image} alt={service.imageAlt || service.title} className="aspect-[16/9] w-full object-cover" />
            </div>
          ) : null}
          <Prose text={service.fullDescription} />
          {steps.length > 0 ? (
            <div>
              <Kicker>How it runs</Kicker>
              <ol className="mt-4 space-y-3">
                {steps.map((step, index) => (
                  <li key={step.title} className="grid grid-cols-[auto_1fr] gap-3">
                    <span className="font-display text-primary">{String(index + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="block font-medium">{step.title}</span>
                      <span className="text-sm text-muted-foreground">{step.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>
        <aside className="space-y-6 lg:col-span-5">
          <div className="bg-black p-6 text-white">
            <h2 className="font-display text-3xl text-white">Start with this service</h2>
            <p className="mt-3 text-sm text-white/65">Tell us the outcome and the date. We reply with a scope, not a slide.</p>
            <Link href={`/contact?topic=${encodeURIComponent(service.title)}`} className="mt-6 inline-flex h-11 items-center gap-2 bg-brand px-4 text-sm text-white">
              Contact Us <ArrowUpRight className="size-4" />
            </Link>
            {stack.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-x-3 gap-y-1">
                {stack.map((item) => (
                  <span key={item} className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">{item}</span>
                ))}
              </div>
            ) : null}
          </div>
          {children.length > 0 ? (
            <div>
              <h2 className="font-medium">Within {service.title}</h2>
              <ul className="mt-3 space-y-2">
                {children.map((child) => (
                  <li key={child.id}>
                    <Link href={`/services/${child.slug}`} className="text-sm hover:text-primary">{child.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {siblings.length > 0 ? (
            <div>
              <h2 className="font-medium">Related services</h2>
              <ul className="mt-3 space-y-2">
                {siblings.map((item) => (
                  <li key={item.id}>
                    <Link href={`/services/${item.slug}`} className="text-sm hover:text-primary">{item.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </Container>
      {projects.length > 0 ? (
        <Container className="pb-16">
          <Kicker>Related work</Kicker>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <Link key={project.id} href={`/portfolio/${project.slug}`} className="border-t border-black/10 py-4">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{project.category}</p>
                <p className="font-display mt-1 text-2xl">{project.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{project.excerpt}</p>
              </Link>
            ))}
          </div>
        </Container>
      ) : null}
    </>
  );
}
