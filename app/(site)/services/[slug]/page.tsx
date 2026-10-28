import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Container, Kicker, PageHero, Prose } from "@/components/site/chrome";
import { SafeImage } from "@/components/site/safe-image";
import { Chip, CtaBand, GradientText, SiteLinkButton } from "@/components/site/ui";
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
      <Container className="grid gap-8 py-10 lg:grid-cols-12 lg:gap-10 lg:py-14">
        <div className="space-y-10 lg:col-span-7">
          {service.image ? (
            <div className="media-card glass-card overflow-hidden rounded-2xl p-1.5">
              <SafeImage
                src={service.image}
                alt={service.imageAlt || service.title}
                className="aspect-[16/9] w-full rounded-[0.9rem] object-cover"
              />
            </div>
          ) : null}
          <Prose text={service.fullDescription} />
          {steps.length > 0 ? (
            <div>
              <Kicker>How it runs</Kicker>
              <ol className="mt-5 space-y-3">
                {steps.map((step, index) => (
                  <li key={step.title} className="glass-card grid grid-cols-[auto_1fr] gap-3 rounded-2xl p-4">
                    <span className="text-sm font-semibold text-primary-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
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
          <div className="glass-card relative overflow-hidden rounded-2xl p-6">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(115,92,255,0.25),transparent_55%)]"
            />
            <div className="relative">
              <h2 className="text-2xl font-semibold">Plan this project</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Tell us the outcome you need. We reply with a clear next step — scope and timeline sized to your
                requirements.
              </p>
              <SiteLinkButton href={`/contact?topic=${encodeURIComponent(service.title)}`} className="mt-6">
                Get a quote <ArrowUpRight className="size-4" />
              </SiteLinkButton>
              {stack.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {stack.map((item) => (
                    <Chip key={item} className="border-border bg-background/50 text-muted-foreground">
                      {item}
                    </Chip>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          {children.length > 0 ? (
            <div className="glass-card rounded-2xl p-5">
              <h2 className="font-semibold">Within {service.title}</h2>
              <ul className="mt-3 space-y-2">
                {children.map((child) => (
                  <li key={child.id}>
                    <Link href={`/services/${child.slug}`} className="text-sm text-muted-foreground hover:text-primary-400">
                      {child.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {siblings.length > 0 ? (
            <div className="glass-card rounded-2xl p-5">
              <h2 className="font-semibold">Related services</h2>
              <ul className="mt-3 space-y-2">
                {siblings.map((item) => (
                  <li key={item.id}>
                    <Link href={`/services/${item.slug}`} className="text-sm text-muted-foreground hover:text-primary-400">
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
        <Container className="pb-16">
          <Kicker>Related work</Kicker>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/portfolio/${project.slug}`}
                className="card-lift glass-card rounded-2xl p-5"
              >
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-primary-400">{project.category}</p>
                <p className="mt-2 text-xl font-semibold">{project.title}</p>
                <Prose text={project.excerpt} className="mt-2 line-clamp-2 text-sm text-muted-foreground" />
              </Link>
            ))}
          </div>
        </Container>
      ) : null}
      <CtaBand
        title={
          <>
            Let&apos;s shape your <GradientText>{service.title}</GradientText> engagement.
          </>
        }
        description="Share your goals — we'll help you explore the right approach."
        primaryHref={`/contact?topic=${encodeURIComponent(service.title)}`}
        primaryLabel="Discuss Your Idea"
        secondaryHref="/portfolio"
        secondaryLabel="Explore Our Work"
      />
    </>
  );
}
