import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/cards/project-card";
import { RichText } from "@/components/content/rich-text";
import { LeadCtaBlock } from "@/components/sections/lead-cta-block";
import { getFeaturedProjects, getServiceBySlug, getServices } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return buildMetadata({
    title: service.seoTitle ?? service.title,
    description: service.seoDescription ?? service.shortDescription,
    path: `/services/${slug}`,
  });
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const related =
    service.relatedProjects && service.relatedProjects.length > 0
      ? service.relatedProjects
      : (await getFeaturedProjects()).slice(0, 2);

  return (
    <>
      <Container className="py-12 sm:py-16 md:py-20">
        <p className="text-sm text-accent">Service</p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{service.title}</h1>
        <p className="mt-4 max-w-3xl text-base text-muted sm:text-lg">{service.shortDescription}</p>
        <div className="mt-8 max-w-3xl">
          <RichText value={service.fullDescription} />
        </div>

        {service.processSteps?.length ? (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-semibold">Our approach</h2>
            <ol className="mt-6 grid gap-4 md:grid-cols-3">
              {service.processSteps.map((step, i) => (
                <li key={step.title} className="rounded-2xl border border-border p-5">
                  <p className="text-sm text-accent">Step {i + 1}</p>
                  <h3 className="mt-1 font-medium">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted">{step.description}</p>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {service.techStack?.length ? (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-semibold">Tech stack</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {service.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-border px-3 py-1 text-sm text-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-10">
          <Button href="/contact" analyticsLabel="Service page CTA" analyticsLocation={`service-${slug}`}>
            Book a Free Consultation
          </Button>
        </div>
      </Container>

      <section className="border-t border-border bg-surface-muted/20 py-16">
        <Container>
          <h2 className="font-display text-2xl font-semibold">Related case studies</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {related.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </Container>
      </section>

      <LeadCtaBlock />
    </>
  );
}
