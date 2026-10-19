import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Building2, Quote } from "lucide-react";
import { Container, Prose } from "@/components/site/chrome";
import { SafeImage } from "@/components/site/safe-image";
import { ServiceIcon } from "@/components/site/service-icon";
import { Chip, SectionHeader, SiteLinkButton, StatItem, Stepper } from "@/components/site/ui";
import { whatsappHref } from "@/lib/contact";
import { parsePairs, parseStats, formatDate } from "@/lib/format";
import { richTextPlain } from "@/lib/rich-text";
import {
  getSettings,
  listCareers,
  listPosts,
  listProjects,
  listScholarships,
  listSections,
  listTestimonials,
  serviceTree,
} from "@/lib/queries";
import { metadataFor } from "@/lib/seo";
import type { HomeSection } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFor("/", {
    title: "Software studio in Gilgit-Baltistan",
    description:
      "Appo Matrix designs and ships web, mobile, and SaaS products from Gilgit-Baltistan for teams worldwide. See the work, services, careers, and scholarships.",
  });
}

function sectionOf(sections: HomeSection[], key: string) {
  const empty = { show: true, kicker: "", title: "", body: "", image: "", imageAlt: "", ctaLabel: "", ctaHref: "" };
  if (sections.length === 0) return empty;
  const found = sections.find((item) => item.sectionKey === key);
  if (!found || !found.published) return { ...empty, show: false };
  return {
    show: true,
    kicker: found.kicker,
    title: found.title,
    body: found.body,
    image: found.image,
    imageAlt: found.imageAlt,
    ctaLabel: found.ctaLabel,
    ctaHref: found.ctaHref,
  };
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export default async function HomePage() {
  const settings = await getSettings();
  const sections = await listSections(false);
  const servicesBlock = sectionOf(sections, "services");
  const portfolioBlock = sectionOf(sections, "portfolio");
  const industriesBlock = sectionOf(sections, "industries");
  const aboutBlock = sectionOf(sections, "about");
  const clientsBlock = sectionOf(sections, "clients");
  const careersBlock = sectionOf(sections, "careers");
  const scholarshipsBlock = sectionOf(sections, "scholarships");
  const notesBlock = sectionOf(sections, "notes");
  const closingBlock = sectionOf(sections, "closing");
  const services = await serviceTree(true);
  const projects = await listProjects(true);
  const featured = projects.filter((project) => project.featured);
  const shown = (featured.length > 0 ? featured : projects).slice(0, 3);
  const posts = (await listPosts(true)).slice(0, 3);
  const quotes = await listTestimonials(true);
  const careers = (await listCareers(true)).slice(0, 3);
  const scholarships = (await listScholarships(true)).slice(0, 3);
  const stats = parseStats(settings.statsText);
  const process = parsePairs(settings.processText);
  const industries = parsePairs(settings.industriesText);
  const principles = parsePairs(settings.principlesText);
  const ribbon = services.flatMap((group) => [group.title, ...group.children.map((child) => child.title)]);
  const whatsapp = whatsappHref(settings.whatsappNumber, settings.whatsappMessage);
  const aboutCards = principles.slice(0, 4);
  const valueList = principles.length > 4 ? principles.slice(4) : principles;

  return (
    <>
      <section className="section-pad border-b border-border">
        <Container className="grid items-center gap-6 lg:grid-cols-2 lg:gap-8">
          <div>
            {settings.city ? <Chip>{settings.city}</Chip> : null}
            <h1 className="font-display mt-4 text-balance">
              {settings.heroTitle}
              {settings.heroHighlight ? <span className="mt-1 block text-primary">{settings.heroHighlight}</span> : null}
            </h1>
            <Prose text={settings.heroLead} className="mt-4 max-w-xl text-base text-muted-foreground md:text-lg" />
            <div className="mt-6 flex flex-wrap gap-3">
              <SiteLinkButton href={settings.ctaPrimaryHref || "/contact"}>
                {settings.ctaPrimaryLabel || "Plan a project"} <ArrowUpRight className="size-4" />
              </SiteLinkButton>
              <SiteLinkButton href={settings.ctaSecondaryHref || "/portfolio"} variant="outline">
                {settings.ctaSecondaryLabel || "See the work"}
              </SiteLinkButton>
            </div>
          </div>
          <div className="relative">
            <div className="media-card overflow-hidden rounded-2xl">
              <SafeImage
                src={settings.heroImage}
                alt={settings.heroImageAlt || settings.siteName}
                priority
                className="aspect-[4/3] w-full object-cover md:aspect-[5/4]"
              />
            </div>
            {(settings.tagline || settings.heroCaption) && (
              <div className="absolute right-3 bottom-3 left-3 rounded-xl border border-white/25 bg-white/85 p-3 shadow-sm backdrop-blur-md md:right-auto md:bottom-4 md:left-4 md:max-w-[16rem]">
                <p className="text-xs font-medium text-primary">{settings.heroKicker || settings.city}</p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {richTextPlain(settings.tagline) || settings.heroCaption}
                </p>
              </div>
            )}
          </div>
        </Container>
      </section>

      {stats.length > 0 ? (
        <section className="border-b border-border">
          <Container className="grid grid-cols-2 gap-6 py-8 md:grid-cols-4 md:gap-0">
            {stats.map((stat, index) => (
              <div
                key={`${stat.value}-${stat.label}`}
                className={`min-w-0 md:px-6 ${index > 0 ? "md:border-l md:border-border" : ""}`}
              >
                <StatItem value={stat.value} label={stat.label} />
              </div>
            ))}
          </Container>
        </section>
      ) : null}

      {ribbon.length > 0 ? (
        <section className="border-b border-border bg-primary-50/50 py-3" aria-label="Services ribbon">
          <div className="hidden overflow-hidden md:block">
            <div className="chip-marquee gap-2 px-2">
              {[...ribbon, ...ribbon].map((item, index) => (
                <Chip key={`${item}-${index}`} className="bg-card whitespace-nowrap">
                  {item}
                </Chip>
              ))}
            </div>
          </div>
          <Container className="flex flex-wrap gap-2 md:hidden">
            {ribbon.map((item) => (
              <Chip key={item}>{item}</Chip>
            ))}
          </Container>
        </section>
      ) : null}

      {servicesBlock.show ? (
        <section className="section-pad">
          <Container>
            <SectionHeader
              eyebrow={servicesBlock.kicker || "Services"}
              title={servicesBlock.title || "What we actually ship"}
              description={servicesBlock.body ? <Prose text={servicesBlock.body} className="text-sm" /> : null}
              href="/services"
              linkLabel="All services"
            />
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {services.map((service, index) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="card-lift group flex h-full flex-col rounded-xl border border-border bg-card p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-primary-50 text-primary">
                      <ServiceIcon name={service.icon} className="size-5" />
                    </span>
                    <span className="text-xs font-semibold text-primary">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold group-hover:text-primary">{service.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {richTextPlain(service.shortDescription)}
                  </p>
                  {service.children.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {service.children.slice(0, 4).map((child) => (
                        <Chip key={child.id} className="bg-muted/60">
                          {child.title}
                        </Chip>
                      ))}
                    </div>
                  ) : null}
                  <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-primary">
                    Explore <ArrowUpRight className="size-4" />
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {portfolioBlock.show ? (
        <section className="section-pad border-y border-border">
          <Container>
            <SectionHeader
              eyebrow={portfolioBlock.kicker || "Portfolio"}
              title={portfolioBlock.title || "Selected products"}
              description={portfolioBlock.body ? <Prose text={portfolioBlock.body} className="text-sm" /> : null}
              href="/portfolio"
              linkLabel="Complete portfolio"
            />
            <div className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
              {shown.map((project) => (
                <Link
                  key={project.id}
                  href={`/portfolio/${project.slug}`}
                  className="card-lift group w-[85%] shrink-0 snap-start overflow-hidden rounded-xl border border-border bg-background md:w-auto"
                >
                  <div className="media-card rounded-none border-0">
                    {project.coverImage ? (
                      <SafeImage
                        src={project.coverImage}
                        alt={project.coverImageAlt || `${project.title} cover`}
                        className="aspect-[16/10] w-full object-cover"
                      />
                    ) : (
                      <div className="grid aspect-[16/10] place-items-center bg-muted text-2xl font-semibold text-muted-foreground">
                        {project.title.slice(0, 1)}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <Chip className="bg-primary-50 text-primary">{project.category}</Chip>
                    <h3 className="mt-3 text-lg font-semibold group-hover:text-primary">{project.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{richTextPlain(project.excerpt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {process.length > 0 ? (
        <section className="section-pad">
          <Container>
            <SectionHeader eyebrow="Process" title="How we ship" />
            <div className="mt-5">
              <Stepper steps={process} />
            </div>
          </Container>
        </section>
      ) : null}

      {industriesBlock.show && industries.length > 0 ? (
        <section className="section-pad border-y border-border">
          <Container>
            <SectionHeader
              eyebrow={industriesBlock.kicker || "Industries"}
              title={industriesBlock.title || "Industries we support"}
              description={industriesBlock.body ? <Prose text={industriesBlock.body} className="text-sm" /> : null}
            />
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {industries.map((industry) => (
                <div key={industry.title} className="rounded-xl border border-border bg-background p-4">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary-50 text-primary">
                    <Building2 className="size-5" />
                  </span>
                  <h3 className="mt-3 text-base font-semibold">{industry.title}</h3>
                  <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{industry.body}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {aboutBlock.show ? (
        <section className="section-pad">
          <Container className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <div>
              <SectionHeader
                eyebrow={aboutBlock.kicker || "About"}
                title={settings.aboutHeadline || aboutBlock.title || "About Appo Matrix"}
                description={<Prose text={settings.aboutBody} className="text-sm" />}
              />
              <SiteLinkButton href={aboutBlock.ctaHref || "/about"} className="mt-6">
                {aboutBlock.ctaLabel || "About Us"}
              </SiteLinkButton>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {aboutCards.map((item) => (
                <div key={item.title} className="rounded-xl border border-border bg-card p-4">
                  <h3 className="text-base font-semibold">{item.title}</h3>
                  <p className="mt-2 line-clamp-4 text-sm text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </div>
          </Container>
          {valueList.length > 0 ? (
            <Container className="mt-10">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {valueList.map((item) => (
                  <div key={item.title} className="flex gap-3 rounded-xl border border-border/80 bg-muted/30 p-3">
                    <span className="mt-0.5 size-2 shrink-0 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Container>
          ) : null}
        </section>
      ) : null}

      {clientsBlock.show && quotes.length > 0 ? (
        <section className="section-pad border-y border-border">
          <Container>
            <SectionHeader eyebrow={clientsBlock.kicker || "Clients"} title={clientsBlock.title || "What clients say"} />
            <div className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible">
              {quotes.map((quote) => (
                <figure
                  key={quote.id}
                  className="card-lift flex h-full w-[88%] shrink-0 snap-start flex-col rounded-xl border border-border bg-background p-5 md:w-auto"
                >
                  <Quote className="size-6 text-primary" aria-hidden="true" />
                  <blockquote className="mt-3 flex-1 text-base font-medium leading-relaxed text-foreground">
                    <span className="line-clamp-5">{richTextPlain(quote.quote)}</span>
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-full bg-primary-50 text-sm font-semibold text-primary">
                      {initials(quote.clientName)}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">{quote.clientName}</span>
                      <span className="text-xs text-muted-foreground">
                        {quote.role}, {quote.company}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {careersBlock.show ? (
        <section className="section-pad">
          <Container>
            <SectionHeader
              eyebrow={careersBlock.kicker || "Career Development"}
              title={careersBlock.title || "Open paths"}
              href="/career-development"
              linkLabel="All openings"
            />
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {careers.map((career) => (
                <Link
                  key={career.id}
                  href={`/career-development/${career.slug}`}
                  className="card-lift flex h-full flex-col rounded-xl border border-border bg-card p-5"
                >
                  <Chip className="w-fit bg-primary-50 text-primary">{career.kind}</Chip>
                  <h3 className="mt-3 text-lg font-semibold">{career.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{career.location}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-primary">
                    View role <ArrowUpRight className="size-4" />
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {scholarshipsBlock.show && scholarships.length > 0 ? (
        <section className="section-pad border-t border-border">
          <Container>
            <SectionHeader
              eyebrow={scholarshipsBlock.kicker || "Scholarships"}
              title={scholarshipsBlock.title || "Scholarships"}
              href="/scholarships"
              linkLabel="All scholarships"
            />
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {scholarships.map((item) => (
                <Link
                  key={item.id}
                  href={`/scholarships/${item.slug}`}
                  className="card-lift rounded-xl border border-border bg-background p-5"
                >
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.award}</p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {notesBlock.show ? (
        <section className="section-pad">
          <Container>
            <SectionHeader
              eyebrow={notesBlock.kicker || "Notes"}
              title={notesBlock.title || "Notes"}
              description={notesBlock.body ? <Prose text={notesBlock.body} className="text-sm" /> : null}
              href={notesBlock.ctaHref || "/blog"}
              linkLabel={notesBlock.ctaLabel || "All posts"}
            />
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="card-lift group overflow-hidden rounded-xl border border-border bg-card"
                >
                  <div className="media-card rounded-none border-0">
                    {post.featuredImage ? (
                      <SafeImage
                        src={post.featuredImage}
                        alt={post.featuredImageAlt || post.title}
                        className="aspect-[16/10] w-full object-cover"
                      />
                    ) : (
                      <div className="aspect-[16/10] bg-muted" />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-medium text-muted-foreground">
                      {post.category} · {formatDate(post.publishedAt)}
                    </p>
                    <h3 className="mt-2 line-clamp-2 text-lg font-semibold group-hover:text-primary">{post.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {closingBlock.show ? (
        <section className="bg-surface-dark">
          <Container className="flex flex-col gap-6 py-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-white">{closingBlock.title || "Start with a written brief."}</h2>
              {closingBlock.body ? <Prose text={closingBlock.body} className="mt-3 text-sm text-white/70" /> : null}
            </div>
            <div className="flex flex-wrap gap-3">
              <SiteLinkButton href={closingBlock.ctaHref || "/contact"} variant="dark">
                {closingBlock.ctaLabel || "Contact Us"} <ArrowUpRight className="size-4" />
              </SiteLinkButton>
              {whatsapp ? (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border border-white/20 px-4 text-sm font-semibold text-white hover:border-white/40"
                >
                  WhatsApp
                </a>
              ) : null}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
