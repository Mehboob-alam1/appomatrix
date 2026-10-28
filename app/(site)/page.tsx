import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  Cloud,
  Code2,
  LayoutTemplate,
  Rocket,
  Smartphone,
  Sparkles,
  Workflow,
  Quote,
} from "lucide-react";
import { Container, Prose } from "@/components/site/chrome";
import { SafeImage } from "@/components/site/safe-image";
import { ServiceIcon } from "@/components/site/service-icon";
import {
  BackgroundGlow,
  Chip,
  CtaBand,
  GradientText,
  ProcessPillars,
  SectionHeader,
  SiteLinkButton,
  StatItem,
  Stepper,
} from "@/components/site/ui";
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
    title: "From Idea to Live Software — In Weeks, Not Months",
    description:
      "Appo Matrix designs, develops, and deploys modern AI-powered software at startup speed. From first concept to live product for teams worldwide.",
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

const DDD = [
  {
    number: "01",
    title: "Design",
    body: "We transform your vision into a polished, intuitive product experience — clear scope, sharp UX, and a plan your team can trust.",
  },
  {
    number: "02",
    title: "Develop",
    body: "We build modern, scalable software with efficient engineering workflows and AI-assisted tools where they accelerate quality delivery.",
  },
  {
    number: "03",
    title: "Deploy",
    body: "We test, launch, and help you scale with confidence — production-ready handoff, not a demo that falls over.",
  },
];

const SPEED_POINTS = [
  { title: "Focused MVP scoping", body: "Ship the slice that proves value first — not a bloated first release." },
  { title: "Rapid prototyping", body: "Validate flows early so engineering time goes into the right product." },
  { title: "Reusable foundations", body: "Proven patterns for auth, dashboards, APIs, and deployment." },
  { title: "AI-assisted workflows", body: "Accelerate drafting, testing, and iteration without skipping review." },
  { title: "Continuous testing", body: "Quality gates stay in the loop as features land." },
  { title: "Streamlined deployment", body: "Cloud-ready launches with monitoring and a clear ownership path." },
];

const WHY_US = [
  { title: "Rapid execution", body: "Startup speed with senior ownership from brief to launch." },
  { title: "AI-powered capabilities", body: "Practical AI integrations where they create real product leverage." },
  { title: "Modern product design", body: "Interfaces that feel intentional — not template-default." },
  { title: "End-to-end ownership", body: "Strategy, design, engineering, and deploy in one squad." },
  { title: "Scalable architecture", body: "Built to grow with users, data, and new surfaces." },
  { title: "Transparent collaboration", body: "You talk to the people shipping — clear milestones, no black box." },
];

const PHASES = [
  { title: "Discovery & scope", body: "Goals, constraints, and a delivery plan sized to your idea." },
  { title: "Product design", body: "UX flows, UI systems, and prototypes you can react to quickly." },
  { title: "Build & integrate", body: "Iterative engineering with demos you can click, not slide decks." },
  { title: "Test & deploy", body: "Hardening, launch, and handoff — with support as you scale." },
];

