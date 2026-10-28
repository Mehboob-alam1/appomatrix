import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, PageHero, Prose } from "@/components/site/chrome";
import { ServiceIcon } from "@/components/site/service-icon";
import { Chip, CtaBand, GradientText, ProcessPillars, SectionHeader } from "@/components/site/ui";
import { pageIntro, pageSeed } from "@/lib/page-copy";
import { richTextPlain } from "@/lib/rich-text";
import { parsePairs } from "@/lib/format";
import { getPageMeta, getSettings, serviceTree } from "@/lib/queries";
import { metadataFor } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFor("/services", {
    title: "Services — Design, Develop, Deploy",
    description:
      "From idea validation to launch, Appo Matrix designs, engineers, and deploys modern digital products that help businesses move faster.",
  });
}

const FALLBACK_PROCESS = [
  { title: "Understand", body: "Goals, users, constraints, and success criteria." },
  { title: "Plan", body: "Scoped roadmap with clear milestones and ownership." },
  { title: "Design", body: "Product experience that is usable and brand-true." },
  { title: "Develop", body: "Modern engineering with AI-assisted workflows where they help." },
  { title: "Launch", body: "Tested, deployed, and ready for real users." },
  { title: "Scale", body: "Iterate, monitor, and grow with confidence." },
];

export default async function ServicesPage() {
  const groups = await serviceTree(true);
  const settings = await getSettings();
  const seed = pageSeed("/services");
  const copy = pageIntro(await getPageMeta("/services"), {
    kicker: seed?.kicker || "Services",
    heading: seed?.heading || "Digital solutions built for what's next.",
    lead:
      seed?.lead ||
      "From idea validation to launch, we design, engineer, and deploy modern digital products that help businesses move faster.",
    body: seed?.body || "",
  });
  const process = parsePairs(settings.processText);
  const steps = (process.length ? process : FALLBACK_PROCESS).slice(0, 6);

  return (
    <>
      <PageHero
        kicker={copy.kicker}
        title={copy.heading}
        lead={copy.lead}
        image={copy.image}
        imageAlt={copy.imageAlt}
        highlight="what's next"
      />
      <Container className="section-pad">
        {copy.body ? <Prose text={copy.body} className="mb-10 max-w-2xl text-muted-foreground" /> : null}
        <SectionHeader
          eyebrow="Capabilities"
          title={
            <>
              Everything you need to go from <GradientText>idea to launch.</GradientText>
            </>
          }
        />
        <div className="mt-10 grid gap-5">
          {groups.map((group, index) => (
            <section key={group.id} className="glass-card rounded-2xl p-5 md:p-7">
              <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <div className="flex items-start gap-3">
                    <span className="grid size-12 place-items-center rounded-xl bg-primary/15 text-primary-300">
                      <ServiceIcon name={group.icon} className="size-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-primary-400">{String(index + 1).padStart(2, "0")}</p>
                      <h2 className="mt-1 text-xl font-semibold">
                        <Link href={`/services/${group.slug}`} className="hover:text-primary-300">
                          {group.title}
                        </Link>
                      </h2>
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                        {richTextPlain(group.shortDescription)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
                  {(group.children.length > 0 ? group.children : [group]).map((service) => (
                    <Link
                      key={service.id}
                      href={`/services/${service.slug}`}
                      className="card-lift group flex items-start justify-between gap-3 rounded-xl border border-border bg-background/40 p-4"
                    >
                      <span>
                        <span className="block font-semibold group-hover:text-primary-300">{service.title}</span>
                        <span className="mt-1 block line-clamp-2 text-sm text-muted-foreground">
                          {richTextPlain(service.shortDescription)}
                        </span>
                      </span>
                      <ArrowUpRight className="mt-1 size-4 shrink-0 text-primary-400" />
                    </Link>
                  ))}
                </div>
              </div>
              {group.children.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {group.children.map((child) => (
                    <Chip key={child.id} className="bg-primary/10 text-primary-300">
                      {child.title}
                    </Chip>
                  ))}
                </div>
              ) : null}
            </section>
          ))}
        </div>
      </Container>

      <section className="section-pad border-y border-border bg-secondary/30">
        <Container>
          <SectionHeader
            eyebrow="Process"
            title={
              <>
                Our development <GradientText>process.</GradientText>
              </>
            }
            description="A clear path from brief to live product — timelines are always qualified to your scope."
          />
          <div className="mt-10">
            <ProcessPillars
              steps={steps.map((step, i) => ({
                number: String(i + 1).padStart(2, "0"),
                title: step.title,
                body: step.body,
              }))}
            />
          </div>
        </Container>
      </section>

      <CtaBand
        eyebrow="Consultation"
        title={
          <>
            Ready to scope your <GradientText>next build?</GradientText>
          </>
        }
        description="Tell us what you're launching. We'll reply with a clear approach and delivery plan."
        primaryHref="/contact"
        primaryLabel="Get a Project Estimate"
        secondaryHref="/portfolio"
        secondaryLabel="Explore Our Work"
        footnotes={["Clear scoping", "No obligation", "Expert consultation"]}
      />
    </>
  );
}