export default async function HomePage() {
  const settings = await getSettings();
  const sections = await listSections(false);
  const servicesBlock = sectionOf(sections, "services");
  const portfolioBlock = sectionOf(sections, "portfolio");
  const aboutBlock = sectionOf(sections, "about");
  const clientsBlock = sectionOf(sections, "clients");
  const careersBlock = sectionOf(sections, "careers");
  const scholarshipsBlock = sectionOf(sections, "scholarships");
  const notesBlock = sectionOf(sections, "notes");
  const closingBlock = sectionOf(sections, "closing");
  const services = await serviceTree(true);
  const projects = await listProjects(true);
  const featured = projects.filter((project) => project.featured);
  const shown = (featured.length > 0 ? featured : projects).slice(0, 4);
  const posts = (await listPosts(true)).slice(0, 3);
  const quotes = await listTestimonials(true);
  const careers = (await listCareers(true)).slice(0, 3);
  const scholarships = (await listScholarships(true)).slice(0, 3);
  const stats = parseStats(settings.statsText);
  const process = parsePairs(settings.processText);
  const principles = parsePairs(settings.principlesText);
  const whatsapp = whatsappHref(settings.whatsappNumber, settings.whatsappMessage);
  const heroVisual = shown[0]?.coverImage || settings.heroImage;
  const heroVisualAlt = shown[0]
    ? shown[0].coverImageAlt || `${shown[0].title} cover`
    : settings.heroImageAlt || settings.siteName;

  const serviceIcons = [Code2, Smartphone, Cloud, Bot, LayoutTemplate, Workflow, Rocket, Sparkles];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <BackgroundGlow />
        <Container className="relative grid items-center gap-10 py-14 lg:grid-cols-12 lg:gap-12 lg:py-20">
          <div className="fade-in lg:col-span-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-primary-300 uppercase">
              <span className="size-1.5 rounded-full bg-cyan" aria-hidden="true" />
              AI-Powered Software Studio
            </p>
            <h1 className="font-display mt-5 text-balance">
              From Idea to <GradientText>Live Software.</GradientText>
              <span className="mt-2 block text-foreground">In Weeks, Not Months.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              We design, develop, and deploy modern AI-powered software at startup speed. From your first idea to a
              production-ready product, we handle the complete journey — with scope and timeline sized to your project.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <SiteLinkButton href={settings.ctaPrimaryHref || "/contact"}>
                Build My Software <ArrowUpRight className="size-4" />
              </SiteLinkButton>
              <SiteLinkButton href={settings.ctaSecondaryHref || "/portfolio"} variant="outline">
                Explore Our Work
              </SiteLinkButton>
            </div>
            <p className="mt-4 text-xs text-muted-foreground/80">
              Delivery estimates depend on scope, complexity, and requirements — we qualify timelines after discovery.
            </p>
          </div>

          <div className="relative fade-in lg:col-span-6" style={{ animationDelay: "80ms" }}>
            <div className="relative mx-auto max-w-xl">
              <div
                aria-hidden="true"
                className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_center,rgba(115,92,255,0.35),transparent_65%)] blur-2xl"
              />
              <div className="glass-card relative overflow-hidden rounded-[1.5rem] p-2 md:p-3">
                <SafeImage
                  src={heroVisual}
                  alt={heroVisualAlt}
                  priority
                  className="aspect-[16/11] w-full rounded-[1.1rem] object-cover"
                />
                <div className="absolute right-5 bottom-5 left-5 rounded-xl border border-white/15 bg-[#090D18]/75 p-3 backdrop-blur-md md:right-auto md:left-5 md:max-w-[15rem]">
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-primary-300 uppercase">
                    Design · Develop · Deploy
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {richTextPlain(settings.tagline) || "AI-powered products, shipped with clarity."}
                  </p>
                </div>
              </div>
              {shown[1]?.coverImage ? (
                <div className="glass-card absolute -right-2 -bottom-6 hidden w-[42%] overflow-hidden rounded-2xl p-1.5 sm:block md:-right-4">
                  <SafeImage
                    src={shown[1].coverImage}
                    alt={shown[1].coverImageAlt || shown[1].title}
                    className="aspect-[9/14] w-full rounded-xl object-cover"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </Container>

        {stats.length > 0 ? (
          <Container className="relative pb-12">
            <div className="grid grid-cols-2 gap-6 rounded-2xl border border-border bg-card/40 px-5 py-6 md:grid-cols-4 md:gap-0 md:px-2">
              {stats.map((stat, index) => (
                <div
                  key={`${stat.value}-${stat.label}`}
                  className={`min-w-0 md:px-6 ${index > 0 ? "md:border-l md:border-border" : ""}`}
                >
                  <StatItem value={stat.value} label={stat.label} />
                </div>
              ))}
            </div>
          </Container>
        ) : null}
      </section>

      {/* DESIGN DEVELOP DEPLOY */}
      <section className="section-pad relative">
        <Container>
          <SectionHeader
            eyebrow="How we work"
            title={
              <>
                Design. Develop. <GradientText>Deploy.</GradientText>
              </>
            }
            description="A clear path from concept to live software — built for speed without skipping craft."
          />
          <div className="mt-10">
            <ProcessPillars steps={DDD} />
          </div>
        </Container>
      </section>

      {/* WHY WAIT */}
      <section className="section-pad relative border-y border-border bg-secondary/40">
        <BackgroundGlow className="opacity-60" />
        <Container className="relative">
          <SectionHeader
            eyebrow="Faster execution"
            title={
              <>
                Great ideas deserve <GradientText>faster execution.</GradientText>
              </>
            }
            description="We accelerate delivery through focused scoping and modern engineering — timelines are always qualified to your project's complexity."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SPEED_POINTS.map((item) => (
              <div key={item.title} className="glass-card rounded-2xl p-5">
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* SERVICES */}
      {servicesBlock.show ? (
        <section className="section-pad">
          <Container>
            <SectionHeader
              eyebrow={servicesBlock.kicker || "Services"}
              title={
                servicesBlock.title || (
                  <>
                    Everything you need to go from <GradientText>idea to launch.</GradientText>
                  </>
                )
              }
              description={
                servicesBlock.body ? (
                  <Prose text={servicesBlock.body} className="text-sm" />
                ) : (
                  "Outcome-driven practices from Appo Matrix — open a service or start with a consultation."
                )
              }
              href="/services"
              linkLabel="All services"
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {services.map((service, index) => {
                const Icon = serviceIcons[index % serviceIcons.length];
                return (
                  <Link
                    key={service.id}
                    href={`/services/${service.slug}`}
                    className="card-lift glass-card group flex h-full flex-col rounded-2xl p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary-300">
                        {service.icon ? <ServiceIcon name={service.icon} className="size-5" /> : <Icon className="size-5" />}
                      </span>
                      <span className="text-xs font-semibold text-primary-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold group-hover:text-primary-300">{service.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                      {richTextPlain(service.shortDescription)}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-primary-400">
                      Learn more <ArrowUpRight className="size-4" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </Container>
        </section>
      ) : null}

      {/* FEATURED WORK */}
      {portfolioBlock.show && shown.length > 0 ? (
        <section className="section-pad border-y border-border">
          <Container>
            <SectionHeader
              eyebrow={portfolioBlock.kicker || "Featured work"}
              title={
                portfolioBlock.title || (
                  <>
                    Real products. <GradientText>Real business impact.</GradientText>
                  </>
                )
              }
              description={portfolioBlock.body ? <Prose text={portfolioBlock.body} className="text-sm" /> : null}
              href="/portfolio"
              linkLabel="View all projects"
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {shown.map((project) => (
                <Link
                  key={project.id}
                  href={`/portfolio/${project.slug}`}
                  className="card-lift group overflow-hidden rounded-2xl border border-border bg-card/50"
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
                  <div className="p-5">
                    {project.category ? <Chip className="bg-primary/10 text-primary-300">{project.category}</Chip> : null}
                    <h3 className="mt-3 text-xl font-semibold group-hover:text-primary-300">{project.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{richTextPlain(project.excerpt)}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-400">
                      View case study <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* TIMELINE */}
      <section className="section-pad">
        <Container>
          <SectionHeader
            eyebrow="Delivery"
            title={
              <>
                How fast can we <GradientText>launch?</GradientText>
              </>
            }
            description="Typical phases for appropriately scoped products. Exact timelines depend on scope, integrations, and complexity — we'll confirm after discovery."
          />
          <div className="mt-10">
            <Stepper steps={process.length ? process : PHASES} />
          </div>
        </Container>
      </section>

      {/* WHY APPO MATRIX */}
      <section className="section-pad border-y border-border bg-secondary/30">
        <Container>
          <SectionHeader
            eyebrow="Why Appo Matrix"
            title={
              <>
                Built for teams who need <GradientText>momentum.</GradientText>
              </>
            }
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(principles.length >= 3
              ? principles.map((p) => ({ title: p.title, body: p.body }))
              : WHY_US
            ).map((item) => (
              <div key={item.title} className="glass-card rounded-2xl p-5">
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
          {aboutBlock.show ? (
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <SiteLinkButton href={aboutBlock.ctaHref || "/about"} variant="outline">
                {aboutBlock.ctaLabel || "About Appo Matrix"}
              </SiteLinkButton>
            </div>
          ) : null}
        </Container>
      </section>

      {/* TESTIMONIALS */}
      {clientsBlock.show && quotes.length > 0 ? (
        <section className="section-pad">
          <Container>
            <SectionHeader
              eyebrow={clientsBlock.kicker || "Client stories"}
              title={
                clientsBlock.title || (
                  <>
                    What our <GradientText>clients say.</GradientText>
                  </>
                )
              }
            />
            <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible">
              {quotes.map((quote) => (
                <figure
                  key={quote.id}
                  className="card-lift glass-card flex h-full w-[88%] shrink-0 snap-start flex-col rounded-2xl p-6 md:w-auto"
                >
                  <Quote className="size-6 text-primary-400" aria-hidden="true" />
                  <blockquote className="mt-4 flex-1 text-base font-medium leading-relaxed text-foreground">
                    <span className="line-clamp-6">{richTextPlain(quote.quote)}</span>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-full bg-primary/15 text-sm font-semibold text-primary-300">
                      {initials(quote.clientName)}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">{quote.clientName}</span>
                      <span className="text-xs text-muted-foreground">
                        {quote.role}
                        {quote.company ? `, ${quote.company}` : ""}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* CAREERS / SCHOLARSHIPS / NOTES — keep CMS sections, restyled */}
      {careersBlock.show && careers.length > 0 ? (
        <section className="section-pad border-t border-border">
          <Container>
            <SectionHeader
              eyebrow={careersBlock.kicker || "Careers"}
              title={careersBlock.title || "Open paths"}
              href="/career-development"
              linkLabel="All openings"
            />
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {careers.map((career) => (
                <Link
                  key={career.id}
                  href={`/career-development/${career.slug}`}
                  className="card-lift glass-card flex h-full flex-col rounded-2xl p-5"
                >
                  <Chip className="w-fit bg-primary/10 text-primary-300">{career.kind}</Chip>
                  <h3 className="mt-3 text-lg font-semibold">{career.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{career.location}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-primary-400">
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
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {scholarships.map((item) => (
                <Link
                  key={item.id}
                  href={`/scholarships/${item.slug}`}
                  className="card-lift glass-card rounded-2xl p-5"
                >
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.award}</p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {notesBlock.show && posts.length > 0 ? (
        <section className="section-pad border-t border-border">
          <Container>
            <SectionHeader
              eyebrow={notesBlock.kicker || "Insights"}
              title={notesBlock.title || "Notes from the studio"}
              description={notesBlock.body ? <Prose text={notesBlock.body} className="text-sm" /> : null}
              href={notesBlock.ctaHref || "/blog"}
              linkLabel={notesBlock.ctaLabel || "All posts"}
            />
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="card-lift group overflow-hidden rounded-2xl border border-border bg-card/50"
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
                    <h3 className="mt-2 line-clamp-2 text-lg font-semibold group-hover:text-primary-300">{post.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* FINAL CTA */}
      <CtaBand
        eyebrow={closingBlock.kicker || "Let's build"}
        title={
          closingBlock.title || (
            <>
              Your next big idea deserves to <GradientText>go live.</GradientText>
            </>
          )
        }
        description={
          closingBlock.body ? (
            <Prose text={closingBlock.body} className="text-sm" />
          ) : (
            "Tell us what you're building. We'll help you turn your idea into a modern digital product with a clear scope and delivery plan."
          )
        }
        primaryHref={closingBlock.ctaHref || "/contact"}
        primaryLabel={closingBlock.ctaLabel || "Let's Build Your Software"}
        secondaryHref={whatsapp || "/contact"}
        secondaryLabel={whatsapp ? "Discuss Your Idea" : "Contact Us"}
        footnotes={["No obligation", "Clear scoping", "Expert consultation"]}
      />
    </>
  );
}
